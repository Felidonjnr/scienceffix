/**
 * Science Transition Academy — Curriculum Blueprint
 * 
 * Formal mapping and architectural taxonomy connecting the existing Science
 * Readiness Assessment diagnostic items to foundation curriculum concepts,
 * cross-subject bridges, learning objectives, and prerequisite dependencies.
 */

import { 
  CurriculumConceptNode, 
  DiagnosticToCurriculumMapping, 
  CrossSubjectBridge,
  CurriculumBlueprintSummary
} from '../types/curriculumBlueprint';

// ============================================================================
// 1. DIAGNOSTIC-TO-CURRICULUM EVIDENCE MAPPINGS
// Maps each actual question in the 64-item diagnostic engine to a curriculum concept
// ============================================================================

export const DIAGNOSTIC_CURRICULUM_MAPPINGS: DiagnosticToCurriculumMapping[] = [
  // --- MATHEMATICS MAPPINGS ---
  {
    questionId: 'MAT_Z_01', subject: 'Mathematics', diagnosticTopic: 'Fractions', profileLevel: 'Z',
    curriculumConceptId: 'CON-MAT-01', conceptName: 'Fractions & Part-Whole Reasoning',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Deconstructing fractions as parts of a whole rather than disconnected numerals.'
  },
  {
    questionId: 'MAT_Z_02', subject: 'Mathematics', diagnosticTopic: 'Proportions', profileLevel: 'Z',
    curriculumConceptId: 'CON-MAT-02', conceptName: 'Direct Proportionality & Multipliers',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Scaling quantities using constant ratios without additive distortion.'
  },
  {
    questionId: 'MAT_Z_03', subject: 'Mathematics', diagnosticTopic: 'Percentages', profileLevel: 'Z',
    curriculumConceptId: 'CON-MAT-03', conceptName: 'Percentages & Fractional Dissection',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Calculating fractional reductions and net outcomes in everyday contexts.'
  },
  {
    questionId: 'MAT_Z_04', subject: 'Mathematics', diagnosticTopic: 'Estimation', profileLevel: 'Z',
    curriculumConceptId: 'CON-MAT-04', conceptName: 'Arithmetic Estimation & Multi-Item Budgeting',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Mental arithmetic validation and cumulative bounds checking.'
  },
  {
    questionId: 'MAT_F_01', subject: 'Mathematics', diagnosticTopic: 'Order of Operations (BODMAS)', profileLevel: 'F',
    curriculumConceptId: 'CON-MAT-05', conceptName: 'Precedence & Order of Operations',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Evaluating multiplication before addition to avoid left-to-right drift.'
  },
  {
    questionId: 'MAT_F_02', subject: 'Mathematics', diagnosticTopic: 'Adding Fractions', profileLevel: 'F',
    curriculumConceptId: 'CON-MAT-01', conceptName: 'Fraction Addition & Common Denominators',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Overcoming the misconception of adding numerators and denominators directly.'
  },
  {
    questionId: 'MAT_F_03', subject: 'Mathematics', diagnosticTopic: 'Negative Numbers', profileLevel: 'F',
    curriculumConceptId: 'CON-MAT-06', conceptName: 'Directed Numbers & Sign Arithmetic',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Number line orientation when subtracting negative quantities.'
  },
  {
    questionId: 'MAT_F_04', subject: 'Mathematics', diagnosticTopic: 'Basic Algebra', profileLevel: 'F',
    curriculumConceptId: 'CON-MAT-07', conceptName: 'Linear Equations & Inverse Operations',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Balancing equations through balanced subtraction and division operations.'
  },
  {
    questionId: 'MAT_P_01', subject: 'Mathematics', diagnosticTopic: 'Quadratic Equations', profileLevel: 'P',
    curriculumConceptId: 'CON-MAT-08', conceptName: 'Quadratic Factorization & Zero-Product Property',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Finding roots via product factors without sign confusion.'
  },
  {
    questionId: 'MAT_P_02', subject: 'Mathematics', diagnosticTopic: 'Indices/Exponents', profileLevel: 'P',
    curriculumConceptId: 'CON-MAT-09', conceptName: 'Laws of Indices & Exponent Manipulation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Adding powers when multiplying identical bases rather than multiplying powers.'
  },
  {
    questionId: 'MAT_P_03', subject: 'Mathematics', diagnosticTopic: 'Trigonometry', profileLevel: 'P',
    curriculumConceptId: 'CON-MAT-10', conceptName: 'Right-Triangle Trigonometric Ratios',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Distinguishing opposite, adjacent, and hypotenuse in ratio selection.'
  },
  {
    questionId: 'MAT_P_04', subject: 'Mathematics', diagnosticTopic: 'Logarithms', profileLevel: 'P',
    curriculumConceptId: 'CON-MAT-11', conceptName: 'Logarithmic Inverse Functions & Base 10',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Connecting logarithms to the power required to reach a target value.'
  },
  {
    questionId: 'MAT_C_01', subject: 'Mathematics', diagnosticTopic: 'Functions', profileLevel: 'C',
    curriculumConceptId: 'CON-MAT-12', conceptName: 'Graphical Representation of Roots & Zeros',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Interpreting roots as geometric x-axis intersections where y=0.'
  },
  {
    questionId: 'MAT_C_02', subject: 'Mathematics', diagnosticTopic: 'Calculus (Derivative)', profileLevel: 'C',
    curriculumConceptId: 'CON-MAT-13', conceptName: 'Derivatives as Instantaneous Rates of Change',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Connecting rate of change of position with velocity in physical models.'
  },
  {
    questionId: 'MAT_C_03', subject: 'Mathematics', diagnosticTopic: 'Probability', profileLevel: 'C',
    curriculumConceptId: 'CON-MAT-14', conceptName: 'Independent Events & Gambler’s Fallacy',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Understanding independence of random events without bias from past streaks.'
  },
  {
    questionId: 'MAT_C_04', subject: 'Mathematics', diagnosticTopic: 'Inequalities', profileLevel: 'C',
    curriculumConceptId: 'CON-MAT-15', conceptName: 'Inequalities & Negative Direction Reversal',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Explaining why negative division inverts order along the number line.'
  },

  // --- PHYSICS MAPPINGS ---
  {
    questionId: 'PHY_Z_01', subject: 'Physics', diagnosticTopic: 'Gravity & Falling Objects', profileLevel: 'Z',
    curriculumConceptId: 'CON-PHY-01', conceptName: 'Gravitational Acceleration & Mass Independence',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Overcoming the weight-determines-fall-speed intuition in dense objects.'
  },
  {
    questionId: 'PHY_Z_02', subject: 'Physics', diagnosticTopic: 'Force & Motion', profileLevel: 'Z',
    curriculumConceptId: 'CON-PHY-02', conceptName: 'Inertia & Force Decoupling',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Overcoming impetus theory; understanding that motion does not require constant force.'
  },
  {
    questionId: 'PHY_Z_03', subject: 'Physics', diagnosticTopic: 'Heat Transfer', profileLevel: 'Z',
    curriculumConceptId: 'CON-PHY-03', conceptName: 'Thermal Conduction & Materials',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Distinguishing heat creation from thermal conductivity rates.'
  },
  {
    questionId: 'PHY_Z_04', subject: 'Physics', diagnosticTopic: 'Energy Conservation', profileLevel: 'Z',
    curriculumConceptId: 'CON-PHY-04', conceptName: 'Energy Transformation & Dissipation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Tracking energy conservation: chemical into electrical plus heat loss.'
  },
  {
    questionId: 'PHY_F_01', subject: 'Physics', diagnosticTopic: 'Newton\'s Third Law', profileLevel: 'F',
    curriculumConceptId: 'CON-PHY-05', conceptName: 'Interaction Force Pairs & F=ma Damage Disparity',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Equal action-reaction forces yielding unequal accelerations due to mass difference.'
  },
  {
    questionId: 'PHY_F_02', subject: 'Physics', diagnosticTopic: 'Electricity', profileLevel: 'F',
    curriculumConceptId: 'CON-PHY-06', conceptName: 'Electric Current Continuity & Energy Transfer',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Recognizing charge is conserved; electrical potential energy is what is consumed.'
  },
  {
    questionId: 'PHY_F_03', subject: 'Physics', diagnosticTopic: 'Waves & Sound', profileLevel: 'F',
    curriculumConceptId: 'CON-PHY-07', conceptName: 'Wave Parameters: Amplitude vs Frequency',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Decoupling volume/loudness (amplitude) from pitch (frequency).'
  },
  {
    questionId: 'PHY_F_04', subject: 'Physics', diagnosticTopic: 'Density & Buoyancy', profileLevel: 'F',
    curriculumConceptId: 'CON-PHY-08', conceptName: 'Average Density & Fluid Displaced Flotation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Enclosed air altering aggregate density below that of the supporting fluid.'
  },
  {
    questionId: 'PHY_P_01', subject: 'Physics', diagnosticTopic: 'Kinematics', profileLevel: 'P',
    curriculumConceptId: 'CON-PHY-09', conceptName: 'Linear Acceleration & Kinematic Equations',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Executing v = u + at systematically without operation guessing.'
  },
  {
    questionId: 'PHY_P_02', subject: 'Physics', diagnosticTopic: 'Work & Energy', profileLevel: 'P',
    curriculumConceptId: 'CON-PHY-10', conceptName: 'Mechanical Work Done (W = Fd)',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Multiplying force and displacement parallel to motion.'
  },
  {
    questionId: 'PHY_P_03', subject: 'Physics', diagnosticTopic: 'Ohm\'s Law', profileLevel: 'P',
    curriculumConceptId: 'CON-PHY-11', conceptName: 'Ohm’s Law & Resistance Constraints (V = IR)',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Calculating current as potential difference divided by resistance.'
  },
  {
    questionId: 'PHY_P_04', subject: 'Physics', diagnosticTopic: 'Gas Laws', profileLevel: 'P',
    curriculumConceptId: 'CON-PHY-12', conceptName: 'Isothermal Gas Compression & Boyle’s Law',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Inverse relationship: Halving volume doubles pressure at constant temperature.'
  },
  {
    questionId: 'PHY_C_01', subject: 'Physics', diagnosticTopic: 'Projectile Motion', profileLevel: 'C',
    curriculumConceptId: 'CON-PHY-13', conceptName: '2D Motion Vector Independence',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Horizontal velocity having zero impact on vertical gravitational acceleration.'
  },
  {
    questionId: 'PHY_C_02', subject: 'Physics', diagnosticTopic: 'Circular Motion', profileLevel: 'C',
    curriculumConceptId: 'CON-PHY-14', conceptName: 'Centripetal Force & Tangential Release',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Recognizing tangent path upon string failure rather than outward centrifugal flight.'
  },
  {
    questionId: 'PHY_C_03', subject: 'Physics', diagnosticTopic: 'Electromagnetic Induction', profileLevel: 'C',
    curriculumConceptId: 'CON-PHY-15', conceptName: 'Lenz’s Law & Induced Opposition',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Induced magnetic fields opposing the mechanical change causing them.'
  },
  {
    questionId: 'PHY_C_04', subject: 'Physics', diagnosticTopic: 'Quantum/Photoelectric', profileLevel: 'C',
    curriculumConceptId: 'CON-PHY-16', conceptName: 'Photon Quantization & Light Intensity',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Intensity altering photon flux (rate) rather than single-photon energy.'
  },

  // --- CHEMISTRY MAPPINGS ---
  {
    questionId: 'CHE_Z_01', subject: 'Chemistry', diagnosticTopic: 'States of Matter', profileLevel: 'Z',
    curriculumConceptId: 'CON-CHE-01', conceptName: 'Physical Phase Changes & Molecular Identity',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Understanding boiling spreads water molecules apart without breaking chemical bonds.'
  },
  {
    questionId: 'CHE_Z_02', subject: 'Chemistry', diagnosticTopic: 'Chemical Changes', profileLevel: 'Z',
    curriculumConceptId: 'CON-CHE-02', conceptName: 'Conservation of Mass & Oxidation Bonding',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Rusting adding atmospheric oxygen mass rather than "eating away" iron.'
  },
  {
    questionId: 'CHE_Z_03', subject: 'Chemistry', diagnosticTopic: 'Solutions & Mixtures', profileLevel: 'Z',
    curriculumConceptId: 'CON-CHE-03', conceptName: 'Dissolution & Particle Homogeneity',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Solute molecules separating and dispersing evenly rather than melting or vanishing.'
  },
  {
    questionId: 'CHE_Z_04', subject: 'Chemistry', diagnosticTopic: 'Combustion', profileLevel: 'Z',
    curriculumConceptId: 'CON-CHE-04', conceptName: 'Combustion Gas Products & Conservation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Combusted mass escaping into atmosphere as carbon dioxide and steam.'
  },
  {
    questionId: 'CHE_F_01', subject: 'Chemistry', diagnosticTopic: 'Atomic Structure', profileLevel: 'F',
    curriculumConceptId: 'CON-CHE-05', conceptName: 'Subatomic Particle Arrangement in Atoms',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Locating protons and neutrons in the dense central nucleus.'
  },
  {
    questionId: 'CHE_F_02', subject: 'Chemistry', diagnosticTopic: 'Acids & Bases', profileLevel: 'F',
    curriculumConceptId: 'CON-CHE-06', conceptName: 'Acid-Base Classification via Indicators',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Associating blue litmus turning red with acidic solutions.'
  },
  {
    questionId: 'CHE_F_03', subject: 'Chemistry', diagnosticTopic: 'Chemical Bonding', profileLevel: 'F',
    curriculumConceptId: 'CON-CHE-07', conceptName: 'Valence Shell Octet & Chemical Bonding',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Bonding driven by achieving stable noble-gas electronic configurations.'
  },
  {
    questionId: 'CHE_F_04', subject: 'Chemistry', diagnosticTopic: 'Periodic Table', profileLevel: 'F',
    curriculumConceptId: 'CON-CHE-08', conceptName: 'Periodic Groups & Valence Reactivity',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Elements in identical vertical groups sharing valence electron count and chemical behavior.'
  },
  {
    questionId: 'CHE_P_01', subject: 'Chemistry', diagnosticTopic: 'Balancing Equations', profileLevel: 'P',
    curriculumConceptId: 'CON-CHE-09', conceptName: 'Conservation of Atoms & Stoichiometric Coefficients',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Balancing diatomic reactives without altering chemical subscript identities.'
  },
  {
    questionId: 'CHE_P_02', subject: 'Chemistry', diagnosticTopic: 'Moles & Molar Mass', profileLevel: 'P',
    curriculumConceptId: 'CON-CHE-10', conceptName: 'Molar Mass Calculation from Atomic Masses',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Summing atomic contributions (C + 2O = 12 + 32 = 44 g/mol).'
  },
  {
    questionId: 'CHE_P_03', subject: 'Chemistry', diagnosticTopic: 'Concentration (Molarity)', profileLevel: 'P',
    curriculumConceptId: 'CON-CHE-11', conceptName: 'Solution Molarity (M = moles / liters)',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Computing moles dissolved per liter of solution volume.'
  },
  {
    questionId: 'CHE_P_04', subject: 'Chemistry', diagnosticTopic: 'pH Calculation', profileLevel: 'P',
    curriculumConceptId: 'CON-CHE-12', conceptName: 'Logarithmic pH Scale & Hydrogen Ions',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Interpreting negative log exponent directly as pH level.'
  },
  {
    questionId: 'CHE_C_01', subject: 'Chemistry', diagnosticTopic: 'Equilibrium', profileLevel: 'C',
    curriculumConceptId: 'CON-CHE-13', conceptName: 'Dynamic Equilibrium & Le Chatelier’s Shifts',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Reactant addition shifting dynamic systems toward product formation.'
  },
  {
    questionId: 'CHE_C_02', subject: 'Chemistry', diagnosticTopic: 'Intermolecular Forces', profileLevel: 'C',
    curriculumConceptId: 'CON-CHE-14', conceptName: 'Intermolecular Hydrogen Bonding vs Boiling Point',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Distinguishing intermolecular attraction from intramolecular covalent bonds.'
  },
  {
    questionId: 'CHE_C_03', subject: 'Chemistry', diagnosticTopic: 'Limiting Reactants', profileLevel: 'C',
    curriculumConceptId: 'CON-CHE-15', conceptName: 'Stoichiometric Limiting Reactants',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Identifying which reagent runs out first based on recipe ratios.'
  },
  {
    questionId: 'CHE_C_04', subject: 'Chemistry', diagnosticTopic: 'Thermodynamics', profileLevel: 'C',
    curriculumConceptId: 'CON-CHE-16', conceptName: 'Endothermic Reactions & Environmental Heat Absorption',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Endothermic processes absorbing thermal energy from contact surfaces.'
  },

  // --- BIOLOGY MAPPINGS ---
  {
    questionId: 'BIO_Z_01', subject: 'Biology', diagnosticTopic: 'Photosynthesis', profileLevel: 'Z',
    curriculumConceptId: 'CON-BIO-01', conceptName: 'Atmospheric Carbon Fixation in Plant Biomass',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Recognizing that plant mass comes from atmospheric CO2, not soil minerals.'
  },
  {
    questionId: 'BIO_Z_02', subject: 'Biology', diagnosticTopic: 'Respiration', profileLevel: 'Z',
    curriculumConceptId: 'CON-BIO-02', conceptName: 'Cellular Respiration & Glucose Oxidation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Connecting inhaled oxygen to chemical energy release in mitochondria.'
  },
  {
    questionId: 'BIO_Z_03', subject: 'Biology', diagnosticTopic: 'Genetics', profileLevel: 'Z',
    curriculumConceptId: 'CON-BIO-03', conceptName: 'Genetic Inheritance vs Acquired Characteristics',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Overcoming Lamarckian misconceptions: only germline DNA is inherited.'
  },
  {
    questionId: 'BIO_Z_04', subject: 'Biology', diagnosticTopic: 'Ecology', profileLevel: 'Z',
    curriculumConceptId: 'CON-BIO-04', conceptName: 'Trophic Interdependence & Food Web Disruptions',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_1_FOUNDATION',
    remedialFocus: 'Predicting cascading population changes across predator-prey relationships.'
  },
  {
    questionId: 'BIO_F_01', subject: 'Biology', diagnosticTopic: 'Cell Structure', profileLevel: 'F',
    curriculumConceptId: 'CON-BIO-05', conceptName: 'Cell Membrane & Selective Permeability',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Membrane regulating substance entry and exit rather than serving as brain/food store.'
  },
  {
    questionId: 'BIO_F_02', subject: 'Biology', diagnosticTopic: 'Digestive System', profileLevel: 'F',
    curriculumConceptId: 'CON-BIO-06', conceptName: 'Nutrient Absorption in the Small Intestine',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Locating primary blood absorption in small intestine villi, not the stomach.'
  },
  {
    questionId: 'BIO_F_03', subject: 'Biology', diagnosticTopic: 'Circulation', profileLevel: 'F',
    curriculumConceptId: 'CON-BIO-07', conceptName: 'Systemic Circulation: Arteries vs Veins',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Arteries carrying oxygenated blood under pressure away from the heart.'
  },
  {
    questionId: 'BIO_F_04', subject: 'Biology', diagnosticTopic: 'Reproduction', profileLevel: 'F',
    curriculumConceptId: 'CON-BIO-08', conceptName: 'Placental Exchange Without Direct Blood Mixing',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Diffusive exchange of gases and nutrients across placental membranes.'
  },
  {
    questionId: 'BIO_P_01', subject: 'Biology', diagnosticTopic: 'Genetics (Punnett Squares)', profileLevel: 'P',
    curriculumConceptId: 'CON-BIO-09', conceptName: 'Monohybrid Crosses & Punnett Probability',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Heterozygous cross (Tt x Tt) producing 25% homozygous recessive phenotype.'
  },
  {
    questionId: 'BIO_P_02', subject: 'Biology', diagnosticTopic: 'DNA Base Pairing', profileLevel: 'P',
    curriculumConceptId: 'CON-BIO-10', conceptName: 'Complementary DNA Base Pairing Rules',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Applying A-T and C-G pairing without confusing DNA with RNA uracil.'
  },
  {
    questionId: 'BIO_P_03', subject: 'Biology', diagnosticTopic: 'Enzyme Action', profileLevel: 'P',
    curriculumConceptId: 'CON-BIO-11', conceptName: 'Enzymatic Catalysis & Activation Energy',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Enzymes accelerating reaction kinetics by lowering energy barriers.'
  },
  {
    questionId: 'BIO_P_04', subject: 'Biology', diagnosticTopic: 'Cell Division', profileLevel: 'P',
    curriculumConceptId: 'CON-BIO-12', conceptName: 'Mitosis & Chromosome Number Conservation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_2_CORE_SCIENCE',
    remedialFocus: 'Mitosis producing somatic daughter cells with identical diploid count (46).'
  },
  {
    questionId: 'BIO_C_01', subject: 'Biology', diagnosticTopic: 'Evolutionary Theory', profileLevel: 'C',
    curriculumConceptId: 'CON-BIO-13', conceptName: 'Natural Selection & Antibiotic Resistance',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Differential survival of pre-existing mutations under selective drug pressure.'
  },
  {
    questionId: 'BIO_C_02', subject: 'Biology', diagnosticTopic: 'Osmosis & Diffusion', profileLevel: 'C',
    curriculumConceptId: 'CON-BIO-14', conceptName: 'Osmotic Water Potential & Plasmolysis',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Hypertonic saline environments drawing water out of cells by osmosis.'
  },
  {
    questionId: 'BIO_C_03', subject: 'Biology', diagnosticTopic: 'Cellular Respiration vs Photosynthesis', profileLevel: 'C',
    curriculumConceptId: 'CON-BIO-15', conceptName: 'Universal Cellular Respiration in Plant Cells',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Overcoming the misconception that plants only photosynthesize and do not respire.'
  },
  {
    questionId: 'BIO_C_04', subject: 'Biology', diagnosticTopic: 'Feedback Mechanisms', profileLevel: 'C',
    curriculumConceptId: 'CON-BIO-16', conceptName: 'Negative Feedback & Homeostatic Regulation',
    mappingConfidence: 'EXACT_MAPPING', prescribedStartingStage: 'STAGE_3_SCIENCE_APPLICATION',
    remedialFocus: 'Insulin release counteracting elevated blood sugar to restore equilibrium.'
  }
];

// ============================================================================
// 2. STRUCTURED CURRICULUM CONCEPTS (EVIDENCED + FUTURE PROPOSALS)
// ============================================================================

export const CURRICULUM_BLUEPRINT_CONCEPTS: CurriculumConceptNode[] = [
  // --- MATHEMATICS CONCEPTS ---
  {
    id: 'CON-MAT-01', subject: 'Mathematics',
    domainId: 'DOM-MAT-01', domainName: 'Number Sense & Fractional Operations',
    topicId: 'TOP-MAT-01', topicName: 'Fractions and Part-Whole Arithmetic',
    code: 'MAT-01', name: 'Fractions & Part-Whole Arithmetic',
    description: 'Deconstruct fractions into equal parts of a whole, perform arithmetic with common denominators, and relate fractions to ratios.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-MAT-01',
      whatLearnerUnderstands: ['A fraction represents equal partitions of a single continuous unit.', 'Adding fractions requires equal partition sizes (common denominator).'],
      whatLearnerCanDo: ['Add and subtract fractions with unlike denominators.', 'Calculate remaining parts of a whole in word problems.'],
      assessmentCriteria: ['Calculates 1/2 + 1/3 = 5/6 without adding denominators.', 'Solves remaining portion word problems accurately.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['MAT_Z_01', 'MAT_F_02'],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry', 'Physics', 'Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-MAT-02', subject: 'Mathematics',
    domainId: 'DOM-MAT-02', domainName: 'Proportional Reasoning & Ratios',
    topicId: 'TOP-MAT-02', topicName: 'Direct Proportionality',
    code: 'MAT-02', name: 'Direct Proportionality & Multipliers',
    description: 'Scale physical quantities using constant multipliers and apply unit ratios across science contexts.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: ['CON-MAT-01'],
    learningObjective: {
      id: 'OBJ-MAT-02',
      whatLearnerUnderstands: ['In direct proportionality, multiplying one quantity multiplies the other by the exact same factor.'],
      whatLearnerCanDo: ['Set up cross-multiplication or unitary rate equations.', 'Calculate proportional recipe and dosage quantities.'],
      assessmentCriteria: ['Calculates scaled quantities without additive error.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['MAT_Z_02'],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry', 'Physics', 'Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'HEALTH_SCIENCES', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-MAT-03', subject: 'Mathematics',
    domainId: 'DOM-MAT-01', domainName: 'Number Sense & Fractional Operations',
    topicId: 'TOP-MAT-03', topicName: 'Percentages in Context',
    code: 'MAT-03', name: 'Percentages & Fractional Dissection',
    description: 'Calculate percentage discounts, increases, and solution proportions from raw values.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: ['CON-MAT-01'],
    learningObjective: {
      id: 'OBJ-MAT-03',
      whatLearnerUnderstands: ['Percent means parts per one hundred.', 'A percentage change modifies the base quantity.'],
      whatLearnerCanDo: ['Calculate percentage discounts and subtract from gross value.', 'Convert between percentages, decimals, and fractions.'],
      assessmentCriteria: ['Calculates net cost after percentage discount without omitting subtraction.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['MAT_Z_03'],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry', 'Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-MAT-05', subject: 'Mathematics',
    domainId: 'DOM-MAT-03', domainName: 'Algebraic Foundations',
    topicId: 'TOP-MAT-04', topicName: 'Order of Operations',
    code: 'MAT-05', name: 'Precedence & Order of Operations (BODMAS)',
    description: 'Apply operator precedence rules consistently when calculating multi-operation expressions.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-MAT-05',
      whatLearnerUnderstands: ['Multiplication and division take precedence over addition and subtraction regardless of writing order.'],
      whatLearnerCanDo: ['Evaluate multi-step expressions without left-to-right calculation errors.'],
      assessmentCriteria: ['Evaluates 5 + 3 × 2 = 11 rather than 16.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['MAT_F_01'],
    isCrossSubject: true,
    supportingSubjects: ['Physics', 'Chemistry'],
    destinationRelevance: ['ENGINEERING_PHYSICAL', 'TECHNOLOGY_COMPUTING'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-MAT-07', subject: 'Mathematics',
    domainId: 'DOM-MAT-03', domainName: 'Algebraic Foundations',
    topicId: 'TOP-MAT-05', topicName: 'Linear Equations',
    code: 'MAT-07', name: 'Linear Equations & Formula Manipulation',
    description: 'Isolate variables using inverse operations and rearrange multi-variable formulas in physics and chemistry.',
    stage: 'STAGE_2_CORE_SCIENCE',
    prerequisiteConceptIds: ['CON-MAT-05'],
    learningObjective: {
      id: 'OBJ-MAT-07',
      whatLearnerUnderstands: ['An equation is a balanced equality; operations must be applied symmetrically to both sides.'],
      whatLearnerCanDo: ['Solve for an unknown variable in a two-step linear equation.', 'Rearrange scientific formulas like V = IR or P1V1 = P2V2.'],
      assessmentCriteria: ['Solves 2x + 5 = 11 to find x = 3 with verified working.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['MAT_F_04'],
    isCrossSubject: true,
    supportingSubjects: ['Physics', 'Chemistry'],
    destinationRelevance: ['ENGINEERING_PHYSICAL', 'NURSING_MIDWIFERY', 'HEALTH_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },

  // --- PHYSICS CONCEPTS ---
  {
    id: 'CON-PHY-01', subject: 'Physics',
    domainId: 'DOM-PHY-01', domainName: 'Mechanics & Gravitation',
    topicId: 'TOP-PHY-01', topicName: 'Free Fall & Gravity',
    code: 'PHY-01', name: 'Gravitational Free Fall & Galilean Equivalence',
    description: 'Understand that in the absence of significant air resistance, gravity accelerates all masses at the identical rate (g = 9.8 m/s²).',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-PHY-01',
      whatLearnerUnderstands: ['Gravitational force scales with mass, but inertia also scales with mass, making acceleration identical.'],
      whatLearnerCanDo: ['Predict simultaneous impact of dense objects dropped from identical heights.'],
      assessmentCriteria: ['Explains why a yam and a pebble drop together without claiming weight makes the yam fall faster.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['PHY_Z_01'],
    isCrossSubject: false,
    destinationRelevance: ['ENGINEERING_PHYSICAL'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-PHY-02', subject: 'Physics',
    domainId: 'DOM-PHY-01', domainName: 'Mechanics & Gravitation',
    topicId: 'TOP-PHY-02', topicName: 'Inertia and Newton’s First Law',
    code: 'PHY-02', name: 'Inertia & Force Decoupling',
    description: 'Deconstruct impetus theory: recognize that moving objects continue moving due to inertia, not a lingering propulsion force.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-PHY-02',
      whatLearnerUnderstands: ['Forces cause changes in motion (acceleration), not motion itself.'],
      whatLearnerCanDo: ['Identify the actual forces acting on a projectile in flight (gravity, air) without inventing imaginary forward forces.'],
      assessmentCriteria: ['Identifies that only gravity acts on a kicked football in flight, rejecting lingering kick forces.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['PHY_Z_02'],
    isCrossSubject: false,
    destinationRelevance: ['ENGINEERING_PHYSICAL'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-PHY-06', subject: 'Physics',
    domainId: 'DOM-PHY-02', domainName: 'Electricity & Circuits',
    topicId: 'TOP-PHY-03', topicName: 'Current and Conservation of Charge',
    code: 'PHY-06', name: 'Electric Current Continuity & Energy Transfer',
    description: 'Understand that electric current is the flow of charge conserved throughout a closed loop; electrical energy is transferred, but electrons are not consumed.',
    stage: 'STAGE_2_CORE_SCIENCE',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-PHY-06',
      whatLearnerUnderstands: ['Charge is conserved throughout a circuit.', 'The bulb converts electrical potential energy into light/heat without consuming charge.'],
      whatLearnerCanDo: ['Explain circuit current constancy before and after resistive loads.'],
      assessmentCriteria: ['Rejects the misconception that current is consumed by light bulbs.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['PHY_F_02'],
    isCrossSubject: false,
    destinationRelevance: ['ENGINEERING_PHYSICAL', 'TECHNOLOGY_COMPUTING'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-PHY-08', subject: 'Physics',
    domainId: 'DOM-PHY-03', domainName: 'Fluid Mechanics & Density',
    topicId: 'TOP-PHY-04', topicName: 'Density and Buoyancy',
    code: 'PHY-08', name: 'Average Density & Fluid Displaced Flotation',
    description: 'Analyze floating vs sinking in terms of average object density vs fluid density and displaced fluid weight.',
    stage: 'STAGE_2_CORE_SCIENCE',
    prerequisiteConceptIds: ['CON-MAT-01'],
    learningObjective: {
      id: 'OBJ-PHY-08',
      whatLearnerUnderstands: ['Objects float if their aggregate density (mass/total volume) is less than the fluid.'],
      whatLearnerCanDo: ['Explain why a hollow steel ship floats while a solid nail sinks.'],
      assessmentCriteria: ['Identifies that enclosed air reduces the ship’s average density below water.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['PHY_F_04'],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry', 'Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'ENGINEERING_PHYSICAL'],
    defaultMasteryState: 'NOT_STARTED'
  },

  // --- CHEMISTRY CONCEPTS ---
  {
    id: 'CON-CHE-01', subject: 'Chemistry',
    domainId: 'DOM-CHE-01', domainName: 'Particulate Matter & Phase Changes',
    topicId: 'TOP-CHE-01', topicName: 'States of Matter',
    code: 'CHE-01', name: 'Physical Phase Changes & Molecular Identity',
    description: 'Distinguish physical changes (spacing of molecules) from chemical changes (breaking of intramolecular bonds).',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-CHE-01',
      whatLearnerUnderstands: ['Boiling water changes the arrangement of H2O molecules without decomposing them into H2 and O2 gases.'],
      whatLearnerCanDo: ['Distinguish physical phase changes from chemical transformations.'],
      assessmentCriteria: ['Explains that steam is still water molecules spread apart.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['CHE_Z_01'],
    isCrossSubject: true,
    supportingSubjects: ['Physics'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-CHE-02', subject: 'Chemistry',
    domainId: 'DOM-CHE-01', domainName: 'Particulate Matter & Phase Changes',
    topicId: 'TOP-CHE-02', topicName: 'Conservation of Mass',
    code: 'CHE-02', name: 'Conservation of Mass & Oxidation Bonding',
    description: 'Understand that atoms are neither created nor destroyed in chemical reactions; oxidation adds mass from surrounding air.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-CHE-02',
      whatLearnerUnderstands: ['Chemical reactions rearrange atoms; total mass is strictly conserved.'],
      whatLearnerCanDo: ['Predict mass changes when gases are absorbed or released during reactions.'],
      assessmentCriteria: ['Explains why a rusted cutlass weighs more due to combined atmospheric oxygen.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['CHE_Z_02'],
    isCrossSubject: true,
    supportingSubjects: ['Physics', 'Biology'],
    destinationRelevance: ['LABORATORY_SCIENCES', 'HEALTH_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-CHE-11', subject: 'Chemistry',
    domainId: 'DOM-CHE-02', domainName: 'Solutions, Stoichiometry & Concentrations',
    topicId: 'TOP-CHE-03', topicName: 'Solution Molarity',
    code: 'CHE-11', name: 'Solution Molarity (M = moles / liters)',
    description: 'Calculate volumetric solution concentrations in moles per liter for laboratory and clinical dilution scenarios.',
    stage: 'STAGE_2_CORE_SCIENCE',
    prerequisiteConceptIds: ['CON-MAT-01', 'CON-MAT-02'],
    learningObjective: {
      id: 'OBJ-CHE-11',
      whatLearnerUnderstands: ['Molarity measures the number of dissolved solute particles per liter of total solution.'],
      whatLearnerCanDo: ['Calculate molarity using M = n / V.'],
      assessmentCriteria: ['Solves 0.5 moles in 2.0 L = 0.25 M accurately.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['CHE_P_03'],
    isCrossSubject: true,
    supportingSubjects: ['Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'LABORATORY_SCIENCES', 'HEALTH_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },

  // --- BIOLOGY CONCEPTS ---
  {
    id: 'CON-BIO-01', subject: 'Biology',
    domainId: 'DOM-BIO-01', domainName: 'Cellular Energetics & Ecosystems',
    topicId: 'TOP-BIO-01', topicName: 'Photosynthesis & Carbon Fixation',
    code: 'BIO-01', name: 'Atmospheric Carbon Fixation in Plant Biomass',
    description: 'Understand that plant dry biomass originates from gaseous atmospheric CO2 converted into carbohydrates during photosynthesis, not soil dirt.',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-BIO-01',
      whatLearnerUnderstands: ['Carbon dioxide from air provides the carbon atoms for plant cellular growth.'],
      whatLearnerCanDo: ['Dispel the misconception that trees gain mass by eating dirt from the ground.'],
      assessmentCriteria: ['Identifies atmospheric CO2 as the primary origin of tree mass.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['BIO_Z_01'],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry'],
    destinationRelevance: ['HEALTH_SCIENCES', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-BIO-07', subject: 'Biology',
    domainId: 'DOM-BIO-02', domainName: 'Human Physiology & Organ Systems',
    topicId: 'TOP-BIO-02', topicName: 'Circulation and Transport',
    code: 'BIO-07', name: 'Systemic Circulation: Arteries vs Veins',
    description: 'Distinguish the structural and functional adaptations of arteries, veins, and capillaries in systemic blood transport.',
    stage: 'STAGE_2_CORE_SCIENCE',
    prerequisiteConceptIds: [],
    learningObjective: {
      id: 'OBJ-BIO-07',
      whatLearnerUnderstands: ['Arteries carry blood away from the heart under high ventricular pressure.', 'Veins return blood toward the heart.'],
      whatLearnerCanDo: ['Identify the direction and oxygenation state of systemic vessels.'],
      assessmentCriteria: ['Identifies arteries as carrying oxygenated blood away from the heart to tissues.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['BIO_F_03'],
    isCrossSubject: true,
    supportingSubjects: ['Physics'], // Blood pressure mechanics
    destinationRelevance: ['NURSING_MIDWIFERY', 'HEALTH_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-BIO-14', subject: 'Biology',
    domainId: 'DOM-BIO-03', domainName: 'Cellular Transport & Homeostasis',
    topicId: 'TOP-BIO-03', topicName: 'Osmosis in Living Cells',
    code: 'BIO-14', name: 'Osmotic Water Potential & Plasmolysis',
    description: 'Predict cell volume changes in hypotonic, isotonic, and hypertonic solutions based on net water movement down water potential gradients.',
    stage: 'STAGE_3_SCIENCE_APPLICATION',
    prerequisiteConceptIds: ['CON-CHE-03', 'CON-MAT-01'],
    learningObjective: {
      id: 'OBJ-BIO-14',
      whatLearnerUnderstands: ['Water moves across semipermeable membranes toward areas of higher solute concentration.'],
      whatLearnerCanDo: ['Explain why freshwater cells shrivel in saltwater (hypertonic environment).'],
      assessmentCriteria: ['Explains water loss and plasmolysis when freshwater organisms enter ocean water.']
    },
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED',
    mappedDiagnosticQuestionIds: ['BIO_C_02'],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry', 'Physics'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'HEALTH_SCIENCES', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },

  // --- PROPOSED FUTURE FOUNDATION CONCEPTS (FOR FUTURE VALIDATION) ---
  {
    id: 'CON-MAT-F01', subject: 'Mathematics',
    domainId: 'DOM-MAT-04', domainName: 'Scientific Calculations & Units',
    topicId: 'TOP-MAT-F01', topicName: 'Dimensional Analysis & Scientific Notation',
    code: 'MAT-F01', name: 'Dimensional Analysis & Scientific Notation',
    description: 'Converting micro, milli, centi, and kilo prefixes and expressing physical quantities in standard form (A × 10^n).',
    stage: 'STAGE_1_FOUNDATION',
    prerequisiteConceptIds: ['CON-MAT-01'],
    learningObjective: {
      id: 'OBJ-MAT-F01',
      whatLearnerUnderstands: ['Scientific notation prevents orders-of-magnitude errors in minute or massive numbers.'],
      whatLearnerCanDo: ['Convert milligrams to grams and liters to milliliters without hesitation.'],
      assessmentCriteria: ['Executes metric conversions with 100% precision.']
    },
    evidenceStatus: 'FUTURE_CURRICULUM_AREA',
    maturity: 'PROPOSED',
    mappedDiagnosticQuestionIds: [],
    isCrossSubject: true,
    supportingSubjects: ['Chemistry', 'Physics', 'Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-PHY-F01', subject: 'Physics',
    domainId: 'DOM-PHY-03', domainName: 'Fluid Mechanics & Density',
    topicId: 'TOP-PHY-F01', topicName: 'Fluid Pressure & Pressure Gradients',
    code: 'PHY-F01', name: 'Fluid Pressure Gradients & Hydraulic Systems',
    description: 'Understand pressure as force per unit area (P = F/A) and pressure transmission in liquids and cardiovascular columns.',
    stage: 'STAGE_2_CORE_SCIENCE',
    prerequisiteConceptIds: ['CON-MAT-02'],
    learningObjective: {
      id: 'OBJ-PHY-F01',
      whatLearnerUnderstands: ['Pressure depends on fluid depth and density; liquids transmit pressure undiminished.'],
      whatLearnerCanDo: ['Explain intravenous fluid delivery height and blood pressure measurement principles.'],
      assessmentCriteria: ['Explains gravity-fed IV bag flow rates based on pressure height.']
    },
    evidenceStatus: 'FUTURE_CURRICULUM_AREA',
    maturity: 'PROPOSED',
    mappedDiagnosticQuestionIds: [],
    isCrossSubject: true,
    supportingSubjects: ['Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'HEALTH_SCIENCES', 'ENGINEERING_PHYSICAL'],
    defaultMasteryState: 'NOT_STARTED'
  },
  {
    id: 'CON-CHE-F01', subject: 'Chemistry',
    domainId: 'DOM-CHE-03', domainName: 'Chemical Systems in Organisms',
    topicId: 'TOP-CHE-F01', topicName: 'Buffer Solutions & pH Balance',
    code: 'CHE-F01', name: 'Buffer Systems & Physiological pH Maintenance',
    description: 'Understand how weak acids and conjugate bases resist pH changes in chemical and biological solutions.',
    stage: 'STAGE_3_SCIENCE_APPLICATION',
    prerequisiteConceptIds: ['CON-CHE-06', 'CON-MAT-11'],
    learningObjective: {
      id: 'OBJ-CHE-F01',
      whatLearnerUnderstands: ['Buffers absorb added H+ or OH- ions, keeping solution pH tightly bounded.'],
      whatLearnerCanDo: ['Explain the bicarbonate buffer system maintaining human blood pH around 7.4.'],
      assessmentCriteria: ['Explains physiological consequences of blood acid-base disruption.']
    },
    evidenceStatus: 'FUTURE_CURRICULUM_AREA',
    maturity: 'PROPOSED',
    mappedDiagnosticQuestionIds: [],
    isCrossSubject: true,
    supportingSubjects: ['Biology'],
    destinationRelevance: ['NURSING_MIDWIFERY', 'HEALTH_SCIENCES', 'LABORATORY_SCIENCES'],
    defaultMasteryState: 'NOT_STARTED'
  }
];

// ============================================================================
// 3. CROSS-SUBJECT FOUNDATIONS
// Concepts that unlock multiple science disciplines simultaneously
// ============================================================================

export const CROSS_SUBJECT_BRIDGES: CrossSubjectBridge[] = [
  {
    id: 'CSB-01',
    name: 'Proportions, Ratios & Dilution Scaling',
    description: 'The mathematical foundation of direct proportionality enables dilution calculations in Chemistry, dosage formulas in Biology/Nursing, and mechanical advantage in Physics.',
    primarySubject: 'Mathematics',
    connectedSubjects: ['Chemistry', 'Biology', 'Physics'],
    curriculumConceptIds: ['CON-MAT-01', 'CON-MAT-02', 'CON-CHE-11'],
    unlocksCapabilities: [
      'Clinical drug dosage calculations (Nursing/Health)',
      'Solution molarity dilution recipes (Chemistry/Lab)',
      'Scaling mechanical force vectors and gear ratios (Physics)'
    ],
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED'
  },
  {
    id: 'CSB-02',
    name: 'Conservation Laws (Mass, Energy & Atoms)',
    description: 'The fundamental principle that physical entities cannot be created from nothing or destroyed into nothing underpins chemical reaction balancing, biological metabolism, and thermodynamic engines.',
    primarySubject: 'Physics',
    connectedSubjects: ['Chemistry', 'Biology'],
    curriculumConceptIds: ['CON-PHY-04', 'CON-CHE-02', 'CON-BIO-01'],
    unlocksCapabilities: [
      'Balancing chemical reaction equations without phantom mass',
      'Tracking biomass carbon origin from air in photosynthesis',
      'Accounting for heat loss in biological respiration and mechanical motors'
    ],
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED'
  },
  {
    id: 'CSB-03',
    name: 'Membrane Transport, Concentration Gradients & Osmosis',
    description: 'Connecting solution concentration (Chemistry) with hydrostatic pressure (Physics) to understand cellular homeostasis, IV therapy, and organ absorption (Biology).',
    primarySubject: 'Biology',
    connectedSubjects: ['Chemistry', 'Physics'],
    curriculumConceptIds: ['CON-CHE-03', 'CON-CHE-11', 'CON-BIO-14'],
    unlocksCapabilities: [
      'Intravenous fluid administration and osmotic cell response (Nursing)',
      'Dialysis and cellular membrane diffusion mechanics (Health Science)',
      'Plant root water uptake against gravity (Ecology/Biology)'
    ],
    evidenceStatus: 'SUPPORTED_BY_CURRENT_ASSESSMENT',
    maturity: 'IMPLEMENTED'
  },
  {
    id: 'CSB-04',
    name: 'Dimensional Consistency & Unit Analysis',
    description: 'Using units as a built-in error check when manipulating equations across Physics, Chemistry, and Clinical Practice.',
    primarySubject: 'Mathematics',
    connectedSubjects: ['Physics', 'Chemistry', 'Biology'],
    curriculumConceptIds: ['CON-MAT-07', 'CON-MAT-F01'],
    unlocksCapabilities: [
      'Validating rearranged formulas by verifying units cancel properly',
      'Zero-error conversions between cubic centimeters, milliliters, and liters'
    ],
    evidenceStatus: 'FUTURE_CURRICULUM_AREA',
    maturity: 'PROPOSED'
  }
];

// ============================================================================
// 4. CURRICULUM BLUEPRINT METRICS & SUMMARY
// ============================================================================

export const CURRICULUM_SUMMARY_BY_SUBJECT: CurriculumBlueprintSummary[] = [
  {
    subject: 'Mathematics',
    domainsCount: 4,
    topicsCount: 5,
    evidencedConceptsCount: 15,
    futureConceptsCount: 3,
    reviewRequiredCount: 1
  },
  {
    subject: 'Physics',
    domainsCount: 4,
    topicsCount: 5,
    evidencedConceptsCount: 16,
    futureConceptsCount: 3,
    reviewRequiredCount: 1
  },
  {
    subject: 'Chemistry',
    domainsCount: 4,
    topicsCount: 5,
    evidencedConceptsCount: 16,
    futureConceptsCount: 3,
    reviewRequiredCount: 1
  },
  {
    subject: 'Biology',
    domainsCount: 4,
    topicsCount: 5,
    evidencedConceptsCount: 16,
    futureConceptsCount: 3,
    reviewRequiredCount: 1
  }
];

// ============================================================================
// 5. DIAGNOSTIC BRIDGE HELPER
// Identifies corresponding curriculum concepts when given a diagnostic failure
// ============================================================================

export function bridgeDiagnosticToCurriculum(questionId: string): DiagnosticToCurriculumMapping | undefined {
  return DIAGNOSTIC_CURRICULUM_MAPPINGS.find(m => m.questionId === questionId);
}
