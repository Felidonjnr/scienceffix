import { Question } from '../types';
import { physicsQuestions } from './physics';
import { chemistryQuestions } from './chemistry';
import { biologyQuestions } from './biology';
import { mathQuestions } from './math';
import { EXPANDED_QUESTIONS } from './expandedQuestions';

export const QUESTIONS: Question[] = [
  ...physicsQuestions,
  ...chemistryQuestions,
  ...biologyQuestions,
  ...mathQuestions,
  ...EXPANDED_QUESTIONS
];
