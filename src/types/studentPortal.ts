/**
 * ScienceFix - Personalized Tutorial Student Portal Types
 * 
 * Data models for individually taught tutorial students:
 * Profiles, Learning Plans, Teaching Session Logs, Assignments,
 * Daily Fix, Reading Habits, Topic Mastery, and Follow-ups.
 */

import { Subject, ProfileLevel } from '../types';

export interface TutorialStudent {
  id: string;
  name: string;
  accessCode: string; // PIN or alphanumeric access code (e.g. "4091" or "DAVID1")
  phone?: string;
  avatarSeed: string;
  createdAt: string;
  isActive: boolean;
  currentGoal: string; // e.g. "Nursing Admission", "UTME Pharmacy", "Engineering Foundation"
}

export interface StudentProfile {
  studentId: string;
  subjects: Subject[];
  overallLevel: ProfileLevel; // Z | F | P | C
  strengths: string[];
  needsImprovement: string[];
  targetPathway: string;
  dailyQuestionTarget: number; // e.g. 5 questions per day
  dailyReadingTargetMinutes: number; // e.g. 15 minutes
  teacherNotes: string;
  updatedAt: string;
}

export interface StudentSubjectPlan {
  subject: Subject;
  currentTopic: string;
  targetTopics: string[];
  weakTopics: string[];
  completedTopics: string[];
  preferredDifficulty: number; // 1 to 3
}

export interface StudentLearningPlan {
  studentId: string;
  subjects: StudentSubjectPlan[];
  nextRecommendedAction: string;
  learningGoals: string[];
  updatedAt: string;
}

export interface TeachingSessionLog {
  id: string;
  studentId: string;
  date: string; // ISO date string
  subject: Subject;
  topic: string;
  subtopic?: string;
  whatWasTaught: string;
  struggles: string;
  teacherEmphasis: string;
  understandingLevel: 1 | 2 | 3 | 4 | 5; // 1 = Lost, 3 = Developing, 5 = Mastered
  recommendedNextStep: string;
  extractedWeaknesses?: string[];
  createdAt: string;
}

export interface AssignmentQuestionItem {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'numerical';
  options: { id: string; text: string; points: number }[];
  correctOptionId: string;
  explanation: string;
  subject: Subject;
  topic: string;
  difficulty: number;
  learningObjective?: string;
}

export interface StudentAssignment {
  id: string;
  studentId: string;
  title: string;
  subject: Subject;
  topic: string;
  instructions: string;
  questions: AssignmentQuestionItem[];
  difficulty: number;
  dueDate: string; // ISO string
  estimatedMinutes: number;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: string;
  completedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  areasToPractise?: string[];
  strengthsObserved?: string[];
}

export interface StudentAnswerSubmission {
  questionId: string;
  selectedOptionId: string;
  timeSpentSeconds: number;
}

export interface AssignmentResult {
  assignmentId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  questionResults: {
    questionId: string;
    text: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
    pointsEarned: number;
    explanation: string;
  }[];
  strengths: string[];
  areasToPractise: string[];
  completedAt: string;
}

export interface DailyFixPractice {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  subject: Subject;
  focusTopic: string;
  reason: 'current_focus' | 'weak_area_reinforcement' | 'spaced_recall';
  questions: AssignmentQuestionItem[];
  status: 'pending' | 'completed';
  completedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
}

export interface ReadingTask {
  id: string;
  studentId: string;
  subject: Subject;
  topic: string;
  title: string;
  content: string;
  targetDurationMinutes: number;
  recallQuestion?: {
    questionText: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
  };
  dueDate?: string;
  status: 'pending' | 'completed';
  completedAt?: string;
  actualDurationMinutes?: number;
}

export interface TopicMasteryRecord {
  id: string;
  studentId: string;
  subject: Subject;
  topic: string;
  masteryPercent: number; // 0 to 100
  attemptCount: number;
  correctCount: number;
  totalQuestions: number;
  lastTestedAt: string;
  trend: 'improving' | 'stable' | 'declining' | 'new';
}

export interface TeacherFollowUpItem {
  id: string;
  studentId: string;
  studentName: string;
  issue: string; // e.g. "Struggling with Electron Configuration (28% on Daily Fix)"
  triggerType: 'missed_assignment' | 'repeated_low_score' | 'declining_performance' | 'inactivity' | 'broken_reading_habit' | 'ready_to_progress';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  recommendedAction: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface StudentStreak {
  studentId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayCompleted: boolean;
}

export interface StudentLearningContext {
  studentId: string;
  studentName: string;
  level: ProfileLevel;
  goal: string;
  subjects: Subject[];
  currentTopics: { subject: Subject; topic: string }[];
  weakTopics: { subject: Subject; topic: string; mastery: number }[];
  recentSessions: {
    date: string;
    subject: Subject;
    topic: string;
    struggles: string;
    understandingLevel: number;
    recommendedNextStep: string;
  }[];
  recentMistakes: {
    subject: Subject;
    topic: string;
    questionText: string;
  }[];
  recentScores: {
    title: string;
    percentage: number;
    date: string;
  }[];
  usedQuestionIds: string[];
}

export interface StudentHomeDashboardData {
  student: TutorialStudent;
  streak: StudentStreak;
  profile: StudentProfile;
  learningPlan: StudentLearningPlan;
  todayPractice: DailyFixPractice | null;
  pendingAssignments: StudentAssignment[];
  todayReading: ReadingTask | null;
  recentScore: {
    title: string;
    percentage: number;
    completedAt: string;
  } | null;
  currentFocus: {
    subject: Subject;
    topic: string;
    reason: string;
  };
  weakTopicsCount: number;
}

export interface TeacherDashboardData {
  totalStudents: number;
  activeToday: number;
  pendingAssignmentsCount: number;
  readingParticipationPercent: number;
  attentionRequiredCount: number;
  followUps: TeacherFollowUpItem[];
  studentsSummary: {
    id: string;
    name: string;
    avatarSeed: string;
    goal: string;
    currentSubject: Subject;
    currentTopic: string;
    streakDays: number;
    todayStatus: 'completed' | 'pending' | 'inactive';
    recentAverageScore: number;
    needsAttention: boolean;
    attentionReason?: string;
  }[];
}
