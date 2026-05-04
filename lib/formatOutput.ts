import type { StrategicMessagingOutput } from './types';

export function formatOutputAsPlainText(output: StrategicMessagingOutput): string {
  const terms = output.termsToReconsider.length
    ? output.termsToReconsider
        .map((t, i) => `${i + 1}. Original: ${t.originalWording}\n   Why reconsider: ${t.whyReconsider}\n   Suggested framing: ${t.suggestedFraming}`)
        .join('\n')
    : 'No major terms flagged.';

  return [
    'Strategic Rewrite',
    output.strategicRewrite,
    '',
    'What Changed and Why',
    ...output.whatChangedAndWhy.map((item) => `- ${item}`),
    '',
    'Intent Preservation Check',
    output.intentPreservationCheck,
    '',
    'Terms to Reconsider',
    terms,
    '',
    'Stronger Alternative Phrases',
    ...output.strongerAlternativePhrases.map((p) => `- ${p}`),
    '',
    'Message Readiness Score',
    `Rating: ${output.messageReadinessScore.rating}`,
    `Clarity: ${output.messageReadinessScore.clarity}`,
    `Audience fit: ${output.messageReadinessScore.audienceFit}`,
    `Concrete outcomes: ${output.messageReadinessScore.concreteOutcomes}`,
    `Substance preserved: ${output.messageReadinessScore.substancePreserved}`,
  ].join('\n');
}
