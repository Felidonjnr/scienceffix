const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { useState } from 'react';",
  "import { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';"
);

// Replace return statement
const oldReturn = `  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {step === 'landing' && <LandingView onStart={() => setStep('intake')} />}
      
      {step === 'intake' && (
        <IntakeForm 
          onSubmit={(data) => {
            setStudent(data);
            setStep('diagnostic');
          }} 
          onDevSkip={handleDevSkip}
        />
      )}

      {step === 'diagnostic' && student && (
        <DiagnosticView 
          student={student}
          onComplete={(finalAnswers) => {
            setAnswers(finalAnswers);
            setStep('report');
          }} 
        />
      )}

      {step === 'report' && student && (
        <ReportView 
          student={student}
          answers={answers}
          onRestart={() => {
            setAnswers([]);
            setStudent(null);
            setStep('landing');
          }}
        />
      )}
    </div>
  );`;

const newReturn = `  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen"
        >
          {step === 'landing' && <LandingView onStart={() => setStep('intake')} />}
          
          {step === 'intake' && (
            <IntakeForm 
              onSubmit={(data) => {
                setStudent(data);
                setStep('diagnostic');
              }} 
              onDevSkip={handleDevSkip}
            />
          )}

          {step === 'diagnostic' && student && (
            <DiagnosticView 
              student={student}
              onComplete={(finalAnswers) => {
                setAnswers(finalAnswers);
                setStep('report');
              }} 
            />
          )}

          {step === 'report' && student && (
            <ReportView 
              student={student}
              answers={answers}
              onRestart={() => {
                setAnswers([]);
                setStudent(null);
                setStep('landing');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );`;

code = code.replace(oldReturn, newReturn);
fs.writeFileSync('src/App.tsx', code);
console.log(code.includes('AnimatePresence'));
