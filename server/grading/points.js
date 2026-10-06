// Turns a graded run into XP. Grade and stars are worth points; harder difficulty multiplies them.
export const GRADE_POINTS = { S: 500, A: 400, B: 300, C: 200, D: 100, F: 0 };
export const STAR_POINTS = 100;
export const DIFFICULTY_MULTIPLIER = { easy: 1, normal: 1.5, hard: 2 };

export function pointsFor({ grade, stars, difficulty }) {
  const gradePts = GRADE_POINTS[grade] ?? 0;
  const starPts = stars * STAR_POINTS;
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;
  return {
    grade: gradePts,
    stars: starPts,
    multiplier,
    total: Math.round((gradePts + starPts) * multiplier),
  };
}
