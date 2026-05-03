import type { StrategicMessagingOutput } from '@/lib/types';

export function StrategicMessagingOutputView({ output }: { output?: StrategicMessagingOutput }) {
  if (!output) {
    return <div className="rounded border border-stone-200 bg-white p-6 text-sm">You will receive: Strategic Rewrite, What Changed and Why, Intent Preservation Check, Terms to Reconsider, Stronger Alternative Phrases, and Message Readiness Score.</div>;
  }

  return (
    <div className="space-y-5 rounded border border-stone-200 bg-white p-6">
      <section><h3 className="font-semibold">Strategic Rewrite</h3><p className="mt-2 whitespace-pre-wrap text-sm">{output.strategicRewrite}</p></section>
      <section><h3 className="font-semibold">What Changed and Why</h3><ul className="mt-2 list-disc pl-5 text-sm">{output.whatChangedAndWhy.map((x, i) => <li key={i}>{x}</li>)}</ul></section>
      <section><h3 className="font-semibold">Intent Preservation Check</h3><p className="mt-2 text-sm">{output.intentPreservationCheck}</p></section>
      <section><h3 className="font-semibold">Terms to Reconsider</h3>{output.termsToReconsider.length===0 ? <p className="mt-2 text-sm">No major terms flagged.</p> : <div className="mt-2 space-y-2 text-sm">{output.termsToReconsider.map((t, i)=><div key={i} className="rounded border border-stone-200 p-2"><p><strong>Original wording:</strong> {t.originalWording}</p><p><strong>Why reconsider:</strong> {t.whyReconsider}</p><p><strong>Suggested framing:</strong> {t.suggestedFraming}</p></div>)}</div>}</section>
      <section><h3 className="font-semibold">Stronger Alternative Phrases</h3><ul className="mt-2 list-disc pl-5 text-sm">{output.strongerAlternativePhrases.map((x,i)=><li key={i}>{x}</li>)}</ul></section>
      <section><h3 className="font-semibold">Message Readiness Score</h3><p className="text-sm">{output.messageReadinessScore.rating}</p></section>
    </div>
  );
}
