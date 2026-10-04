import { Question } from '../types';
import { physicsQuestions } from './physics';
import { chemistryQuestions } from './chemistry';
import { biologyQuestions } from './biology';
import { mathQuestions } from './math';
import { EXPANDED_QUESTIONS } from './expandedQuestions';

// Production bank: 64 legacy questions + 336 expanded questions.
// Each subject has exactly 100 questions: 25 per readiness level (Z/F/P/C).
export const QUESTIONS: Question[] = [
  ...physicsQuestions,
  ...chemistryQuestions,
  ...biologyQuestions,
  ...mathQuestions,
  ...EXPANDED_QUESTIONS
];

export const QUESTION_BANK_SIZE = QUESTIONS.length;
