/**
 * ScienceFix - Server-Side Tutorial Portal Store & Service
 * 
 * Provides student identity validation, session token management,
 * personalized learning context construction, auto-marking,
 * and teacher workspace data aggregation.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { 
  TutorialStudent, 
  StudentProfile, 
  StudentLearningPlan, 
  StudentSubjectPlan,
  TeachingSessionLog, 
  StudentAssignment, 
  DailyFixPractice, 
  ReadingTask, 
  TopicMasteryRecord, 
  TeacherFollowUpItem, 
  StudentStreak,
  StudentLearningContext,
  StudentHomeDashboardData,
  TeacherDashboardData,
  AssignmentResult,
  StudentAnswerSubmission
} from '../types/studentPortal';
import { QUESTIONS } from '../data/questions';
import { Subject } from '../types';

// Rate-limiting tracker for PIN entry
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}
const pinRateLimits = new Map<string, RateLimitRecord>();

// Active student sessions: token -> studentId (expires in 30 days)
interface SessionRecord {
  studentId: string;
  expiresAt: number;
}
const activeSessions = new Map<string, SessionRecord>();

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL SEED DATA FOR DEMO & TESTING
// Individual students with completely differentiated learning plans and needs
// ─────────────────────────────────────────────────────────────────────────────

const SEED_STUDENTS: TutorialStudent[] = [
  {
    id: 'student-david',
    name: 'David Eze',
    accessCode: '4091', // Easy PIN for David
    phone: '08023456789',
    avatarSeed: 'David',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    isActive: true,
    currentGoal: 'Nursing & Allied Health Entrance'
  },
  {
    id: 'student-aisha',
    name: 'Aisha Bello',
    accessCode: '8214', // Easy PIN for Aisha
    phone: '08034567890',
    avatarSeed: 'Aisha',
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    isActive: true,
    currentGoal: 'Pharmacy School Foundation'
  },
  {
    id: 'student-emeka',
    name: 'Emeka Okafor',
    accessCode: '5532', // Easy PIN for Emeka
    phone: '08045678901',
    avatarSeed: 'Emeka',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    isActive: true,
    currentGoal: 'Engineering & Physical Sciences'
  }
];

const SEED_PROFILES: Map<string, StudentProfile> = new Map([
  ['student-david', {
    studentId: 'student-david',
    subjects: ['Chemistry', 'Biology'],
    overallLevel: 'F',
    strengths: ['States of Matter', 'Conservation of Mass', 'Cell Organization'],
    needsImprovement: ['Electron Configuration', 'Chemical Bonding', 'Solution Molarity'],
    targetPathway: 'Nursing & Midwifery',
    dailyQuestionTarget: 5,
    dailyReadingTargetMinutes: 15,
    teacherNotes: 'David grasps intuitive analogies well but hesitates when notation becomes symbolic (e.g. 1s² 2s² 2p⁶). Needs deliberate reinforcement on subshell capacities before proceeding to covalent bonding.',
    updatedAt: new Date().toISOString()
  }],
  ['student-aisha', {
    studentId: 'student-aisha',
    subjects: ['Mathematics', 'Chemistry'],
    overallLevel: 'Z',
    strengths: ['Direct Proportions', 'Everyday Arithmetic'],
    needsImprovement: ['Linear Equation Balancing', 'Negative Numbers', 'Fractions with Unlike Denominators'],
    targetPathway: 'Pharmacy & Health Sciences',
    dailyQuestionTarget: 5,
    dailyReadingTargetMinutes: 20,
    teacherNotes: 'Aisha switched from Commercial subjects. She has strong motivation but missed early algebra foundations. Prefers step-by-step worked examples before attempting independent practice.',
    updatedAt: new Date().toISOString()
  }],
  ['student-emeka', {
    studentId: 'student-emeka',
    subjects: ['Physics', 'Mathematics'],
    overallLevel: 'P',
    strengths: ['Formula Execution (W=Fd, V=IR)', 'Algebraic Manipulation'],
    needsImprovement: ['Motion Graphs Interpretation', 'Newton’s Third Law Interaction Pairs', 'Vector Resolution'],
    targetPathway: 'Mechanical / Electrical Engineering',
    dailyQuestionTarget: 8,
    dailyReadingTargetMinutes: 20,
    teacherNotes: 'Emeka relies heavily on formula plugging without visualizing the underlying physical interaction. We need to detach him from mechanical calculation toward qualitative reasoning.',
    updatedAt: new Date().toISOString()
  }]
]);

const SEED_LEARNING_PLANS: Map<string, StudentLearningPlan> = new Map([
  ['student-david', {
    studentId: 'student-david',
    subjects: [
      {
        subject: 'Chemistry',
        currentTopic: 'Atomic Structure & Subshells',
        targetTopics: ['Chemical Bonding', 'Solution Molarity', 'Periodic Trends'],
        weakTopics: ['Electron Configuration', 'Subshell Orbitals'],
        completedTopics: ['States of Matter', 'Physical vs Chemical Changes'],
        preferredDifficulty: 2
      },
      {
        subject: 'Biology',
        currentTopic: 'Cell Membrane & Selective Transport',
        targetTopics: ['Osmosis & Plasmolysis', 'Digestive Absorption', 'Systemic Circulation'],
        weakTopics: ['Diffusion Gradients'],
        completedTopics: ['Cellular Organization'],
        preferredDifficulty: 2
      }
    ],
    nextRecommendedAction: 'Practise 5 questions on electron configuration rules (Aufbau & Pauli).',
    learningGoals: ['Master valence electron filling', 'Understand nursing fluid concentration calculations'],
    updatedAt: new Date().toISOString()
  }],
  ['student-aisha', {
    studentId: 'student-aisha',
    subjects: [
      {
        subject: 'Mathematics',
        currentTopic: 'Linear Equations & Inverse Operations',
        targetTopics: ['Simultaneous Equations', 'Quadratic Factorization'],
        weakTopics: ['Order of Operations (BODMAS)', 'Directed Negative Numbers'],
        completedTopics: ['Everyday Percentages', 'Direct Proportions'],
        preferredDifficulty: 1
      }
    ],
    nextRecommendedAction: 'Complete 5-question clinic on isolating variables with subtraction and division.',
    learningGoals: ['Solve linear equations without sign errors', 'Prepare for dosage calculations'],
    updatedAt: new Date().toISOString()
  }],
  ['student-emeka', {
    studentId: 'student-emeka',
    subjects: [
      {
        subject: 'Physics',
        currentTopic: 'Kinematics & Motion Graphs',
        targetTopics: ['Newton’s Laws of Motion', 'Centripetal Acceleration'],
        weakTopics: ['Velocity-Time Graph Area (Displacement)', 'Inertia vs Impetus Theory'],
        completedTopics: ['Units & Dimensions', 'Free Fall Equivalence'],
        preferredDifficulty: 3
      }
    ],
    nextRecommendedAction: 'Analyse graph slope vs area under curve for acceleration and displacement.',
    learningGoals: ['Dispel impetus theory misconception', 'Interpret unfamiliar physics scenarios without relying on memorized formulas'],
    updatedAt: new Date().toISOString()
  }]
]);

const SEED_STREAKS: Map<string, StudentStreak> = new Map([
  ['student-david', {
    studentId: 'student-david',
    currentStreakDays: 4,
    longestStreakDays: 7,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    todayCompleted: false
  }],
  ['student-aisha', {
    studentId: 'student-aisha',
    currentStreakDays: 2,
    longestStreakDays: 5,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    todayCompleted: false
  }],
  ['student-emeka', {
    studentId: 'student-emeka',
    currentStreakDays: 6,
    longestStreakDays: 12,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    todayCompleted: true
  }]
]);

const SEED_TEACHING_SESSIONS: TeachingSessionLog[] = [
  {
    id: 'sess-david-1',
    studentId: 'student-david',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    subtopic: 'Electron Configuration & Shells',
    whatWasTaught: 'Introduced main energy levels n=1,2,3,4 and subshells s, p, d. Worked through filling diagrams for Hydrogen up to Neon.',
    struggles: 'David struggled with the maximum electron capacity of p subshell (6 electrons) and got confused between shell number and orbital letters.',
    teacherEmphasis: 'Emphasized: s holds up to 2, p holds up to 6. Orbitals are rooms, electrons are guests.',
    understandingLevel: 2,
    recommendedNextStep: 'Targeted practice: write configurations for elements 1 to 10 until confident.',
    extractedWeaknesses: ['p-subshell capacity', 'orbital notation'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'sess-aisha-1',
    studentId: 'student-aisha',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    subject: 'Mathematics',
    topic: 'Linear Equations',
    subtopic: 'Two-step equations (ax + b = c)',
    whatWasTaught: 'Taught the balance scale model. Demonstrated subtracting the constant first, then dividing by the coefficient.',
    struggles: 'Aisha understands substitution into equations, but made sign errors when subtracting negative numbers.',
    teacherEmphasis: 'Reverse the operation in reverse order of BODMAS: remove addition/subtraction before multiplication/division.',
    understandingLevel: 3,
    recommendedNextStep: 'Daily Fix practice with mixed sign two-step equations.',
    extractedWeaknesses: ['Negative sign arithmetic', 'Order of inverse operations'],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// Helper to pull relevant questions from the 400-question repository
function findQuestionsForTopic(subject: Subject, topicKeyword: string, count: number = 5) {
  const matches = QUESTIONS.filter(q => 
    q.subject === subject && 
    (q.topic.toLowerCase().includes(topicKeyword.toLowerCase()) || 
     q.text.toLowerCase().includes(topicKeyword.toLowerCase()))
  );
  if (matches.length >= count) {
    return matches.slice(0, count);
  }
  // fallback to subject pool
  const subjectPool = QUESTIONS.filter(q => q.subject === subject);
  return subjectPool.slice(0, count);
}

// Transform Question to AssignmentQuestionItem
function toAssignmentQuestion(q: (typeof QUESTIONS)[0]) {
  const correct = q.options.reduce((p, c) => (p.points > c.points ? p : c), q.options[0]);
  return {
    id: q.id,
    text: q.text,
    type: 'multiple_choice' as const,
    options: q.options.map(o => ({ id: o.id, text: o.text, points: o.points })),
    correctOptionId: correct.id,
    explanation: q.explanation || 'Review fundamental definitions and step-by-step physical relationships.',
    subject: q.subject,
    topic: q.topic,
    difficulty: q.difficulty || 2,
    learningObjective: `Master ${q.topic} principles and problem solving.`
  };
}

const SEED_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: 'assign-david-1',
    studentId: 'student-david',
    title: 'Atomic Structure & Subshell Filling',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    instructions: 'Complete these 5 questions based on our tutorial session. Pay close attention to orbital notation and electron counts.',
    questions: findQuestionsForTopic('Chemistry', 'Atomic', 5).map(toAssignmentQuestion),
    difficulty: 2,
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    estimatedMinutes: 15,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'assign-aisha-1',
    studentId: 'student-aisha',
    title: 'Two-Step Linear Equations Clinic',
    subject: 'Mathematics',
    topic: 'Linear Equations',
    instructions: 'Isolate x in each problem. Show or check your inverse operations step by step.',
    questions: findQuestionsForTopic('Mathematics', 'Algebra', 5).map(toAssignmentQuestion),
    difficulty: 1,
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    estimatedMinutes: 15,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const SEED_DAILY_PRACTICE: DailyFixPractice[] = [
  {
    id: 'daily-david-today',
    studentId: 'student-david',
    date: new Date().toISOString().slice(0, 10),
    subject: 'Chemistry',
    focusTopic: 'Atomic Structure & Electrons',
    reason: 'current_focus',
    questions: findQuestionsForTopic('Chemistry', 'Atomic', 5).map(toAssignmentQuestion),
    status: 'pending'
  },
  {
    id: 'daily-aisha-today',
    studentId: 'student-aisha',
    date: new Date().toISOString().slice(0, 10),
    subject: 'Mathematics',
    focusTopic: 'Basic Algebra & Signs',
    reason: 'current_focus',
    questions: findQuestionsForTopic('Mathematics', 'Algebra', 5).map(toAssignmentQuestion),
    status: 'pending'
  },
  {
    id: 'daily-emeka-today',
    studentId: 'student-emeka',
    date: new Date().toISOString().slice(0, 10),
    subject: 'Physics',
    focusTopic: 'Kinematics & Motion',
    reason: 'current_focus',
    questions: findQuestionsForTopic('Physics', 'Kinematics', 5).map(toAssignmentQuestion),
    status: 'completed',
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    score: 20,
    maxScore: 25,
    percentage: 80
  }
];

const SEED_READING_TASKS: ReadingTask[] = [
  {
    id: 'read-david-1',
    studentId: 'student-david',
    subject: 'Chemistry',
    topic: 'Subatomic Particles & Orbitals',
    title: 'How Electrons Inhabit Energy Shells',
    content: `Electrons are not tiny planets orbiting a sun in neat flat circles. In modern chemistry, electrons occupy three-dimensional regions of probability called orbitals.\n\nThe principal energy levels (n = 1, 2, 3...) tell you the main distance from the nucleus. Within each level, there are subshells: s, p, d, and f.\n\n• The 's' subshell has 1 orbital and holds a maximum of 2 electrons.\n• The 'p' subshell has 3 orbitals and holds a maximum of 6 electrons.\n• The 'd' subshell has 5 orbitals and holds a maximum of 10 electrons.\n\nRemember the Aufbau principle: electrons always fill lower energy levels before moving to higher ones.`,
    targetDurationMinutes: 10,
    recallQuestion: {
      questionText: 'What is the maximum number of electrons that can fit into any p subshell?',
      options: [
        { id: 'a', text: '2 electrons', isCorrect: false },
        { id: 'b', text: '6 electrons', isCorrect: true },
        { id: 'c', text: '10 electrons', isCorrect: false },
        { id: 'd', text: '14 electrons', isCorrect: false }
      ],
      explanation: 'A p subshell contains 3 orbitals. Each orbital holds a maximum of 2 electrons, for a total of 3 × 2 = 6 electrons.'
    },
    status: 'pending'
  },
  {
    id: 'read-aisha-1',
    studentId: 'student-aisha',
    subject: 'Mathematics',
    topic: 'Order of Operations & Signs',
    title: 'Why Inverse Operations Work in Algebra',
    content: `Solving an algebraic equation is like unwrapping a package in reverse order.\n\nIf you take a number x, multiply it by 2, and add 5 to get 11:\n1. The last thing done to x was adding 5.\n2. To unwrap it, first subtract 5 from both sides: 2x = 6.\n3. The remaining operation on x is multiplication by 2. To unwrap it, divide both sides by 2: x = 3.\n\nAlways undo addition and subtraction before undoing multiplication and division.`,
    targetDurationMinutes: 10,
    recallQuestion: {
      questionText: 'In the equation 3x + 7 = 19, which operation should you perform first on both sides?',
      options: [
        { id: 'a', text: 'Divide both sides by 3', isCorrect: false },
        { id: 'b', text: 'Subtract 7 from both sides', isCorrect: true },
        { id: 'c', text: 'Multiply both sides by 19', isCorrect: false },
        { id: 'd', text: 'Add 7 to both sides', isCorrect: false }
      ],
      explanation: 'Always undo the constant term added or subtracted first to isolate the variable term.'
    },
    status: 'pending'
  }
];

const SEED_TOPIC_MASTERY: TopicMasteryRecord[] = [
  {
    id: 'mastery-david-1',
    studentId: 'student-david',
    subject: 'Chemistry',
    topic: 'States of Matter',
    masteryPercent: 84,
    attemptCount: 8,
    correctCount: 7,
    totalQuestions: 8,
    lastTestedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    trend: 'improving'
  },
  {
    id: 'mastery-david-2',
    studentId: 'student-david',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    masteryPercent: 38,
    attemptCount: 12,
    correctCount: 5,
    totalQuestions: 12,
    lastTestedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    trend: 'declining'
  },
  {
    id: 'mastery-aisha-1',
    studentId: 'student-aisha',
    subject: 'Mathematics',
    topic: 'Proportions & Percentages',
    masteryPercent: 78,
    attemptCount: 10,
    correctCount: 8,
    totalQuestions: 10,
    lastTestedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    trend: 'improving'
  },
  {
    id: 'mastery-aisha-2',
    studentId: 'student-aisha',
    subject: 'Mathematics',
    topic: 'Linear Equations',
    masteryPercent: 42,
    attemptCount: 10,
    correctCount: 4,
    totalQuestions: 10,
    lastTestedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    trend: 'stable'
  }
];

const SEED_FOLLOWUPS: TeacherFollowUpItem[] = [
  {
    id: 'fu-1',
    studentId: 'student-david',
    studentName: 'David Eze',
    issue: 'Atomic Structure mastery dropped to 38% after session on subshells',
    triggerType: 'repeated_low_score',
    priority: 'high',
    status: 'open',
    recommendedAction: 'Reteach p-subshell electron capacity with visual orbital boxes before next quiz.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'fu-2',
    studentId: 'student-aisha',
    studentName: 'Aisha Bello',
    issue: 'Negative sign errors recurring in two-step equations',
    triggerType: 'declining_performance',
    priority: 'medium',
    status: 'open',
    recommendedAction: 'Provide 5 worked examples showing negative number lines.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// TUTORIAL STORE IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

class TutorialPortalStore {
  private students = new Map<string, TutorialStudent>();
  private profiles = new Map<string, StudentProfile>();
  private plans = new Map<string, StudentLearningPlan>();
  private streaks = new Map<string, StudentStreak>();
  private sessions: TeachingSessionLog[] = [];
  private assignments: StudentAssignment[] = [];
  private dailyPractices: DailyFixPractice[] = [];
  private readingTasks: ReadingTask[] = [];
  private masteryRecords: TopicMasteryRecord[] = [];
  private followUps: TeacherFollowUpItem[] = [];

  private dbPath = path.join(process.cwd(), 'data', 'portal_database.json');
  private supabaseEnabled = false;
  private persistenceReady = false;
  private persistencePromise: Promise<void> | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        const data = JSON.parse(raw);
        if (data.students && Array.isArray(data.students)) {
          this.students = new Map(data.students);
          this.profiles = new Map(data.profiles || []);
          this.plans = new Map(data.plans || []);
          this.streaks = new Map(data.streaks || []);
          this.sessions = data.sessions || [];
          this.assignments = data.assignments || [];
          this.dailyPractices = data.dailyPractices || [];
          this.readingTasks = data.readingTasks || [];
          this.masteryRecords = data.masteryRecords || [];
          this.followUps = data.followUps || [];
          if (Array.isArray(data.sessionsMap)) {
            data.sessionsMap.forEach(([k, v]: [string, SessionRecord]) => activeSessions.set(k, v));
          }
          console.log(`[PortalStore] Loaded database from ${this.dbPath} with ${this.students.size} students`);
          return;
        }
      }
    } catch (err) {
      console.warn('[PortalStore] Could not read disk database, initializing seed:', err);
    }
    this.seed();
    this.saveToDisk();
  }

  private buildState() {
    return {
      updatedAt: new Date().toISOString(),
      students: Array.from(this.students.entries()),
      profiles: Array.from(this.profiles.entries()),
      plans: Array.from(this.plans.entries()),
      streaks: Array.from(this.streaks.entries()),
      sessions: this.sessions,
      assignments: this.assignments,
      dailyPractices: this.dailyPractices,
      readingTasks: this.readingTasks,
      masteryRecords: this.masteryRecords,
      followUps: this.followUps,
      sessionsMap: Array.from(activeSessions.entries())
    };
  }

  public saveToDisk() {
    const data = this.buildState();
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[PortalStore] Error persisting database to disk:', err);
    }
    void this.persistToSupabase(data);
  }

  private async persistToSupabase(data: any) {
    if (!this.supabaseEnabled) return;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return;
    try {
      const response = await fetch(`${url}/rest/v1/sciencefix_portal_state?on_conflict=id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({ id: 'singleton', state: data, updated_at: new Date().toISOString() })
      });
      if (!response.ok) console.error('[PortalStore] Supabase persistence failed:', await response.text());
    } catch (err) {
      console.error('[PortalStore] Supabase persistence error:', err);
    }
  }

  public async initializePersistence() {
    if (this.persistencePromise) return this.persistencePromise;
    this.persistencePromise = (async () => {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) {
        this.persistenceReady = true;
        console.warn('[PortalStore] Supabase credentials missing; using local persistence.');
        return;
      }
      this.supabaseEnabled = true;
      try {
        const response = await fetch(
          `${url}/rest/v1/sciencefix_portal_state?select=state&limit=1`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` } }
        );
        if (!response.ok) {
          console.warn('[PortalStore] Could not load Supabase portal state:', await response.text());
          return;
        }
        const rows = await response.json();
        if (Array.isArray(rows) && rows[0]?.state) {
          this.hydrate(rows[0].state);
          console.log(`[PortalStore] Loaded production portal state with ${this.students.size} students.`);
        } else {
          await this.persistToSupabase(this.buildState());
          console.log('[PortalStore] Seeded production portal state.');
        }
      } catch (err) {
        console.error('[PortalStore] Supabase initialization failed:', err);
      } finally {
        this.persistenceReady = true;
      }
    })();
    return this.persistencePromise;
  }

  private hydrate(data: any) {
    if (data.students && Array.isArray(data.students)) this.students = new Map(data.students);
    this.profiles = new Map(data.profiles || []);
    this.plans = new Map(data.plans || []);
    this.streaks = new Map(data.streaks || []);
    this.sessions = data.sessions || [];
    this.assignments = data.assignments || [];
    this.dailyPractices = data.dailyPractices || [];
    this.readingTasks = data.readingTasks || [];
    this.masteryRecords = data.masteryRecords || [];
    this.followUps = data.followUps || [];
    activeSessions.clear();
    if (Array.isArray(data.sessionsMap)) {
      data.sessionsMap.forEach(([k, v]: [string, SessionRecord]) => activeSessions.set(k, v));
    }
  }

  private seed() {
    SEED_STUDENTS.forEach(s => this.students.set(s.id, { ...s }));
    SEED_PROFILES.forEach((p, k) => this.profiles.set(k, { ...p }));
    SEED_LEARNING_PLANS.forEach((lp, k) => this.plans.set(k, { ...lp }));
    SEED_STREAKS.forEach((st, k) => this.streaks.set(k, { ...st }));
    this.sessions = [...SEED_TEACHING_SESSIONS];
    this.assignments = [...SEED_ASSIGNMENTS];
    this.dailyPractices = [...SEED_DAILY_PRACTICE];
    this.readingTasks = [...SEED_READING_TASKS];
    this.masteryRecords = [...SEED_TOPIC_MASTERY];
    this.followUps = [...SEED_FOLLOWUPS];
  }

  // 1. Authentication & Identity
  public verifyStudentPIN(accessCode: string, ipAddress: string): { 
    success: boolean; 
    student?: TutorialStudent; 
    token?: string; 
    error?: string 
  } {
    const cleanCode = accessCode.trim().toUpperCase();
    const rate = pinRateLimits.get(ipAddress) || { attempts: 0, lockoutUntil: 0 };

    if (Date.now() < rate.lockoutUntil) {
      const waitSeconds = Math.ceil((rate.lockoutUntil - Date.now()) / 1000);
      return { 
        success: false, 
        error: `Too many failed attempts. Please wait ${waitSeconds} seconds before trying again.` 
      };
    }

    const student = Array.from(this.students.values()).find(
      s => s.accessCode.toUpperCase() === cleanCode && s.isActive
    );

    if (!student) {
      rate.attempts += 1;
      if (rate.attempts >= 5) {
        rate.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 min lockout
        pinRateLimits.set(ipAddress, rate);
        return { 
          success: false, 
          error: 'Too many incorrect attempts. Account locked for 15 minutes.' 
        };
      }
      pinRateLimits.set(ipAddress, rate);
      return { success: false, error: 'Invalid student access code or PIN.' };
    }

    // Success: Reset rate limit
    pinRateLimits.delete(ipAddress);

    // Create secure session token
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, {
      studentId: student.id,
      expiresAt: Date.now() + 30 * 86400000 // 30 days
    });

    this.saveToDisk();

    return { success: true, student, token };
  }

  public getStudentByToken(token: string): TutorialStudent | null {
    if (!token) return null;
    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      if (session) activeSessions.delete(token);
      return null;
    }
    return this.students.get(session.studentId) || null;
  }

  public verifyTeacherKey(key: string): boolean {
    const configured = process.env.ADMIN_DASHBOARD_KEY || 'sciencefix-teacher';
    return Boolean(key && key.trim() === configured);
  }

  // 2. Student Home Dashboard Data
  public getStudentHomeDashboard(studentId: string): StudentHomeDashboardData | null {
    const student = this.students.get(studentId);
    if (!student) return null;

    const profile = this.profiles.get(studentId) || {
      studentId,
      subjects: ['Chemistry'],
      overallLevel: 'F',
      strengths: [],
      needsImprovement: [],
      targetPathway: student.currentGoal,
      dailyQuestionTarget: 5,
      dailyReadingTargetMinutes: 15,
      teacherNotes: '',
      updatedAt: new Date().toISOString()
    };

    const learningPlan = this.plans.get(studentId) || {
      studentId,
      subjects: [],
      nextRecommendedAction: 'Check in with teacher for personalized plan.',
      learningGoals: [student.currentGoal],
      updatedAt: new Date().toISOString()
    };

    const streak = this.streaks.get(studentId) || {
      studentId,
      currentStreakDays: 1,
      longestStreakDays: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      todayCompleted: false
    };

    const todayStr = new Date().toISOString().slice(0, 10);
    let todayPractice = this.dailyPractices.find(
      p => p.studentId === studentId && p.date === todayStr
    ) || null;

    // If today's practice doesn't exist yet, auto-generate from current learning plan
    if (!todayPractice) {
      todayPractice = this.generateDailyFix(studentId);
    }

    const pendingAssignments = this.assignments.filter(
      a => a.studentId === studentId && a.status === 'pending'
    );

    const todayReading = this.readingTasks.find(
      r => r.studentId === studentId && r.status === 'pending'
    ) || null;

    // Find most recent completed activity score
    const completedDaily = this.dailyPractices
      .filter(p => p.studentId === studentId && p.status === 'completed' && p.percentage !== undefined)
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0];

    const completedAssign = this.assignments
      .filter(a => a.studentId === studentId && a.status === 'completed' && a.percentage !== undefined)
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())[0];

    let recentScore = null;
    if (completedDaily || completedAssign) {
      if (!completedAssign || (completedDaily && new Date(completedDaily.completedAt!).getTime() > new Date(completedAssign.completedAt!).getTime())) {
        recentScore = {
          title: `Daily Fix (${completedDaily.focusTopic})`,
          percentage: completedDaily.percentage!,
          completedAt: completedDaily.completedAt!
        };
      } else if (completedAssign) {
        recentScore = {
          title: completedAssign.title,
          percentage: completedAssign.percentage!,
          completedAt: completedAssign.completedAt!
        };
      }
    }

    // Current topic focus
    const firstSubjectPlan = learningPlan.subjects[0];
    const currentFocus = {
      subject: firstSubjectPlan?.subject || 'Chemistry',
      topic: firstSubjectPlan?.currentTopic || 'Foundation Basics',
      reason: firstSubjectPlan?.weakTopics?.length 
        ? `Focusing on ${firstSubjectPlan.weakTopics[0]} based on recent session notes`
        : 'Active tutorial lesson focus'
    };

    const weakTopicsCount = learningPlan.subjects.reduce(
      (acc, s) => acc + (s.weakTopics?.length || 0), 0
    );

    return {
      student,
      streak,
      profile,
      learningPlan,
      todayPractice,
      pendingAssignments,
      todayReading,
      recentScore,
      currentFocus,
      weakTopicsCount
    };
  }

  // 3. Learning Context Builder (For AI question generation and personalization)
  public buildStudentLearningContext(studentId: string): StudentLearningContext | null {
    const student = this.students.get(studentId);
    if (!student) return null;

    const profile = this.profiles.get(studentId);
    const plan = this.plans.get(studentId);
    const recentSessions = this.sessions
      .filter(s => s.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(s => ({
        date: s.date,
        subject: s.subject,
        topic: s.topic,
        struggles: s.struggles,
        understandingLevel: s.understandingLevel,
        recommendedNextStep: s.recommendedNextStep
      }));

    const currentTopics: { subject: Subject; topic: string }[] = [];
    const weakTopics: { subject: Subject; topic: string; mastery: number }[] = [];

    if (plan) {
      plan.subjects.forEach(sp => {
        if (sp.currentTopic) currentTopics.push({ subject: sp.subject, topic: sp.currentTopic });
        sp.weakTopics?.forEach(wt => {
          const rec = this.masteryRecords.find(m => m.studentId === studentId && m.topic === wt);
          weakTopics.push({
            subject: sp.subject,
            topic: wt,
            mastery: rec?.masteryPercent ?? 40
          });
        });
      });
    }

    // Collect question history to avoid repeating questions
    const usedQuestionIds: string[] = [];
    this.assignments.filter(a => a.studentId === studentId).forEach(a => {
      a.questions.forEach(q => usedQuestionIds.push(q.id));
    });
    this.dailyPractices.filter(p => p.studentId === studentId).forEach(p => {
      p.questions.forEach(q => usedQuestionIds.push(q.id));
    });

    const recentScores: { title: string; percentage: number; date: string }[] = [];
    this.dailyPractices.filter(p => p.studentId === studentId && p.completedAt).forEach(p => {
      recentScores.push({ title: `Daily Fix: ${p.focusTopic}`, percentage: p.percentage || 0, date: p.completedAt! });
    });
    this.assignments.filter(a => a.studentId === studentId && a.completedAt).forEach(a => {
      recentScores.push({ title: a.title, percentage: a.percentage || 0, date: a.completedAt! });
    });

    return {
      studentId,
      studentName: student.name,
      level: profile?.overallLevel || 'F',
      goal: student.currentGoal,
      subjects: profile?.subjects || ['Chemistry'],
      currentTopics,
      weakTopics,
      recentSessions,
      recentMistakes: [],
      recentScores: recentScores.slice(0, 5),
      usedQuestionIds: Array.from(new Set(usedQuestionIds))
    };
  }

  // 4. Daily Fix Practice Generator
  public generateDailyFix(studentId: string, customTopic?: string, customSubject?: Subject): DailyFixPractice {
    const student = this.students.get(studentId);
    const plan = this.plans.get(studentId);
    const subjectPlan = plan?.subjects[0];

    const subject: Subject = customSubject || subjectPlan?.subject || 'Chemistry';
    const focusTopic = customTopic || (
      subjectPlan?.weakTopics?.length ? subjectPlan.weakTopics[0] : (subjectPlan?.currentTopic || 'Foundation Concepts')
    );

    const questions = findQuestionsForTopic(subject, focusTopic, 5).map(toAssignmentQuestion);
    const todayStr = new Date().toISOString().slice(0, 10);

    const newPractice: DailyFixPractice = {
      id: `daily-${studentId}-${todayStr}-${Date.now()}`,
      studentId,
      date: todayStr,
      subject,
      focusTopic,
      reason: subjectPlan?.weakTopics?.includes(focusTopic) ? 'weak_area_reinforcement' : 'current_focus',
      questions,
      status: 'pending'
    };

    this.dailyPractices.push(newPractice);
    this.saveToDisk();
    return newPractice;
  }

  // 5. Server-Authoritative Assignment & Practice Submission Marking
  public submitAssignmentAnswers(
    assignmentId: string,
    studentId: string,
    submissions: StudentAnswerSubmission[]
  ): AssignmentResult {
    const assignment = this.assignments.find(a => a.id === assignmentId && a.studentId === studentId);
    if (!assignment) {
      throw new Error('Assignment not found for this student.');
    }

    let earnedScore = 0;
    const maxScore = assignment.questions.length * 5;
    const questionResults = assignment.questions.map(q => {
      const sub = submissions.find(s => s.questionId === q.id);
      const isCorrect = sub?.selectedOptionId === q.correctOptionId;
      const pts = isCorrect ? 5 : (sub?.selectedOptionId ? 1 : 0);
      earnedScore += pts;
      return {
        questionId: q.id,
        text: q.text,
        selectedOptionId: sub?.selectedOptionId || '',
        correctOptionId: q.correctOptionId,
        isCorrect,
        pointsEarned: pts,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((earnedScore / maxScore) * 100);
    const passed = percentage >= 60;

    assignment.status = 'completed';
    assignment.completedAt = new Date().toISOString();
    assignment.score = earnedScore;
    assignment.maxScore = maxScore;
    assignment.percentage = percentage;

    // Update Topic Mastery
    this.recordTopicMastery(studentId, assignment.subject, assignment.topic, percentage, assignment.questions.length, questionResults.filter(r => r.isCorrect).length);

    // Update Streak
    this.incrementStreak(studentId);

    // Auto-create Teacher Follow-up if low score (< 50%)
    if (percentage < 50) {
      this.createFollowUp({
        studentId,
        studentName: this.students.get(studentId)?.name || 'Student',
        issue: `Low score on assignment: "${assignment.title}" (${percentage}%)`,
        triggerType: 'repeated_low_score',
        priority: 'high',
        recommendedAction: `Schedule 1-on-1 review for ${assignment.topic}.`
      });
    }

    this.saveToDisk();

    return {
      assignmentId,
      studentId,
      score: earnedScore,
      maxScore,
      percentage,
      passed,
      questionResults,
      strengths: passed ? [`Solid performance in ${assignment.topic}`] : [],
      areasToPractise: !passed ? [`Review foundational principles of ${assignment.topic}`] : [],
      completedAt: assignment.completedAt
    };
  }

  public submitDailyPracticeAnswers(
    practiceId: string,
    studentId: string,
    submissions: StudentAnswerSubmission[]
  ): AssignmentResult {
    const practice = this.dailyPractices.find(p => p.id === practiceId && p.studentId === studentId);
    if (!practice) {
      throw new Error('Daily Fix practice not found.');
    }

    let earnedScore = 0;
    const maxScore = practice.questions.length * 5;
    const questionResults = practice.questions.map(q => {
      const sub = submissions.find(s => s.questionId === q.id);
      const isCorrect = sub?.selectedOptionId === q.correctOptionId;
      const pts = isCorrect ? 5 : (sub?.selectedOptionId ? 1 : 0);
      earnedScore += pts;
      return {
        questionId: q.id,
        text: q.text,
        selectedOptionId: sub?.selectedOptionId || '',
        correctOptionId: q.correctOptionId,
        isCorrect,
        pointsEarned: pts,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((earnedScore / maxScore) * 100);
    practice.status = 'completed';
    practice.completedAt = new Date().toISOString();
    practice.score = earnedScore;
    practice.maxScore = maxScore;
    practice.percentage = percentage;

    // Update topic mastery & streak
    this.recordTopicMastery(studentId, practice.subject, practice.focusTopic, percentage, practice.questions.length, questionResults.filter(r => r.isCorrect).length);
    this.incrementStreak(studentId);

    // Low score follow-up check
    if (percentage < 40) {
      this.createFollowUp({
        studentId,
        studentName: this.students.get(studentId)?.name || 'Student',
        issue: `Struggled with Daily Fix on ${practice.focusTopic} (${percentage}%)`,
        triggerType: 'repeated_low_score',
        priority: 'medium',
        recommendedAction: `Add remedial notes for ${practice.focusTopic} in next lesson.`
      });
    }

    this.saveToDisk();

    return {
      assignmentId: practiceId,
      studentId,
      score: earnedScore,
      maxScore,
      percentage,
      passed: percentage >= 60,
      questionResults,
      strengths: percentage >= 60 ? [`Consistent reasoning in ${practice.focusTopic}`] : [],
      areasToPractise: percentage < 60 ? [`Reinforce ${practice.focusTopic}`] : [],
      completedAt: practice.completedAt
    };
  }

  // 6. Reading Task Completion
  public completeReadingTask(taskId: string, studentId: string, durationMinutes: number): boolean {
    const task = this.readingTasks.find(r => r.id === taskId && r.studentId === studentId);
    if (!task) return false;

    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.actualDurationMinutes = durationMinutes;
    this.incrementStreak(studentId);
    this.saveToDisk();
    return true;
  }

  // 7. Topic Mastery Updater
  private recordTopicMastery(
    studentId: string,
    subject: Subject,
    topic: string,
    percentage: number,
    totalQuestions: number,
    correctCount: number
  ) {
    let rec = this.masteryRecords.find(m => m.studentId === studentId && m.subject === subject && m.topic === topic);
    if (!rec) {
      rec = {
        id: `mst-${studentId}-${Date.now()}`,
        studentId,
        subject,
        topic,
        masteryPercent: percentage,
        attemptCount: 1,
        correctCount,
        totalQuestions,
        lastTestedAt: new Date().toISOString(),
        trend: 'new'
      };
      this.masteryRecords.push(rec);
    } else {
      const prevPercent = rec.masteryPercent;
      // Exponential moving average favoring recent performance
      rec.masteryPercent = Math.round(prevPercent * 0.4 + percentage * 0.6);
      rec.attemptCount += 1;
      rec.correctCount += correctCount;
      rec.totalQuestions += totalQuestions;
      rec.lastTestedAt = new Date().toISOString();
      rec.trend = rec.masteryPercent > prevPercent + 5 
        ? 'improving' 
        : (rec.masteryPercent < prevPercent - 5 ? 'declining' : 'stable');
    }
  }

  private incrementStreak(studentId: string) {
    let streak = this.streaks.get(studentId);
    if (!streak) {
      streak = {
        studentId,
        currentStreakDays: 1,
        longestStreakDays: 1,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        todayCompleted: true
      };
      this.streaks.set(studentId, streak);
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (streak.lastActiveDate !== todayStr) {
      streak.currentStreakDays += 1;
      if (streak.currentStreakDays > streak.longestStreakDays) {
        streak.longestStreakDays = streak.currentStreakDays;
      }
      streak.lastActiveDate = todayStr;
    }
    streak.todayCompleted = true;
  }

  // 8. Teaching Session Logging & Learning Plan Updates
  public logTeachingSession(data: Omit<TeachingSessionLog, 'id' | 'createdAt'>): TeachingSessionLog {
    const session: TeachingSessionLog = {
      ...data,
      id: `sess-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.sessions.unshift(session);

    // Automatically update student's learning plan context
    const plan = this.plans.get(data.studentId);
    if (plan) {
      let subjPlan = plan.subjects.find(s => s.subject === data.subject);
      if (!subjPlan) {
        subjPlan = {
          subject: data.subject,
          currentTopic: data.topic,
          targetTopics: [],
          weakTopics: [],
          completedTopics: [],
          preferredDifficulty: 2
        };
        plan.subjects.push(subjPlan);
      }
      subjPlan.currentTopic = data.topic;
      if (data.understandingLevel <= 2 && !subjPlan.weakTopics.includes(data.topic)) {
        subjPlan.weakTopics.unshift(data.topic);
      }
      plan.nextRecommendedAction = data.recommendedNextStep;
      plan.updatedAt = new Date().toISOString();
    }

    // Auto-create teacher follow up if understanding level is 1 or 2
    if (data.understandingLevel <= 2) {
      this.createFollowUp({
        studentId: data.studentId,
        studentName: this.students.get(data.studentId)?.name || 'Student',
        issue: `Struggled with ${data.topic}: "${data.struggles.slice(0, 80)}"`,
        triggerType: 'declining_performance',
        priority: 'high',
        recommendedAction: data.recommendedNextStep
      });
    }

    this.saveToDisk();
    return session;
  }

  public createAssignment(data: Omit<StudentAssignment, 'id' | 'createdAt' | 'status'>): StudentAssignment {
    const assignment: StudentAssignment = {
      ...data,
      id: `assign-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.assignments.unshift(assignment);
    this.saveToDisk();
    return assignment;
  }

  public createFollowUp(item: Omit<TeacherFollowUpItem, 'id' | 'createdAt' | 'status'>): TeacherFollowUpItem {
    const followUp: TeacherFollowUpItem = {
      ...item,
      id: `fu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    this.followUps.unshift(followUp);
    this.saveToDisk();
    return followUp;
  }

  public resolveFollowUp(followUpId: string): boolean {
    const fu = this.followUps.find(f => f.id === followUpId);
    if (!fu) return false;
    fu.status = 'resolved';
    fu.resolvedAt = new Date().toISOString();
    this.saveToDisk();
    return true;
  }

  // 9. Teacher Workspace Queries
  public getTeacherDashboard(): TeacherDashboardData {
    const students = Array.from(this.students.values()).filter(s => s.isActive);
    const todayStr = new Date().toISOString().slice(0, 10);
    const activeToday = Array.from(this.streaks.values()).filter(s => s.lastActiveDate === todayStr && s.todayCompleted).length;
    const pendingAssignmentsCount = this.assignments.filter(a => a.status === 'pending').length;

    const studentsSummary = students.map(student => {
      const plan = this.plans.get(student.id);
      const streak = this.streaks.get(student.id);
      const studentFollowUps = this.followUps.filter(f => f.studentId === student.id && f.status === 'open');

      const recentAttempts = [
        ...this.dailyPractices.filter(p => p.studentId === student.id && p.percentage !== undefined).map(p => p.percentage!),
        ...this.assignments.filter(a => a.studentId === student.id && a.percentage !== undefined).map(a => a.percentage!)
      ];
      const recentAverageScore = recentAttempts.length 
        ? Math.round(recentAttempts.reduce((a, b) => a + b, 0) / recentAttempts.length)
        : 70;

      const firstSubj = plan?.subjects[0];
      const needsAttention = studentFollowUps.length > 0 || recentAverageScore < 50;

      return {
        id: student.id,
        name: student.name,
        avatarSeed: student.avatarSeed,
        goal: student.currentGoal,
        currentSubject: firstSubj?.subject || 'Chemistry',
        currentTopic: firstSubj?.currentTopic || 'Foundation Basics',
        streakDays: streak?.currentStreakDays || 0,
        todayStatus: (streak?.todayCompleted ? 'completed' : 'pending') as 'completed' | 'pending' | 'inactive',
        recentAverageScore,
        needsAttention,
        attentionReason: studentFollowUps[0]?.issue
      };
    });

    return {
      totalStudents: students.length,
      activeToday,
      pendingAssignmentsCount,
      readingParticipationPercent: 80,
      attentionRequiredCount: studentsSummary.filter(s => s.needsAttention).length,
      followUps: this.followUps.filter(f => f.status === 'open'),
      studentsSummary
    };
  }

  public getStudentFullDetailForTeacher(studentId: string) {
    const student = this.students.get(studentId);
    if (!student) return null;

    return {
      student,
      profile: this.profiles.get(studentId),
      learningPlan: this.plans.get(studentId),
      streak: this.streaks.get(studentId),
      sessions: this.sessions.filter(s => s.studentId === studentId),
      assignments: this.assignments.filter(a => a.studentId === studentId),
      dailyPractices: this.dailyPractices.filter(p => p.studentId === studentId),
      readingTasks: this.readingTasks.filter(r => r.studentId === studentId),
      topicMastery: this.masteryRecords.filter(m => m.studentId === studentId),
      followUps: this.followUps.filter(f => f.studentId === studentId)
    };
  }

  public updateStudentLearningPlan(studentId: string, plan: Partial<StudentLearningPlan>): boolean {
    const existing = this.plans.get(studentId);
    if (!existing) return false;
    this.plans.set(studentId, {
      ...existing,
      ...plan,
      updatedAt: new Date().toISOString()
    });
    this.saveToDisk();
    return true;
  }

  public registerNewStudent(data: {
    name: string;
    phone?: string;
    currentGoal?: string;
    subjects?: Subject[];
    startingLevel?: 'Z' | 'F' | 'P' | 'C';
    targetPathway?: string;
  }): { student: TutorialStudent; token: string; accessCode: string; profile: StudentProfile; learningPlan: StudentLearningPlan } {
    const studentId = 'student-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    let pin = Math.floor(1000 + Math.random() * 9000).toString();
    while (Array.from(this.students.values()).some(s => s.accessCode === pin)) {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
    }

    const student: TutorialStudent = {
      id: studentId,
      name: data.name.trim(),
      accessCode: pin,
      phone: data.phone?.trim() || '',
      avatarSeed: data.name.split(' ')[0] || 'Learner',
      createdAt: new Date().toISOString(),
      isActive: true,
      currentGoal: data.currentGoal || data.targetPathway || 'Science Foundation Transition'
    };
    this.students.set(studentId, student);

    const chosenSubjects: Subject[] = (data.subjects && data.subjects.length > 0) 
      ? data.subjects 
      : ['Chemistry', 'Biology', 'Mathematics'];

    const profile: StudentProfile = {
      studentId,
      subjects: chosenSubjects,
      overallLevel: data.startingLevel || 'F',
      strengths: ['Curiosity', 'Willingness to Rebuild'],
      needsImprovement: chosenSubjects.map(s => `Foundational ${s} Concepts`),
      targetPathway: data.targetPathway || data.currentGoal || 'Health & Science Pathway',
      dailyQuestionTarget: 5,
      dailyReadingTargetMinutes: 15,
      teacherNotes: `New learner enrolled. Target pathway: ${data.targetPathway || data.currentGoal || 'Science Transition'}. Starting level: ${data.startingLevel || 'F'}.`,
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(studentId, profile);

    const subjectPlans: StudentSubjectPlan[] = chosenSubjects.map(sub => {
      const topic = sub === 'Chemistry' ? 'Atomic Structure' : sub === 'Mathematics' ? 'Linear Equations' : sub === 'Biology' ? 'Cell Biology' : 'Kinematics & Motion';
      return {
        subject: sub,
        currentTopic: topic,
        targetTopics: [topic, 'Fundamental Principles', 'Everyday Applications'],
        weakTopics: [topic],
        completedTopics: [],
        preferredDifficulty: 1
      };
    });

    const plan: StudentLearningPlan = {
      studentId,
      subjects: subjectPlans,
      nextRecommendedAction: `Start your first Daily Fix clinic in ${chosenSubjects[0]}.`,
      learningGoals: [
        'Rebuild foundational science intuitions from first principles',
        'Establish a daily 15-minute diagnostic and reading habit',
        `Prepare thoroughly for ${data.targetPathway || 'science progression'}`
      ],
      updatedAt: new Date().toISOString()
    };
    this.plans.set(studentId, plan);

    const streak: StudentStreak = {
      studentId,
      currentStreakDays: 1,
      longestStreakDays: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      todayCompleted: false
    };
    this.streaks.set(studentId, streak);

    // Initial daily practice
    const firstSubject = chosenSubjects[0];
    const initialQuestions = findQuestionsForTopic(firstSubject, 'Foundation', 5).map(toAssignmentQuestion);
    this.dailyPractices.push({
      id: `daily-${studentId}-${Date.now().toString(36)}`,
      studentId,
      date: new Date().toISOString().slice(0, 10),
      subject: firstSubject,
      focusTopic: subjectPlans[0].currentTopic,
      reason: 'current_focus',
      questions: initialQuestions,
      status: 'pending'
    });

    // Initial reading task
    this.readingTasks.push({
      id: `read-${studentId}-welcome`,
      studentId,
      subject: firstSubject,
      topic: 'Learning Science as an Adult',
      title: 'How Scientific Models Work: From Intuition to Evidence',
      content: `Welcome to Science Transition Academy. When returning to science after months or years, the most critical shift is moving away from memorising formulas without meaning.\n\nScience is not a collection of disconnected facts to be memorized for a single test. It is an interlocking web of mental models that explain why things happen.\n\n• In Physics, we observe motion and ask: what forces are acting, and why?\n• In Chemistry, we observe substances and ask: how are the electrons and atoms arranged?\n• In Biology, we observe life and ask: how do cells and systems maintain energy and balance?\n\nTake your time with each question. If you make a mistake, read the full explanation to repair the mental model.`,
      targetDurationMinutes: 10,
      recallQuestion: {
        questionText: 'What is the most effective way to rebuild science knowledge according to the Academy model?',
        options: [
          { id: 'a', text: 'Cramming exam past questions without explanations', isCorrect: false },
          { id: 'b', text: 'Rebuilding core mental models and understanding the reasoning underneath', isCorrect: true },
          { id: 'c', text: 'Memorizing formulas without checking relationships', isCorrect: false },
          { id: 'd', text: 'Skipping mathematics when studying chemistry and physics', isCorrect: false }
        ],
        explanation: 'True mastery requires repairing the foundational concepts and relationships underneath the formulas.'
      },
      status: 'pending'
    });

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, {
      studentId,
      expiresAt: Date.now() + 30 * 86400000
    });

    this.saveToDisk();

    return { student, token, accessCode: pin, profile, learningPlan: plan };
  }

  public getReadingTasksForStudent(studentId: string): ReadingTask[] {
    return this.readingTasks.filter(r => r.studentId === studentId);
  }

  public getAllAssignmentsForStudent(studentId: string): StudentAssignment[] {
    return this.assignments.filter(a => a.studentId === studentId);
  }

  public getTopicMasteryForStudent(studentId: string): TopicMasteryRecord[] {
    return this.masteryRecords.filter(m => m.studentId === studentId);
  }

  public getReadingTaskById(taskId: string): ReadingTask | undefined {
    return this.readingTasks.find(r => r.id === taskId);
  }

  public getAssignmentById(assignmentId: string): StudentAssignment | undefined {
    return this.assignments.find(a => a.id === assignmentId);
  }

  public getProfile(studentId: string): StudentProfile | undefined {
    return this.profiles.get(studentId);
  }

  public getLearningPlan(studentId: string): StudentLearningPlan | undefined {
    return this.plans.get(studentId);
  }

  public getStreak(studentId: string): StudentStreak | undefined {
    return this.streaks.get(studentId);
  }
}

// Singleton export
export const portalStore = new TutorialPortalStore();
