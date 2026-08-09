// Required skills map by dream job role
const ROLE_SKILLS = {
  'Software Engineer': [
    { name: 'Data Structures & Algorithms', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'System Design', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'JavaScript', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'Python', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'SQL', category: 'Database', importance: 'High', level: 'Intermediate' },
    { name: 'Git & Version Control', category: 'Programming', importance: 'High', level: 'Beginner' },
    { name: 'REST APIs', category: 'Programming', importance: 'Medium', level: 'Intermediate' },
    { name: 'Linux/Unix', category: 'Programming', importance: 'Medium', level: 'Beginner' },
    { name: 'Cloud Basics', category: 'Cloud', importance: 'Medium', level: 'Beginner' },
    { name: 'Communication', category: 'Soft Skills', importance: 'Medium', level: 'Intermediate' },
  ],
  'Data Analyst': [
    { name: 'Python', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'SQL', category: 'Database', importance: 'High', level: 'Advanced' },
    { name: 'Excel', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Power BI', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Data Visualization', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Statistics', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Pandas', category: 'Programming', importance: 'Medium', level: 'Intermediate' },
    { name: 'Tableau', category: 'Analytics', importance: 'Medium', level: 'Beginner' },
    { name: 'Business Intelligence', category: 'Analytics', importance: 'Medium', level: 'Beginner' },
    { name: 'Communication', category: 'Soft Skills', importance: 'Medium', level: 'Intermediate' },
  ],
  'Data Scientist': [
    { name: 'Python', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Machine Learning', category: 'AI', importance: 'High', level: 'Advanced' },
    { name: 'Deep Learning', category: 'AI', importance: 'High', level: 'Intermediate' },
    { name: 'Statistics', category: 'Analytics', importance: 'High', level: 'Advanced' },
    { name: 'SQL', category: 'Database', importance: 'High', level: 'Intermediate' },
    { name: 'TensorFlow/PyTorch', category: 'AI', importance: 'High', level: 'Intermediate' },
    { name: 'Feature Engineering', category: 'AI', importance: 'Medium', level: 'Intermediate' },
    { name: 'Data Visualization', category: 'Analytics', importance: 'Medium', level: 'Intermediate' },
    { name: 'Cloud ML', category: 'Cloud', importance: 'Medium', level: 'Beginner' },
    { name: 'Research & Problem Solving', category: 'Soft Skills', importance: 'High', level: 'Advanced' },
  ],
  'Business Analyst': [
    { name: 'Business Process Modeling', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'SQL', category: 'Database', importance: 'High', level: 'Intermediate' },
    { name: 'Excel', category: 'Analytics', importance: 'High', level: 'Advanced' },
    { name: 'Requirements Gathering', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Power BI', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'JIRA', category: 'Analytics', importance: 'Medium', level: 'Beginner' },
    { name: 'Stakeholder Management', category: 'Soft Skills', importance: 'High', level: 'Intermediate' },
    { name: 'Agile/Scrum', category: 'Programming', importance: 'Medium', level: 'Beginner' },
    { name: 'Data Visualization', category: 'Analytics', importance: 'Medium', level: 'Intermediate' },
    { name: 'Communication', category: 'Soft Skills', importance: 'High', level: 'Advanced' },
  ],
  'Cloud Engineer': [
    { name: 'AWS', category: 'Cloud', importance: 'High', level: 'Advanced' },
    { name: 'Azure', category: 'Cloud', importance: 'High', level: 'Intermediate' },
    { name: 'Linux/Unix', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Docker', category: 'Cloud', importance: 'High', level: 'Intermediate' },
    { name: 'Kubernetes', category: 'Cloud', importance: 'High', level: 'Intermediate' },
    { name: 'Terraform', category: 'Cloud', importance: 'Medium', level: 'Intermediate' },
    { name: 'Python/Bash Scripting', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'Networking Fundamentals', category: 'Cloud', importance: 'High', level: 'Intermediate' },
    { name: 'CI/CD Pipelines', category: 'Cloud', importance: 'Medium', level: 'Intermediate' },
    { name: 'Security Best Practices', category: 'Cloud', importance: 'Medium', level: 'Intermediate' },
  ],
  'DevOps Engineer': [
    { name: 'Docker', category: 'Cloud', importance: 'High', level: 'Advanced' },
    { name: 'Kubernetes', category: 'Cloud', importance: 'High', level: 'Advanced' },
    { name: 'CI/CD Pipelines', category: 'Cloud', importance: 'High', level: 'Advanced' },
    { name: 'Linux/Unix', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Terraform', category: 'Cloud', importance: 'High', level: 'Intermediate' },
    { name: 'AWS/GCP/Azure', category: 'Cloud', importance: 'High', level: 'Intermediate' },
    { name: 'Python/Bash', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'Monitoring & Logging', category: 'Cloud', importance: 'Medium', level: 'Intermediate' },
    { name: 'Git & Version Control', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Problem Solving', category: 'Soft Skills', importance: 'Medium', level: 'Advanced' },
  ],
  'AI/ML Engineer': [
    { name: 'Python', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Machine Learning', category: 'AI', importance: 'High', level: 'Advanced' },
    { name: 'Deep Learning', category: 'AI', importance: 'High', level: 'Advanced' },
    { name: 'TensorFlow/PyTorch', category: 'AI', importance: 'High', level: 'Advanced' },
    { name: 'NLP', category: 'AI', importance: 'High', level: 'Intermediate' },
    { name: 'MLOps', category: 'AI', importance: 'High', level: 'Intermediate' },
    { name: 'Statistics & Math', category: 'Analytics', importance: 'High', level: 'Advanced' },
    { name: 'Cloud ML Platforms', category: 'Cloud', importance: 'Medium', level: 'Intermediate' },
    { name: 'SQL', category: 'Database', importance: 'Medium', level: 'Intermediate' },
    { name: 'Research Skills', category: 'Soft Skills', importance: 'High', level: 'Advanced' },
  ],
  'Cybersecurity Analyst': [
    { name: 'Network Security', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Linux/Unix', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Python/Scripting', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'SIEM Tools', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Penetration Testing', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'Cryptography', category: 'Programming', importance: 'Medium', level: 'Intermediate' },
    { name: 'Incident Response', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Compliance & Regulations', category: 'Analytics', importance: 'Medium', level: 'Beginner' },
    { name: 'Cloud Security', category: 'Cloud', importance: 'Medium', level: 'Intermediate' },
    { name: 'Problem Solving', category: 'Soft Skills', importance: 'Medium', level: 'Advanced' },
  ],
  'Full Stack Developer': [
    { name: 'JavaScript', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'React.js', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Node.js', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'SQL', category: 'Database', importance: 'High', level: 'Intermediate' },
    { name: 'MongoDB', category: 'Database', importance: 'High', level: 'Intermediate' },
    { name: 'REST APIs', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Git & Version Control', category: 'Programming', importance: 'High', level: 'Intermediate' },
    { name: 'CSS & HTML', category: 'Programming', importance: 'High', level: 'Advanced' },
    { name: 'Cloud Basics', category: 'Cloud', importance: 'Medium', level: 'Beginner' },
    { name: 'System Design', category: 'Programming', importance: 'Medium', level: 'Intermediate' },
  ],
  'Product Manager': [
    { name: 'Product Strategy', category: 'Analytics', importance: 'High', level: 'Advanced' },
    { name: 'Stakeholder Management', category: 'Soft Skills', importance: 'High', level: 'Advanced' },
    { name: 'Agile/Scrum', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Data Analysis', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'JIRA', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'SQL', category: 'Database', importance: 'Medium', level: 'Beginner' },
    { name: 'User Research & UX', category: 'Analytics', importance: 'High', level: 'Intermediate' },
    { name: 'Roadmap Planning', category: 'Analytics', importance: 'High', level: 'Advanced' },
    { name: 'Communication', category: 'Soft Skills', importance: 'High', level: 'Advanced' },
    { name: 'Market Analysis', category: 'Analytics', importance: 'Medium', level: 'Intermediate' },
  ],
};

const getSkillGap = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const dreamJob = user.dreamJob || 'Software Engineer';
    const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());

    // Fetch required skills for this role
    const requiredSkills = ROLE_SKILLS[dreamJob] || ROLE_SKILLS['Software Engineer'];

    // Match user skills against required skills (case-insensitive partial match)
    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(reqSkill => {
      const reqName = reqSkill.name.toLowerCase();
      const isMatched = userSkills.some(us =>
        us.includes(reqName) || reqName.includes(us) || us.split(' ').some(w => reqName.includes(w) && w.length > 3)
      );
      if (isMatched) {
        matchedSkills.push(reqSkill.name);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

    return res.status(200).json({
      success: true,
      data: {
        dreamJob,
        dreamCompany: user.dreamCompany || '',
        userSkills: user.skills || [],
        requiredSkills,
        matchedSkills,
        missingSkills,
        matchPercentage,
        totalRequired: requiredSkills.length,
        totalMatched: matchedSkills.length,
        totalMissing: missingSkills.length,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkillGap };
