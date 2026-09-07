import { Question } from '../types';

export const physicsQuestions: Question[] = [
  // --- LEVEL Z: ZERO FOUNDATION (Contextual / Everyday) ---
  {
    id: 'PHY_Z_01', subject: 'Physics', profileLevel: 'Z', knowledgeType: 'K1', topic: 'Gravity & Falling Objects', cognitiveSkills: ["Reading Comprehension","Spatial Reasoning"], difficulty: 3,
    text: 'You drop a heavy yam and a light pebble from the same height at the exact same time. What happens?',
    options: [
      { id: 'a', text: 'The heavy yam hits the ground first because it has more weight.', points: 0 },
      { id: 'b', text: 'The light pebble hits the ground first because it faces less air resistance.', points: 1 },
      { id: 'c', text: 'They both hit the ground at the exact same time.', points: 5 },
      { id: 'd', text: 'The yam falls faster at first, then the pebble catches up.', points: 0 }
    ],
    explanation: 'Galileo proved that gravity accelerates all objects at the exact same rate (9.8 m/s²), regardless of their mass. Air resistance can slow lighter, flatter objects down (like a feather), but for dense objects like a yam and a pebble, the effect of air is negligible. Thus, they hit the ground simultaneously.'
  },
  {
    id: 'PHY_Z_02', subject: 'Physics', profileLevel: 'Z', knowledgeType: 'K2', topic: 'Force & Motion', cognitiveSkills: ["Spatial Reasoning","Conceptual Application"], difficulty: 3,
    text: 'A boy kicks a football high into the air. While the ball is flying in the air (and ignoring wind), what forces are pushing it FORWARD?',
    options: [
      { id: 'a', text: 'The force of the kick stays with the ball and keeps pushing it.', points: 0 },
      { id: 'b', text: 'There is no forward force pushing it; it moves forward because of inertia (its starting motion).', points: 5 },
      { id: 'c', text: 'Gravity pushes it forward in an arc.', points: 0 },
      { id: 'd', text: 'The air pushes it forward from behind.', points: 1 }
    ],
    explanation: 'This tests a classic misconception known as "impetus theory". Once the ball leaves the foot, the kick is over; there is no longer any forward force acting on it. It continues to move forward purely because of inertia (Newton\'s First Law). The only force acting on it in flight is gravity pulling it downward.'
  },
  {
    id: 'PHY_Z_03', subject: 'Physics', profileLevel: 'Z', knowledgeType: 'K3', topic: 'Heat Transfer', cognitiveSkills: ["Logical Deduction"], difficulty: 3,
    text: 'You are stirring a hot pot of egusi soup. Why does a metal spoon feel hotter in your hand than a wooden spoon?',
    options: [
      { id: 'a', text: 'Metal creates its own heat when it touches the hot soup.', points: 0 },
      { id: 'b', text: 'Metal absorbs heat, but wood blocks heat completely.', points: 1 },
      { id: 'c', text: 'Metal allows heat to travel through it quickly to your hand; wood does not.', points: 5 },
      { id: 'd', text: 'The metal spoon is heavier, so it attracts more heat.', points: 0 }
    ]
  },
  {
    id: 'PHY_Z_04', subject: 'Physics', profileLevel: 'Z', knowledgeType: 'K4', topic: 'Energy Conservation', cognitiveSkills: ["Formula Dependency","Logical Deduction"], difficulty: 3,
    text: 'A generator at the market is running, powering a fridge. What is the main energy change happening?',
    options: [
      { id: 'a', text: 'It creates electrical energy from nothing.', points: 0 },
      { id: 'b', text: 'It changes chemical energy in fuel into electrical energy, losing some as heat and sound.', points: 5 },
      { id: 'c', text: 'It uses up all the fuel and destroys the energy to make cold air.', points: 1 },
      { id: 'd', text: 'It turns sound energy into electrical energy.', points: 0 }
    ]
  },

  // --- LEVEL F: FRAGMENTED (Mixed / Rote recall with gaps) ---
  {
    id: 'PHY_F_01', subject: 'Physics', profileLevel: 'F', knowledgeType: 'K1', topic: 'Newton\'s Third Law',
    text: 'A fast-moving Danfo bus collides with a small stationary bicycle. During the crash, which experiences a greater impact force?',
    options: [
      { id: 'a', text: 'The Danfo bus exerts a much larger force on the bicycle.', points: 0 }, // Common misconception
      { id: 'b', text: 'The bicycle exerts a larger force on the Danfo bus.', points: 0 },
      { id: 'c', text: 'They both exert the exact same amount of force on each other.', points: 5 }, // FCI backed
      { id: 'd', text: 'The Danfo bus absorbs all the force since it is heavier.', points: 1 }
    ],
    explanation: 'According to Newton\'s Third Law, every action has an equal and opposite reaction. The force the bus exerts on the bicycle is exactly equal in magnitude to the force the bicycle exerts on the bus. The reason the bicycle is destroyed while the bus is barely dented is because the bicycle has much less mass, so the same force causes a much greater acceleration (damage) on it (F = ma).'
  },
  {
    id: 'PHY_F_02', subject: 'Physics', profileLevel: 'F', knowledgeType: 'K2', topic: 'Electricity', cognitiveSkills: ["Spatial Reasoning","Reading Comprehension"], difficulty: 2,
    text: 'In a basic circuit with a battery and a light bulb, what happens to the electric current after it passes through the bulb?',
    options: [
      { id: 'a', text: 'The current is used up by the bulb to make light.', points: 0 },
      { id: 'b', text: 'The current is slightly less because the bulb consumed some of it.', points: 1 },
      { id: 'c', text: 'The current remains exactly the same; it is not used up, only the energy is transferred.', points: 5 },
      { id: 'd', text: 'The current turns into heat and leaves the wire.', points: 0 }
    ],
    explanation: 'Electric current is the flow of electrons, and electrons are never "used up" or destroyed in a circuit; they simply flow through it like water through a pipe. What gets used up is the electrical potential energy, which the bulb converts into light and heat energy.'
  },
  {
    id: 'PHY_F_03', subject: 'Physics', profileLevel: 'F', knowledgeType: 'K3', topic: 'Waves & Sound', cognitiveSkills: ["Spatial Reasoning","Conceptual Application"], difficulty: 1,
    text: 'When a radio is turned up louder, what physical property of the sound wave changes?',
    options: [
      { id: 'a', text: 'The frequency of the wave increases.', points: 0 },
      { id: 'b', text: 'The speed of the sound wave increases.', points: 1 },
      { id: 'c', text: 'The amplitude (height) of the wave increases.', points: 5 },
      { id: 'd', text: 'The wavelength of the wave becomes shorter.', points: 0 }
    ]
  },
  {
    id: 'PHY_F_04', subject: 'Physics', profileLevel: 'F', knowledgeType: 'K4', topic: 'Density & Buoyancy', cognitiveSkills: ["Formula Dependency","Reading Comprehension"], difficulty: 1,
    text: 'A heavy steel ship floats on water, but a small steel nail sinks. Why?',
    options: [
      { id: 'a', text: 'The ship has a heavy engine that pushes it up.', points: 0 },
      { id: 'b', text: 'The ship is shaped to contain a lot of air, making its overall average density less than water.', points: 5 },
      { id: 'c', text: 'Water surface tension is stronger on larger objects.', points: 1 },
      { id: 'd', text: 'The ocean has salt which lifts heavy things, unlike tap water.', points: 0 }
    ]
  },

  // --- LEVEL P: PROCEDURAL (Formulaic / Abstract calculations) ---
  {
    id: 'PHY_P_01', subject: 'Physics', profileLevel: 'P', knowledgeType: 'K1', topic: 'Kinematics', cognitiveSkills: ["Spatial Reasoning"], difficulty: 2,
    text: 'A car accelerates from rest at 2 m/s² for 5 seconds. What is its final velocity?',
    options: [
      { id: 'a', text: '7 m/s', points: 0 }, // added instead of multiplied
      { id: 'b', text: '10 m/s', points: 5 }, // v = u + at = 0 + 2(5)
      { id: 'c', text: '25 m/s', points: 1 }, // squared it
      { id: 'd', text: '5 m/s', points: 0 }
    ]
  },
  {
    id: 'PHY_P_02', subject: 'Physics', profileLevel: 'P', knowledgeType: 'K2', topic: 'Work & Energy', cognitiveSkills: ["Conceptual Application","Formula Dependency"], difficulty: 1,
    text: 'Calculate the work done when a force of 50N pushes a box 4 meters across a frictionless floor.',
    isMathHeavy: true,
    options: [
      { id: 'a', text: '12.5 Joules', points: 0 }, // divided
      { id: 'b', text: '200 Joules', points: 5 }, // W = Fd = 50 * 4
      { id: 'c', text: '54 Joules', points: 1 }, // added
      { id: 'd', text: '0 Joules, because there is no friction.', points: 0 } 
    ]
  },
  {
    id: 'PHY_P_03', subject: 'Physics', profileLevel: 'P', knowledgeType: 'K3', topic: 'Ohm\'s Law',
    text: 'A 12V battery is connected to a 4Ω resistor. What is the current flowing through the circuit?',
    isMathHeavy: true,
    options: [
      { id: 'a', text: '48 Amps', points: 0 }, // multiplied
      { id: 'b', text: '3 Amps', points: 5 }, // I = V/R = 12/4
      { id: 'c', text: '8 Amps', points: 1 }, // subtracted
      { id: 'd', text: '0.33 Amps', points: 0 } // inverted
    ]
  },
  {
    id: 'PHY_P_04', subject: 'Physics', profileLevel: 'P', knowledgeType: 'K4', topic: 'Gas Laws', cognitiveSkills: ["Spatial Reasoning","Reading Comprehension"], difficulty: 2,
    text: 'A gas occupies 2.0 L at a pressure of 1.0 atm. If the volume is compressed to 1.0 L at constant temperature, what is the new pressure?',
    isMathHeavy: true,
    options: [
      { id: 'a', text: '0.5 atm', points: 0 }, // directly proportional mistake
      { id: 'b', text: '2.0 atm', points: 5 }, // Boyle\'s law P1V1 = P2V2
      { id: 'c', text: '1.0 atm', points: 1 },
      { id: 'd', text: '4.0 atm', points: 0 }
    ]
  },

  // --- LEVEL C: CONCEPTUAL (Deep understanding / Transfer) ---
  {
    id: 'PHY_C_01', subject: 'Physics', profileLevel: 'C', knowledgeType: 'K1', topic: 'Projectile Motion', cognitiveSkills: ["Graph Illiteracy","Conceptual Application"], difficulty: 2,
    text: 'A bullet is fired perfectly horizontally from a gun, and at the exact same instant, an identical bullet is dropped from the same height. Which hits the flat ground first?',
    options: [
      { id: 'a', text: 'The dropped bullet hits first because it falls straight down.', points: 1 },
      { id: 'b', text: 'The fired bullet hits first because it is traveling much faster.', points: 0 },
      { id: 'c', text: 'They both hit the ground at the exact same time.', points: 5 }, // Independence of x and y motion
      { id: 'd', text: 'It depends on the mass of the bullet.', points: 0 }
    ]
  },
  {
    id: 'PHY_C_02', subject: 'Physics', profileLevel: 'C', knowledgeType: 'K2', topic: 'Circular Motion', cognitiveSkills: ["Spatial Reasoning","Conceptual Application"], difficulty: 3,
    text: 'A stone is tied to a string and swung in a horizontal circle. If the string suddenly snaps, what path will the stone take?',
    options: [
      { id: 'a', text: 'It will fly straight outward, away from the center.', points: 0 }, // Centrifugal misconception
      { id: 'b', text: 'It will continue in a curved path for a short time before straightening out.', points: 1 },
      { id: 'c', text: 'It will fly off in a straight line tangent to the circle at the point it broke.', points: 5 },
      { id: 'd', text: 'It will spiral outward gradually.', points: 0 }
    ]
  },
  {
    id: 'PHY_C_03', subject: 'Physics', profileLevel: 'C', knowledgeType: 'K3', topic: 'Electromagnetic Induction', cognitiveSkills: ["Logical Deduction","Conceptual Application"], difficulty: 1,
    text: 'When a solid copper ring is dropped through a strong magnetic field, it falls slower than if dropped outside the field. Why?',
    options: [
      { id: 'a', text: 'The magnetic field physically pushes on the copper atoms to slow them down.', points: 1 },
      { id: 'b', text: 'The falling ring induces a current, which creates an opposing magnetic field that repels the fall (Lenz\'s Law).', points: 5 },
      { id: 'c', text: 'Copper is naturally magnetic and is attracted to the magnet.', points: 0 },
      { id: 'd', text: 'The air resistance increases significantly inside a magnetic field.', points: 0 }
    ]
  },
  {
    id: 'PHY_C_04', subject: 'Physics', profileLevel: 'C', knowledgeType: 'K4', topic: 'Quantum/Photoelectric', cognitiveSkills: ["Formula Dependency","Graph Illiteracy"], difficulty: 1,
    text: 'In the photoelectric effect, increasing the INTENSITY (brightness) of the incoming light will...',
    options: [
      { id: 'a', text: 'Increase the kinetic energy (speed) of the emitted electrons.', points: 0 }, // Classic wave theory mistake
      { id: 'b', text: 'Increase the number of electrons emitted per second, but not their maximum speed.', points: 5 }, // Particle theory
      { id: 'c', text: 'Decrease the threshold frequency required.', points: 1 },
      { id: 'd', text: 'Have absolutely no effect on the electrons.', points: 0 }
    ]
  }
];
