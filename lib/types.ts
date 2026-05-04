export type MessageReadinessRating =
  | 'Strong'
  | 'Solid with minor refinements'
  | 'Needs refinement';

export interface TermToReconsider {
  originalWording: string;
  whyReconsider: string;
  suggestedFraming: string;
}

export interface StrategicMessagingOutput {
  strategicRewrite: string;
  whatChangedAndWhy: string[];
  intentPreservationCheck: string;
  termsToReconsider: TermToReconsider[];
  strongerAlternativePhrases: string[];
  messageReadinessScore: {
    rating: MessageReadinessRating;
    clarity: string;
    audienceFit: string;
    concreteOutcomes: string;
    substancePreserved: string;
  };
}
