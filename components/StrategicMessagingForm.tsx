'use client';

import { useMemo, useState } from 'react';
import { APP_CONFIG, AUDIENCE_OPTIONS, FOLLOW_UP_ACTIONS, MODE_OPTIONS } from '@/lib/config';
import type { StrategicMessagingOutput } from '@/lib/types';
import { StrategicMessagingOutputView } from './StrategicMessagingOutput';
import { formatOutputAsPlainText } from '@/lib/formatOutput';
import { CopyButton } from './CopyButton';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plainText = useMemo(() => (output ? formatOutputAsPlainText(output) : ''), [output]);
  const tooLong = message.length > APP_CONFIG.maxMessageChars;

  async function generate(followUpAction?: string) {
    if (!message.trim()) return setError('Message is required.');
    if (tooLong) return setError(`Message must be ${APP_CONFIG.maxMessageChars} characters or fewer.`);
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/generate', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,audience,mode,goalContext,followUpAction,currentOutput:output})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setOutput(data.output);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unexpected error'); }
    finally { setLoading(false); }
  }

  return <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-4 rounded border border-[#E5E3DC] bg-[#FFFFFF] p-6"><label className="block text-sm font-medium">Paste your message</label><textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Paste a paragraph, email, talking points, public statement, program description, or draft language." className="h-52 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-3" />
  <p className="text-xs text-[#495A58]">{message.length}/{APP_CONFIG.maxMessageChars}</p>
  <div><label className="text-sm font-medium">Who is this for?</label><select className="mt-1 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" value={audience} onChange={(e)=>setAudience(e.target.value as any)}>{AUDIENCE_OPTIONS.map(x=><option key={x}>{x}</option>)}</select></div>
  <div><label className="text-sm font-medium">Communication mode</label><select className="mt-1 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" value={mode} onChange={(e)=>setMode(e.target.value as any)}>{MODE_OPTIONS.map(x=><option key={x}>{x}</option>)}</select><p className="mt-2 text-xs text-[#495A58]">{modeDescriptions[mode]}</p></div>
  <div><label className="text-sm font-medium">Goal or context optional</label><input value={goalContext} onChange={(e)=>setGoalContext(e.target.value)} placeholder="Example: prepare for a board discussion, explain a program change, support a funding request, or clarify public-facing language." className="mt-1 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" /></div>
  <p className="text-xs text-[#495A58]">Do not enter confidential patient information or protected health information.</p>
  {error && <p className="text-sm text-red-700">{error}</p>}
  <button disabled={loading} onClick={()=>generate()} className="rounded bg-[#D4967D] px-4 py-2 text-[#303636] disabled:opacity-50">{loading ? 'Rewriting strategically...' : 'Generate strategic rewrite'}</button>
  {output && <div className="flex flex-wrap gap-2">{FOLLOW_UP_ACTIONS.map((a)=><button key={a} onClick={()=>generate(a)} disabled={loading} className="rounded border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-sm">{a}</button>)}</div>}
  </div><div className="space-y-3">{output && <div className="flex flex-wrap gap-2"><CopyButton label="Copy Strategic Rewrite" text={output.strategicRewrite} /><CopyButton label="Copy Full Output" text={plainText} /><a className="rounded border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-sm" href={plainText.length > 1800 ? '#' : `mailto:?subject=${encodeURIComponent('AHEA Strategic Messaging Output')}&body=${encodeURIComponent(plainText)}`} onClick={(e)=>{if(plainText.length>1800){e.preventDefault();alert('This output may be too long to open in your email client. Please use Copy Full Output instead.');}}}>Email Output</a></div>}
  <StrategicMessagingOutputView output={output} /></div></div>;
}
