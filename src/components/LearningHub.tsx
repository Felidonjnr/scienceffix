import { ArrowRight, BookOpen, Brain, Calculator, FlaskConical, PlayCircle, FileText, Clock3, Lock, CheckCircle2 } from 'lucide-react';

type LearningHubProps = { onNavigate: (section: any) => void };

const subjects = [
  { name: 'Mathematics', icon: Calculator, text: 'Numbers, algebra, ratios, graphs and the mathematical thinking science depends on.' },
  { name: 'Physics', icon: Brain, text: 'Build intuition for motion, forces, energy, electricity and measurement.' },
  { name: 'Chemistry', icon: FlaskConical, text: 'Understand matter, particles, reactions, quantities and chemical patterns.' },
  { name: 'Biology', icon: BookOpen, text: 'Build a connected picture of living systems, cells, organisms and processes.' },
];

const resourceTypes = [
  { title: 'Foundation Lessons', text: 'Short, structured lessons designed to rebuild concepts you may have missed.', icon: PlayCircle },
  { title: 'Guided Practice', text: 'Practice that moves from understanding to application instead of jumping straight to exam questions.', icon: CheckCircle2 },
  { title: 'Worksheets', text: 'Printable practice for writing, calculations, diagrams, explanations and recall.', icon: FileText },
  { title: 'Quick Reviews', text: 'Compact refreshers for learners returning to a topic after a gap.', icon: Clock3 },
];

export default function LearningHub({ onNavigate }: LearningHubProps) {
  return (
    <div className="mt-14 space-y-14">
      <section className="rounded-[2rem] bg-slate-950 text-white p-8 md:p-12">
        <div className="max-w-3xl">
          <p className="text-xs font-black tracking-[0.2em] text-blue-300">YOUR LEARNING LIBRARY</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">Learn the foundation before you rush the exam.</h2>
          <p className="mt-5 text-slate-300 leading-relaxed text-lg">
            The Learning Hub will become the Academy's working library: lessons, explanations, practice and revision resources organised around the four-stage restart journey.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {['Understand', 'Practise', 'Apply', 'Review'].map((step, i) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-xs font-black text-blue-300">0{i + 1}</span>
              <p className="mt-2 font-black">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-5 mb-7">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-blue-700">CORE SCIENCE</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Build across four subjects.</h2>
          </div>
          <button onClick={() => onNavigate('assessment')} className="hidden sm:block font-black text-blue-700">Check your starting point <ArrowRight className="inline w-4 h-4" /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {subjects.map(({ name, icon: Icon, text }) => (
            <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-200 hover:shadow-lg transition">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
              <h3 className="mt-5 text-xl font-black">{name}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{text}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400"><Lock className="w-3.5 h-3.5" /> Academy library — building</div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {resourceTypes.map(({ title, text, icon: Icon }) => (
          <article key={title} className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
            <Icon className="w-6 h-6 text-blue-700" />
            <h3 className="mt-5 text-lg font-black">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
        <p className="text-xs font-black tracking-[0.2em] text-blue-700">START SMART</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-black">Don't start by guessing what you should study.</h2>
        <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">Use the Science Readiness Assessment to identify your current starting point. Your results can guide what you rebuild first as the learning library grows.</p>
        <button onClick={() => onNavigate('assessment')} className="mt-6 px-5 py-3 rounded-xl bg-slate-950 text-white font-black">Check readiness <ArrowRight className="inline w-4 h-4 ml-1" /></button>
      </section>
    </div>
  );
}
