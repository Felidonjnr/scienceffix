import { ArrowRight, BookOpen, Brain, BriefcaseBusiness, CheckCircle2, ChevronRight, GraduationCap, HeartPulse, Library, Menu, Sparkles, Target, Users, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import FoundingCohortForm from './FoundingCohortForm';

type Section = 'home' | 'academy' | 'programmes' | 'assessment' | 'learning' | 'pathways' | 'cohort' | 'portal';

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
  { id: 'programmes', label: 'Programmes' },
  { id: 'assessment', label: 'Readiness Assessment' },
  { id: 'learning', label: 'Learning Hub' },
  { id: 'pathways', label: 'Pathways' },
  { id: 'cohort', label: 'Founding Cohort' },
  { id: 'portal', label: 'Student Portal' },
];

const programmes = [
  { title: 'Science Foundation', text: 'Rebuild the concepts, vocabulary and study habits you need to begin learning science with confidence.', icon: BookOpen },
  { title: 'Core Science', text: 'Develop connected understanding across Mathematics, Physics, Chemistry and Biology.', icon: Brain },
  { title: 'Science Application', text: 'Move from knowing facts to explaining, solving, interpreting and applying scientific ideas.', icon: Target },
  { title: 'Pathway Readiness', text: 'Connect your science foundation to the academic destination you are working toward.', icon: GraduationCap },
];

export default function AcademyHome({ section, onNavigate, onStartAssessment, onViewBlueprint, hasBlueprint, studentName }: AcademyHomeProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (next: Section) => {
    setMobileOpen(false);
    onNavigate(next);
  };

  const sectionCopy: Record<Exclude<Section, 'home'>, { eyebrow: string; title: string; text: string }> = {
    academy: { eyebrow: 'THE ACADEMY', title: "You don't have to pretend you already know the science. Start from where you are.", text: 'Science Restart Academy helps learners rebuild the foundation they need to enter, understand and progress through science-related education.' },
    programmes: { eyebrow: 'PROGRAMMES', title: 'A staged route from rebuilding to readiness.', text: 'The Academy is designed around progression: strengthen the foundation, build core science understanding, apply it, then prepare for the destination ahead.' },
    assessment: { eyebrow: 'SCIENCE READINESS ASSESSMENT', title: 'Know your starting point before you build.', text: 'The readiness assessment is one section of the Academy. It identifies where your current science foundation is strongest, where it needs rebuilding, and what to work on first.' },
    learning: { eyebrow: 'LEARNING HUB', title: 'Resources built for real learning.', text: 'Lessons, explanations, worksheets, practice and revision resources will live here as the Academy learning library grows.' },
    pathways: { eyebrow: 'PATHWAYS', title: 'Start with the destination in mind.', text: 'Explore science-related academic pathways and understand the knowledge, subjects and preparation they require.' },
    cohort: { eyebrow: 'FOUNDING COHORT', title: 'The first Academy cohort is coming.', text: 'A focused founding cohort is planned for January 2027. Applications, schedule, programme details and fees will be published here.' },
    portal: { eyebrow: 'STUDENT PORTAL', title: 'Your learning journey, in one place.', text: 'The student portal will eventually bring courses, assignments, assessments, progress and support together in one learner dashboard.' },
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
            <div className="grid md:grid-cols-3 gap-5 mt-14">
              {[
                ['Learn the missing pieces', 'We start from what you actually know instead of assuming the foundation is already there.'],
                ['Learn how science works', 'Understanding, reasoning and practice matter—not memorising disconnected facts.'],
                ['Keep moving despite life', 'The model is being designed for adults balancing work, family and other responsibilities.'],
              ].map(([title, text]) => <InfoCard key={title} title={title} text={text} />)}
            </div>
          )}

          {section === 'programmes' && (
            <div className="grid md:grid-cols-2 gap-5 mt-14">
              {programmes.map((item) => <ProgrammeCard key={item.title} {...item} />)}
            </div>
          )}

          {section === 'assessment' && (
            <div className="mt-14 max-w-3xl rounded-3xl bg-slate-950 text-white p-8 md:p-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-6"><Brain className="w-6 h-6 text-blue-300" /></div>
              <h2 className="text-2xl md:text-3xl font-black mb-3">Science Readiness Assessment</h2>
              <p className="text-slate-300 leading-relaxed mb-7">Take the assessment to establish your current starting point and receive a Science Readiness Blueprint.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onStartAssessment} className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold">Start assessment <ArrowRight className="inline w-4 h-4 ml-1" /></button>
                {hasBlueprint && <button onClick={() => onViewBlueprint()} className="px-6 py-3 rounded-xl border border-white/20 font-bold">View existing blueprint</button>}
              </div>
            </div>
          )}

          {section === 'learning' && <ComingSoon icon={Library} label="Learning resources are being built into the Academy." />}
          {section === 'pathways' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {['Nursing', 'Medical Laboratory Science', 'Public Health', 'Other Science Pathways'].map((name) => <PathwayCard key={name} name={name} />)}
            </div>
          )}
          {section === 'cohort' && <FoundingCohortForm onAssessment={onStartAssessment} />}
          {section === 'portal' && <ComingSoon icon={BriefcaseBusiness} label="The learner portal is planned for the next stage of the Academy." />}
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
          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28 grid lg:grid-cols-[1.2fr_.8fr] gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-7">
                <Sparkles className="w-3.5 h-3.5" /> Science Restart Academy
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[.98] max-w-4xl">You want a science future. <span className="text-blue-300">But your foundation is holding you back.</span></h1>
              <p className="mt-7 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">Science Restart Academy helps adults and other learners rebuild the science foundation they need for the next step in their education or career.</p>
              <div className="flex flex-wrap gap-3 mt-9">
                <button onClick={() => go('cohort')} className="px-6 py-4 rounded-2xl bg-white text-slate-950 font-black hover:bg-blue-50 transition">Join the January 2027 founding cohort <ArrowRight className="inline w-5 h-5 ml-1" /></button>
                <button onClick={() => go('assessment')} className="px-6 py-4 rounded-2xl border border-white/20 font-bold hover:bg-white/10 transition">Check your science readiness</button>
              </div>
            </motion.div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[.06] backdrop-blur p-7 md:p-8">
              <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-6">The restart</p>
              {['Where I am now', 'Science Foundation', 'Core Science', 'Science Application', 'Where I want to go'].map((label, i) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === 0 || i === 4 ? 'bg-white' : 'bg-blue-400'}`} />
                    {i < 4 && <div className="w-px h-9 bg-white/15" />}
                  </div>
                  <span className={`pb-8 ${i === 0 || i === 4 ? 'font-black text-white' : 'text-slate-300'}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-24">
          <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-12 items-start">
            <div>
              <p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-4">DOES THIS SOUND LIKE YOU?</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">You know where you want to go. You just don't know how to catch up in science.</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'You studied Arts or Commercial subjects but now want a science-related career.',
                'You studied science years ago, but you have forgotten most of it.',
                "You can pass some questions, but you don't really understand the science behind them.",
                'You keep joining exam classes, but the foundation you need never gets fixed.'
              ].map((text) => <div key={text} className="rounded-2xl bg-slate-50 border border-slate-200 p-5"><CheckCircle2 className="w-5 h-5 text-blue-600 mb-4" /><p className="font-semibold text-slate-700 leading-relaxed">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div><p className="text-sm font-black tracking-[0.2em] text-blue-700 mb-4">THE LEARNING JOURNEY</p><h2 className="text-4xl md:text-5xl font-black tracking-tight">Four stages. A clear way forward.</h2></div>
              <button onClick={() => go('programmes')} className="font-bold text-blue-700">View programmes <ChevronRight className="inline w-4 h-4" /></button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">{programmes.map((item) => <ProgrammeCard key={item.title} {...item} />)}</div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-16 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div><p className="text-xs font-black tracking-[0.2em] text-blue-300 mb-2">JANUARY 2027</p><h2 className="text-2xl md:text-3xl font-black">We are building the first Science Restart Academy cohort.</h2><p className="text-slate-300 mt-2">Tell us where you are starting from. Your answers will shape the launch.</p></div>
            <button onClick={() => go('cohort')} className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-black">Join the pre-launch list <ArrowRight className="inline w-4 h-4 ml-1" /></button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-24">
          <div className="rounded-[2rem] bg-blue-700 text-white p-8 md:p-12 flex flex-col lg:flex-row justify-between gap-10 items-start lg:items-center">
            <div className="max-w-2xl"><p className="text-sm font-black tracking-[0.2em] text-blue-200 mb-4">START HERE</p><h2 className="text-3xl md:text-4xl font-black">Before you prepare for the next exam, find out what you actually need to learn.</h2><p className="mt-4 text-blue-100 leading-relaxed">The Readiness Assessment is one part of the Academy—not the Academy itself. Use it to establish your starting point.</p></div>
            <button onClick={() => go('assessment')} className="shrink-0 px-7 py-4 rounded-2xl bg-white text-slate-950 font-black">Take the assessment <ArrowRight className="inline w-5 h-5 ml-1" /></button>
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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-18 min-h-[72px] flex items-center justify-between gap-6">
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

function ProgrammeCard({ title, text, icon: Icon }: { title: string; text: string; icon: typeof BookOpen }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-200 hover:shadow-lg transition"><div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6"><Icon className="w-5 h-5" /></div><h3 className="text-xl font-black mb-2">{title}</h3><p className="text-slate-600 leading-relaxed">{text}</p></div>;
}

function PathwayCard({ name }: { name: string }) {
  return <button className="text-left rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition"><HeartPulse className="w-6 h-6 text-blue-700 mb-5" /><h3 className="font-black text-lg">{name}</h3><p className="text-sm text-slate-500 mt-2">Explore pathway requirements</p></button>;
}

function ComingSoon({ icon: Icon, label, action, actionLabel }: { icon: typeof Library; label: string; action?: () => void; actionLabel?: string }) {
  return <div className="mt-14 rounded-3xl border border-dashed border-slate-300 bg-white p-10 max-w-2xl"><Icon className="w-8 h-8 text-blue-700 mb-5" /><p className="text-lg font-bold text-slate-800">{label}</p>{action && <button onClick={action} className="mt-6 px-5 py-3 rounded-xl bg-slate-950 text-white font-bold">{actionLabel}</button>}</div>;
}

