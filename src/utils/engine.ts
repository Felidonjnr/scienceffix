import { Question, Subject, ProfileLevel, Answer, StudentData } from '../types';
import { QUESTIONS } from '../data/questions';

const ESCALATION_THRESHOLD = 0.6; // 60% of available points

export function getQuestionsForSubjectAndLevel(subject: Subject, level: ProfileLevel, student?: StudentData): Question[] {
  let matched = QUESTIONS.filter(q => q.subject === subject && q.profileLevel === level);

  // The production bank contains 25 questions per subject/level. A live diagnostic
  // samples exactly 4 from that pool so the learner is assessed without taking the
  // full 400-question bank.
  const seedText = student
    ? `${student.name}|${student.phone}|${student.courseGoal}|${student.targetExam}|${subject}|${level}`
    : `${subject}|${level}`;

  const hash = (value: string) => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  const seeded = [...matched].sort((a, b) => hash(seedText + a.id) - hash(seedText + b.id));

  if (student?.biggestChallenge === 'Calculations') {
    seeded.sort((a, b) => Number(Boolean(b.isMathHeavy)) - Number(Boolean(a.isMathHeavy)));
  }

  if (student?.readingPace === 'Fast skimmer' || student?.readingPace === 'Struggles with focus') {
    seeded.sort((a, b) => Number(b.textLength === 'short') - Number(a.textLength === 'short'));
  }

  return seeded.slice(0, 4);
}

export function evaluateSubjectLevel(answers: Answer[], questionsInLevel: Question[]): { points: number, maxPoints: number, passed: boolean } {
  let points = 0;
  let maxPoints = 0;
  for (const q of questionsInLevel) {
    const ans = answers.find(a => a.questionId === q.id);
    const maxQPoints = Math.max(...q.options.map(o => o.points));
    maxPoints += maxQPoints;
    if (ans) {
      points += ans.points;
    }
  }
  return { points, maxPoints, passed: maxPoints > 0 && (points / maxPoints) >= ESCALATION_THRESHOLD };
}

export function computeReport(answers: Answer[]) {
  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const subjectScores: Record<Subject, { rawScore: number, k3k4Avg: number, level: string, status: string }> = {} as any;
  
  const cognitivePathology: Record<string, { totalPoints: number, earnedPoints: number, score: number }> = {};
  const behavioralMetrics = {
    fastGuesses: 0,
    arrogantErrors: 0,
    slowInefficiencies: 0,
    averageTime: 0,
    totalTime: 0
  };

  let validTimeAnswers = 0;

  for (const subject of subjects) {
    const subjectQuestions = QUESTIONS.filter(q => q.subject === subject);
    const answeredIds = answers.map(a => a.questionId);
    const subjectAnswered = subjectQuestions.filter(q => answeredIds.includes(q.id));
    
    let points = 0;
    let maxPoints = 0;
    let k3k4Points = 0;
    let k3k4MaxPoints = 0;
    
    for (const q of subjectAnswered) {
      const ans = answers.find(a => a.questionId === q.id)!;
      const qMax = Math.max(...q.options.map(o => o.points));
      
      points += ans.points;
      maxPoints += qMax;
      
      if (q.knowledgeType === 'K3' || q.knowledgeType === 'K4') {
        k3k4Points += ans.points;
        k3k4MaxPoints += qMax;
      }

      if (q.cognitiveSkills) {
        q.cognitiveSkills.forEach(skill => {
          if (!cognitivePathology[skill]) {
            cognitivePathology[skill] = { totalPoints: 0, earnedPoints: 0, score: 0 };
          }
          cognitivePathology[skill].totalPoints += qMax;
          cognitivePathology[skill].earnedPoints += ans.points;
        });
      }

      const isCorrect = ans.points === qMax;
      if (ans.timeSpent !== undefined) {
        behavioralMetrics.totalTime += ans.timeSpent;
        validTimeAnswers++;
        
        if (!isCorrect && ans.timeSpent < 15) behavioralMetrics.fastGuesses++;
        if (isCorrect && ans.timeSpent > 90) behavioralMetrics.slowInefficiencies++;
      }
      
      if (!isCorrect && ans.confidence === 'High') {
        behavioralMetrics.arrogantErrors++;
      }
    }
    
    const rawScore = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
    const k3k4Avg = k3k4MaxPoints > 0 ? (k3k4Points / k3k4MaxPoints) * 100 : 0;
    
    let level = 'Critical';
    let status = '🔴 Building Zone';
    if (rawScore > 75) {
      level = 'Strong';
      status = '🟢 Excellence Zone';
    } else if (rawScore > 50) {
      level = 'Developing';
      status = '🟡 Growth Zone';
    } else if (rawScore > 25) {
      level = 'Weak';
      status = '🟡 Growth Zone';
    }
    
    subjectScores[subject] = { rawScore, k3k4Avg, level, status };
  }
  
  if (validTimeAnswers > 0) {
    behavioralMetrics.averageTime = behavioralMetrics.totalTime / validTimeAnswers;
  }

  for (const skill in cognitivePathology) {
    const data = cognitivePathology[skill];
    data.score = data.totalPoints > 0 ? (data.earnedPoints / data.totalPoints) * 100 : 0;
  }

  let overallProfile = 'F';
  let overallProfileName = 'THE FRAGMENTED (Weak/Confused Foundation)';
  
  const allSub30 = Object.values(subjectScores).every(s => s.rawScore < 30);
  const count30_60 = Object.values(subjectScores).filter(s => s.rawScore >= 30 && s.rawScore <= 60).length;
  const count60_80 = Object.values(subjectScores).filter(s => s.rawScore >= 60 && s.rawScore <= 80).length;
  const countAbove75 = Object.values(subjectScores).filter(s => s.rawScore > 75).length;
  
  const avgK3K4 = Object.values(subjectScores).reduce((acc, s) => acc + s.k3k4Avg, 0) / 4;
  const avgOverall = (
    subjectScores['Mathematics'].rawScore * 0.30 +
    subjectScores['Physics'].rawScore * 0.25 +
    subjectScores['Chemistry'].rawScore * 0.25 +
    subjectScores['Biology'].rawScore * 0.20
  );

  if (allSub30 || avgOverall < 25) {
    overallProfile = 'Z';
    overallProfileName = 'THE ZERO (Zero Science Foundation)';
  } else if (count30_60 >= 2 && avgK3K4 < 40) {
    overallProfile = 'F';
    overallProfileName = 'THE FRAGMENTED (Weak/Confused Foundation)';
  } else if (count60_80 >= 2 && avgK3K4 >= 40 && avgK3K4 < 70) {
    overallProfile = 'P';
    overallProfileName = 'THE PROCEDURAL (Can Calculate, Doesn\'t Understand)';
  } else if (countAbove75 === 4 && avgK3K4 >= 70) {
    overallProfile = 'C';
    overallProfileName = 'THE CONCEPTUAL (Understands, Needs Polish)';
  } else {
    if (avgOverall < 35) {
        overallProfile = 'Z';
        overallProfileName = 'THE ZERO (Zero Science Foundation)';
    } else if (avgOverall < 60) {
        overallProfile = 'F';
        overallProfileName = 'THE FRAGMENTED (Weak/Confused Foundation)';
    } else if (avgOverall < 80) {
        overallProfile = 'P';
        overallProfileName = 'THE PROCEDURAL (Can Calculate, Doesn\'t Understand)';
    } else {
        overallProfile = 'C';
        overallProfileName = 'THE CONCEPTUAL (Understands, Needs Polish)';
    }
  }

  return {
    subjectScores,
    overallProfile,
    overallProfileName,
    avgOverall,
    avgK3K4,
    cognitivePathology,
    behavioralMetrics
  };
}


/**
 * Validates that an assessment payload represents a completed adaptive diagnostic.
 * The live diagnostic always completes at least one 4-question level per subject,
 * and every submitted answer must match the question bank exactly.
 */
export function isCompleteAssessment(answers: unknown): answers is Answer[] {
  if (!Array.isArray(answers) || answers.length < 16 || answers.length > QUESTIONS.length) return false;

  const seen = new Set<string>();
  const subjectCounts: Record<Subject, number> = {
    Mathematics: 0,
    Physics: 0,
    Chemistry: 0,
    Biology: 0
  };

  for (const rawAnswer of answers) {
    if (!rawAnswer || typeof rawAnswer !== 'object') return false;
    const answer = rawAnswer as Answer;
    if (typeof answer.questionId !== 'string' || seen.has(answer.questionId)) return false;

    const question = QUESTIONS.find(q => q.id === answer.questionId);
    if (!question) return false;

    const option = question.options.find(o => o.id === answer.optionId);
    if (!option || answer.points !== option.points) return false;
    if (typeof answer.timeSpent !== 'number' || answer.timeSpent < 0) return false;
    if (answer.confidence !== 'Low' && answer.confidence !== 'Medium' && answer.confidence !== 'High') return false;

    seen.add(answer.questionId);
    subjectCounts[question.subject] += 1;
  }

  // A completed subject contains 4, 8, 12, or 16 questions depending on
  // how far the learner progresses through the adaptive levels.
  return Object.values(subjectCounts).every(count => count >= 4 && count % 4 === 0);
}
