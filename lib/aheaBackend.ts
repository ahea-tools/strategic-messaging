import type { StrategicMessagingOutput } from '@/lib/types';

const DEFAULT_BACKEND_URL = 'https://api.americanhealthequity.org';

export function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_AHEA_BACKEND_URL || DEFAULT_BACKEND_URL;
}

export interface MeResponse {
  authenticated?: boolean;
  access?: {
    allowed?: boolean;
    blocked?: boolean;
    reason?: string;
    message?: string;
  };
  usage?: {
    complimentaryRemaining?: number;
    complimentaryTotal?: number;
    used?: number;
    limit?: number;
    [key: string]: unknown;
  };
  paywall?: {
    blocked?: boolean;
    message?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  message?: string;
  [key: string]: unknown;
}

export interface GenerateResponse {
  output?: StrategicMessagingOutput;
  blocked?: boolean;
  message?: string;
  error?: string;
  usage?: MeResponse['usage'];
  paywall?: MeResponse['paywall'];
  [key: string]: unknown;
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch(`${getBackendBaseUrl()}/api/me`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as MeResponse;
  if (!res.ok) throw new Error(data.message || 'Unable to load account status.');
  return data;
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
    body: JSON.stringify({
      toolId: 'strategic-messaging',
      input,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as GenerateResponse;
  if (!res.ok) return { ...data, blocked: true, error: data.error || data.message || 'Generation failed.' };
  return data;
}
