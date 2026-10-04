# Science Transition Academy — Learning Architecture

This document establishes the underlying educational architecture, data hierarchy, and progression framework for **Science Transition Academy**. It outlines the structural framework that future curricula, practice systems, and student experiences will inhabit, while strictly preserving the integrity of the existing Science Readiness Assessment engine.

---

## 1. Core Academy Model: The 5-Phase Progression

Unlike traditional examination tutorial centers that follow a superficial sequence (*"Attend classes → Memorize notes → Write exam"*), Science Transition Academy is structured around an intuitive, capability-driven progression:

$$\text{ASSESS} \quad\longrightarrow\quad \text{REBUILD} \quad\longrightarrow\quad \text{PRACTISE} \quad\longrightarrow\quad \text{APPLY} \quad\longrightarrow\quad \text{PROGRESS}$$

1. **ASSESS:** Identify the learner's actual starting baseline, intuitive reasoning, and specific cognitive gaps without judgment.
2. **REBUILD:** Deconstruct intimidating scientific ideas into first principles, establishing core vocabulary, units, arithmetic, and conceptual models.
3. **PRACTISE:** Convert passive understanding into active, reflexive capability through guided clinics and scaffolding exercises.
4. **APPLY:** Move beyond single-topic formula execution to solve multi-step, non-routine, and cross-disciplinary problems.
5. **PROGRESS:** Validate retention against the initial baseline and prepare the learner for their target healthcare or university programme.

---

## 2. Learning Stages (Conceptual, Not Fixed Durations)

The Academy rejects arbitrary calendar constraints (e.g. *"Everyone finishes in 12 weeks"*). Stage advancement is strictly governed by demonstrated understanding, formative milestone assessments, and individual learner pace:

* **STAGE 1 — FOUNDATION (`STAGE_1_FOUNDATION`):**  
  * *Purpose:* Rebuild missing prerequisite vocabulary, basic mathematical reasoning, proportions, scientific notation, dimensional units, and graph interpretation.  
  * *Exit Criteria:* Fluent unit conversion, proportion arithmetic without panic, accurate graphical gradient and trend analysis.
* **STAGE 2 — CORE SCIENCE (`STAGE_2_CORE_SCIENCE`):**  
  * *Purpose:* Build reliable mental models of major principles across Mathematics, Physics, Chemistry, and Biology from first principles.  
  * *Exit Criteria:* Independent rearrangement of multi-variable formulas, conceptual explanation of physical and biological mechanisms.
* **STAGE 3 — SCIENCE APPLICATION (`STAGE_3_SCIENCE_APPLICATION`):**  
  * *Purpose:* Move from recognition to problem-solving. Practice interpreting complex questions, selecting unprompted formulas, and explaining causal relationships.  
  * *Exit Criteria:* Successful unassisted execution of unfamiliar multi-step problems and articulate error diagnosis.
* **STAGE 4 — DESTINATION READINESS (`STAGE_4_DESTINATION_READINESS`):**  
  * *Purpose:* Contextualize science capability to the learner's specific academic or vocational target (e.g., Nursing entrance calculations, Engineering kinematics, Laboratory stoichiometry).  
  * *Exit Criteria:* Timed evaluation sets executed without cognitive overload or formula anxiety.
* **STAGE 5 — CONTINUED PROGRESS (`STAGE_5_CONTINUED_PROGRESS`):**  
  * *Purpose:* Long-term retention scans, cognitive calibration, and continuous advisory as learners enter university or formal training.  
  * *Exit Criteria:* Resilient long-term retention and self-directed academic study habits.

---

## 3. Subject & Concept Hierarchy

Curriculum content is structured in an explicit 7-tier hierarchy:

$$\text{Subject} \longrightarrow \text{Domain} \longrightarrow \text{Topic} \longrightarrow \text{Concept} \longrightarrow \text{Lesson} \longrightarrow \text{PracticeSet} \longrightarrow \text{Assessment}$$

* **Subject:** One of the four core sciences (*Mathematics, Physics, Chemistry, Biology*).
* **Domain:** Broad pedagogical competency area (e.g., *M-ALG: Algebraic Manipulation & Formula Rearranging*).
* **Topic:** Thematic cluster of related ideas (e.g., *Linear Equations with Physical Dimensions*).
* **Concept:** Atomic unit of learning carrying an explicit **Learning Objective** and prerequisite graph.
* **Lesson:** Modular, 15–25 minute interactive or worked-example walkthrough tailored to adult learning attention.
* **PracticeSet:** Curated set of guided or independent practice items with scaffolding hints.
* **Assessment:** Evaluation checkpoint verifying mastery or progress.

### Learning Objective Schema
Every concept must explicitly define:
1. **What the learner understands** (Mental model / intuitive principles).
2. **What the learner can do** (Executable procedural skills).
3. **Prerequisite knowledge** (Prior concepts that must be active).
4. **Practice requirements** (Minimum problem sets completed).
5. **Assessment criteria** (Mastery thresholds and demonstration benchmarks).

---

## 4. Concept Mastery State Machine

Learners do not simply have a percentage score; each concept maintains an explicit mastery state:

```
[NOT_STARTED]
      ↓
  [LEARNING]  ← (Interactive walkthrough, worked clinics)
      ↓
 [PRACTISING] ← (Guided & independent problem sets)
      ↓
 [DEVELOPING] ← (Occasional errors under varying conditions)
      ↓
  [MASTERED]  ← (Consistent accuracy across unfamiliar variations)
```

---

## 5. Assessment Taxonomy Distinction

The learning architecture strictly separates three distinct assessment modes to prevent confounding entry diagnostics with formative study:

| Category | Role | Frequency | Modifies Baseline? |
| :--- | :--- | :--- | :--- |
| **A. Science Readiness Assessment** | Entry-point diagnostic determining the learner's starting point, cognitive inclinations, and priority gaps. | Once upon onboarding (or retake after major milestone). | **Yes** (Establishes baseline) |
| **B. Learning Practice** | Formative skill building with worked hints and scaffolding during lessons. | Continuous (Daily / Weekly). | **No** (Guides active learning) |
| **C. Progress Assessment** | Milestone checks verifying retained knowledge and measurable growth against the initial baseline. | End of stage or monthly interval. | **No** (Compares against baseline) |

---

## 6. Foundation-First Personalized Learning Path

Traditional courses force every learner through Lesson 1 regardless of background. Science Transition Academy utilizes the initial Science Readiness Assessment to assign a **Personalized Learning Path**:

* **Learner A** (Score 28%): Recommended to start at **Stage 1 (Foundation)** on *Proportions, Metric Units & Scientific Terminology*.
* **Learner B** (Score 58%): Foundation is recognized; recommended to start at **Stage 2 (Core Science)** on *Algebraic Equation Balancing & Reaction Stoichiometry*.
* **Learner C** (Score 78%): Core concepts intact; recommended to start at **Stage 3 (Science Application)** on *Non-Routine Problem Deconstruction & Destination Prep*.

---

## 7. Adult Learning & Catch-Up Recovery Model

Adult learners manage employment, shifts, and families. Missing a session must never cause a learner to permanently derail:

$$\text{Missed Session} \longrightarrow \text{Recovery Lesson} \longrightarrow \text{Guided Practice} \longrightarrow \text{Concept Check} \longrightarrow \text{Restored to Normal Path}$$

* **Short Learning Activities:** Core instructional content delivered in digestible 15–25 minute modules.
* **Recovery Loops:** Asynchronous walkthroughs with self-paced worked example clinics.
* **Checkpoint Verification:** A brief 3-question Concept Check confirms readiness before advancing.

---

## 8. Teacher Intervention Triggers

The architecture defines 5 automated flag criteria for academic advisor intervention:

1. **`REPEATED_ERRORS`:** 3+ consecutive errors on the same prerequisite concept during guided practice.
2. **`PROGRESS_STALLED`:** 7+ days in `LEARNING` state without advancing through practice.
3. **`PREREQUISITE_WEAKNESS`:** Current struggle directly traced to an unsolidified earlier foundation.
4. **`PRACTICE_INCONSISTENCY`:** 2 consecutive missed weekly checkpoints due to work/schedule disruptions.
5. **`CONFIDENCE_PERFORMANCE_DIVERGENCE`:** High confidence with wrong answers (unconscious misconception) or Low confidence with correct answers (imposter hesitation).

---

## 9. Destination Pathways (Nursing as Initial Beachhead)

While **Nursing & Midwifery** serves as the initial strategic beachhead, the architecture supports all science-dependent academic pathways:

1. **Nursing, Midwifery & Allied Health** (*Beachhead: Focus on metric conversions, dosage proportions, fluid mechanics, and physiological regulation*).
2. **Medicine, Pharmacy & Health Sciences** (*Focus on organic functional groups, reaction stoichiometry, bioenergetics, and optics*).
3. **Applied & Laboratory Sciences** (*Focus on titration stoichiometry, buffer solutions, genetics, and scientific error analysis*).
4. **Engineering & Physical Sciences** (*Focus on advanced algebra, vector mechanics, kinematics, and thermodynamics*).
5. **Computing, Software & Data Science** (*Focus on discrete logic, boolean algebra, functions, and rate of change*).
6. **Science Education & Teaching** (*Focus on pedagogical clarity and conceptual communication*).
7. **General Science Foundation** (*Broad exploratory literacy across all 4 sciences*).

---

## 10. Clean Data Separation Architecture

To prevent fragile, monolithic objects, the data model maintains strict boundary separation:

```typescript
// 1. Learner Profile (Identity & Availability)
interface LearnerProfile { ... }

// 2. Science Readiness Result (Diagnostic Baseline)
interface ScienceReadinessResult { ... }

// 3. Personalized Learning Path (Current Stage & Active Concepts)
interface PersonalizedLearningPath { ... }

// 4. Curriculum & Lessons (Content Hierarchy)
interface LearningDomain { ... }
interface LearningConcept { ... }
interface Lesson { ... }

// 5. Practice & Mastery (Formative Evaluation)
interface PracticeSet { ... }
interface LearnerConceptMastery { ... }

// 6. Destination Pathway (Target Program Requirements)
interface DestinationPathway { ... }

// 7. Founding Cohort Application (Admissions & Onboarding Record)
interface FoundingCohortApplication { ... }
```

---

## 11. Implementation Status Matrix

| System Component | Status | Location / Implementation |
| :--- | :--- | :--- |
| **Science Readiness Assessment** | **CURRENTLY IMPLEMENTED** | `src/utils/engine.ts`, `src/data/questions.ts`, `src/components/DiagnosticView.tsx` |
| **Science Readiness Blueprint** | **CURRENTLY IMPLEMENTED** | `src/components/ReportView.tsx`, `src/utils/engine.ts` |
| **Founding Cohort Offer Experience** | **CURRENTLY IMPLEMENTED** | `src/components/LandingView.tsx`, `src/data/cohortConfig.ts` |
| **Founding Cohort Application Flow** | **CURRENTLY IMPLEMENTED** | `src/components/CohortApplicationModal.tsx`, `src/types.ts` |
| **Learning Architecture Types & Contracts** | **CURRENTLY IMPLEMENTED** | `src/types/learningArchitecture.ts`, `src/types.ts` |
| **Learning Stage & Pathway Reference** | **CURRENTLY IMPLEMENTED** | `src/data/learningArchitecture.ts` |
| **Full Lesson Content Library** | *FUTURE ARCHITECTURE* | To be developed within `STAGE_1` – `STAGE_4` hierarchy |
| **Interactive Practice Engine** | *FUTURE ARCHITECTURE* | To be developed under `PracticeType` taxonomy |
| **Automated LMS / Student Dashboards** | *FUTURE ARCHITECTURE* | Future phase after cohort validation |
| **Automated Teacher Intervention Alerts**| *FUTURE ARCHITECTURE* | Future phase after live cohort onboarding |

---

*Science Transition Academy Architecture — Prepared for modular curriculum insertion and scalable adult-learning delivery.*
