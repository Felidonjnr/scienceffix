-- ScienceFix Personalized Student Portal Database Schema
-- Version 1.0 (PostgreSQL / Supabase with Row Level Security)

-- 1. Tutorial Students Table
create table if not exists public.sciencefix_students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  access_code text not null unique, -- 4 to 6 char PIN/access code validated server-side
  phone text,
  avatar_seed text not null default 'student-default',
  current_goal text not null default 'Science Pathway Foundation',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sciencefix_students_code on public.sciencefix_students (access_code);

-- 2. Student Profiles
create table if not exists public.sciencefix_student_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade unique,
  subjects jsonb not null default '["Mathematics", "Chemistry"]'::jsonb,
  overall_level text not null default 'F', -- Z, F, P, C
  strengths jsonb not null default '[]'::jsonb,
  needs_improvement jsonb not null default '[]'::jsonb,
  target_pathway text not null default 'Healthcare / Nursing',
  daily_question_target integer not null default 5,
  daily_reading_target_minutes integer not null default 15,
  teacher_notes text default '',
  updated_at timestamptz not null default now()
);

-- 3. Student Learning Plans (Subject and Topic breakdown)
create table if not exists public.sciencefix_learning_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade unique,
  subjects_plan jsonb not null default '[]'::jsonb, -- Array of { subject, currentTopic, targetTopics, weakTopics, completedTopics, preferredDifficulty }
  learning_goals jsonb not null default '[]'::jsonb,
  next_recommended_action text not null default 'Complete today''s practice',
  updated_at timestamptz not null default now()
);

-- 4. Teaching Session Logs
create table if not exists public.sciencefix_teaching_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  session_date date not null default current_date,
  subject text not null,
  topic text not null,
  subtopic text,
  what_was_taught text not null,
  struggles text not null,
  teacher_emphasis text default '',
  understanding_level integer not null default 3 check (understanding_level between 1 and 5),
  recommended_next_step text not null,
  extracted_weaknesses jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_sciencefix_sessions_student on public.sciencefix_teaching_sessions (student_id, session_date desc);

-- 5. Student Assignments
create table if not exists public.sciencefix_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  title text not null,
  subject text not null,
  topic text not null,
  instructions text not null default '',
  questions jsonb not null default '[]'::jsonb, -- Array of AssignmentQuestionItem
  difficulty integer not null default 2,
  due_date timestamptz not null,
  estimated_minutes integer not null default 15,
  status text not null default 'pending' check (status in ('pending', 'completed', 'overdue')),
  score integer,
  max_score integer,
  percentage integer,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_sciencefix_assignments_student on public.sciencefix_assignments (student_id, status);

-- 6. Assignment Submissions & Answers
create table if not exists public.sciencefix_student_answers (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  assignment_id uuid references public.sciencefix_assignments(id) on delete cascade,
  question_id text not null,
  selected_option_id text not null,
  is_correct boolean not null,
  points_earned integer not null default 0,
  time_spent_seconds integer not null default 0,
  created_at timestamptz not null default now()
);

-- 7. Daily Fix (Personalized Practice)
create table if not exists public.sciencefix_daily_practice (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  practice_date date not null default current_date,
  subject text not null,
  focus_topic text not null,
  reason text not null default 'current_focus', -- current_focus | weak_area_reinforcement | spaced_recall
  questions jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  score integer,
  max_score integer,
  percentage integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint uq_student_daily_date unique (student_id, practice_date)
);

create index if not exists idx_sciencefix_daily_student on public.sciencefix_daily_practice (student_id, practice_date desc);

-- 8. Reading Tasks & Reading Sessions
create table if not exists public.sciencefix_reading_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  subject text not null,
  topic text not null,
  title text not null,
  content text not null,
  target_duration_minutes integer not null default 15,
  actual_duration_minutes integer,
  recall_question jsonb,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 9. Topic Mastery (Aggregated across attempts)
create table if not exists public.sciencefix_topic_mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  subject text not null,
  topic text not null,
  mastery_percent integer not null default 0 check (mastery_percent between 0 and 100),
  attempt_count integer not null default 0,
  correct_count integer not null default 0,
  total_questions integer not null default 0,
  trend text not null default 'new', -- improving | stable | declining | new
  last_tested_at timestamptz not null default now(),
  constraint uq_student_topic unique (student_id, subject, topic)
);

create index if not exists idx_sciencefix_mastery_student on public.sciencefix_topic_mastery (student_id);

-- 10. Teacher Follow-Up Items
create table if not exists public.sciencefix_followups (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.sciencefix_students(id) on delete cascade,
  issue text not null,
  trigger_type text not null, -- missed_assignment | repeated_low_score | declining_performance | inactivity | broken_reading_habit | ready_to_progress
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  recommended_action text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_sciencefix_followups_status on public.sciencefix_followups (status, priority);

-- 11. Student Streaks
create table if not exists public.sciencefix_streaks (
  student_id uuid primary key references public.sciencefix_students(id) on delete cascade,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) on all portal tables
alter table public.sciencefix_students enable row level security;
alter table public.sciencefix_student_profiles enable row level security;
alter table public.sciencefix_learning_plans enable row level security;
alter table public.sciencefix_teaching_sessions enable row level security;
alter table public.sciencefix_assignments enable row level security;
alter table public.sciencefix_student_answers enable row level security;
alter table public.sciencefix_daily_practice enable row level security;
alter table public.sciencefix_reading_sessions enable row level security;
alter table public.sciencefix_topic_mastery enable row level security;
alter table public.sciencefix_followups enable row level security;
alter table public.sciencefix_streaks enable row level security;
