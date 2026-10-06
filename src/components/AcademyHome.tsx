import { ArrowRight, Brain, CheckCircle2, HeartPulse, Menu, Sparkles, Target, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import FoundingCohortForm from './FoundingCohortForm';

type Section = 'home' | 'academy' | 'programmes' | 'assessment' | 'pathways' | 'cohort';

interface AcademyHomeProps {
  section: Section;
  onNavigate: (section: Section) => void;
  onStartAssessment: () => void;
  onViewBlueprint: () => void;
  hasBlueprint: boolean;
  studentName?: string;
}

const navItems: { id: Section; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'academy', label: 'The Academy' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'pathways', label: 'Pathways' },
  { id: 'cohort', label: 'Founding Cohort' },
];

const programmes = [
  { title: 'Science Foundation', text: 'Rebuild what you missed and strengthen the foundation you need to learn science well.' },
  { title: 'Core Science', text: 'Build connected understanding across Mathematics, Physics, Chemistry and Biology.' },
  { title: 'Science Application', text: 'Move from knowing facts to explaining, solving and applying scientific ideas.' },
  { title: 'Pathway Readiness', text: 'Connect your science capability to the academic destination you are working toward.' },
];

const experience = [
  ['Live teaching', 'Understand difficult concepts with guided instruction and interaction.'],
  ['Practicals & simulations', 'See science applied instead of only reading about it.'],
  ['Daily practice', 'Worksheets and guided practice turn lessons into progress.'],
  ['Class recordings', 'Revisit lessons when work, family or life gets in the way.'],
  ['Follow-up', 'We identify struggling areas before they become bigger problems.'],
  ['Progress checks', 'Regular assessments show what is improving and what needs attention.'],
];

export default function AcademyHome({ section, onNavigate, onStartAssessment, onViewBlueprint, hasBlueprint }: AcademyHomeProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (next: Section) => {
    setMobileOpen(false);
    onNavigate(next);
  };

  const sectionCopy: Record<Exclude<Section, 'home'>, { eyebrow: string; title: string; text: string }> = {
    academy: {
      eyebrow: 'THE ACADEMY',
      title: 'More than a class. A system built around your progress.',
      text: 'Science Restart Academy helps learners rebuild science through structured teaching, practice, practical learning, follow-up and clear progression.',
    },
    programmes: {
      eyebrow: 'THE ACADEMY MODEL',
      title: 'A clear route from rebuilding to readiness.',
      text: 'The four stages describe the Academy journey. They are not separate courses currently open for enrollment.',
    },
    assessment: {
      eyebrow: 'SCIENCE READINESS ASSESSMENT',
      title: 'Know where you stand before you spend another year guessing.',
      text: 'Find out where your current science foundation is strongest, where it needs rebuilding and what you should work on first.',
    },
    pathways: {
      eyebrow: 'PATHWAYS',
      title: 'Start with the destination in mind.',
      text: 'Explore science-related directions and understand how a stronger science foundation can support your next academic step.',
    },
    cohort: {
      eyebrow: 'FOUNDING COHORT',
      title: 'Build your science foundation with the first Academy cohort.',
      text: 'A focused founding cohort is planned for January 2027. Tell us about your goals and current situation so we can design the experience around real learners.',
    },
  };

  if (section !== 'home') {
    const copy = sectionCopy[section];
    return (
      <div className="min-h-screen bg-slate-50 text-slate-950">
        <Header section={section} onNavigate={go} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-5">{copy.eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-7">{copy.title}</h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">{copy.text}</p>
          </div>

          {section === 'academy' && (
            <div className="mt-14">
              <section className="rounded-[2rem] bg-slate-950 text-white p-8 md:p-12">
                <p className="text-sm font-black tracking-[0.18em] text-blue-300 mb-4">THE EXPERIENCE</p>
                <h2 className="text-3xl md:text-5xl font-black max-w-3xl">You are not just paying for lessons. You are paying for a system that keeps you moving.</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                  {experience.map(([title, text]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[.06] p-5">
                      <CheckCircle2 className="w-5 h-5 text-blue-300 mb-4" />
                      <h3 className="font-black text-lg">{title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mt-2">{text}</p>
                    </div>
                  ))}
                </div>
              </section>
              <div className="grid md:grid-cols-3 gap-5 mt-8">
                <InfoCard title="Start from where you are" text="We do not assume you remember everything. Your starting point matters." />
                <InfoCard title="Learn with structure" text="Know what you are learning, what to practise and what comes next." />
                <InfoCard title="Keep moving when life happens" text="Recordings, recovery and follow-up help you get back on track." />
              </div>
            </div>
          )}

          {section === 'programmes' && (
            <div className="grid md:grid-cols-2 gap-5 mt-14">
              {programmes.map((item, i) => <ProgrammeCard key={item.title} index={i + 1} {...item} />)}
            </div>
          )}

          {section === 'assessment' && (
            <div className="mt-14 max-w-4xl rounded-[2rem] bg-slate-950 text-white p-8 md:p-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-6"><Brain className="w-6 h-6 text-blue-300" /></div>
              <h2 className="text-2xl md:text-3xl font-black mb-3">Science Readiness Assessment</h2>
              <p className="text-slate-300 leading-relaxed mb-7 max-w-2xl">A structured diagnostic across Mathematics, Physics, Chemistry and Biology. It is a starting point—not an IQ test or entrance examination.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onStartAssessment} className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold">Start assessment <ArrowRight className="inline w-4 h-4 ml-1" /></button>
                {hasBlueprint && <button onClick={onViewBlueprint} className="px-6 py-3 rounded-xl border border-white/20 font-bold">View existing blueprint</button>}
              </div>
            </div>
          )}

          {section === 'pathways' && (
            <div className="mt-14 space-y-8">
              <div className="rounded-[2rem] bg-white border border-slate-200 p-7 md:p-9 max-w-4xl">
                <p className="text-sm font-black tracking-[0.16em] text-blue-700 mb-3">YOUR DESTINATION</p>
                <h2 className="text-2xl md:text-3xl font-black mb-3">You do not need to have everything figured out yet.</h2>
                <p className="text-slate-600 leading-relaxed">Your destination helps shape what you need to prepare for. Requirements vary by institution and programme, so always confirm official requirements with your chosen school.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Nursing', 'Medicine', 'Pharmacy', 'Medical Laboratory Science', 'Public Health', 'Engineering', 'Computer Science & Technology', 'Pure & Applied Sciences', 'Agriculture & Environmental Sciences'].map((name) => (
                  <div key={name} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <HeartPulse className="w-5 h-5 text-blue-700 mb-4" />
                    <h3 className="font-black">{name}</h3>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] bg-blue-700 text-white p-7 md:p-9 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                  <p className="text-sm font-black tracking-[0.16em] text-blue-200 mb-2">NOT SURE YET?</p>
                  <h2 className="text-2xl font-black">Start with your science foundation.</h2>
                  <p className="text-blue-100 mt-2 max-w-2xl">You can take the Readiness Assessment even if your final destination is still unclear.</p>
                </div>
                <button onClick={onStartAssessment} className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-black">Check readiness <ArrowRight className="inline w-4 h-4 ml-1" /></button>
              </div>
            </div>
          )}

          {section === 'cohort' && <FoundingCohortForm onAssessment={onStartAssessment} />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header section={section} onNavigate={go} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(37,99,235,.28),transparent_34%),radial-gradient(circle_at_15%_80%,rgba(14,165,233,.14),transparent_30%)]" />
          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-7">
                <Sparkles className="w-3.5 h-3.5" /> Science Restart Academy
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[.98]">You know where you want to go. <span className="text-blue-300">Science keeps getting in the way.</span></h1>
              <p className="mt-7 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">You may have the ambition, but weak foundations, repeated exam setbacks or forgotten science can keep the future you want out of reach. We help you rebuild the foundation and move forward.</p>
              <div className="flex flex-wrap gap-3 mt-9">
                <button onClick={() => go('assessment')} className="px-6 py-4 rounded-2xl bg-white text-slate-950 font-black hover:bg-blue-50 transition">Check your science readiness <ArrowRight className="inline w-5 h-5 ml-1" /></button>
                <button onClick={() => go('academy')} className="px-6 py-4 rounded-2xl border border-white/20 font-bold hover:bg-white/10 transition">See the Academy</button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-[.75fr_1.25fr] gap-10 items-start">
            <div>
              <p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-4">THE PAIN</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">You don't need another year of trying the same thing.</h2>
            </div>
            <div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Failed an important examination before?',
                  'Studied science years ago and forgotten most of it?',
                  'Keep joining tutorials but still do not understand the basics?',
                  'Know the career you want, but science keeps getting in the way?',
                ].map((text) => <div key={text} className="rounded-2xl bg-slate-50 border border-slate-200 p-5"><CheckCircle2 className="w-5 h-5 text-blue-600 mb-4" /><p className="font-semibold text-slate-700 leading-relaxed">{text}</p></div>)}
              </div>
              <p className="text-xl md:text-2xl font-black mt-7">The problem may not be effort. It may be the foundation you are building on.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-4">THE RESTART</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Maybe you don't need another tutorial. Maybe you need a restart.</h2>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed">We first find out what you actually understand. Then we rebuild the gaps, strengthen your science and help you apply what you learn to your next academic step.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
              {['Assess', 'Rebuild', 'Practise', 'Apply'].map((item, i) => <div key={item} className="rounded-2xl bg-white border border-slate-200 p-5"><span className="text-xs font-black text-blue-700">0{i + 1}</span><h3 className="text-xl font-black mt-2">{item}</h3></div>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-black tracking-[0.2em] text-blue-300 mb-4">THE EXPERIENCE</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">More than a class. A system built around your progress.</h2>
              <p className="mt-5 text-lg text-slate-300 leading-relaxed">Premium learning should feel organised, supported and intentional—not like another class you attend and forget.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {experience.map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[.05] p-5">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 mb-4" />
                  <h3 className="font-black text-lg">{title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mt-2">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10">
            <p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-3">BUILT FOR REAL LIFE</p>
            <h2 className="text-3xl md:text-4xl font-black">Work. Family. Responsibilities. Life happens.</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl leading-relaxed">Your learning system should account for that. Recordings, catch-up support and structured weekly targets help you keep moving.</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {['Recordings', 'Catch-up support', 'Weekly targets'].map((item) => <div key={item} className="rounded-xl bg-slate-50 p-4 font-black">{item}</div>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
              <div><p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-4">YOUR RESTART PATH</p><h2 className="text-4xl md:text-5xl font-black tracking-tight">A clear way forward.</h2></div>
              <button onClick={() => go('programmes')} className="font-bold text-blue-700">See the model <ArrowRight className="inline w-4 h-4 ml-1" /></button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {programmes.map((item, i) => <ProgrammeCard key={item.title} index={i + 1} {...item} />)}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-4">YOUR DESTINATION</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Where are you trying to go?</h2>
            <p className="mt-4 text-lg text-slate-600">Nursing, Medicine, Pharmacy, Medical Laboratory Science, Public Health, Engineering, Technology, Pure & Applied Sciences—and other science-related pathways.</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-7">
            {['Nursing', 'Medicine', 'Pharmacy', 'Medical Laboratory Science', 'Public Health', 'Engineering', 'Computer Science & Technology', 'Pure & Applied Sciences'].map((name) => <span key={name} className="px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm font-bold">{name}</span>)}
          </div>
          <button onClick={() => go('pathways')} className="mt-6 font-bold text-blue-700">Explore pathways <ArrowRight className="inline w-4 h-4 ml-1" /></button>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 md:pb-20">
          <div className="rounded-[2rem] bg-blue-700 text-white p-8 md:p-12 flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-black tracking-[0.2em] text-blue-200 mb-4">START HERE</p>
              <h2 className="text-3xl md:text-4xl font-black">Before you spend another year guessing, find out where you stand.</h2>
              <p className="mt-4 text-blue-100 leading-relaxed">The Science Readiness Assessment gives you a clearer picture of your current foundation and what to work on first.</p>
            </div>
            <button onClick={() => go('assessment')} className="shrink-0 px-7 py-4 rounded-2xl bg-white text-slate-950 font-black">Check your readiness <ArrowRight className="inline w-5 h-5 ml-1" /></button>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-100"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500"><span className="font-black text-slate-900">Science Restart Academy</span><span>Rebuild your science. Restart your future.</span></div></footer>
    </div>
  );
}

function Header({ section, onNavigate, mobileOpen, setMobileOpen }: { section: Section; onNavigate: (section: Section) => void; mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 min-h-[72px] flex items-center justify-between gap-6">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 shrink-0 text-left">
          <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center"><Sparkles className="w-5 h-5 text-blue-300" /></div>
          <span className="font-black tracking-tight hidden sm:block">Science Restart Academy</span>
        </button>
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={`px-3 py-2 rounded-lg text-sm font-bold transition ${section === item.id ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>{item.label}</button>)}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('assessment')} className="hidden md:block px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-black">Check readiness</button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      {mobileOpen && <div className="xl:hidden border-t border-slate-100 bg-white px-5 py-4 grid gap-1">{navItems.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className="text-left px-4 py-3 rounded-xl font-bold hover:bg-slate-100">{item.label}</button>)}</div>}
    </header>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6"><CheckCircle2 className="w-5 h-5 text-blue-600 mb-5" /><h3 className="text-xl font-black mb-2">{title}</h3><p className="text-slate-600 leading-relaxed">{text}</p></div>;
}

function ProgrammeCard({ title, text, index }: { title: string; text: string; index: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-200 hover:shadow-lg transition"><span className="text-xs font-black tracking-widest text-blue-700">0{index}</span><h3 className="text-xl font-black mt-3 mb-2">{title}</h3><p className="text-slate-600 leading-relaxed">{text}</p></div>;
}
