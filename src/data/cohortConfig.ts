/**
 * Science Transition Academy - Founding Cohort Configuration
 * 
 * Centralized configuration object for programme specifications, schedules,
 * curriculum placeholders, investment details, and FAQ data.
 * Update values here to update all public interfaces cleanly.
 */

export type ApplicationStatus = 'COMING_SOON' | 'OPEN' | 'CLOSED';

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Curriculum' | 'Admissions' | 'Schedule & Cost';
}

export interface CurriculumSubject {
  subject: string;
  subtitle: string;
  domains: string[];
}

export interface LearningStage {
  stage: string;
  name: string;
  subtitle: string;
  description: string;
}

export interface SupportPillar {
  title: string;
  subtitle: string;
  description: string;
}

export interface CohortConfig {
  cohortName: string;
  cohortCode: string;
  headline: string;
  subheadline: string;
  applicationStatus: ApplicationStatus;
  
  // Schedule & Delivery (Configurable Placeholders)
  startDate: string;
  duration: string;
  scheduleDays: string;
  scheduleTimes: string;
  deliveryMode: string;
  cohortSize: string;
  
  // Programme Investment (Configurable Placeholders)
  tuitionStatus: string;
  tuitionNote: string;
  tuitionIncludes: string[];
  tuitionExcludes: string[];
  
  // Academic Framework
  curriculumStructure: CurriculumSubject[];
  learningStages: LearningStage[];
  supportModel: SupportPillar[];
  applicationRequirements: string[];
  faqs: FAQItem[];
  
  // Admissions & Advisory
  contactWhatsAppNumber: string;
}

export const FOUNDING_COHORT_CONFIG: CohortConfig = {
  cohortName: "Science Transition Academy — Founding Cohort",
  cohortCode: "Cohort 01",
  headline: "The First Structured Science Transition Cohort",
  subheadline: "A deliberate educational runway engineered for learners rebuilding their science foundations for healthcare, university degrees, and technical careers.",
  
  // Application State: 'COMING_SOON' | 'OPEN' | 'CLOSED'
  applicationStatus: 'COMING_SOON',
  
  // Unresolved Business Details — Structured Placeholders
  startDate: "To be announced with admissions packet",
  duration: "To be announced (Designed for steady retention)",
  scheduleDays: "To be announced (Evening & weekend consideration)",
  scheduleTimes: "To be announced (Configured around working schedules)",
  deliveryMode: "To be announced (Delivery format finalized prior to launch)",
  cohortSize: "Limited founding group for high instructional attention",
  
  // Investment Details
  tuitionStatus: "Tuition to be finalized and announced",
  tuitionNote: "Tuition will be communicated transparently to registered waitlist candidates before formal enrollment opens. No hidden fees.",
  tuitionIncludes: [
    "Full access to structured foundational instructional sessions",
    "Guided problem-solving clinics and worked example walkthroughs",
    "Formative assessment scans and progress monitoring",
    "Curated exercise sets and concept summary guides",
    "Academic pathway advisory for target healthcare or university goals"
  ],
  tuitionExcludes: [
    "External examination registration fees (JAMB, WAEC, NECO, professional nursing council)",
    "External university or college application fees",
    "Personal computing devices or internet data subscriptions"
  ],

  // Programme Stages
  learningStages: [
    {
      stage: "STAGE 1",
      name: "ASSESS",
      subtitle: "Understand the Starting Point",
      description: "Establish a clear, non-judgmental baseline across Mathematics, Physics, Chemistry, and Biology to identify specific conceptual blindspots."
    },
    {
      stage: "STAGE 2",
      name: "REBUILD",
      subtitle: "Repair Missing Foundations",
      description: "Deconstruct intimidating scientific ideas into first principles. Rebuild essential algebra, units, atomic behavior, and physiological systems."
    },
    {
      stage: "STAGE 3",
      name: "PRACTISE",
      subtitle: "Turn Concepts into Usable Knowledge",
      description: "Move from passive comprehension to active, guided problem solving through structured clinics and step-by-step reasoning exercises."
    },
    {
      stage: "STAGE 4",
      name: "APPLY",
      subtitle: "Connect Concepts to Academic Problems",
      description: "Learn how scientific principles interact across disciplines and apply them to realistic scenarios in healthcare and advanced studies."
    },
    {
      stage: "STAGE 5",
      name: "PROGRESS",
      subtitle: "Prepare for the Next Academic Chapter",
      description: "Evaluate developed competency through staged milestones, entering formal academic coursework with a resilient, transferable foundation."
    }
  ],

  // Curriculum Framework Ready for Final Insertion
  curriculumStructure: [
    {
      subject: "Mathematics",
      subtitle: "Quantitative Reasoning & Science Tools",
      domains: [
        "Proportions, ratios, fractions, and rates of change",
        "Algebraic manipulation, formula rearranging, and equation solving",
        "Units of measurement, dimensional consistency, and scientific notation",
        "Interpreting mathematical graphs, gradients, and quantitative trends"
      ]
    },
    {
      subject: "Physics",
      subtitle: "Physical Relationships & Mechanics",
      domains: [
        "Forces, equilibrium, vectors, and Newton's laws of motion",
        "Energy transformations, conservation of energy, and mechanical work",
        "Pressure in fluids, density, and hydraulic principles",
        "Physical reasoning and translating word problems into mathematical models"
      ]
    },
    {
      subject: "Chemistry",
      subtitle: "Matter, Structure & Chemical Transformations",
      domains: [
        "Atomic structure, subatomic particles, and electronic configuration",
        "Chemical bonding, periodic trends, and molecular interactions",
        "Concentrations, solutions, stoichiometry, and balanced reactions",
        "Acids, bases, gas behaviors, and real-world chemical relationships"
      ]
    },
    {
      subject: "Biology",
      subtitle: "Living Systems & Biological Reasoning",
      domains: [
        "Cellular biology, membrane transport, diffusion, and osmosis",
        "Bioenergetics, cellular respiration, and energy flow in living systems",
        "Human organ systems, physiological regulation, and homeostasis",
        "Biological terminology, cause-and-effect reasoning, and scientific comprehension"
      ]
    }
  ],

  // Support Model
  supportModel: [
    {
      title: "Teacher Support",
      subtitle: "Direct Instructional Guidance",
      description: "Accessible guidance from foundational educators trained to teach adults with patience and clarity."
    },
    {
      title: "Learning Support",
      subtitle: "Assistance When You Get Stuck",
      description: "Dedicated problem-solving walkthroughs when calculations or abstract concepts feel difficult."
    },
    {
      title: "Accountability",
      subtitle: "Structures for Adult Consistency",
      description: "Clear weekly milestones designed to help busy learners maintain momentum without falling behind."
    },
    {
      title: "Progress Feedback",
      subtitle: "Transparent Visibility into Growth",
      description: "Formative checks showing exactly which concepts have been mastered and what needs further practice."
    },
    {
      title: "Catch-Up Pathways",
      subtitle: "Realistic Adult Flexibility",
      description: "Structured catch-up material so missing a session due to work or family duties does not derail your progress."
    }
  ],

  // Application Requirements
  applicationRequirements: [
    "A clear or emerging goal in a science-dependent academic or professional pathway (e.g. Nursing, Pharmacy, Engineering, Computing).",
    "Willingness to commit consistent weekly study time outside of instructional sessions.",
    "Willingness to practise problem sets actively rather than passively memorizing answers.",
    "Honesty about your starting point and readiness to ask questions when stuck.",
    "Access to a reliable device (smartphone, tablet, or laptop) and steady internet connectivity."
  ],

  // Comprehensive FAQ Database
  faqs: [
    {
      question: "Who is the Academy for?",
      category: "General",
      answer: "The Academy is designed for individuals who need to rebuild their science foundation to pursue science-related education or careers. This includes adult returnees, working professionals, individuals from Arts or Commercial backgrounds, and learners with incomplete or forgotten science instruction."
    },
    {
      question: "Do I need a science background to join?",
      category: "Admissions",
      answer: "No. The Academy is specifically designed for learners whose science foundation is weak, fragmented, forgotten, or non-existent. We start from intuitive first principles rather than assuming prior knowledge."
    },
    {
      question: "What if I studied Arts or Commercial subjects in secondary school?",
      category: "Admissions",
      answer: "You are very welcome. Many learners transition from non-science backgrounds into nursing, health sciences, or technical disciplines. The Academy provides the foundational bridge you need to understand core scientific concepts without being overwhelmed."
    },
    {
      question: "Is this only for Nursing and health-related pathways?",
      category: "Curriculum",
      answer: "While many of our first learners are preparing for Nursing, Midwifery, Pharmacy, and allied health courses, the Academy's foundation spans Mathematics, Physics, Chemistry, and Biology. The principles taught apply to all science-dependent academic pathways."
    },
    {
      question: "Is this a JAMB tutorial center?",
      category: "General",
      answer: "No. Standard tutorial centers focus primarily on rapid revision and past-question drills for students who already possess an underlying foundation. Science Transition Academy focuses on foundation building—teaching you why scientific formulas and concepts work so you can solve both familiar and unfamiliar problems."
    },
    {
      question: "How does the Science Readiness Assessment work?",
      category: "General",
      answer: "The Science Readiness Assessment is a 15-minute diagnostic evaluating your intuitive reasoning across Mathematics, Physics, Chemistry, and Biology. It generates an immediate Science Readiness Blueprint identifying your baseline, strong domains, and priority concept gaps. It is completely free and runs privately on your device."
    },
    {
      question: "How long is the Founding Cohort programme?",
      category: "Schedule & Cost",
      answer: "The exact duration of Cohort 01 will be announced with the admissions packet. It is being structured to provide thorough foundational depth without overwhelming adult schedules."
    },
    {
      question: "When does the next cohort begin?",
      category: "Schedule & Cost",
      answer: "Applications and expressions of interest are currently being received for the Founding Cohort. Dates and enrollment timelines will be communicated directly to waitlist members before public release."
    },
    {
      question: "How much does the programme cost?",
      category: "Schedule & Cost",
      answer: "Tuition details will be announced prior to formal enrollment. We are committed to a transparent, fair pricing structure with clear inclusions and no surprise charges."
    },
    {
      question: "Is the programme physical, online, or hybrid?",
      category: "Schedule & Cost",
      answer: "Delivery format details will be finalized and announced with the cohort packet. The design prioritizes accessibility for adult working schedules."
    },
    {
      question: "What happens if I miss a scheduled class or session?",
      category: "Curriculum",
      answer: "We understand that adult life involves unexpected work shifts and family responsibilities. The programme is being built with catch-up pathways, recorded walkthroughs, and practice guides so you do not fall behind."
    },
    {
      question: "Will the Academy guarantee university or nursing school admission?",
      category: "Admissions",
      answer: "No educational institution can honestly guarantee admission, as admission decisions depend entirely on official regulatory bodies, individual universities, and colleges. What the Academy guarantees is a dedicated, structured environment to rebuild the scientific and mathematical competence required to meet those academic standards."
    }
  ],

  contactWhatsAppNumber: "2348024646351"
};

/**
 * Helper to get button label and status badge based on applicationStatus
 */
export function getCohortStatusInfo(status: ApplicationStatus) {
  switch (status) {
    case 'COMING_SOON':
      return {
        badgeText: "Applications Opening Soon",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
        primaryButtonText: "Join the Interest List",
        statusNotice: "Founding Cohort applications are opening soon.",
        modalTitle: "Join the Interest List",
        modalDescription: "Register your interest to receive priority admissions criteria, curriculum schedules, and tuition announcements before public release.",
        submitButtonText: "Submit Interest"
      };
    case 'OPEN':
      return {
        badgeText: "Applications Open",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
        primaryButtonText: "Apply for the Founding Cohort",
        statusNotice: "Founding Cohort applications are currently open.",
        modalTitle: "Apply for the Founding Cohort",
        modalDescription: "Submit your application for Cohort 01. Our admissions team will review your background and target academic goals.",
        submitButtonText: "Submit Cohort Application"
      };
    case 'CLOSED':
      return {
        badgeText: "Applications Closed",
        badgeColor: "bg-slate-500/20 text-slate-300 border-slate-400/30",
        primaryButtonText: "Join the Next Cohort Interest List",
        statusNotice: "Applications for this cohort are currently closed.",
        modalTitle: "Join the Next Cohort Interest List",
        modalDescription: "The current cohort is full. Submit your details to be notified when admissions for the subsequent cohort open.",
        submitButtonText: "Join Next Cohort Interest List"
      };
  }
}
