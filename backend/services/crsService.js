exports.computeCRS = (userProfile) => {
  // CRS = (0.40×S) + (0.10×A) + (0.25×P) + (0.15×C) + (0.10×R)
  // S = Skills, A = Academic, P = Projects, C = Certifications, R = Resume
  const skillsScore = userProfile.skills ? userProfile.skills.length * 10 : 0;
  const academicScore = userProfile.cgpa ? userProfile.cgpa * 10 : 0;
  const projectsScore = userProfile.projects ? userProfile.projects.length * 20 : 0;
  const certScore = userProfile.certifications ? userProfile.certifications.length * 15 : 0;
  const resumeScore = userProfile.resumeUrl ? 100 : 0;

  const overall = (0.40 * skillsScore) + (0.10 * academicScore) + (0.25 * projectsScore) + (0.15 * certScore) + (0.10 * resumeScore);
  
  return {
    overall: overall > 100 ? 100 : overall,
    breakdown: {
      skills: skillsScore,
      academic: academicScore,
      projects: projectsScore,
      certifications: certScore,
      resume: resumeScore
    }
  };
};
