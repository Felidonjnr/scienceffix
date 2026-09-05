import React, { useState } from 'react';
import { StudentData, ProfileLevel } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, User, Target, Calendar, Shield } from 'lucide-react';

export default function IntakeForm({ onSubmit, onDevSkip }: { onSubmit: (data: StudentData) => void, onDevSkip?: () => void }) {
  const [data, setData] = useState<StudentData>({
    name: '',
    phone: '',
    age: '',
    courseGoal: '',
    targetExam: '',
    startingLevel: 'Z',
    employmentStatus: '',
    learningMethod: '',
    readingPace: '',
    dailyStudyHours: '',
    biggestChallenge: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#E2E8F0]"
      >
        <div className="mb-10 border-b border-[#E2E8F0] pb-8 -mx-8 md:-mx-10 -mt-8 md:-mt-10 p-8 md:p-10 bg-[#F8FAFC] rounded-t-2xl">
          <h2 className="text-2xl font-bold mb-2 text-[#0F172A] tracking-tight">AI Personalization Intake</h2>
          <p className="text-[#64748B] text-sm leading-relaxed">
            Please provide accurate details about your lifestyle, learning style, and goals. 
            Our AI engine uses this data to map out the exact pathway that will work best for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Personal Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] border-b pb-2">1. Personal & Lifestyle Profile</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E293B]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input 
                  required
                  type="text"
                  className="w-full pl-9 pr-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white"
                  placeholder="e.g. Jane Doe"
                  value={data.name}
                  onChange={e => setData({...data, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Age</label>
                <input 
                  required
                  type="number"
                  className="w-full px-3 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white"
                  placeholder="e.g. 18"
                  value={data.age}
                  onChange={e => setData({...data, age: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Phone</label>
                <input 
                  required
                  type="tel"
                  className="w-full px-3 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white"
                  placeholder="e.g. 080..."
                  value={data.phone}
                  onChange={e => setData({...data, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E293B]">Current Employment / Status</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white appearance-none"
                value={data.employmentStatus}
                onChange={e => setData({...data, employmentStatus: e.target.value})}
              >
                <option value="" disabled>Select your current status</option>
                <option value="Full-time student">Full-time student</option>
                <option value="Working full-time">Working full-time (9-5)</option>
                <option value="Working part-time">Working part-time / freelance</option>
                <option value="Gap year / Not working">Gap year / Not working</option>
                <option value="Stay-at-home parent">Stay-at-home parent</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E293B]">Daily Study Availability</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white appearance-none"
                value={data.dailyStudyHours}
                onChange={e => setData({...data, dailyStudyHours: e.target.value})}
              >
                <option value="" disabled>How much time can you commit daily?</option>
                <option value="< 1 hour">Less than 1 hour</option>
                <option value="1-2 hours">1 to 2 hours</option>
                <option value="3-4 hours">3 to 4 hours</option>
                <option value="5+ hours">5+ hours</option>
              </select>
            </div>
          </div>

          {/* Section 2: Cognitive & Learning Psychology */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] border-b pb-2">2. Learning Psychology</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E293B]">Primary Learning Method</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white appearance-none"
                value={data.learningMethod}
                onChange={e => setData({...data, learningMethod: e.target.value})}
              >
                <option value="" disabled>How do you learn best?</option>
                <option value="Visual">Visual (Diagrams, Videos, Animations)</option>
                <option value="Auditory">Auditory (Lectures, Explanations, Podcasts)</option>
                <option value="Reading">Reading/Writing (Textbooks, Notes, Summaries)</option>
                <option value="Kinesthetic">Kinesthetic (Practice questions, Hands-on experiments)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E293B]">Reading Pattern & Pace</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white appearance-none"
                value={data.readingPace}
                onChange={e => setData({...data, readingPace: e.target.value})}
              >
                <option value="" disabled>Describe your reading style</option>
                <option value="Slow and thorough">Slow and highly thorough (I need to understand every word)</option>
                <option value="Average">Average pace (I read normally, occasionally re-read)</option>
                <option value="Fast skimmer">Fast skimmer (I read quickly but sometimes miss small details)</option>
                <option value="Struggles with focus">I struggle to maintain focus while reading long texts</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E293B]">Biggest Learning Challenge</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white appearance-none"
                value={data.biggestChallenge}
                onChange={e => setData({...data, biggestChallenge: e.target.value})}
              >
                <option value="" disabled>What stops you from studying effectively?</option>
                <option value="Procrastination">Procrastination and Lack of Motivation</option>
                <option value="Memory">Forgetting things right after studying</option>
                <option value="Calculations">Struggling with math and calculations</option>
                <option value="Test Anxiety">Test anxiety and panicking during exams</option>
                <option value="Time Management">No time due to work/life responsibilities</option>
              </select>
            </div>
          </div>

          {/* Section 3: Academic Targets */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B] border-b pb-2">3. Academic Targets</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Course Goal</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input 
                    required
                    type="text"
                    className="w-full pl-9 pr-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white"
                    placeholder="e.g. Medicine, Engineering"
                    value={data.courseGoal}
                    onChange={e => setData({...data, courseGoal: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E293B]">Target Exam</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <select 
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-md border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all text-sm bg-white appearance-none"
                    value={data.targetExam}
                    onChange={e => setData({...data, targetExam: e.target.value})}
                  >
                    <option value="" disabled>Select target exam</option>
                    <option value="JAMB 2027">JAMB 2027</option>
                    <option value="JAMB 2028">JAMB 2028</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-[#1E293B]">Self-Assessed Science Baseline</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'Z', title: 'Zero Foundation', desc: 'Arts/Commercial background, starting entirely fresh' },
                  { id: 'F', title: 'Fragmented', desc: 'Studied science before, but forgot a lot of the basics' },
                  { id: 'P', title: 'Procedural', desc: 'Good at formulas/calculations, but struggle with core concepts' },
                  { id: 'C', title: 'Conceptual', desc: 'Solid understanding, just need speed and exam strategy' },
                ].map(level => (
                  <label 
                    key={level.id} 
                    className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                      data.startingLevel === level.id 
                        ? 'border-[#2563EB] bg-blue-50' 
                        : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="startingLevel" 
                      value={level.id}
                      checked={data.startingLevel === level.id}
                      onChange={(e) => setData({...data, startingLevel: e.target.value as ProfileLevel})}
                      className="mt-1 border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">{level.title}</div>
                      <div className="text-sm text-[#64748B] mt-1">{level.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-700">Your privacy matters.</p>
              <p className="text-sm text-slate-600 mt-1">We do not save or collect your personal data or test results. Everything happens locally on your device. Please ensure you download your PDF report at the end of the test.</p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm text-base mt-8"
          >
            Launch AI Diagnostic Scan
            <ArrowRight className="w-5 h-5" />
          </button>

          {onDevSkip && (
            <button 
              type="button"
              onClick={onDevSkip}
              className="w-full flex items-center justify-center gap-2 bg-purple-50 text-purple-600 border border-purple-200 border-dashed px-6 py-3 rounded-xl font-bold hover:bg-purple-100 transition-colors text-sm mt-4"
            >
              🧪 Dev: Auto-Fill & Skip Quiz
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
