/**
 * Science Transition Academy — Learning Architecture
 * 
 * Foundational TypeScript definitions establishing the educational data hierarchy,
 * learning stages, concept mastery models, practice taxonomy, catch-up pathways,
 * and destination pathways.
 * 
 * IMPORTANT: This defines the underlying architecture for the future curriculum.
 * It does NOT modify or replace the existing Science Readiness Assessment engine.
 */

import { Subject } from '../types';
export type { Subject };

// ============================================================================
// 1. CORE ACADEMY PROGRESSION & LEARNING STAGES
// ============================================================================

export type CoreLearningPhase = 'ASSESS' | 'REBUILD' | 'PRACTISE' | 'APPLY' | 'PROGRESS';

export type LearningStageId = 
  | 'STAGE_1_FOUNDATION'
  | 'STAGE_2_CORE_SCIENCE'
  | 'STAGE_3_SCIENCE_APPLICATION'
  | 'STAGE_4_DESTINATION_READINESS'
  | 'STAGE_5_CONTINUED_PROGRESS';

export interface LearningStage {
  id: LearningStageId;
  stageNumber: 1 | 2 | 3 | 4 | 5;
  code: string;
  name: string;
  subtitle: string;
  purpose: string;
  focusCategories: string[];
  exitCriteria: string[];
}

// ============================================================================
// 2. SUBJECT & CONCEPT HIERARCHY
// Subject → Domain → Topic → Concept → Lesson → PracticeSet → Assessment
// ============================================================================

export interface LearningDomain {
  id: string;
  subject: Subject;
  code: string;
  name: string;
  description: string;
  stage: LearningStageId;
  sequenceOrder: number;
}

export interface LearningTopic {
  id: string;
  domainId: string;
  subject: Subject;
  name: string;
  description: string;
  sequenceOrder: number;
}

export interface LearningObjective {
  id: string;
  conceptId: string;
  whatLearnerUnderstands: string[];
  whatLearnerCanDo: string[];
  prerequisiteKnowledge: string[];
  practiceRequirements: string[];
  assessmentCriteria: string[];
}

export interface LearningConcept {
  id: string;
  topicId: string;
  domainId: string;
  subject: Subject;
  code: string;
  name: string;
  description: string;
  stage: LearningStageId;
  learningObjective: LearningObjective;
  prerequisiteConceptIds: string[];
  difficulty: 1 | 2 | 3;
}

export type LessonFormat = 
  | 'INTERACTIVE_WALKTHROUGH'
  | 'CONCEPT_EXPLAINER'
  | 'WORKED_EXAMPLE_CLINIC'
  | 'GUIDED_DEMONSTRATION';

export interface Lesson {
  id: string;
  conceptId: string;
  title: string;
  summary: string;
  estimatedDurationMinutes: number; // Tailored for adult focus (e.g. 15–25 mins)
  format: LessonFormat;
  keyTakeaways: string[];
  mediaResourceUrl?: string;
  sequenceOrder: number;
}

// ============================================================================
// 3. CONCEPT MASTERY MODEL
// ============================================================================

export type ConceptMasteryState = 
  | 'NOT_STARTED'
  | 'LEARNING'
  | 'PRACTISING'
  | 'DEVELOPING'
  | 'MASTERED';

export interface LearnerConceptMastery {
  learnerId: string;
  conceptId: string;
  state: ConceptMasteryState;
  accuracyRate: number; // 0 to 100
  practiceAttemptsCount: number;
  lastPracticedAt?: string;
  masteredAt?: string;
  needsReview: boolean;
  notes?: string;
}

// ============================================================================
// 4. PRACTICE ARCHITECTURE (SEPARABLE FROM DIAGNOSTIC)
// ============================================================================

export type PracticeType = 
  | 'GUIDED_PRACTICE'
  | 'INDEPENDENT_PRACTICE'
  | 'REVIEW_PRACTICE'
  | 'CONCEPT_CHECK'
  | 'PROGRESS_ASSESSMENT';

export interface PracticeItem {
  id: string;
  conceptId: string;
  practiceType: PracticeType;
  prompt: string;
  scaffoldingHint?: string;
  workedSolution?: string;
  difficulty: 1 | 2 | 3;
}

export interface PracticeSet {
  id: string;
  conceptId: string;
  title: string;
  practiceType: PracticeType;
  items: PracticeItem[];
  passingThresholdScore: number; // e.g. 80%
  recommendedTimeMinutes: number;
}

// ============================================================================
// 5. ASSESSMENT DISTINCTION TAXONOMY
// ============================================================================

export type AssessmentCategory = 
  | 'SCIENCE_READINESS_ASSESSMENT' // A: Starting baseline diagnostic
  | 'LEARNING_PRACTICE'            // B: Formative skill building
  | 'PROGRESS_ASSESSMENT';         // C: Growth verification against baseline

export interface AssessmentDistinction {
  category: AssessmentCategory;
  title: string;
  purpose: string;
  frequency: string;
  evaluates: string;
  modifiesBaseline: boolean;
}

// ============================================================================
// 6. ADULT LEARNING, CATCH-UP MODEL & TEACHER INTERVENTION
// ============================================================================

export type CatchUpStatus = 
  | 'NORMAL'
  | 'MISSED_SESSION'
  | 'IN_RECOVERY'
  | 'CHECKING_UNDERSTANDING'
  | 'RESTORED';

export interface CatchUpPathway {
  id: string;
  learnerId: string;
  missedConceptId: string;
  status: CatchUpStatus;
  recoveryLessonId: string;
  checkPracticeSetId: string;
  isResolved: boolean;
  initiatedAt: string;
  completedAt?: string;
}

export type TeacherInterventionTrigger = 
  | 'REPEATED_ERRORS'
  | 'PROGRESS_STALLED'
  | 'PREREQUISITE_WEAKNESS'
  | 'PRACTICE_INCONSISTENCY'
  | 'CONFIDENCE_PERFORMANCE_DIVERGENCE';

export interface TeacherInterventionFlag {
  id: string;
  learnerId: string;
  conceptId: string;
  trigger: TeacherInterventionTrigger;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  observedPattern: string;
  recommendedAction: string;
  flaggedAt: string;
  resolved: boolean;
}

// ============================================================================
// 7. DESTINATION PATHWAYS
// ============================================================================

export type DestinationPathwayId = 
  | 'NURSING_MIDWIFERY'
  | 'HEALTH_SCIENCES'
  | 'LABORATORY_SCIENCES'
  | 'ENGINEERING_PHYSICAL'
  | 'TECHNOLOGY_COMPUTING'
  | 'SCIENCE_EDUCATION'
  | 'GENERAL_SCIENCE_FOUNDATION';

export interface DestinationPathway {
  id: DestinationPathwayId;
  name: string;
  isBeachhead: boolean; // true for Nursing
  description: string;
  prioritySubjects: Subject[];
  essentialPrerequisiteDomains: string[];
  readinessMilestones: string[];
}

// ============================================================================
// 8. DATA SEPARATION CONTRACTS
// Separate models to prevent monolithic coupling
// ============================================================================

/**
 * 1. Learner Profile: Identity and life parameters
 */
export interface LearnerProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  backgroundCategory: string;
  studyTimeAvailability: string;
  targetDestinationId: DestinationPathwayId;
  createdAt: string;
}

/**
 * 2. Science Readiness Result: Diagnostic snapshot from engine
 */
export interface ScienceReadinessResult {
  id: string;
  learnerId: string;
  overallScore: number;
  subjectScores: Record<Subject, number>;
  identifiedWeakTopics: string[];
  startingLevel: string; // Z, F, P, C
  completedAt: string;
}

/**
 * 3. Personalized Learning Path: Tailored educational runway
 */
export interface StartingPointRecommendation {
  subject: Subject;
  startingStage: LearningStageId;
  recommendedStartingDomain: string;
  justification: string;
}

export interface PersonalizedLearningPath {
  id: string;
  learnerId: string;
  destinationPathwayId: DestinationPathwayId;
  currentStage: LearningStageId;
  startingPointRecommendations: StartingPointRecommendation[];
  activeConceptIds: string[];
  completedConceptIds: string[];
  conceptMasteryMap: Record<string, ConceptMasteryState>;
  catchUpPathways: CatchUpPathway[];
  interventionFlags: TeacherInterventionFlag[];
  updatedAt: string;
}

/**
 * 4. Progress Record: Formative milestone tracking
 */
export interface ProgressMilestoneRecord {
  id: string;
  learnerId: string;
  stageId: LearningStageId;
  conceptsMasteredCount: number;
  totalRequiredConcepts: number;
  practiceSetsCompleted: number;
  latestProgressScore?: number;
  recordedAt: string;
}
