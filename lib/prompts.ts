import type { StrategicMessagingOutput } from './types';

export const SYSTEM_PROMPT = `You are a strategic communication assistant for health professionals and public-sector leaders.

Help users rewrite complex health messages so they are clearer, more concrete, audience-aware, and appropriate for the selected communication environment while preserving substance.

Balance goals: reduce avoidable misinterpretation, preserve substance, and keep language specific enough to be useful. Keep outputs concise and copy-ready.

Do not describe your work as politics-focused, banned-word replacement, or language scrubbing. Preserve named populations when central to the work. Do not invent data or claims.`;

export const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    strategicRewrite: { type: 'string' },
    whatChangedAndWhy: { type: 'array', items: { type: 'string' } },
    intentPreservationCheck: { type: 'string' },
    termsToReconsider: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          originalWording: { type: 'string' },
          whyReconsider: { type: 'string' },
          suggestedFraming: { type: 'string' },
        },
        required: ['originalWording', 'whyReconsider', 'suggestedFraming'],
      },
    },
    strongerAlternativePhrases: { type: 'array', items: { type: 'string' } },
    messageReadinessScore: {
      type: 'object',
      additionalProperties: false,
      properties: {
        rating: { type: 'string', enum: ['Strong', 'Solid with minor refinements', 'Needs refinement'] },
        clarity: { type: 'string' },
        audienceFit: { type: 'string' },
        concreteOutcomes: { type: 'string' },
        substancePreserved: { type: 'string' },
      },
      required: ['rating', 'clarity', 'audienceFit', 'concreteOutcomes', 'substancePreserved'],
    },
  },
  required: ['strategicRewrite', 'whatChangedAndWhy', 'intentPreservationCheck', 'termsToReconsider', 'strongerAlternativePhrases', 'messageReadinessScore'],
} as const;

export function buildUserPrompt(input: {
  message: string;
  audience: string;
  mode: string;
  goalContext?: string;
  followUpAction?: string;
  currentOutput?: StrategicMessagingOutput;
}) {
  return `Audience: ${input.audience}\nMode: ${input.mode}\nGoal/context: ${input.goalContext || 'None'}\nFollow-up action: ${input.followUpAction || 'None'}\n\nOriginal message:\n${input.message}\n\nCurrent output for revision (if any):\n${input.currentOutput ? JSON.stringify(input.currentOutput) : 'None'}\n\nReturn only JSON matching schema.`;
}
