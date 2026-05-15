'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { APP_CONFIG, AUDIENCE_OPTIONS, FOLLOW_UP_ACTIONS, MODE_OPTIONS } from '@/lib/config';
import type { StrategicMessagingOutput } from '@/lib/types';
import { StrategicMessagingOutputView } from './StrategicMessagingOutput';
import { formatOutputAsPlainText } from '@/lib/formatOutput';
import { CopyButton } from './CopyButton';
import { fetchMe, generateStrategicMessaging, startAuth, type MeResponse } from '@/lib/aheaBackend';

export function StrategicMessagingForm() {
  const modeDescriptions: Record<(typeof MODE_OPTIONS)[number], string> = {
    Standard: 'Balanced, professional rewrite.',
    'Plain-language': 'Simpler wording for broader audiences.',
    'Careful / neutral': 'Concrete, practical wording with a measured tone.',
    'Highly constrained': 'Most cautious and institutionally grounded wording.',
    'More direct': 'Clearer, more explicit wording while staying professional.',
  };
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0]);
  const [mode, setMode] = useState(MODE_OPTIONS[0]);
  const [goalContext, setGoalContext] = useState('');
  const [output, setOutput] = useState<StrategicMessagingOutput>();
  const [account, setAccount] = useState<MeResponse>();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    fetchMe().then(setAccount).catch((e) => setError(e.message)).finally(() => setStatusLoading(false));
  }, []);

  const plainText = useMemo(() => (output ? formatOutputAsPlainText(output) : ''), [output]);
  const tooLong = message.length > APP_CONFIG.maxMessageChars;
  const blocked = Boolean(account?.blocked || account?.paywall?.show);
  const showAuthNotice = account?.paywall?.variant === 'auth' || account?.auth?.required === true;
  const showMembershipCta = account?.paywall?.show && account.paywall.variant !== 'auth' && account.paywall.ctaLabel && account.paywall.ctaUrl;

  async function requestVerificationLink(event?: FormEvent) {
    event?.preventDefault();
    if (!authEmail.trim()) {
      setAuthMessage('Please enter your email address.');
      console.warn('Auth start validation error: missing email.');
      return;
    }
    setAuthLoading(true);
    setAuthMessage('');
    try {
      await startAuth(authEmail.trim(), window.location.origin, account);
      setAuthMessage('Check your email for a secure sign-in link.');
    } catch (e) {
      if (e instanceof TypeError) {
        console.warn('Auth start network failure.', e);
      } else if (e instanceof Error && /unexpected|shape/i.test(e.message)) {
        console.warn('Auth start unexpected response shape.', e);
      } else {
        console.warn('Auth start non-2xx backend response.', e);
      }
      setAuthMessage('We could not send your verification link right now. Please try again in a moment.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function generate(followUpAction?: string) {
    if (!message.trim()) return setError('Message is required.');
    if (tooLong) return setError(`Message must be ${APP_CONFIG.maxMessageChars} characters or fewer.`);
    setError(''); setLoading(true);
    try {
      const data = await generateStrategicMessaging({ message, audience, mode, goalContext, followUpAction, currentOutput: output });
      if (data.usage || data.paywall || data.blocked !== undefined) {
        setAccount((prev) => ({
          ...(prev || { status: 'success' }),
          usage: data.usage || prev?.usage,
          paywall: data.paywall || prev?.paywall,
          blocked: Boolean(data.paywall?.show || data.blocked),
        }));
      }
      if (data.blocked) {
        setOutput(undefined);
        throw new Error(data.error || data.message || 'Unable to generate a strategic rewrite right now.');
      }
      if (!data.output) {
        throw new Error(data.error || 'Generation completed, but the response could not be displayed.');
      }
      setOutput(data.output);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unexpected error'); }
    finally { setLoading(false); }
  }

  return <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-4 rounded border border-[#E5E3DC] bg-[#FFFFFF] p-6">
  {statusLoading ? <p className="text-sm text-[#495A58]">Loading access and usage status…</p> : (
    <div className="rounded border border-[#E5E3DC] bg-[#FAF9F6] p-3 text-sm text-[#495A58]">
      {showAuthNotice ? <p>Please sign in or verify your email to use AHEA tools. Verified users receive two complimentary generations total across AHEA tools.</p> : <p>{account?.message || 'Signed-in status is managed by the AHEA shared backend.'}</p>}
      {account?.usage && <p className="mt-1">Generations used: {String(account.usage.generationsUsed ?? '—')} • Free limit: {String(account.usage.freeGenerationsLimit ?? '—')} • Remaining free generations: {String(account.usage.remainingFreeGenerations ?? '—')} • Access status: {String(account.usage.accessStatus ?? '—')}.</p>}
      {showAuthNotice && <form className="mt-3 space-y-2" onSubmit={requestVerificationLink}><label className="block text-sm font-medium" htmlFor="auth-email">Email address</label><input id="auth-email" type="email" value={authEmail} onChange={(e)=>setAuthEmail(e.target.value)} className="w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" placeholder="name@example.org" required /><button type="submit" disabled={authLoading} className="rounded border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-sm disabled:opacity-50">{authLoading ? 'Sending...' : 'Send verification link'}</button>{authMessage && <p className="text-sm text-[#495A58]">{authMessage}</p>}</form>}
      {showMembershipCta && <a className="mt-2 inline-block rounded border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-sm" href={account?.paywall?.ctaUrl} target="_blank" rel="noreferrer">{account?.paywall?.ctaLabel}</a>}
    </div>
  )}
  <label className="block text-sm font-medium">Paste your message</label><textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Paste a paragraph, email, talking points, public statement, program description, or draft language." className="h-52 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-3" />
  <p className="text-xs text-[#495A58]">{message.length}/{APP_CONFIG.maxMessageChars}</p>
  <div><label className="text-sm font-medium">Who is this for?</label><select className="mt-1 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" value={audience} onChange={(e)=>setAudience(e.target.value as any)}>{AUDIENCE_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></div>
  <div><label className="text-sm font-medium">Communication mode</label><select className="mt-1 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" value={mode} onChange={(e)=>setMode(e.target.value as any)}>{MODE_OPTIONS.map(x=><option key={x}>{x}</option>)}</select><p className="mt-2 text-xs text-[#495A58]">{modeDescriptions[mode]}</p></div>
  <div><label className="text-sm font-medium">Goal or context optional</label><input value={goalContext} onChange={(e)=>setGoalContext(e.target.value)} placeholder="Example: prepare for a board discussion, explain a program change, support a funding request, or clarify public-facing language." className="mt-1 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" /></div>
  <p className="text-xs text-[#495A58]">Do not enter confidential patient information or protected health information.</p>
  {error && <p className="text-sm text-red-700">{error}</p>}
  <button disabled={loading || blocked || statusLoading} onClick={()=>generate()} className="rounded bg-[#D4967D] px-4 py-2 text-[#303636] disabled:opacity-50">{loading ? 'Rewriting strategically...' : 'Generate strategic rewrite'}</button>
  {output && <div className="flex flex-wrap gap-2">{FOLLOW_UP_ACTIONS.map((a)=><button key={a} onClick={()=>generate(a)} disabled={loading || blocked} className="rounded border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-sm">{a}</button>)}</div>}
  </div><div className="space-y-3">{output && <div className="flex flex-wrap gap-2"><CopyButton label="Copy Strategic Rewrite" text={output.strategicRewrite} /><CopyButton label="Copy Full Output" text={plainText} /><a className="rounded border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-sm" href={plainText.length > 1800 ? '#' : `mailto:?subject=${encodeURIComponent('AHEA Strategic Messaging Output')}&body=${encodeURIComponent(plainText)}`} onClick={(e)=>{if(plainText.length>1800){e.preventDefault();alert('This output may be too long to open in your email client. Please use Copy Full Output instead.');}}}>Email Output</a></div>}
  <StrategicMessagingOutputView output={output} /></div></div>;
}
