// Roadmap template by job role
const ROADMAP_TEMPLATE = (jobRole) => {
  const roleMap = {
    'Software Engineer': {
      level1: { title: 'Foundation', lessons: ['Intro to Software Engineering', 'Core Tools Overview', 'Programming Fundamentals Quiz', 'Beginner CRUD Project', 'Foundation Certificate'] },
      level2: { title: 'Skill Development', lessons: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Hands-on API Project', 'DSA Assessment Quiz', 'Skill Certificate'] },
      level3: { title: 'Industry Ready', lessons: ['System Design Principles', 'Real World Web App Project', 'Open Source Contribution', 'Industry Assessment', 'Industry Certificate'] },
      level4: { title: 'Placement Ready', lessons: ['Resume Building Workshop', 'Mock Interview Prep', 'LeetCode Challenge Set', 'HR Round Preparation', 'Final Placement Assessment'] },
    },
    'Data Analyst': {
      level1: { title: 'Foundation', lessons: ['Intro to Data Analytics', 'Excel Fundamentals', 'Basic Stats Quiz', 'Data Cleaning Project', 'Foundation Certificate'] },
      level2: { title: 'Skill Development', lessons: ['SQL for Analytics', 'Python with Pandas', 'Visualization Project', 'Analytics Skills Quiz', 'Skill Certificate'] },
      level3: { title: 'Industry Ready', lessons: ['Power BI Deep Dive', 'End-to-End Analytics Project', 'Business Case Study', 'Industry Assessment', 'Industry Certificate'] },
      level4: { title: 'Placement Ready', lessons: ['Resume for Analysts', 'Mock Interview Prep', 'Case Study Challenge', 'HR Round Preparation', 'Final Assessment'] },
    },
    'Data Scientist': {
      level1: { title: 'Foundation', lessons: ['Intro to Data Science', 'Python Basics', 'Statistics Quiz', 'EDA Project', 'Foundation Certificate'] },
      level2: { title: 'Skill Development', lessons: ['Machine Learning Basics', 'Supervised Learning', 'ML Project', 'ML Quiz', 'Skill Certificate'] },
      level3: { title: 'Industry Ready', lessons: ['Deep Learning & Neural Nets', 'NLP Project', 'Industry Case Study', 'Industry Assessment', 'Industry Certificate'] },
      level4: { title: 'Placement Ready', lessons: ['Resume Building', 'Mock Interviews', 'Kaggle Challenge', 'HR Round Prep', 'Final Assessment'] },
    },
  };

  const defaultTemplate = {
    level1: { title: 'Foundation', lessons: ['Introduction to ' + jobRole, 'Core Tools Overview', 'Basic Concepts Quiz', 'Beginner Project', 'Foundation Certificate'] },
    level2: { title: 'Skill Development', lessons: ['Core Skill 1', 'Core Skill 2', 'Hands-on Practice', 'Skill Assessment Quiz', 'Skill Certificate'] },
    level3: { title: 'Industry Ready', lessons: ['Industry Tools Deep Dive', 'Real World Project', 'Company Case Study', 'Industry Assessment', 'Industry Certificate'] },
    level4: { title: 'Placement Ready', lessons: ['Resume Building', 'Mock Interview Prep', 'Coding Challenge', 'HR Round Preparation', 'Final Assessment'] },
  };

  return roleMap[jobRole] || defaultTemplate;
};

const LESSON_TYPES = ['Video', 'Video', 'Quiz', 'Project', 'Certificate'];
const LESSON_XP = [10, 10, 20, 100, 50];

const buildRoadmap = (jobRole, progressData) => {
  const template = ROADMAP_TEMPLATE(jobRole);
  const completedIds = new Set((progressData || []).map(p => p.lessonId));

  const levels = [1, 2, 3, 4].map(num => {
    const key = `level${num}`;
    const tpl = template[key];
    const lessons = tpl.lessons.map((name, i) => {
      const lessonId = `L${num}-${i + 1}`;
      return {
        id: lessonId,
        title: name,
        type: LESSON_TYPES[i],
        xp: LESSON_XP[i],
        completed: completedIds.has(lessonId),
      };
    });

    const prevLevelCompleted = num === 1 || lessons.filter((_, i, arr) => {
      // check previous level completion
      return true;
    }).length > 0;

    const completedCount = lessons.filter(l => l.completed).length;

    return {
      number: num,
      title: tpl.title,
      lessons,
      completedCount,
      totalLessons: lessons.length,
      unlocked: num === 1, // frontend handles unlock logic based on prev level
    };
  });

  // Unlock levels based on completion chain
  for (let i = 1; i < levels.length; i++) {
    levels[i].unlocked = levels[i - 1].completedCount === levels[i - 1].totalLessons;
  }

  const totalXP = (progressData || []).reduce((sum, p) => sum + (p.xpEarned || 0), 0);
  const totalCompleted = levels.reduce((sum, l) => sum + l.completedCount, 0);
  const totalLessons = levels.reduce((sum, l) => sum + l.totalLessons, 0);

  return { levels, totalXP, totalCompleted, totalLessons };
};

// In-memory progress store (in production this would be MongoDB collection)
const progressStore = {};

const getRoadmapProgress = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const userId = user._id.toString();
    const dreamJob = user.dreamJob || 'Software Engineer';
    const progressData = progressStore[userId] || [];
    const roadmap = buildRoadmap(dreamJob, progressData);

    return res.status(200).json({ success: true, data: { ...roadmap, dreamJob, dreamCompany: user.dreamCompany || '' } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { lessonId, levelNumber, xpEarned } = req.body;
    if (!lessonId) return res.status(400).json({ success: false, message: 'lessonId is required' });

    const userId = user._id.toString();
    if (!progressStore[userId]) progressStore[userId] = [];

    // Avoid duplicates
    const exists = progressStore[userId].find(p => p.lessonId === lessonId);
    if (!exists) {
      progressStore[userId].push({ lessonId, levelNumber, xpEarned: xpEarned || 0, completedAt: new Date() });
    }

    const dreamJob = user.dreamJob || 'Software Engineer';
    const roadmap = buildRoadmap(dreamJob, progressStore[userId]);

    return res.status(200).json({ success: true, message: 'Progress updated', data: roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Keep backward compat export
const getRoadmapByJobRole = async (req, res) => {
  return res.status(200).json({ success: true, data: { jobRole: req.params.jobRole } });
};

module.exports = { getRoadmapProgress, updateLessonProgress, getRoadmapByJobRole };
