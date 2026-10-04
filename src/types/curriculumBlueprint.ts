/**
 * Science Transition Academy — Curriculum Blueprint Types
 * 
 * Formal TypeScript structures establishing the curriculum hierarchy,
 * diagnostic-to-curriculum mappings, cross-subject foundations,
 * and prerequisite dependency graph.
 */

import { Subject, ProfileLevel } from '../types';
import { 
  LearningStageId, 
  DestinationPathwayId, 
  ConceptMasteryState 
} from './learningArchitecture';

export type CurriculumEvidenceStatus = 
  | 'SUPPORTED_BY_CURRENT_ASSESSMENT' 
  | 'FUTURE_CURRICULUM_AREA' 
  | 'REQUIRES_CURRICULUM_REVIEW';

export type CurriculumMaturity = 
  | 'IMPLEMENTED' 
  | 'PROPOSED' 
  | 'REQUIRES_REVIEW';

export type MappingConfidence = 
  | 'EXACT_MAPPING' 
  | 'PARTIAL_MAPPING' 
  | 'REQUIRES_CURRICULUM_REVIEW';

export interface CurriculumLearningObjective {
  id: string;
  whatLearnerUnderstands: string[];
  whatLearnerCanDo: string[]; // Action-oriented, measurable competencies
  assessmentCriteria: string[];
}

export interface CurriculumConceptNode {
  id: string;
  subject: Subject;
  domainId: string;
  domainName: string;
  topicId: string;
  topicName: string;
  code: string;
  name: string;
  description: string;
  stage: LearningStageId;
  prerequisiteConceptIds: string[];
  learningObjective: CurriculumLearningObjective;
  evidenceStatus: CurriculumEvidenceStatus;
  maturity: CurriculumMaturity;
  mappedDiagnosticQuestionIds: string[];
  isCrossSubject: boolean;
  supportingSubjects?: Subject[];
  destinationRelevance?: DestinationPathwayId[];
  defaultMasteryState: ConceptMasteryState;
}

export interface DiagnosticToCurriculumMapping {
  questionId: string;
  subject: Subject;
  diagnosticTopic: string;
  profileLevel: ProfileLevel;
  curriculumConceptId: string;
  conceptName: string;
  mappingConfidence: MappingConfidence;
  prescribedStartingStage: LearningStageId;
  remedialFocus: string;
}

export interface CrossSubjectBridge {
  id: string;
  name: string;
  description: string;
  primarySubject: Subject;
  connectedSubjects: Subject[];
  curriculumConceptIds: string[];
  unlocksCapabilities: string[];
  evidenceStatus: CurriculumEvidenceStatus;
  maturity: CurriculumMaturity;
}

export interface CurriculumBlueprintSummary {
  subject: Subject;
  domainsCount: number;
  topicsCount: number;
  evidencedConceptsCount: number;
  futureConceptsCount: number;
  reviewRequiredCount: number;
}
