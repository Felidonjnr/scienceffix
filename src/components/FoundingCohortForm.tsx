import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const initial = {
  name: '',
  phone: '',
  ageRange: '',
  previousBackground: '',
  desiredPathway: '',
  scienceStatus: '',
  biggestChallenge: '',
  lastStudiedScience: '',
  employmentStatus: '',
  preferredSchedule: '',
  targetYear: '2027',
  wantsFoundingCohort: true,
  willingnessToPay: '',
};

export default function FoundingCohortForm({ onAssessment }: { onAssessment: () => void }) {
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (key: keyof typeof initial, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const response = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'founding-cohort-page' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save your interest.');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-14 max-w-3xl rounded-[2rem] bg-slate-950 text-white p-8 md:p-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-7 h-7 text-blue-300" />
        </div>
        <p className="text-sm font-black tracking-[0.2em] text-blue-300 mb-3">INTEREST RECORDED</p>
        <h2 className="text-3xl md:text-4xl font-black mb-4">Thank you. We’ll keep you close to the launch.</h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Your answers help us understand who the Academy should serve, what learners need, and how the January 2027 founding cohort should be designed. Joining this list is an expression of interest, not a confirmed place or admission offer.
        </p>
        <button onClick={onAssessment} className="px-6 py-3 rounded-xl bg-white text-slate-950 font-black">
          Check your science readiness <ArrowRight className="inline w-4 h-4 ml-1" />
        </button>
      </div>
    );
  }

  const field = (label: string, key: keyof typeof initial, options: string[]) => (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select
        value={String(form[key])}
        onChange={(e) => update(key, e.target.value)}
        required
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select one</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );

  return (
    <form onSubmit={submit} className="mt-14 max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
      <div className="grid md:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Full name</span>
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-500" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">WhatsApp / phone number</span>
          <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-500" />
        </label>

        {field('Age range', 'ageRange', ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'])}
        {field('Previous academic background', 'previousBackground', ['Science', 'Arts', 'Commercial', 'Mixed / other', 'I am not sure'])}
        {field('Desired science pathway or future goal', 'desiredPathway', ['Nursing', 'Medical Laboratory Science', 'Public Health', 'Medicine', 'Pharmacy', 'Computer / technology field', 'Other science pathway', 'I am still deciding'])}
        {field('Where do you feel you are with science right now?', 'scienceStatus', ['I have little or no science foundation', 'I studied science before but forgot much of it', 'I know some basics but have important gaps', 'I can answer some questions but struggle to explain or apply concepts', 'I am currently studying science and want stronger foundations', 'I am not sure where I stand'])}
        {field('Biggest science challenge', 'biggestChallenge', ['I do not know where to start', 'I missed important science basics', 'Understanding concepts', 'Mathematics, calculations, and formulas', 'Remembering what I study', 'Applying what I know to unfamiliar questions', 'Keeping up with study alongside work or family', 'Confidence when studying science', 'Other'])}
        {field('When did you last study science formally?', 'lastStudiedScience', ['Within the last year', '1–3 years ago', '4–7 years ago', 'More than 7 years ago', 'I have never studied it formally', 'I am studying it now'])}
        {field('What does your current week look like?', 'employmentStatus', ['Working full-time', 'Working part-time / freelance', 'Self-employed / running a business', 'Full-time student', 'Managing family / home responsibilities', 'Currently seeking work', 'Other'])}
        {field('What learning schedule would realistically work for you?', 'preferredSchedule', ['Weekday evenings', 'Saturday', 'Sunday', 'Weekends + flexible replay', 'A mix of weekday and weekend sessions', 'I need a flexible option because my schedule changes'])}
        {field('If the Academy is a good fit, what monthly investment would be realistic for you?', 'willingnessToPay', ['Under ₦10,000', '₦10,000–₦19,999', '₦20,000–₦29,999', '₦30,000–₦49,999', '₦50,000+', 'I am not sure yet'])}
      </div>

      <label className="flex items-start gap-3 mt-7 cursor-pointer">
        <input type="checkbox" checked={form.wantsFoundingCohort} onChange={(e) => update('wantsFoundingCohort', e.target.checked)} className="mt-1 w-4 h-4" />
        <span className="text-sm text-slate-600">I want information about the January 2027 Founding Cohort.</span>
      </label>

      {error && <p className="mt-5 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">{error}</p>}

      <button disabled={saving} className="mt-7 w-full md:w-auto px-7 py-4 rounded-2xl bg-blue-700 text-white font-black disabled:opacity-60">
        {saving ? <><Loader2 className="inline w-5 h-5 mr-2 animate-spin" />Saving your profile...</> : <>Join the pre-launch list <ArrowRight className="inline w-5 h-5 ml-1" /></>}
      </button>

      <p className="mt-4 text-xs text-slate-500">
        Your information is used to understand learner needs, shape the founding cohort, and send relevant Academy updates. We will not treat this submission as a confirmed admission or enrollment.
      </p>
    </form>
  );
}
