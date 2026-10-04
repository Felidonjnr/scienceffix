export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology';
export type ProfileLevel = 'Z' | 'F' | 'P' | 'C';
export type KnowledgeType = 'K1' | 'K2' | 'K3' | 'K4';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type CognitiveSkill = 'Spatial Reasoning' | 'Formula Dependency' | 'Graph Illiteracy' | 'Reading Comprehension' | 'Logical Deduction' | 'Conceptual Application';

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
  cognitiveSkills?: CognitiveSkill[];
  difficulty?: number; // 1 to 3
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
  timeSpent?: number; // in seconds
  confidence?: ConfidenceLevel;
}

export interface Scorecard {
  subject: Subject;
  score: number;
  level: string;
  status: string;
}

export interface ApplicantIdentity {
  fullName: string;
  phone: string;
  email?: string;
}

export interface ApplicantAcademicBackground {
  previousBackground: string;
  secondaryCompletionYear?: string;
}

export interface ApplicantAcademicGoal {
  intendedPathway: string;
  intendedExam?: string;
}

export interface ApplicantScienceBackground {
  currentFoundation: string;
  mostDifficultSubject: string;
}

export interface ApplicantMotivation {
  mainReason: string;
  targetOutcome?: string;
}

export interface ApplicantAvailability {
  currentStatus: string;
  weeklyStudyHours: string;
  schedulingNotes?: string;
}

export interface ApplicantAssessmentContext {
  completed: boolean;
  baselineScore?: number;
  courseGoal?: string;
  timestamp?: string;
}

export interface FoundingCohortApplication {
  id: string;
  identity: ApplicantIdentity;
  academicBackground: ApplicantAcademicBackground;
  academicGoal: ApplicantAcademicGoal;
  scienceBackground: ApplicantScienceBackground;
  motivation: ApplicantMotivation;
  availability: ApplicantAvailability;
  assessmentContext?: ApplicantAssessmentContext;
  submittedAt: string;
  cohortCode: string;
  status: 'COMING_SOON' | 'OPEN' | 'CLOSED';
}

// Re-export Science Transition Academy Learning Architecture & Curriculum Blueprint types
export * from './types/learningArchitecture';
export * from './types/curriculumBlueprint';

