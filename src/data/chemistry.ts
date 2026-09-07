import { Question } from '../types';

export const chemistryQuestions: Question[] = [
  // --- LEVEL Z: ZERO FOUNDATION (Contextual / Everyday) ---
  {
    id: 'CHE_Z_01', subject: 'Chemistry', profileLevel: 'Z', knowledgeType: 'K1', topic: 'States of Matter', cognitiveSkills: ["Logical Deduction","Formula Dependency"], difficulty: 1,
    text: 'When you boil a pot of water to make eba and the water disappears as steam, what is that steam actually made of?',
    options: [
      { id: 'a', text: 'It has broken down into Hydrogen and Oxygen gases.', points: 0 }, // Common misconception
      { id: 'b', text: 'It is still water (H2O), just spread far apart in a gas form.', points: 5 },
      { id: 'c', text: 'The water has been completely destroyed by the heat.', points: 0 },
      { id: 'd', text: 'It is just hot air rising from the pot.', points: 1 }
    ]
  },
  {
    id: 'CHE_Z_02', subject: 'Chemistry', profileLevel: 'Z', knowledgeType: 'K2', topic: 'Chemical Changes', cognitiveSkills: ["Reading Comprehension","Logical Deduction"], difficulty: 1,
    text: 'If you leave an iron cutlass outside in the rain, it rusts. How does the weight of the rusty cutlass compare to when it was new?',
    options: [
      { id: 'a', text: 'It is lighter because the rust eats away the iron.', points: 1 },
      { id: 'b', text: 'It is exactly the same weight, just a different color.', points: 0 },
      { id: 'c', text: 'It is heavier because oxygen from the air has combined with the iron.', points: 5 }, // Conservation of mass / oxidation
      { id: 'd', text: 'It is lighter because water washed away the metal.', points: 0 }
    ]
  },
  {
    id: 'CHE_Z_03', subject: 'Chemistry', profileLevel: 'Z', knowledgeType: 'K3', topic: 'Solutions & Mixtures', cognitiveSkills: ["Conceptual Application","Formula Dependency"], difficulty: 3,
    text: 'When you stir sugar into a cup of hot tea and it disappears, what happened to the sugar?',
    options: [
      { id: 'a', text: 'The sugar melted into a liquid.', points: 1 },
      { id: 'b', text: 'The sugar was destroyed by the hot water.', points: 0 },
      { id: 'c', text: 'The sugar particles separated and mixed evenly with the water particles.', points: 5 },
      { id: 'd', text: 'The sugar turned into sweet energy.', points: 0 }
    ]
  },
  {
    id: 'CHE_Z_04', subject: 'Chemistry', profileLevel: 'Z', knowledgeType: 'K4', topic: 'Combustion', cognitiveSkills: ["Reading Comprehension"], difficulty: 2,
    text: 'When firewood burns down to a small pile of ashes, where did most of the wood go?',
    options: [
      { id: 'a', text: 'It was consumed and turned into pure heat and light.', points: 1 },
      { id: 'b', text: 'It turned into the ash on the ground.', points: 0 },
      { id: 'c', text: 'It escaped into the air as invisible gases like carbon dioxide.', points: 5 },
      { id: 'd', text: 'It simply ceased to exist.', points: 0 }
    ]
  },

  // --- LEVEL F: FRAGMENTED (Mixed / Rote recall with gaps) ---
  {
    id: 'CHE_F_01', subject: 'Chemistry', profileLevel: 'F', knowledgeType: 'K1', topic: 'Atomic Structure', cognitiveSkills: ["Graph Illiteracy","Reading Comprehension"], difficulty: 2,
    text: 'An atom is made of protons, neutrons, and electrons. Which particles are found inside the nucleus at the very center?',
    options: [
      { id: 'a', text: 'Only protons.', points: 1 },
      { id: 'b', text: 'Protons and electrons.', points: 0 },
      { id: 'c', text: 'Protons and neutrons.', points: 5 },
      { id: 'd', text: 'Neutrons and electrons.', points: 0 }
    ]
  },
  {
    id: 'CHE_F_02', subject: 'Chemistry', profileLevel: 'F', knowledgeType: 'K2', topic: 'Acids & Bases', cognitiveSkills: ["Logical Deduction"], difficulty: 3,
    text: 'If a liquid turns blue litmus paper red, what does this tell you about the liquid?',
    options: [
      { id: 'a', text: 'It is an alkali (base).', points: 0 },
      { id: 'b', text: 'It is an acid.', points: 5 },
      { id: 'c', text: 'It is neutral, like pure water.', points: 0 },
      { id: 'd', text: 'It is salty.', points: 1 }
    ]
  },
  {
    id: 'CHE_F_03', subject: 'Chemistry', profileLevel: 'F', knowledgeType: 'K3', topic: 'Chemical Bonding', cognitiveSkills: ["Reading Comprehension","Formula Dependency"], difficulty: 1,
    text: 'Why do atoms bond together to form molecules like H2O or NaCl?',
    options: [
      { id: 'a', text: 'Because they are naturally sticky.', points: 0 },
      { id: 'b', text: 'To achieve a full, stable outer shell of electrons.', points: 5 },
      { id: 'c', text: 'To cancel out their protons.', points: 1 },
      { id: 'd', text: 'Because heat forces them together.', points: 0 }
    ]
  },
  {
    id: 'CHE_F_04', subject: 'Chemistry', profileLevel: 'F', knowledgeType: 'K4', topic: 'Periodic Table', cognitiveSkills: ["Spatial Reasoning","Reading Comprehension"], difficulty: 3,
    text: 'Elements in the same vertical column (Group) on the Periodic Table share what important feature?',
    options: [
      { id: 'a', text: 'They have the same atomic mass.', points: 0 },
      { id: 'b', text: 'They have the same number of protons.', points: 1 },
      { id: 'c', text: 'They have similar chemical reactions because they have the same number of outer electrons.', points: 5 },
      { id: 'd', text: 'They were discovered in the same year.', points: 0 }
    ]
  },

  // --- LEVEL P: PROCEDURAL (Formulaic / Abstract calculations) ---
  {
    id: 'CHE_P_01', subject: 'Chemistry', profileLevel: 'P', knowledgeType: 'K1', topic: 'Balancing Equations', cognitiveSkills: ["Graph Illiteracy"], difficulty: 2,
    text: 'Balance this equation: __ H2 + __ O2 → __ H2O',
    options: [
      { id: 'a', text: '1, 1, 1', points: 0 },
      { id: 'b', text: '2, 1, 2', points: 5 },
      { id: 'c', text: '2, 2, 2', points: 1 },
      { id: 'd', text: '4, 1, 4', points: 0 }
    ]
  },
  {
    id: 'CHE_P_02', subject: 'Chemistry', profileLevel: 'P', knowledgeType: 'K2', topic: 'Moles & Molar Mass', cognitiveSkills: ["Spatial Reasoning","Formula Dependency"], difficulty: 3,
    text: 'The molar mass of Carbon (C) is 12 g/mol and Oxygen (O) is 16 g/mol. What is the molar mass of Carbon Dioxide (CO2)?',
    options: [
      { id: 'a', text: '28 g/mol', points: 0 },
      { id: 'b', text: '44 g/mol', points: 5 },
      { id: 'c', text: '32 g/mol', points: 1 },
      { id: 'd', text: '60 g/mol', points: 0 }
    ]
  },
  {
    id: 'CHE_P_03', subject: 'Chemistry', profileLevel: 'P', knowledgeType: 'K3', topic: 'Concentration (Molarity)', cognitiveSkills: ["Spatial Reasoning"], difficulty: 2,
    text: 'If you dissolve 0.5 moles of NaCl into enough water to make 2.0 Liters of solution, what is the molarity (M)?',
    options: [
      { id: 'a', text: '0.25 M', points: 5 },
      { id: 'b', text: '1.0 M', points: 0 },
      { id: 'c', text: '2.5 M', points: 1 },
      { id: 'd', text: '4.0 M', points: 0 }
    ]
  },
  {
    id: 'CHE_P_04', subject: 'Chemistry', profileLevel: 'P', knowledgeType: 'K4', topic: 'pH Calculation', cognitiveSkills: ["Formula Dependency","Spatial Reasoning"], difficulty: 2,
    text: 'If the Hydrogen ion concentration [H+] of a solution is 1 x 10^-4 M, what is the pH?',
    options: [
      { id: 'a', text: '10', points: 1 },
      { id: 'b', text: '4', points: 5 },
      { id: 'c', text: '-4', points: 0 },
      { id: 'd', text: '14', points: 0 }
    ]
  },

  // --- LEVEL C: CONCEPTUAL (Deep understanding / Transfer) ---
  {
    id: 'CHE_C_01', subject: 'Chemistry', profileLevel: 'C', knowledgeType: 'K1', topic: 'Equilibrium', cognitiveSkills: ["Reading Comprehension","Spatial Reasoning"], difficulty: 2,
    text: 'In a sealed, dynamic equilibrium system (A + B ⇌ C + D), what happens if you add more of substance A?',
    options: [
      { id: 'a', text: 'The reaction stops completely.', points: 0 },
      { id: 'b', text: 'The system shifts to produce more C and D to re-balance.', points: 5 }, // Le Chatelier's Principle
      { id: 'c', text: 'The system shifts to produce more B.', points: 1 },
      { id: 'd', text: 'Nothing happens because it is already balanced.', points: 0 }
    ]
  },
  {
    id: 'CHE_C_02', subject: 'Chemistry', profileLevel: 'C', knowledgeType: 'K2', topic: 'Intermolecular Forces', cognitiveSkills: ["Spatial Reasoning"], difficulty: 2,
    text: 'Water (H2O) boils at 100°C, while Methane (CH4) boils at -161°C, even though they are similar in size. Why?',
    options: [
      { id: 'a', text: 'Water has stronger covalent bonds inside the molecule.', points: 1 }, // Misconception: boiling breaks covalent bonds
      { id: 'b', text: 'Water molecules form strong hydrogen bonds WITH EACH OTHER, requiring more energy to separate them.', points: 5 },
      { id: 'c', text: 'Methane is a gas by nature, so it doesn\'t need heat.', points: 0 },
      { id: 'd', text: 'Water is heavier.', points: 0 }
    ]
  },
  {
    id: 'CHE_C_03', subject: 'Chemistry', profileLevel: 'C', knowledgeType: 'K3', topic: 'Limiting Reactants', cognitiveSkills: ["Spatial Reasoning","Graph Illiteracy"], difficulty: 1,
    text: 'To make one bicycle, you need 1 frame and 2 wheels. If you have 5 frames and 8 wheels, how many bicycles can you make, and what is the limiting "reactant"?',
    options: [
      { id: 'a', text: '5 bicycles, limiting is wheels.', points: 0 },
      { id: 'b', text: '4 bicycles, limiting is wheels.', points: 5 },
      { id: 'c', text: '4 bicycles, limiting is frames.', points: 1 },
      { id: 'd', text: '8 bicycles, limiting is frames.', points: 0 }
    ]
  },
  {
    id: 'CHE_C_04', subject: 'Chemistry', profileLevel: 'C', knowledgeType: 'K4', topic: 'Thermodynamics', cognitiveSkills: ["Graph Illiteracy","Spatial Reasoning"], difficulty: 1,
    text: 'An endothermic reaction feels cold to the touch. What is happening to the energy?',
    options: [
      { id: 'a', text: 'The reaction is releasing cold energy into your hand.', points: 0 },
      { id: 'b', text: 'The reaction is destroying heat energy.', points: 1 },
      { id: 'c', text: 'The reaction is absorbing heat energy from its surroundings (your hand) to break chemical bonds.', points: 5 },
      { id: 'd', text: 'The chemicals are freezing solid.', points: 0 }
    ]
  }
];
