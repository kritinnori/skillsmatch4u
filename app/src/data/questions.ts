export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number; // index of the correct answer
}

export const questions = [
  { id: 1, question: "I enjoy figuring out how things work." },
  { id: 2, question: "I like working with numbers, data, or logical problems." },
  { id: 3, question: "I enjoy creative activities like writing, art, music, or design." },
  { id: 4, question: "I like helping people solve personal or emotional problems." },
  { id: 5, question: "I enjoy leading group activities or influencing others." },
  { id: 6, question: "I like organizing information, schedules, or systems." },
  { id: 7, question: "I enjoy building, fixing, or working with physical objects." },
  { id: 8, question: "I like researching topics deeply before forming opinions." },
  { id: 9, question: "I enjoy presenting ideas or speaking in front of others." },
  { id: 10, question: "I prefer structured tasks over open-ended creative ones." },

  { id: 11, question: "I learn new technologies or tools quickly." },
  { id: 12, question: "I am good at explaining complex ideas in simple ways." },
  { id: 13, question: "I can stay focused on difficult tasks for long periods of time." },
  { id: 14, question: "I usually notice patterns or trends that others miss." },
  { id: 15, question: "I am good at planning ahead rather than improvising." },
  { id: 16, question: "I feel confident solving unfamiliar problems." },
  { id: 17, question: "People often rely on me when something needs to be done correctly." },
  { id: 18, question: "I adapt quickly when situations change." },
  { id: 19, question: "I tend to think carefully before making decisions." },
  { id: 20, question: "I often come up with original solutions to problems." },

  { id: 21, question: "I prefer working independently rather than in groups." },
  { id: 22, question: "I feel energized after interacting with many people." },
  { id: 23, question: "I like having clear instructions rather than vague goals." },
  { id: 24, question: "I am comfortable taking risks if the reward is meaningful." },
  { id: 25, question: "I get stressed when things are unorganized." },
  { id: 26, question: "I prefer stability over frequent change." },
  { id: 27, question: "I enjoy competing with others to be the best." },
  { id: 28, question: "I value work that feels meaningful more than high salary alone." },
  { id: 29, question: "I stay calm even when deadlines are tight." },
  { id: 30, question: "I like having freedom to choose how I complete tasks." }
];
