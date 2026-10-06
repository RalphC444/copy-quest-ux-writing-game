export const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', seconds: 240, bpm: 112, blurb: '4:00 per screen. Forgiving grader.', strict: 1, mult: 1 },
  { id: 'normal', name: 'Normal', seconds: 150, bpm: 132, blurb: '2:30 per screen. Standard grader.', strict: 2, mult: 1.5 },
  { id: 'hard', name: 'Hard', seconds: 75, bpm: 156, blurb: '1:15 per screen. Strict grader, bigger time bonus.', strict: 3, mult: 2 },
];

export const getDifficulty = (id) => DIFFICULTIES.find((d) => d.id === id) || DIFFICULTIES[1];

export const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const r = Math.max(0, Math.ceil(s % 60));
  return r === 60 ? `${m + 1}:00` : `${m}:${String(r).padStart(2, '0')}`;
};
