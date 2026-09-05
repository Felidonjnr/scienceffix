import { Question } from '../types';

export const mathQuestions: Question[] = [
  // --- LEVEL Z: ZERO FOUNDATION (Contextual / Everyday) ---
  {
    id: 'MAT_Z_01', subject: 'Mathematics', profileLevel: 'Z', knowledgeType: 'K1', topic: 'Fractions',
    text: 'You have one whole pizza. You give 1/3 of it to your brother and 1/3 to your sister. How much is left for you?',
    options: [
      { id: 'a', text: '1/3', points: 5 },
      { id: 'b', text: '2/6', points: 1 }, // Correct mathematically, but conceptually overcomplicated for everyday terms
      { id: 'c', text: 'Nothing is left.', points: 0 },
      { id: 'd', text: '2/3', points: 0 }
    ]
  },
  {
    id: 'MAT_Z_02', subject: 'Mathematics', profileLevel: 'Z', knowledgeType: 'K2', topic: 'Proportions',
    text: 'If a tailor needs 3 yards of fabric to sew 1 native attire, how many yards does she need to sew 4 identical attires?',
    options: [
      { id: 'a', text: '7 yards', points: 0 }, // Added instead of multiplying
      { id: 'b', text: '12 yards', points: 5 },
      { id: 'c', text: '9 yards', points: 1 },
      { id: 'd', text: '1.33 yards', points: 0 }
    ]
  },
  {
    id: 'MAT_Z_03', subject: 'Mathematics', profileLevel: 'Z', knowledgeType: 'K3', topic: 'Percentages',
    text: 'A shoe at the market costs ₦10,000. The seller gives you a 20% discount. How much do you pay?',
    options: [
      { id: 'a', text: '₦2,000', points: 1 }, // Found the discount, didn't subtract
      { id: 'b', text: '₦12,000', points: 0 }, // Added it
      { id: 'c', text: '₦8,000', points: 5 },
      { id: 'd', text: '₦9,980', points: 0 }
    ]
  },
  {
    id: 'MAT_Z_04', subject: 'Mathematics', profileLevel: 'Z', knowledgeType: 'K4', topic: 'Estimation',
    text: 'You have ₦500. You want to buy Gala (₦120), LaCasera (₦150), and groundnut (₦100). Do you have enough money?',
    options: [
      { id: 'a', text: 'No, I need exactly ₦500 more.', points: 0 },
      { id: 'b', text: 'Yes, and I will have exactly ₦130 change left.', points: 5 }, // 120+150+100 = 370. 500-370=130
      { id: 'c', text: 'Yes, but I will have no change left.', points: 1 },
      { id: 'd', text: 'No, the total is ₦520.', points: 0 }
    ]
  },

  // --- LEVEL F: FRAGMENTED (Mixed / Rote recall with gaps) ---
  {
    id: 'MAT_F_01', subject: 'Mathematics', profileLevel: 'F', knowledgeType: 'K1', topic: 'Order of Operations (BODMAS)',
    text: 'Calculate: 5 + 3 × 2',
    options: [
      { id: 'a', text: '16', points: 1 }, // Left to right error (5+3=8, 8x2=16)
      { id: 'b', text: '11', points: 5 }, // BODMAS (3x2=6, 5+6=11)
      { id: 'c', text: '10', points: 0 },
      { id: 'd', text: '30', points: 0 }
    ]
  },
  {
    id: 'MAT_F_02', subject: 'Mathematics', profileLevel: 'F', knowledgeType: 'K2', topic: 'Adding Fractions',
    text: 'What is 1/2 + 1/3 ?',
    options: [
      { id: 'a', text: '2/5', points: 1 }, // Common misconception: adding numerators and denominators
      { id: 'b', text: '5/6', points: 5 },
      { id: 'c', text: '2/6', points: 0 },
      { id: 'd', text: '1/5', points: 0 }
    ]
  },
  {
    id: 'MAT_F_03', subject: 'Mathematics', profileLevel: 'F', knowledgeType: 'K3', topic: 'Negative Numbers',
    text: 'Calculate: -4 - (-6)',
    options: [
      { id: 'a', text: '-10', points: 1 },
      { id: 'b', text: '-2', points: 0 },
      { id: 'c', text: '2', points: 5 }, // -4 + 6 = 2
      { id: 'd', text: '24', points: 0 }
    ]
  },
  {
    id: 'MAT_F_04', subject: 'Mathematics', profileLevel: 'F', knowledgeType: 'K4', topic: 'Basic Algebra',
    text: 'If 2x + 5 = 11, what is x?',
    options: [
      { id: 'a', text: '8', points: 0 },
      { id: 'b', text: '3', points: 5 },
      { id: 'c', text: '6', points: 1 },
      { id: 'd', text: '16', points: 0 }
    ]
  },

  // --- LEVEL P: PROCEDURAL (Formulaic / Abstract calculations) ---
  {
    id: 'MAT_P_01', subject: 'Mathematics', profileLevel: 'P', knowledgeType: 'K1', topic: 'Quadratic Equations',
    text: 'Solve for x: x² - 5x + 6 = 0',
    options: [
      { id: 'a', text: 'x = -2 or x = -3', points: 1 }, // Sign error
      { id: 'b', text: 'x = 2 or x = 3', points: 5 },
      { id: 'c', text: 'x = -1 or x = 6', points: 0 },
      { id: 'd', text: 'x = 1 or x = -6', points: 0 }
    ]
  },
  {
    id: 'MAT_P_02', subject: 'Mathematics', profileLevel: 'P', knowledgeType: 'K2', topic: 'Indices/Exponents',
    text: 'Simplify: (x³)(x²)',
    textLength: 'short',
    options: [
      { id: 'a', text: 'x^6', points: 1 }, // Multiplied powers instead of adding
      { id: 'b', text: 'x^5', points: 5 },
      { id: 'c', text: 'x^1', points: 0 },
      { id: 'd', text: '2x^5', points: 0 }
    ]
  },
  {
    id: 'MAT_P_03', subject: 'Mathematics', profileLevel: 'P', knowledgeType: 'K3', topic: 'Trigonometry',
    text: 'In a right-angled triangle, if the side opposite angle θ is 3 and the adjacent side is 4, what is tan(θ)?',
    options: [
      { id: 'a', text: '3/5', points: 0 }, // Sine
      { id: 'b', text: '4/5', points: 0 }, // Cosine
      { id: 'c', text: '4/3', points: 1 }, // Cotangent
      { id: 'd', text: '3/4', points: 5 } // Tangent = Opp/Adj
    ]
  },
  {
    id: 'MAT_P_04', subject: 'Mathematics', profileLevel: 'P', knowledgeType: 'K4', topic: 'Logarithms',
    text: 'Evaluate: log₁₀(100)',
    textLength: 'short',
    options: [
      { id: 'a', text: '10', points: 1 },
      { id: 'b', text: '2', points: 5 }, // 10^2 = 100
      { id: 'c', text: '1000', points: 0 },
      { id: 'd', text: '0.1', points: 0 }
    ]
  },

  // --- LEVEL C: CONCEPTUAL (Deep understanding / Transfer) ---
  {
    id: 'MAT_C_01', subject: 'Mathematics', profileLevel: 'C', knowledgeType: 'K1', topic: 'Functions',
    text: 'What does finding the roots (or zeros) of a function f(x) actually mean graphically?',
    options: [
      { id: 'a', text: 'Finding where the graph crosses the y-axis.', points: 1 },
      { id: 'b', text: 'Finding the lowest point of the graph.', points: 0 },
      { id: 'c', text: 'Finding the exact x-values where the graph crosses the x-axis (where y = 0).', points: 5 },
      { id: 'd', text: 'Finding the steepness of the curve.', points: 0 }
    ]
  },
  {
    id: 'MAT_C_02', subject: 'Mathematics', profileLevel: 'C', knowledgeType: 'K2', topic: 'Calculus (Derivative)',
    text: 'If the position of a moving car is represented by the function P(t), what does the derivative P\'(t) represent?',
    options: [
      { id: 'a', text: 'The total distance the car has traveled.', points: 0 },
      { id: 'b', text: 'The velocity (speed and direction) of the car at any given time.', points: 5 },
      { id: 'c', text: 'The acceleration of the car.', points: 1 },
      { id: 'd', text: 'The starting position of the car.', points: 0 }
    ]
  },
  {
    id: 'MAT_C_03', subject: 'Mathematics', profileLevel: 'C', knowledgeType: 'K3', topic: 'Probability',
    text: 'If you flip a fair coin 5 times and it lands on Heads every single time, what is the probability it lands on Heads on the 6th flip?',
    options: [
      { id: 'a', text: 'Almost impossible, since Tails is "due".', points: 1 }, // Gambler's Fallacy
      { id: 'b', text: '100%, because it\'s on a streak.', points: 0 },
      { id: 'c', text: 'Exactly 50% (1/2), because each flip is an independent event.', points: 5 },
      { id: 'd', text: '1/6', points: 0 }
    ]
  },
  {
    id: 'MAT_C_04', subject: 'Mathematics', profileLevel: 'C', knowledgeType: 'K4', topic: 'Inequalities',
    text: 'When solving the inequality -2x < 6, why do we flip the inequality sign to get x > -3?',
    options: [
      { id: 'a', text: 'Because you always flip the sign in algebra.', points: 0 },
      { id: 'b', text: 'Because dividing or multiplying by a negative number reverses the order on the number line.', points: 5 },
      { id: 'c', text: 'Because a negative answer requires a "greater than" sign.', points: 1 },
      { id: 'd', text: 'You do not flip the sign; the answer is x < -3.', points: 0 }
    ]
  }
];
