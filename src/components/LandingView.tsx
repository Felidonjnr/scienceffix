import { ArrowRight, Brain, Target, ShieldCheck, Sparkles, ChevronRight, BookOpen, Clock, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <nav className="flex justify-between items-center mb-16 md:mb-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">The Science Foundation Lab</span>
          </div>
        </nav>
        
        <main className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              <span className="flex w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Elite AI Diagnostic Engine
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Stop Studying Blind. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Fix Your Knowledge Gaps.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
              Don't leave your scores to chance. In 15 minutes, our clinical AI pinpoints your exact academic bottlenecks, analyzes your cognitive habits, and writes a ruthless 4-month prescription to crush your target exam.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onStart}
                className="inline-flex justify-center items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                Take the Free Diagnostic
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
                <Clock className="w-5 h-5 text-blue-600" />
                Takes only 15 minutes
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200/60">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-[${100 * i}] flex items-center justify-center overflow-hidden shadow-sm`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="student" className="w-full h-full bg-slate-100" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-600">
                Join <strong className="text-slate-900">2,500+</strong> students actively rebuilding their study systems.
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative lg:ml-auto w-full max-w-lg"
          >
            {/* Abstract Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 scale-[1.02] -z-10 opacity-10 blur-lg"></div>
            <div className="absolute inset-0 bg-slate-900 rounded-3xl transform rotate-3 scale-100 -z-10 shadow-2xl"></div>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col relative z-0">
              
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex flex-col gap-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Report Preview</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Clinical Blueprint</h3>
                <p className="text-slate-500 text-sm font-medium">What happens after you take the test?</p>
              </div>
              
              <div className="p-8 bg-white space-y-6">
                {[
                  { icon: Brain, title: "Deep Cognitive Profiling", desc: "We track your confidence and speed to find hidden blindspots." },
                  { icon: Activity, title: "Granular Weakness Mapping", desc: "Visualize exactly where you are losing marks." },
                  { icon: ShieldCheck, title: "4-Month Prescription", desc: "A phased, day-by-day plan mapping out your recovery." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                      <item.icon className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors" onClick={onStart}>
                <span className="font-bold">Start Your Diagnostic</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
