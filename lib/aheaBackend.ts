import type { StrategicMessagingOutput } from '@/lib/types';

const DEFAULT_BACKEND_URL = 'https://api.americanhealthequity.org';

export function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_AHEA_BACKEND_URL || DEFAULT_BACKEND_URL;
}

export interface MeApiResponse {
  status?: 'success' | 'error';
  user?: { email: string | null; emailVerified: boolean };
  usage?: {
    generationsUsed?: number;
    freeGenerationsLimit?: number;
    remainingFreeGenerations?: number;
    accessStatus?: string;
  };
  membership?: {
    hasActiveMembership?: boolean;
    membershipStatus?: string;
    billingInterval?: string;
    currentPeriodEnd?: string | null;
  };
  paywall?: {
    show?: boolean;
    variant?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    message?: string;
  };
  auth?: {
    required?: boolean;
    startEndpoint?: string;
    startPath?: string;
    verifyEndpoint?: string;
    callbackEndpoint?: string;
    returnField?: 'returnTo' | 'return_to';
  };
  message?: string;
  error?: string;
}

export interface StartAuthResponse {
  status?: 'success' | 'error';
  message?: string;
  error?: string;
}

export interface MeResponse extends MeApiResponse {
  blocked: boolean;
}

export interface GenerateResponse {
  ok?: boolean;
  output?: StrategicMessagingOutput;
  outputSource?: 'result' | 'output' | 'data' | 'raw' | 'none';
  hasRequiredFields?: boolean;
  blocked?: boolean;
  message?: string;
  error?: string;
  usage?: MeApiResponse['usage'];
  paywall?: MeApiResponse['paywall'];
  [key: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function looksLikeStrategicMessagingOutput(value: unknown): value is StrategicMessagingOutput {
  if (!isRecord(value)) return false;
  return typeof value.strategicRewrite === 'string' && typeof value.intentPreservationCheck === 'string';
}

function normalizeMe(data: MeApiResponse): MeResponse {
  const paywallShow = Boolean(data.paywall?.show);
  const blockedByUsage = data.usage?.accessStatus ? !['free', 'member', 'active', 'allowed'].includes(data.usage.accessStatus) : false;
  return {
    ...data,
    blocked: paywallShow || blockedByUsage,
  };
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch(`${getBackendBaseUrl()}/api/me`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as MeApiResponse;

  if (data.status === 'success') return normalizeMe(data);
  if (!res.ok || data.status === 'error') {
    throw new Error(data.message || data.error || 'Unable to load account status.');
  }

  return normalizeMe(data);
}

export async function generateStrategicMessaging(input: {
  message: string;
  audience: string;
  mode: string;
  goalContext?: string;
  followUpAction?: string;
  currentOutput?: StrategicMessagingOutput;
}): Promise<GenerateResponse> {
  const res = await fetch(`${getBackendBaseUrl()}/api/generate`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId: 'strategic-messaging', input }),
  });

  const raw = (await res.json().catch(() => ({}))) as unknown;
  const data = (isRecord(raw) ? raw : {}) as GenerateResponse;

  const candidateFromResult = isRecord(raw) ? raw.result : undefined;
  const candidateFromOutput = isRecord(raw) ? raw.output : undefined;
  const candidateFromData = isRecord(raw) ? raw.data : undefined;

  const resultOutput = looksLikeStrategicMessagingOutput(candidateFromResult) ? candidateFromResult : undefined;
  const outputOutput = looksLikeStrategicMessagingOutput(candidateFromOutput) ? candidateFromOutput : undefined;
  const dataOutput = looksLikeStrategicMessagingOutput(candidateFromData) ? candidateFromData : undefined;
  const rawOutput = looksLikeStrategicMessagingOutput(raw) ? raw : undefined;

  const output = resultOutput || outputOutput || dataOutput || rawOutput;
  const outputSource: GenerateResponse['outputSource'] = resultOutput ? 'result' : outputOutput ? 'output' : dataOutput ? 'data' : rawOutput ? 'raw' : 'none';
  const hasRequiredFields = Boolean(output && looksLikeStrategicMessagingOutput(output));
  const blocked = Boolean(data.blocked || data.paywall?.show);

  if (process.env.NODE_ENV === 'development') {
    const wrapperKeys = isRecord(raw) ? Object.keys(raw).slice(0, 20) : [];
    console.info('Strategic messaging generate response diagnostics', {
      wrapperKeys,
      outputFound: Boolean(output),
      outputSource,
      hasRequiredFields,
      okStatus: res.ok,
      hasUsage: Boolean(data.usage),
      hasPaywall: Boolean(data.paywall),
    });
  }

  if (!res.ok || blocked) return { ...data, ok: false, output, outputSource, hasRequiredFields, blocked: true, error: data.error || data.message || 'Generation failed.' };

  if (!hasRequiredFields) {
    return {
      ...data,
      ok: true,
      blocked: false,
      output: undefined,
      outputSource,
      hasRequiredFields: false,
      error: 'Generation completed, but the response could not be displayed.',
      raw,
    };
  }

  return { ...data, ok: true, blocked: false, output, outputSource, hasRequiredFields, raw };
}

function getAuthStartEndpoint(account?: MeApiResponse): string {
  const backendBase = getBackendBaseUrl();
  const configured = account?.auth?.startEndpoint || account?.auth?.startPath;
  const fallback = new URL('/api/auth/start', backendBase).toString();

  if (!configured) return fallback;

  const isAbsolute = /^https?:\/\//i.test(configured);
  if (isAbsolute) {
    const parsed = new URL(configured);
    const backendOrigin = new URL(backendBase).origin;
    return parsed.origin === backendOrigin ? parsed.toString() : fallback;
  }

  return new URL(configured, backendBase).toString();
}

export async function startAuth(email: string, returnTo: string, account?: MeApiResponse): Promise<StartAuthResponse> {
  const endpoint = getAuthStartEndpoint(account);
  const body = { email, returnTo, return_to: returnTo };

  const res = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as StartAuthResponse;
  if (!res.ok || data.status === 'error') {
    throw new Error(data.message || data.error || 'Unable to send verification link right now. Please try again.');
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error('Unexpected response shape from auth start endpoint.');
  }

  if (data.status && data.status !== 'success') {
    throw new Error('Unexpected response shape from auth start endpoint.');
  }

  return data;
}
