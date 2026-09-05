import { Question } from '../types';

export const biologyQuestions: Question[] = [
  // --- LEVEL Z: ZERO FOUNDATION (Contextual / Everyday) ---
  {
    id: 'BIO_Z_01', subject: 'Biology', profileLevel: 'Z', knowledgeType: 'K1', topic: 'Photosynthesis',
    text: 'A huge Iroko tree grows from a tiny seed. Where does the tree get MOST of its massive physical weight/matter from as it grows?',
    options: [
      { id: 'a', text: 'From the soil and dirt it absorbs through its roots.', points: 0 }, // Very common misconception
      { id: 'b', text: 'From the water it drinks.', points: 1 },
      { id: 'c', text: 'From carbon dioxide gas in the air.', points: 5 }, // Scientific truth
      { id: 'd', text: 'From the sunlight turning into solid wood.', points: 0 }
    ]
  },
  {
    id: 'BIO_Z_02', subject: 'Biology', profileLevel: 'Z', knowledgeType: 'K2', topic: 'Respiration',
    text: 'Why do humans need to breathe in oxygen continuously?',
    options: [
      { id: 'a', text: 'To fill up our lungs so we don\'t collapse.', points: 0 },
      { id: 'b', text: 'To cool down our blood.', points: 1 },
      { id: 'c', text: 'Our cells use oxygen to break down food and release energy.', points: 5 },
      { id: 'd', text: 'To keep our heart beating mechanically.', points: 0 }
    ]
  },
  {
    id: 'BIO_Z_03', subject: 'Biology', profileLevel: 'Z', knowledgeType: 'K3', topic: 'Genetics',
    text: 'If a father is very good at playing football and trains hard every day, will his new baby automatically be born with strong football muscles?',
    options: [
      { id: 'a', text: 'Yes, traits acquired during life are passed to children.', points: 0 }, // Lamarckian misconception
      { id: 'b', text: 'No, only traits in the DNA (like height or eye color) are inherited, not acquired skills.', points: 5 },
      { id: 'c', text: 'Only if the mother is also athletic.', points: 1 },
      { id: 'd', text: 'Yes, because the blood remembers the training.', points: 0 }
    ]
  },
  {
    id: 'BIO_Z_04', subject: 'Biology', profileLevel: 'Z', knowledgeType: 'K4', topic: 'Ecology',
    text: 'In a village farm, hawks eat snakes, snakes eat rats, and rats eat corn. What would happen if farmers killed all the snakes?',
    options: [
      { id: 'a', text: 'The hawks would start eating corn.', points: 0 },
      { id: 'b', text: 'The rats would increase, eating more corn, and the hawks would starve or leave.', points: 5 },
      { id: 'c', text: 'The farm would instantly become perfectly balanced.', points: 1 },
      { id: 'd', text: 'Nothing else would change.', points: 0 }
    ]
  },

  // --- LEVEL F: FRAGMENTED (Mixed / Rote recall with gaps) ---
  {
    id: 'BIO_F_01', subject: 'Biology', profileLevel: 'F', knowledgeType: 'K1', topic: 'Cell Structure',
    text: 'What is the primary function of the cell membrane?',
    options: [
      { id: 'a', text: 'To act as the brain of the cell.', points: 0 },
      { id: 'b', text: 'To make food for the cell.', points: 1 },
      { id: 'c', text: 'To control what enters and leaves the cell.', points: 5 },
      { id: 'd', text: 'To store water.', points: 0 }
    ]
  },
  {
    id: 'BIO_F_02', subject: 'Biology', profileLevel: 'F', knowledgeType: 'K2', topic: 'Digestive System',
    text: 'Where does most of the ABSORPTION of nutrients into the bloodstream occur in the human body?',
    options: [
      { id: 'a', text: 'In the stomach.', points: 1 }, // Common misconception
      { id: 'b', text: 'In the large intestine.', points: 0 },
      { id: 'c', text: 'In the small intestine.', points: 5 },
      { id: 'd', text: 'In the liver.', points: 0 }
    ]
  },
  {
    id: 'BIO_F_03', subject: 'Biology', profileLevel: 'F', knowledgeType: 'K3', topic: 'Circulation',
    text: 'Which blood vessels carry oxygen-rich blood away from the heart to the rest of the body?',
    options: [
      { id: 'a', text: 'Veins', points: 1 },
      { id: 'b', text: 'Arteries', points: 5 },
      { id: 'c', text: 'Capillaries', points: 0 },
      { id: 'd', text: 'Nerves', points: 0 }
    ]
  },
  {
    id: 'BIO_F_04', subject: 'Biology', profileLevel: 'F', knowledgeType: 'K4', topic: 'Reproduction',
    text: 'In human reproduction, what is the role of the placenta?',
    options: [
      { id: 'a', text: 'To protect the baby from physical bumps.', points: 1 },
      { id: 'b', text: 'To allow the mother and baby\'s blood to mix freely.', points: 0 },
      { id: 'c', text: 'To exchange nutrients, oxygen, and waste between mother and baby without mixing blood directly.', points: 5 },
      { id: 'd', text: 'To produce eggs.', points: 0 }
    ]
  },

  // --- LEVEL P: PROCEDURAL (Formulaic / Abstract calculations) ---
  {
    id: 'BIO_P_01', subject: 'Biology', profileLevel: 'P', knowledgeType: 'K1', topic: 'Genetics (Punnett Squares)',
    text: 'In peas, tall (T) is dominant over short (t). If you cross two heterozygous tall plants (Tt x Tt), what percentage of offspring will be short?',
    options: [
      { id: 'a', text: '0%', points: 0 },
      { id: 'b', text: '25%', points: 5 },
      { id: 'c', text: '50%', points: 1 },
      { id: 'd', text: '75%', points: 0 }
    ]
  },
  {
    id: 'BIO_P_02', subject: 'Biology', profileLevel: 'P', knowledgeType: 'K2', topic: 'DNA Base Pairing',
    text: 'If one strand of DNA has the sequence A-T-C-G, what is the sequence of the complementary strand?',
    options: [
      { id: 'a', text: 'A-T-C-G', points: 0 },
      { id: 'b', text: 'T-A-G-C', points: 5 },
      { id: 'c', text: 'U-A-G-C', points: 1 }, // RNA trap
      { id: 'd', text: 'G-C-A-T', points: 0 }
    ]
  },
  {
    id: 'BIO_P_03', subject: 'Biology', profileLevel: 'P', knowledgeType: 'K3', topic: 'Enzyme Action',
    text: 'An enzyme is a biological catalyst. How does it speed up a chemical reaction?',
    options: [
      { id: 'a', text: 'By increasing the temperature of the cell.', points: 0 },
      { id: 'b', text: 'By lowering the activation energy required for the reaction to start.', points: 5 },
      { id: 'c', text: 'By becoming part of the final product.', points: 1 },
      { id: 'd', text: 'By destroying the reactants.', points: 0 }
    ]
  },
  {
    id: 'BIO_P_04', subject: 'Biology', profileLevel: 'P', knowledgeType: 'K4', topic: 'Cell Division',
    text: 'A human skin cell has 46 chromosomes. After undergoing mitosis, how many chromosomes are in each new daughter cell?',
    options: [
      { id: 'a', text: '23', points: 1 }, // Meiosis trap
      { id: 'b', text: '46', points: 5 },
      { id: 'c', text: '92', points: 0 },
      { id: 'd', text: 'Varies', points: 0 }
    ]
  },

  // --- LEVEL C: CONCEPTUAL (Deep understanding / Transfer) ---
  {
    id: 'BIO_C_01', subject: 'Biology', profileLevel: 'C', knowledgeType: 'K1', topic: 'Evolutionary Theory',
    text: 'Why are some bacteria becoming resistant to antibiotics over time?',
    options: [
      { id: 'a', text: 'The antibiotics teach the bacteria how to fight back.', points: 1 },
      { id: 'b', text: 'The body becomes immune to the medicine.', points: 0 },
      { id: 'c', text: 'Random mutations create some resistant bacteria; when antibiotics kill the weak ones, only the resistant ones survive and multiply.', points: 5 }, // Natural selection
      { id: 'd', text: 'The bacteria mutate ON PURPOSE to survive the medicine.', points: 0 }
    ]
  },
  {
    id: 'BIO_C_02', subject: 'Biology', profileLevel: 'C', knowledgeType: 'K2', topic: 'Osmosis & Diffusion',
    text: 'If you place a freshwater fish into the salty ocean, what will happen to its cells?',
    options: [
      { id: 'a', text: 'Salt will rush in and cause the cells to burst.', points: 1 },
      { id: 'b', text: 'Water will leave the fish\'s cells to balance the salt outside, causing the cells to shrivel (plasmolysis).', points: 5 },
      { id: 'c', text: 'Nothing, fish cells are waterproof.', points: 0 },
      { id: 'd', text: 'The cells will absorb the ocean water and swell.', points: 0 }
    ]
  },
  {
    id: 'BIO_C_03', subject: 'Biology', profileLevel: 'C', knowledgeType: 'K3', topic: 'Cellular Respiration vs Photosynthesis',
    text: 'Which organisms perform cellular respiration (using oxygen to break down sugar)?',
    options: [
      { id: 'a', text: 'Only animals.', points: 1 }, // Common misconception
      { id: 'b', text: 'Only plants.', points: 0 },
      { id: 'c', text: 'Both plants and animals.', points: 5 },
      { id: 'd', text: 'Only bacteria.', points: 0 }
    ]
  },
  {
    id: 'BIO_C_04', subject: 'Biology', profileLevel: 'C', knowledgeType: 'K4', topic: 'Feedback Mechanisms',
    text: 'When your blood sugar rises after eating cake, your pancreas releases insulin to lower it. This is an example of:',
    options: [
      { id: 'a', text: 'Positive feedback.', points: 1 },
      { id: 'b', text: 'Negative feedback (maintaining homeostasis).', points: 5 },
      { id: 'c', text: 'Enzyme denaturation.', points: 0 },
      { id: 'd', text: 'Osmoregulation.', points: 0 }
    ]
  }
];
