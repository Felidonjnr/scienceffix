import { Question, Subject, ProfileLevel, Answer, StudentData } from '../types';
import { QUESTIONS } from '../data/questions';

const ESCALATION_THRESHOLD = 4; // points out of 6 max needed to escalate

export function getQuestionsForSubjectAndLevel(subject: Subject, level: ProfileLevel, student?: StudentData): Question[] {
  let matched = QUESTIONS.filter(q => q.subject === subject && q.profileLevel === level);

  if (student) {
    if (student.biggestChallenge === 'Calculations') {
      matched.sort((a, b) => {
        const aMath = a.isMathHeavy ? 1 : 0;
        const bMath = b.isMathHeavy ? 1 : 0;
        return bMath - aMath; // Prioritize math heavy questions to diagnose properly
      });
    }

    if (student.readingPace === 'Fast skimmer' || student.readingPace === 'Struggles with focus') {
      matched.sort((a, b) => {
        const aShort = a.textLength === 'short' ? 1 : 0;
        const bShort = b.textLength === 'short' ? 1 : 0;
        return bShort - aShort; // Prioritize shorter questions
      });
    }
  }

  // We should ideally return exactly what we need, but for now we return all matched.
  // In a 500+ question bank, we'd add `.slice(0, 4)` here.
  return matched;
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
  
  return {
    points,
    maxPoints,
    passed: points >= ESCALATION_THRESHOLD
  };
}

export function computeReport(answers: Answer[]) {
  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const subjectScores: Record<Subject, { rawScore: number, k3k4Avg: number, level: string, status: string }> = {} as any;
  
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
  
  // Profile Assignment
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
    // Default fallback based on weighted average
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
    avgK3K4
  };
}
