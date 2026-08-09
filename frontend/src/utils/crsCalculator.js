/**
 * Career Readiness Score (CRS) Calculator
 * Single source of truth — import this everywhere.
 *
 * Formula: CRS = (W1 × S) + (W2 × A) + (W3 × P) + (W4 × C) + (W5 × R)
 *   W1 = 0.40  →  Skills Score (S)
 *   W2 = 0.10  →  Academic / CGPA Score (A)
 *   W3 = 0.25  →  Projects Score (P)
 *   W4 = 0.15  →  Certifications Score (C)
 *   W5 = 0.10  →  Resume Score (R)
 *
 * @param {Object} profile - User profile object from MongoDB / localStorage
 * @returns {{ overall: number, breakdown: { skills, academic, projects, certifications, resume } }}
 */
export const calculateCRS = (profile = {}) => {
  const {
    skills = [],
    cgpa = 0,
    projects = [],
    certifications = [],
    resumeUrl = ''
  } = profile;

  // Component scores (each 0–100)
  const S = Math.min(skills.length * 10, 100);           // 10pts per skill, cap 100
  const A = cgpa > 0 ? Math.min((cgpa / 10) * 100, 100) : 0; // CGPA out of 10
  const P = Math.min(projects.length * 20, 100);         // 20pts per project, cap 100
  const C = Math.min(certifications.length * 25, 100);   // 25pts per cert, cap 100
  const R = resumeUrl ? 80 : 0;                          // 80 if resume uploaded

  const W1 = 0.40, W2 = 0.10, W3 = 0.25, W4 = 0.15, W5 = 0.10;

  const overall = (W1 * S) + (W2 * A) + (W3 * P) + (W4 * C) + (W5 * R);

  return {
    overall: Math.round(overall),
    breakdown: {
      skills: Math.round(S),
      academic: Math.round(A),
      projects: Math.round(P),
      certifications: Math.round(C),
      resume: Math.round(R)
    }
  };
};
