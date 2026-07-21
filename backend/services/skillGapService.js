exports.analyzeSkillGap = (userSkills, requiredSkills) => {
  const matched = userSkills.filter(skill => requiredSkills.includes(skill));
  const missing = requiredSkills.filter(skill => !userSkills.includes(skill));
  const matchPercentage = requiredSkills.length > 0 ? (matched.length / requiredSkills.length) * 100 : 100;
  
  return {
    matched,
    missing,
    matchPercentage
  };
};
