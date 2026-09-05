import { ArrowRight, TestTube, Brain, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-24">
      <nav className="flex justify-between items-center mb-24">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">The Science Foundation Lab</span>
        </div>
      </nav>
      
      <main className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E2E8F0] text-[#64748B] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
            <Activity className="w-4 h-4 text-[#2563EB]" />
            Exclusive Diagnostic Audit
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Get Your Custom <span className="text-[#2563EB]">Academic Blueprint</span>
          </h1>
          <p className="text-lg text-[#64748B] leading-relaxed max-w-lg mt-1">
            In 15 minutes, our AI will diagnose your exact knowledge gaps, analyze your lifestyle, and generate a step-by-step 7-day roadmap to hit your target score.
          </p>
          <button 
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Generate My Blueprint
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#2563EB]/5 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Adaptive Engine</h3>
                <p className="text-[#64748B] text-[11px]">Context-embedded assessment</p>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {[
                  "No formal science vocabulary required for beginners",
                  "Adapts in real-time to your answers",
                  "Tests understanding, not memorization",
                  "Instant personalized report and roadmap"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-[#64748B] text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
