import { computeReport } from './src/utils/engine';
import { QUESTIONS } from './src/data/questions';

function runSimulations() {
  let discrepancies = 0;
  for (let i = 0; i < 100; i++) {
    const answers: any[] = [];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    
    // Simulate 5 answers per subject
    subjects.forEach(subject => {
      const subjectQs = QUESTIONS.filter(q => q.subject === subject).slice(0, 5);
      subjectQs.forEach(q => {
        const option = q.options[Math.floor(Math.random() * q.options.length)];
        answers.push({
          questionId: q.id,
          optionId: option.id,
          points: option.points,
          timeSpent: Math.floor(Math.random() * 100),
          confidence: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
        });
      });
    });

    const report1 = computeReport(answers);
    const report2 = computeReport(answers);
    
    if (JSON.stringify(report1) !== JSON.stringify(report2)) {
      discrepancies++;
    }
  }
  console.log(`Ran 100 simulations. Discrepancies on repeated data: ${discrepancies}`);
}

runSimulations();
