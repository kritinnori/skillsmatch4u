export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number; // index of the correct answer
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Is this your first time taking a career/personality test?",
    options: ["Yes", "No"],
    correct_answer: 0,
  },
  {
    id: 2,
    question: "What motivates you most in your work?",
    options: ["Creative expression", "Helping others", "Solving complex problems", "Leading teams"],
    correct_answer: 1,
  },
  {
    id: 3,
    question: "How do you prefer to work?",
    options: ["Independently", "In small teams", "In large groups", "It depends on the project"],
    correct_answer: 2,
  },
  {
    id: 4,
    question: "What type of work environment do you thrive in?",
    options: ["Fast-paced and dynamic", "Structured and organized", "Flexible and adaptable", "Quiet and focused"],
    correct_answer: 0,
  },
  {
    id: 5,
    question: "What is most important to you in a career?",
    options: ["Work-life balance", "High earning potential", "Making an impact", "Continuous learning"],
    correct_answer: 2,
  },
];
