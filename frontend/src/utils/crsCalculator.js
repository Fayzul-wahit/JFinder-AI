/**
 * Calculates Career Readiness Score
 * W1 (0.40): Skills (S)
 * W2 (0.10): Academic/CGPA (A)
 * W3 (0.25): Projects (P)
 * W4 (0.15): Certifications (C)
 * W5 (0.10): Resume Score (R)
 */
export const calculateCRS = (profile = {}) => {
  const { skills = [], cgpa = 0, projects = [], certifications = [], resumeUrl = '' } = profile;
  
  // Mock calculations
  const S = Math.min(skills.length * 10, 100);
  const A = (cgpa / 10) * 100;
  const P = Math.min(projects.length * 20, 100);
  const C = Math.min(certifications.length * 25, 100);
  const R = resumeUrl ? 80 : 0;

  const W1 = 0.40, W2 = 0.10, W3 = 0.25, W4 = 0.15, W5 = 0.10;

  const overall = (W1 * S) + (W2 * A) + (W3 * P) + (W4 * C) + (W5 * R);

  return {
    overall: Math.round(overall),
    breakdown: {
      skills: S,
      academic: A,
      projects: P,
      certifications: C,
      resume: R
    }
  };
};
