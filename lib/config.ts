export const APP_CONFIG = {
  model: 'gpt-5.4-mini', // For lower cost later, switch to 'gpt-5.4-nano'.
  maxOutputTokens: 900,
  temperature: 0.4,
  maxMessageChars: 3000,
} as const;

export const AUDIENCE_OPTIONS = [
  'Leadership / Board',
  'Funders',
  'Policymakers',
  'Community Partners',
  'Internal Team',
  'General Public',
] as const;

export const MODE_OPTIONS = [
  'Standard',
  'Plain-language',
  'Careful / neutral',
  'Highly constrained',
  'More direct',
] as const;

export const FOLLOW_UP_ACTIONS = [
  'Make more public-facing',
  'Make more direct',
  'Make more concise',
  'Make more concrete',
  'Create a clear ask',
] as const;
