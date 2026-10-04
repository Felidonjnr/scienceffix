# Science Transition Academy — Curriculum Blueprint

## Executive Overview & Architectural Intent
This blueprint defines the foundational science curriculum architecture for **Science Transition Academy**. It formalizes the progression from entry diagnostic evidence to foundational conceptual understanding, bridging student needs to future academic and vocational destinations (including Nursing, Allied Health, Engineering, and Laboratory Sciences).

Every component in this blueprint is explicitly classified under one of three governance statuses:
* **`[IMPLEMENTED]`**: Fully grounded in the existing Science Readiness Assessment diagnostic engine and codebase.
* **`[PROPOSED]`**: Formally architected and structured in TypeScript data models for subsequent cohort curriculum authoring.
* **`[REQUIRES REVIEW]`**: Pedagogical or cross-disciplinary intersections flagged for human subject-matter expert decision.

---

## A. Curriculum Philosophy: Foundation Before Acceleration
Traditional secondary and tutorial curricula in Nigeria and West Africa rely on rapid syllabus acceleration:
$$\text{Attend Lecture} \longrightarrow \text{Transcribe Formulas} \longrightarrow \text{Drill Past Exam Papers}$$

When adult returnees, career switchers, and non-science background learners re-enter education, this sequence fails because science education is strictly cumulative. If intuitive mental models of rates, dimensional units, conservation, or cellular processes are fragmented, formula memorization collapses under examination pressure.

The Academy reorganizes education around **Foundation Before Acceleration**:
$$\text{Prerequisite Tool} \longrightarrow \text{Foundation Concept} \longrightarrow \text{Core Science Model} \longrightarrow \text{Application Clinic} \longrightarrow \text{Destination Context}$$

---

## B. Subject Structure & Diagnostic Evidence Base
The curriculum supports four core foundational science disciplines. All initial domains and topics are grounded directly in the 64-item diagnostic engine (`math.ts`, `physics.ts`, `chemistry.ts`, `biology.ts`):

```
Subject: Mathematics (16 Diagnostic Evidence Items)
├── Domain: Number Sense & Fractional Operations
├── Domain: Proportional Reasoning & Rates
├── Domain: Algebraic Foundations & Inverses
└── Domain: Scientific Functions & Rates of Change

Subject: Physics (16 Diagnostic Evidence Items)
├── Domain: Mechanics & Gravitation
├── Domain: Thermal Physics & Energy Conservation
├── Domain: Electricity & Wave Phenomena
└── Domain: Fluid Mechanics & 2D Vectors

Subject: Chemistry (16 Diagnostic Evidence Items)
├── Domain: Particulate Nature of Matter & Physical States
├── Domain: Atomic Structure & Periodic Periodicity
├── Domain: Solutions, Molarity & Stoichiometry
└── Domain: Chemical Equilibrium & Thermochemistry

Subject: Biology (16 Diagnostic Evidence Items)
├── Domain: Cellular Energetics & Bioenergetics
├── Domain: Human Organ Systems & Circulation
├── Domain: Genetics, DNA & Cell Division
└── Domain: Ecology, Osmosis & Homeostatic Feedback
```

---

## C. Foundation Domains & Topic Breakdown

### 1. Mathematics Foundation
* **Domain 1.1: Number Sense & Part-Whole Fractions `[IMPLEMENTED]`**
  * *Topic 1.1.1:* Fractions & Fractional Parts (`MAT_Z_01`)
  * *Topic 1.1.2:* Adding Unlike Denominators (`MAT_F_02`)
  * *Topic 1.1.3:* Percentage Dissection & Net Decreases (`MAT_Z_03`)
  * *Topic 1.1.4:* Cumulative Bounds & Arithmetic Estimation (`MAT_Z_04`)
* **Domain 1.2: Proportional Reasoning & Scaling `[IMPLEMENTED]`**
  * *Topic 1.2.1:* Direct Proportions & Multiplicative Rates (`MAT_Z_02`)
  * *Topic 1.2.2:* Scale Factors in Scientific Ratios (`MAT_P_03`)
* **Domain 1.3: Algebraic Foundations & Linear Equations `[IMPLEMENTED]`**
  * *Topic 1.3.1:* Precedence & Order of Operations (BODMAS) (`MAT_F_01`)
  * *Topic 1.3.2:* Directed Numbers & Negative Sign Inversion (`MAT_F_03`, `MAT_C_04`)
  * *Topic 1.3.3:* Single-Variable Linear Equation Balancing (`MAT_F_04`)
  * *Topic 1.3.4:* Exponents & Laws of Indices (`MAT_P_02`)
* **Domain 1.4: Advanced Functions & Rate Interpretation `[IMPLEMENTED]`**
  * *Topic 1.4.1:* Quadratic Equations & Factorization (`MAT_P_01`)
  * *Topic 1.4.2:* Logarithmic Bases & Decades (`MAT_P_04`)
  * *Topic 1.4.3:* Graphical Zeros & Intercepts (`MAT_C_01`)
  * *Topic 1.4.4:* Derivatives as Instantaneous Rates (`MAT_C_02`)
  * *Topic 1.4.5:* Independent Event Probabilities (`MAT_C_03`)

### 2. Physics Foundation
* **Domain 2.1: Mechanics & Newton’s Laws `[IMPLEMENTED]`**
  * *Topic 2.1.1:* Free Fall & Galilean Equivalence (`PHY_Z_01`)
  * *Topic 2.1.2:* Inertia & Impetus Misconception (`PHY_Z_02`)
  * *Topic 2.1.3:* Newton’s Third Law & Mass-Damage Disparity (`PHY_F_01`)
  * *Topic 2.1.4:* Linear Acceleration Kinematics (`PHY_P_01`)
  * *Topic 2.1.5:* 2D Projectile Motion & Vector Independence (`PHY_C_01`)
  * *Topic 2.1.6:* Centripetal Force & Tangential Release (`PHY_C_02`)
* **Domain 2.2: Work, Energy & Thermal Physics `[IMPLEMENTED]`**
  * *Topic 2.2.1:* Thermal Conduction in Materials (`PHY_Z_03`)
  * *Topic 2.2.2:* Energy Transformation & Heat Dissipation (`PHY_Z_04`)
  * *Topic 2.2.3:* Mechanical Work Done ($W = F \cdot d$) (`PHY_P_02`)
* **Domain 2.3: Electricity, Magnetism & Wave Mechanics `[IMPLEMENTED]`**
  * *Topic 2.3.1:* Electric Current & Charge Conservation (`PHY_F_02`)
  * *Topic 2.3.2:* Wave Parameters: Amplitude vs Frequency (`PHY_F_03`)
  * *Topic 2.3.3:* Ohm’s Law Resistance Constraints (`PHY_P_03`)
  * *Topic 2.3.4:* Electromagnetic Induction & Lenz’s Law (`PHY_C_03`)
  * *Topic 2.3.5:* Photoelectric Effect & Photon Quantization (`PHY_C_04`)
* **Domain 2.4: Fluid Statics & Thermal Expansion `[IMPLEMENTED]`**
  * *Topic 2.4.1:* Aggregate Density & Fluid Buoyancy (`PHY_F_04`)
  * *Topic 2.4.2:* Isothermal Gas Compression & Boyle’s Law (`PHY_P_04`)

### 3. Chemistry Foundation
* **Domain 3.1: Particulate Nature of Matter & Physical States `[IMPLEMENTED]`**
  * *Topic 3.1.1:* Molecular Spacing in Physical Phase Changes (`CHE_Z_01`)
  * *Topic 3.1.2:* Mass Conservation in Chemical Oxidation (`CHE_Z_02`)
  * *Topic 3.1.3:* Particle Dissolution vs Melting (`CHE_Z_03`)
  * *Topic 3.1.4:* Gaseous Mass Transfer in Combustion (`CHE_Z_04`)
* **Domain 3.2: Atomic Structure & Chemical Periodicity `[IMPLEMENTED]`**
  * *Topic 3.2.1:* Subatomic Particle Nucleus Arrangement (`CHE_F_01`)
  * *Topic 3.2.2:* Valence Shell Octet & Chemical Bonding (`CHE_F_03`)
  * *Topic 3.2.3:* Periodic Group Valence Reactivity (`CHE_F_04`)
* **Domain 3.3: Solutions, Stoichiometry & Quantitative Chemistry `[IMPLEMENTED]`**
  * *Topic 3.3.1:* Litmus Acid-Base Indicators (`CHE_F_02`)
  * *Topic 3.3.2:* Balancing Equations & Atom Conservation (`CHE_P_01`)
  * *Topic 3.3.3:* Molar Mass Summation (`CHE_P_02`)
  * *Topic 3.3.4:* Volumetric Solution Molarity ($M = \frac{n}{V}$) (`CHE_P_03`)
  * *Topic 3.3.5:* Logarithmic pH Measurement (`CHE_P_04`)
* **Domain 3.4: Dynamic Equilibrium & Thermochemistry `[IMPLEMENTED]`**
  * *Topic 3.4.1:* Le Chatelier’s Equilibrium Shifts (`CHE_C_01`)
  * *Topic 3.4.2:* Intermolecular Hydrogen Bonding in Liquids (`CHE_C_02`)
  * *Topic 3.4.3:* Stoichiometric Limiting Reactants (`CHE_C_03`)
  * *Topic 3.4.4:* Endothermic Heat Absorption (`CHE_C_04`)

### 4. Biology Foundation
* **Domain 4.1: Cellular Energetics & Ecosystem Dynamics `[IMPLEMENTED]`**
  * *Topic 4.1.1:* Atmospheric Carbon Dioxide Fixation in Biomass (`BIO_Z_01`)
  * *Topic 4.1.2:* Cellular Respiration & Food Energy Conversion (`BIO_Z_02`)
  * *Topic 4.1.3:* Trophic Food Web Cascades (`BIO_Z_04`)
  * *Topic 4.1.4:* Universal Respiration Across Kingdoms (`BIO_C_03`)
* **Domain 4.2: Cellular Organization & Physiology `[IMPLEMENTED]`**
  * *Topic 4.2.1:* Cell Membrane Selective Permeability (`BIO_F_01`)
  * *Topic 4.2.2:* Small Intestinal Nutrient Absorption (`BIO_F_02`)
  * *Topic 4.2.3:* Cardiovascular Arterial Transport (`BIO_F_03`)
  * *Topic 4.2.4:* Placental Barrier & Fetal Exchange (`BIO_F_04`)
  * *Topic 4.2.5:* Enzymatic Activation Energy Catalysis (`BIO_P_03`)
* **Domain 4.3: Genetics & Molecular Inheritance `[IMPLEMENTED]`**
  * *Topic 4.3.1:* Somatic vs Germline Inheritance (`BIO_Z_03`)
  * *Topic 4.3.2:* Monohybrid Crosses & Punnett Ratios (`BIO_P_01`)
  * *Topic 4.3.3:* Complementary DNA Base Pairing (`BIO_P_02`)
  * *Topic 4.3.4:* Mitotic Chromosome Conservation (`BIO_P_04`)
  * *Topic 4.3.5:* Natural Selection & Antibiotic Resistance (`BIO_C_01`)
* **Domain 4.4: Homeostatic Feedback & Osmoregulation `[IMPLEMENTED]`**
  * *Topic 4.4.1:* Hypertonic Plasmolysis & Water Potential (`BIO_C_02`)
  * *Topic 4.4.2:* Negative Feedback in Blood Glucose Regulation (`BIO_C_04`)

---

## D. Concept Hierarchy & Prerequisite Mapping
No advanced concept is taught without ensuring its prerequisite chain is verified:

```
[CON-MAT-01: Fractions]
        ↓
[CON-MAT-02: Direct Proportions] ──→ [CON-CHE-11: Solution Molarity]
        ↓                                       ↓
[CON-MAT-03: Percentages]           [CON-BIO-14: Osmotic Plasmolysis]
        ↓
[CON-MAT-07: Linear Equations] ────→ [CON-PHY-09: Kinematics (v = u + at)]
                                   → [CON-PHY-11: Ohm's Law (V = IR)]
```

### Detailed Concept Prerequisite Graph
1. **`CON-MAT-01` (Fractions)** is prerequisite for:
   * `CON-MAT-02` (Proportions)
   * `CON-MAT-03` (Percentages)
   * `CON-CHE-11` (Molarity & Dilutions)
   * `CON-PHY-08` (Density & Buoyancy)
2. **`CON-MAT-02` (Proportions)** is prerequisite for:
   * `CON-CHE-09` (Balancing Equations)
   * `CON-CHE-15` (Limiting Reactants)
   * `CON-PHY-12` (Boyle's Gas Law)
3. **`CON-MAT-05` (Order of Operations / BODMAS)** is prerequisite for:
   * `CON-MAT-07` (Linear Equations)
   * `CON-MAT-08` (Quadratic Factorization)
4. **`CON-CHE-01` (Physical Phase Changes)** is prerequisite for:
   * `CON-CHE-03` (Solute-Solvent Dissolution)
   * `CON-CHE-14` (Intermolecular Forces)
5. **`CON-CHE-05` (Atomic Structure)** is prerequisite for:
   * `CON-CHE-07` (Chemical Bonding)
   * `CON-CHE-08` (Periodic Group Trends)
   * `CON-PHY-06` (Electric Charge Movement)
6. **`CON-BIO-05` (Cell Membrane Permeability)** is prerequisite for:
   * `CON-BIO-08` (Placental Exchange)
   * `CON-BIO-14` (Osmotic Plasmolysis)

---

## E. Measurable Action-Oriented Learning Objectives
Each concept specifies observable competencies rather than passive comprehension:

| Concept Code | Concept Name | Measurable Learning Objective (`whatLearnerCanDo`) |
| :--- | :--- | :--- |
| `CON-MAT-01` | Fractions & Operations | Add and subtract fractions with unlike denominators by calculating common partitions. |
| `CON-MAT-02` | Proportions & Scaling | Calculate clinical dosages and scaled recipe quantities using direct proportionality multipliers. |
| `CON-MAT-07` | Linear Equations | Isolate an unknown variable in a multi-variable physical formula without operation guessing. |
| `CON-PHY-01` | Gravitational Free Fall | Predict the simultaneous landing of dense masses dropped from equal heights, discarding weight misconceptions. |
| `CON-PHY-08` | Density & Flotation | Calculate average aggregate density to explain why hollow steel vessels float in water. |
| `CON-CHE-02` | Mass Conservation | Predict mass changes in chemical oxidation systems when atmospheric gases participate. |
| `CON-CHE-11` | Solution Molarity | Compute molar concentrations ($M = \frac{n}{V}$) for laboratory and clinical preparation protocols. |
| `CON-BIO-07` | Cardiovascular Transport | Differentiate between systemic arterial pressure flow and venous return mechanisms. |
| `CON-BIO-14` | Osmotic Water Potential | Predict cell volume and plasmolysis outcomes when living tissue is exposed to hypertonic saline. |

---

## F. Cross-Subject Foundations
The following foundational concepts unlock competencies across multiple science disciplines simultaneously:

1. **`CSB-01` — Proportions, Ratios & Dilutions `[IMPLEMENTED]`**
   * *Spans:* Mathematics $\longleftrightarrow$ Chemistry $\longleftrightarrow$ Biology / Healthcare
   * *Unlocks:* Clinical dosage calculations, solution molarity dilution series, and mechanical advantage levers.
2. **`CSB-02` — Universal Conservation Laws (Mass, Energy, Atoms) `[IMPLEMENTED]`**
   * *Spans:* Physics $\longleftrightarrow$ Chemistry $\longleftrightarrow$ Biology
   * *Unlocks:* Balancing reaction equations, tracking atmospheric carbon conversion in photosynthesis, and thermal motor efficiency.
3. **`CSB-03` — Membrane Transport, Gradients & Osmosis `[IMPLEMENTED]`**
   * *Spans:* Chemistry (Solutions) $\longleftrightarrow$ Physics (Hydrostatic Pressure) $\longleftrightarrow$ Biology (Cellular Homeostasis)
   * *Unlocks:* Intravenous fluid administration, dialysis filtration, and plant vascular water uptake.
4. **`CSB-04` — Dimensional Consistency & Unit Analysis `[PROPOSED]`**
   * *Spans:* Mathematics $\longleftrightarrow$ Physics $\longleftrightarrow$ Chemistry
   * *Unlocks:* Using units as a self-checking mechanism when rearranging multi-variable equations.

---

## G. Future Proposed Curriculum Areas (Not in Diagnostic)
The following vital science areas are **not** currently measured by the 64-item diagnostic engine and are categorized as proposed future additions for cohort authoring:

* **`CON-MAT-F01`:** Metric Prefix Conversions & Standard Form ($A \times 10^n$) `[PROPOSED]`
* **`CON-MAT-F02`:** Scientific Graph Interpretation: Gradients, Tangents & Area Under Curves `[PROPOSED]`
* **`CON-PHY-F01`:** Fluid Pressure Gradients, Atmospheric Pressure & Hydraulic Lift `[PROPOSED]` (High Nursing relevance for IV line mechanics and blood pressure cuffs).
* **`CON-PHY-F02`:** Specific Heat Capacity, Latent Heat & Phase Transitions `[PROPOSED]`
* **`CON-CHE-F01`:** Buffer Systems & Physiological Bicarbonate Equilibrium `[PROPOSED]` (Critical for blood acid-base clinical reasoning).
* **`CON-CHE-F02`:** Hydrocarbons & Basic Organic Functional Groups `[PROPOSED]`
* **`CON-BIO-F01`:** Renal Function, Glomerular Filtration & Electrolyte Regulation `[PROPOSED]` (Essential for nursing and allied health transitions).
* **`CON-BIO-F02`:** Immune System Antigens, Antibodies & Active/Passive Immunity `[PROPOSED]`

---

## H. Destination Pathway Relevance (Nursing as Beachhead)
Concepts in the curriculum are tagged with their specific relevance to target academic pathways:

* **Nursing & Midwifery (`NURSING_MIDWIFERY`) `[IMPLEMENTED AS BEACHHEAD]`:**
  * Core Prerequisite Priority: Proportions/Dosages (`CON-MAT-02`), Solutions/Dilutions (`CON-CHE-11`), Cardiovascular Circulation (`CON-BIO-07`), Osmoregulation (`CON-BIO-14`), Buffer Balance (`CON-CHE-F01`), Fluid Pressure (`CON-PHY-F01`).
* **Medicine & Pharmacy (`HEALTH_SCIENCES`) `[PROPOSED]`:**
  * Core Prerequisite Priority: Reaction Stoichiometry, Organic Functional Groups, Cellular Bioenergetics, Genetic DNA transcription.
* **Applied & Laboratory Sciences (`LABORATORY_SCIENCES`) `[PROPOSED]`:**
  * Core Prerequisite Priority: Titration Stoichiometry, Buffer Preparation, Chemical Error Propagation.
* **Engineering & Physical Sciences (`ENGINEERING_PHYSICAL`) `[PROPOSED]`:**
  * Core Prerequisite Priority: Kinematic Equations, Vector Resolution, Newton's Third Law, Ohm's Electrical Circuits.
* **Computing & Technology (`TECHNOLOGY_COMPUTING`) `[PROPOSED]`:**
  * Core Prerequisite Priority: Discrete Logic, Exponents, Probability, Order of Operations.

---

## I. Items Requiring Human Curriculum Review `[REQUIRES REVIEW]`
The following pedagogical design questions are logged for explicit human educator review:

1. **Review Item 1: Placement of Introductory Calculus in Transition Pathways**
   * *Observation:* The diagnostic contains 1 conceptual calculus question (`MAT_C_02`: derivative as rate of change).
   * *Question for Review:* Should derivatives remain in the core foundation sequence, or be routed exclusively to learners targeting Engineering/Computing pathways while health learners receive deeper proportional dosage arithmetic?
   * *Status:* `[REQUIRES REVIEW]`
2. **Review Item 2: Quantum Photoelectric Model in Foundation Physics**
   * *Observation:* `PHY_C_04` tests photon energy vs wave intensity.
   * *Question for Review:* Is the photoelectric effect essential for non-physics transitioners, or should it be deferred in favor of direct current circuits and heat transfer?
   * *Status:* `[REQUIRES REVIEW]`
3. **Review Item 3: Secondary School Organic Chemistry Prerequisites**
   * *Observation:* The current diagnostic contains zero organic chemistry questions.
   * *Question for Review:* Nursing and pharmacy entrance examinations frequently include functional groups. Should an introductory organic chemistry module (`CON-CHE-F02`) be mandatory before Stage 4?
   * *Status:* `[REQUIRES REVIEW]`

---

## J. Diagnostic-to-Curriculum Bridge Workflow

When a learner completes the Science Readiness Assessment, the diagnostic gap does not present an abstract failure; it routes to a specific curriculum remedy:

$$\text{Diagnostic Missed: } \mathbf{MAT\_F\_02} \text{ (1/2 + 1/3 = 2/5)} \longrightarrow \text{Identifies Concept: } \mathbf{CON\text{-}MAT\text{-}01} \longrightarrow \text{Prescribes Stage: } \mathbf{STAGE\_1\_FOUNDATION}$$

* Diagnostic score $< 40\%$: Routes to **Stage 1 Foundation** (*Arithmetic, Proportions, Units, Physical Changes*).
* Diagnostic score $40\% - 69\%$: Routes to **Stage 2 Core Science** (*Linear Equations, Forces, Molarity, Cell Systems*).
* Diagnostic score $\ge 70\%$: Routes to **Stage 3 Science Application** (*Multi-step non-routine word problems, Le Chatelier shifts, Osmotic regulation*).

---

*Science Transition Academy Architecture — Formalized blueprint connecting entry diagnostic evidence to modular curriculum implementation.*
