/**
 * Science Transition Academy — Learning Architecture Framework Reference
 * 
 * Central educational framework establishing learning stages, subject hierarchy,
 * assessment taxonomy distinctions, destination pathways, and adult catch-up models.
 */

import { 
  LearningStage, 
  DestinationPathway, 
  AssessmentDistinction, 
  LearningDomain,
  Subject,
  TeacherInterventionTrigger
} from '../types/learningArchitecture';

// ============================================================================
// 1. THE 5 LEARNING STAGES (NOT FIXED DURATIONS)
// ============================================================================

export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 'STAGE_1_FOUNDATION',
    stageNumber: 1,
    code: 'STG-01',
    name: 'Foundation',
    subtitle: 'Rebuilding Missing Core Tools',
    purpose: 'Reconstruct essential prerequisite vocabulary, mathematical operations, dimensional units, and graphical intuition required before attempting formal science theory.',
    focusCategories: [
      'Scientific terminology & root meanings',
      'Basic arithmetic proportions, ratios & percentages',
      'Units of measurement & dimensional consistency',
      'Reading and interpreting quantitative graphs',
      'Translating everyday phenomena into simple models'
    ],
    exitCriteria: [
      'Demonstrates fluent conversion between standard scientific units',
      'Calculates rates of change and simple proportions without calculator panic',
      'Interprets line, bar, and gradient graphs accurately'
    ]
  },
  {
    id: 'STAGE_2_CORE_SCIENCE',
    stageNumber: 2,
    code: 'STG-02',
    name: 'Core Science',
    subtitle: 'Anchoring Foundational Principles',
    purpose: 'Build durable conceptual mental models across Mathematics, Physics, Chemistry, and Biology from intuitive first principles rather than rote memory.',
    focusCategories: [
      'Mathematics: Algebraic manipulation & formula rearrangement',
      'Physics: Forces, equilibrium, energy transfer & pressure',
      'Chemistry: Atomic structure, chemical bonding & solution concentrations',
      'Biology: Cellular transport, bioenergetics & physiological regulation'
    ],
    exitCriteria: [
      'Explains why core scientific relationships behave as they do',
      'Rearranges standard multi-variable formulas independently',
      'Identifies the physical or chemical principle underlying a descriptive problem'
    ]
  },
  {
    id: 'STAGE_3_SCIENCE_APPLICATION',
    stageNumber: 3,
    code: 'STG-03',
    name: 'Science Application',
    subtitle: 'From Recognition to Problem Solving',
    purpose: 'Move beyond passive recognition. Train learners to deconstruct unfamiliar problems, select relevant principles, and execute multi-step calculations.',
    focusCategories: [
      'Multi-step word problem deconstruction',
      'Selecting appropriate formulas when questions do not name them directly',
      'Explaining cause-and-effect mechanisms in living and physical systems',
      'Connecting mathematical tools across chemistry and physics problems',
      'Error analysis: Identifying where an approach broke down'
    ],
    exitCriteria: [
      'Solves non-routine problems without hints or formula prompts',
      'Articulates the logical steps taken to arrive at an answer',
      'Maintains calculation accuracy across multi-step solutions'
    ]
  },
  {
    id: 'STAGE_4_DESTINATION_READINESS',
    stageNumber: 4,
    code: 'STG-04',
    name: 'Destination Readiness',
    subtitle: 'Pathway-Specific Contextualization',
    purpose: 'Bridge foundational scientific capability into the specific requirements of the learner’s target degree, college, or certification pathway (e.g. Nursing, Engineering).',
    focusCategories: [
      'Healthcare: Dosage calculations, physiological homeostasis, fluid pressure',
      'Technical/Engineering: Advanced mechanics, electrical dynamics, vectors',
      'Applied Sciences: Laboratory stoichiometry, biochemical pathways',
      'Examination technique: Time-paced problem execution and resilience'
    ],
    exitCriteria: [
      'Meets target competency benchmarks in pathway-specific problem sets',
      'Handles timed evaluation sets without freezing or cognitive overload'
    ]
  },
  {
    id: 'STAGE_5_CONTINUED_PROGRESS',
    stageNumber: 5,
    code: 'STG-05',
    name: 'Continued Progress',
    subtitle: 'Ongoing Mastery & Pathway Launch',
    purpose: 'Maintain progress monitoring, prevent skill regression, and provide continuous advisory as learners enter university or formal training.',
    focusCategories: [
      'Formative milestone scans to verify long-term retention',
      'Advanced extension topics for higher academic coursework',
      'Personalized review loops targeting fragile concepts'
    ],
    exitCriteria: [
      'Maintains consistent retention across all prerequisite domains',
      'Enters formal academic coursework with durable, self-directed study habits'
    ]
  }
];

// ============================================================================
// 2. CORE SUBJECT HIERARCHY (SAMPLE DOMAIN TAXONOMY)
// ============================================================================

export const CORE_DOMAINS: LearningDomain[] = [
  // Mathematics
  {
    id: 'dom-math-01',
    subject: 'Mathematics',
    code: 'M-FOUND',
    name: 'Quantitative Basics & Scientific Notation',
    description: 'Proportions, scientific notation, powers of ten, and fractions in physical measurements.',
    stage: 'STAGE_1_FOUNDATION',
    sequenceOrder: 1
  },
  {
    id: 'dom-math-02',
    subject: 'Mathematics',
    code: 'M-ALG',
    name: 'Algebraic Manipulation & Formula Rearranging',
    description: 'Isolating variables, substituting units, and solving linear equations in science contexts.',
    stage: 'STAGE_2_CORE_SCIENCE',
    sequenceOrder: 2
  },
  
  // Physics
  {
    id: 'dom-phys-01',
    subject: 'Physics',
    code: 'P-UNITS',
    name: 'Physical Quantities & Measurement Systems',
    description: 'Base units, derived units, dimensional analysis, and error in physical measurement.',
    stage: 'STAGE_1_FOUNDATION',
    sequenceOrder: 1
  },
  {
    id: 'dom-phys-02',
    subject: 'Physics',
    code: 'P-MECH',
    name: 'Forces, Equilibrium & Newton’s Laws',
    description: 'Balanced and unbalanced forces, friction, vectors, and translational motion.',
    stage: 'STAGE_2_CORE_SCIENCE',
    sequenceOrder: 2
  },

  // Chemistry
  {
    id: 'dom-chem-01',
    subject: 'Chemistry',
    code: 'C-MATTER',
    name: 'Particulate Nature of Matter & Atomic Structure',
    description: 'Subatomic particles, atomic number, electronic configurations, and periodic organization.',
    stage: 'STAGE_1_FOUNDATION',
    sequenceOrder: 1
  },
  {
    id: 'dom-chem-02',
    subject: 'Chemistry',
    code: 'C-STOICH',
    name: 'Solutions, Concentrations & Stoichiometry',
    description: 'Molar mass, molarity, solution preparation, balancing equations, and mole ratios.',
    stage: 'STAGE_2_CORE_SCIENCE',
    sequenceOrder: 2
  },

  // Biology
  {
    id: 'dom-bio-01',
    subject: 'Biology',
    code: 'B-CELL',
    name: 'Cellular Organization & Membrane Dynamics',
    description: 'Cell organelles, diffusion, osmosis, active transport, and cellular energy basics.',
    stage: 'STAGE_1_FOUNDATION',
    sequenceOrder: 1
  },
  {
    id: 'dom-bio-02',
    subject: 'Biology',
    code: 'B-HOMEO',
    name: 'Organ Systems & Homeostatic Regulation',
    description: 'Circulatory, respiratory, and endocrine coordination in maintaining physiological balance.',
    stage: 'STAGE_2_CORE_SCIENCE',
    sequenceOrder: 2
  }
];

// ============================================================================
// 3. ASSESSMENT DISTINCTION TAXONOMY
// ============================================================================

export const ASSESSMENT_TAXONOMY: AssessmentDistinction[] = [
  {
    category: 'SCIENCE_READINESS_ASSESSMENT',
    title: 'Science Readiness Assessment',
    purpose: 'Establish initial foundation baseline, cognitive tendencies, and topic gaps before teaching begins.',
    frequency: 'Once upon onboarding (optional retake after major milestones).',
    evaluates: 'Intuitive reasoning, basic proportions, formula dependence, and baseline knowledge across 4 sciences.',
    modifiesBaseline: true
  },
  {
    category: 'LEARNING_PRACTICE',
    title: 'Guided & Independent Learning Practice',
    purpose: 'Active skill acquisition during lessons; immediate feedback with scaffolding hints and worked clinics.',
    frequency: 'Continuous during each learning session (daily/weekly).',
    evaluates: 'Step-by-step problem execution, conceptual understanding, and procedure fluency.',
    modifiesBaseline: false
  },
  {
    category: 'PROGRESS_ASSESSMENT',
    title: 'Periodic Progress Assessment',
    purpose: 'Verify retention and measurable capability growth across completed learning stages against the baseline.',
    frequency: 'At the conclusion of a learning stage or monthly interval.',
    evaluates: 'Durable retention, unprompted formula selection, and transfer to unfamiliar questions.',
    modifiesBaseline: false
  }
];

// ============================================================================
// 4. DESTINATION PATHWAYS (NURSING AS BEACHHEAD)
// ============================================================================

export const DESTINATION_PATHWAYS: DestinationPathway[] = [
  {
    id: 'NURSING_MIDWIFERY',
    name: 'Nursing, Midwifery & Allied Health',
    isBeachhead: true, // Initial strategic focus
    description: 'Structured for transitioners aiming for Nursing councils, Colleges of Nursing, or university Bachelor of Nursing degrees.',
    prioritySubjects: ['Biology', 'Chemistry', 'Mathematics', 'Physics'],
    essentialPrerequisiteDomains: [
      'Proportions, ratios & dosage arithmetic',
      'Solution concentrations (molarity, dilution percentages)',
      'Diffusion, osmosis & cellular transport dynamics',
      'Fluid pressure, gradients & circulatory mechanics',
      'Organ systems, acid-base balance & homeostatic feedback'
    ],
    readinessMilestones: [
      'Zero-hesitation calculation of metric conversions and dosages',
      'Intuitive explanation of human physiological regulation under stress',
      'Confident handling of entrance examination science sections'
    ]
  },
  {
    id: 'HEALTH_SCIENCES',
    name: 'Medicine, Pharmacy & Health Sciences',
    isBeachhead: false,
    description: 'Rigorous foundation for learners targeting medicine, pharmacology, medical laboratory science, and radiography.',
    prioritySubjects: ['Chemistry', 'Biology', 'Physics', 'Mathematics'],
    essentialPrerequisiteDomains: [
      'Organic chemistry fundamentals & functional groups',
      'Stoichiometry & chemical thermodynamics',
      'Physiology, genetics & cellular bioenergetics',
      'Wave mechanics, optics & diagnostic physics principles'
    ],
    readinessMilestones: [
      'Mastery of multi-step chemical reaction pathways',
      'Fluent interpretation of physiological and molecular biology data'
    ]
  },
  {
    id: 'LABORATORY_SCIENCES',
    name: 'Applied & Laboratory Sciences',
    isBeachhead: false,
    description: 'Preparation for biochemistry, microbiology, industrial chemistry, and environmental science degrees.',
    prioritySubjects: ['Chemistry', 'Biology', 'Mathematics'],
    essentialPrerequisiteDomains: [
      'Chemical solutions, buffers & titration stoichiometry',
      'Microbial classification & molecular genetics',
      'Quantitative data handling & scientific error estimation'
    ],
    readinessMilestones: [
      'Independent lab problem calculation fluency'
    ]
  },
  {
    id: 'ENGINEERING_PHYSICAL',
    name: 'Engineering & Physical Sciences',
    isBeachhead: false,
    description: 'Quantitative runway for civil, electrical, mechanical, and agricultural engineering transitions.',
    prioritySubjects: ['Mathematics', 'Physics', 'Chemistry'],
    essentialPrerequisiteDomains: [
      'Advanced algebra, quadratics & trigonometry',
      'Vector mechanics, kinematics & Newton’s laws',
      'Electricity, magnetism, circuits & thermodynamics'
    ],
    readinessMilestones: [
      'Multi-variable mechanical problem solving without prompting'
    ]
  },
  {
    id: 'TECHNOLOGY_COMPUTING',
    name: 'Computing, Software & Data Science',
    isBeachhead: false,
    description: 'Foundational mathematics and logical reasoning for software engineering, cybersecurity, and data analytics.',
    prioritySubjects: ['Mathematics', 'Physics'],
    essentialPrerequisiteDomains: [
      'Discrete quantitative logic, sets & Boolean algebra',
      'Functions, graphs & computational rate of change',
      'Algorithmic problem breakdown'
    ],
    readinessMilestones: [
      'Logical problem deconstruction and quantitative modeling'
    ]
  },
  {
    id: 'SCIENCE_EDUCATION',
    name: 'Science Education & Teaching',
    isBeachhead: false,
    description: 'Comprehensive science foundations for educators seeking to teach primary or secondary level STEM.',
    prioritySubjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    essentialPrerequisiteDomains: [
      'Pedagogical clarity across foundational first principles',
      'Bridging intuitive analogies to formal formulas'
    ],
    readinessMilestones: [
      'Demonstrated ability to explain scientific concepts simply'
    ]
  },
  {
    id: 'GENERAL_SCIENCE_FOUNDATION',
    name: 'General Science Foundation',
    isBeachhead: false,
    description: 'Exploratory science runway for learners still deciding on their specific academic or vocational direction.',
    prioritySubjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    essentialPrerequisiteDomains: [
      'Broad literacy across all four sciences',
      'Confidence building and elimination of math anxiety'
    ],
    readinessMilestones: [
      'Established baseline in all 4 science disciplines'
    ]
  }
];

// ============================================================================
// 5. CATCH-UP & TEACHER INTERVENTION ARCHITECTURE
// ============================================================================

export const TEACHER_INTERVENTION_CRITERIA: {
  trigger: TeacherInterventionTrigger;
  description: string;
  recommendedAction: string;
}[] = [
  {
    trigger: 'REPEATED_ERRORS',
    description: 'Learner misses 3 or more attempts on the same prerequisite concept across guided practice.',
    recommendedAction: 'Assign a 1-on-1 concept clinic or assign alternative sensory explainer.'
  },
  {
    trigger: 'PROGRESS_STALLED',
    description: 'Learner spends more than 7 days in LEARNING state for a single foundational domain without advancing.',
    recommendedAction: 'Academic advisor reaches out to assess life scheduling constraints or underlying confusion.'
  },
  {
    trigger: 'PREREQUISITE_WEAKNESS',
    description: 'Learner struggles with an advanced concept because an earlier Stage 1 foundation was not solidified.',
    recommendedAction: 'Pause current module; route learner through a 2-lesson recovery loop on the missing prerequisite.'
  },
  {
    trigger: 'PRACTICE_INCONSISTENCY',
    description: 'Adult learner misses 2 consecutive weekly practice checkpoints due to external job or family demands.',
    recommendedAction: 'Trigger flexible catch-up pathway with consolidated weekend walkthrough session.'
  },
  {
    trigger: 'CONFIDENCE_PERFORMANCE_DIVERGENCE',
    description: 'Learner reports High confidence on an assessment item but provides an incorrect answer (unconscious incompetence), or reports Low confidence on correct answers (imposter syndrome).',
    recommendedAction: 'Flag for cognitive calibration clinic to align confidence with actual understanding.'
  }
];

// ============================================================================
// 6. FOUNDATION-FIRST STARTING POINT HELPER
// (Derives recommendation without modifying diagnostic engine)
// ============================================================================

export function deriveStartingStage(overallScore: number): {
  recommendedStage: LearningStage;
  startingSubjectFocus: Subject[];
  rationale: string;
} {
  if (overallScore < 40) {
    return {
      recommendedStage: LEARNING_STAGES[0], // Stage 1: Foundation
      startingSubjectFocus: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      rationale: 'Initial diagnostic indicates essential vocabulary, arithmetic proportions, and core units require deliberate rebuilding before formal topics can be understood.'
    };
  } else if (overallScore < 70) {
    return {
      recommendedStage: LEARNING_STAGES[1], // Stage 2: Core Science
      startingSubjectFocus: ['Mathematics', 'Chemistry', 'Biology'],
      rationale: 'Basic quantitative tools are present. Recommended focus is anchoring the underlying mechanisms of forces, reactions, and living systems from first principles.'
    };
  } else {
    return {
      recommendedStage: LEARNING_STAGES[2], // Stage 3: Science Application
      startingSubjectFocus: ['Physics', 'Chemistry'],
      rationale: 'Core principles are recognized. Recommended focus is tackling unfamiliar multi-step problems, eliminating formula dependence, and connecting concepts.'
    };
  }
}
