import { Question } from '../types';
import { physicsQuestions } from './physics';
import { chemistryQuestions } from './chemistry';
import { biologyQuestions } from './biology';
import { mathQuestions } from './math';
import { EXPANDED_QUESTIONS } from './expandedQuestions';

// Production bank: 320 validated legacy questions + 80 new questions.
// Each subject has exactly 100 questions: 25 per readiness level (Z/F/P/C).
const expansionSample = EXPANDED_QUESTIONS.filter(q => {
  const match = q.id.match(/_X_(\d+)$/);
  return Boolean(match && Number(match[1]) <= 5);
});

export const QUESTIONS: Question[] = [
  ...physicsQuestions,
  ...chemistryQuestions,
  ...biologyQuestions,
  ...mathQuestions,
  ...expansionSample
];

export const QUESTION_BANK_SIZE = QUESTIONS.length;
