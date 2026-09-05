export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology';
export type ProfileLevel = 'Z' | 'F' | 'P' | 'C';
export type KnowledgeType = 'K1' | 'K2' | 'K3' | 'K4';

export interface QuestionOption {
  id: string;
  text: string;
  points: number;
}

export interface Question {
  id: string;
  subject: Subject;
  profileLevel: ProfileLevel;
  knowledgeType: KnowledgeType;
  topic: string;
  text: string;
  options: QuestionOption[];
  explanation?: string;
  isMathHeavy?: boolean;
  textLength?: 'short' | 'medium' | 'long';
}

export interface StudentData {
  name: string;
  phone: string;
  age: string;
  courseGoal: string;
  targetExam: string;
  startingLevel: ProfileLevel;
  employmentStatus: string;
  learningMethod: string;
  readingPace: string;
  dailyStudyHours: string;
  biggestChallenge: string;
}

export interface Answer {
  questionId: string;
  optionId: string;
  points: number;
}

export interface Scorecard {
  subject: Subject;
  score: number;
  level: string;
  status: string;
}
