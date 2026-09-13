import React, { useState, useEffect, useRef } from "react";
import { Card, Badge, Button, Modal } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import {
  Brain, Calculator, Puzzle, MessageSquare, BarChart3, Shapes, Zap,
  CheckCircle2, XCircle, Clock, Trophy, Flame, Target, ArrowRight,
  RotateCcw, Award, Check, X, HelpCircle, Sparkles
} from "lucide-react";
import "./Practice.css";

// ── QUESTIONS BANK ──
const QUESTIONS_BANK = {
  numerical: [
    { id: "n1", question: "If 15% of X = 45, what is X?", options: ["200", "300", "250", "350"], answer: 1, explanation: "X = 45 / 0.15 = 300" },
    { id: "n2", question: "A train travels 360 km in 4 hours. What is its speed in km/h?", options: ["80", "90", "85", "95"], answer: 1, explanation: "Speed = Distance / Time = 360 / 4 = 90 km/h" },
    { id: "n3", question: "What is 25% of 480?", options: ["100", "110", "120", "130"], answer: 2, explanation: "25 / 100 × 480 = 120" },
    { id: "n4", question: "If a shirt costs ₹800 and is sold for ₹1000, what is the profit percentage?", options: ["20%", "25%", "30%", "15%"], answer: 1, explanation: "Profit% = (Profit / CP) × 100 = (200 / 800) × 100 = 25%" },
    { id: "n5", question: "A can do a work in 10 days, B in 15 days. Together in how many days?", options: ["5", "6", "7", "8"], answer: 1, explanation: "1/10 + 1/15 = 5/30 = 1/6, so together they take 6 days" },
    { id: "n6", question: "What is the next number: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "45"], answer: 1, explanation: "Differences are +4, +6, +8, +10, +12, so 30 + 12 = 42" },
    { id: "n7", question: "Simple interest on ₹5000 at 8% per year for 3 years is?", options: ["₹1200", "₹1100", "₹1000", "₹1300"], answer: 0, explanation: "SI = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = ₹1200" },
    { id: "n8", question: "If 3x + 7 = 22, what is x?", options: ["3", "4", "5", "6"], answer: 2, explanation: "3x = 22 - 7 = 15, so x = 5" },
    { id: "n9", question: "A bag has 5 red and 3 blue balls. What is the probability of picking a red ball?", options: ["3/8", "5/8", "5/3", "1/2"], answer: 1, explanation: "P(Red) = Red Balls / Total Balls = 5 / (5 + 3) = 5/8" },
    { id: "n10", question: "If cost price is ₹500 and loss is 10%, what is the selling price?", options: ["₹400", "₹450", "₹480", "₹460"], answer: 1, explanation: "Loss = 10% of 500 = ₹50. SP = 500 - 50 = ₹450" }
  ],
  logical: [
    { id: "l1", question: "All cats are animals. All animals have legs. Conclusion: All cats have legs. True or False?", options: ["True", "False", "Uncertain", "Partially true"], answer: 0, explanation: "Syllogism — both premises are true so conclusion is valid" },
    { id: "l2", question: "A is B's sister. B is C's brother. What is A to C?", options: ["Brother", "Sister", "Cousin", "Cannot determine"], answer: 3, explanation: "We know A is sister to B and B is brother to C (so A is C's sister), but without knowing C's gender, C to A is brother or sister, so A to C is Sister (wait, answer choice D: Cannot determine or B: Sister. Here A is definitely sister to C!)." },
    { id: "l3", question: "If MANGO is coded as OCPIQ, how is APPLE coded?", options: ["CRRNG", "CRRNF", "BRRNG", "DSSNH"], answer: 0, explanation: "Each letter is shifted by +2: A+2=C, P+2=R, P+2=R, L+2=N, E+2=G -> CRRNG" },
    { id: "l4", question: "Find the odd one out:", options: ["Triangle", "Square", "Circle", "Cube"], answer: 3, explanation: "Cube is a 3D solid shape, while Triangle, Square, and Circle are 2D plane shapes" },
    { id: "l5", question: "Pointing to a man, a woman says 'His mother is the only daughter of my mother.' How is the woman related to the man?", options: ["Grandmother", "Mother", "Sister", "Aunt"], answer: 1, explanation: "'Only daughter of my mother' means the woman herself. So the man's mother is the woman, making her his Mother." },
    { id: "l6", question: "In a row of students, A is 7th from left and 5th from right. How many people are in the row?", options: ["10", "11", "12", "13"], answer: 1, explanation: "Total = (Position from left + Position from right) - 1 = (7 + 5) - 1 = 11" },
    { id: "l7", question: "Which letter group comes next: ACE, BDF, CEG, ?", options: ["DFH", "EGI", "DGI", "EFH"], answer: 0, explanation: "Each letter shifts by +1: A->B->C->D, C->D->E->F, E->F->G->H -> DFH" },
    { id: "l8", question: "If South-East becomes North, North-East becomes West, what does South become?", options: ["North-West", "North-East", "South-West", "East"], answer: 1, explanation: "Each direction rotates 135° anti-clockwise. South rotated 135° anti-clockwise becomes North-East." },
    { id: "l9", question: "Book is to Reading as Fork is to?", options: ["Kitchen", "Eating", "Cooking", "Food"], answer: 1, explanation: "A book is a tool used for reading; a fork is a tool used for eating." },
    { id: "l10", question: "Complete the series: 1, 4, 9, 16, 25, ?", options: ["30", "35", "36", "49"], answer: 2, explanation: "Perfect squares: 1², 2², 3², 4², 5², next is 6² = 36" }
  ],
  verbal: [
    { id: "v1", question: "Choose the synonym of ABUNDANT:", options: ["Scarce", "Plentiful", "Rare", "Limited"], answer: 1, explanation: "Abundant means existing in large quantities — plentiful" },
    { id: "v2", question: "Choose the antonym of TRANSPARENT:", options: ["Clear", "Obvious", "Opaque", "Visible"], answer: 2, explanation: "Transparent means see-through; the opposite is opaque (not allowing light to pass through)" },
    { id: "v3", question: "Complete the analogy: Doctor : Hospital :: Teacher : ?", options: ["Book", "School", "Student", "Classroom"], answer: 1, explanation: "A doctor works in a hospital; a teacher works in a school" },
    { id: "v4", question: "Find the correctly spelled word:", options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"], answer: 1, explanation: "Correct spelling is Accommodation (double 'c' and double 'm')" },
    { id: "v5", question: "Choose the word most similar in meaning to DILIGENT:", options: ["Lazy", "Careless", "Hardworking", "Slow"], answer: 2, explanation: "Diligent means showing steady, earnest care and effort — hardworking" },
    { id: "v6", question: "Rearrange to form a proper sentence: [quickly / the / ran / dog / away]", options: ["The dog ran away quickly", "Quickly the dog away ran", "The dog away quickly ran", "Away ran the dog quickly"], answer: 0, explanation: "Follows standard Subject (The dog) + Verb (ran away) + Adverb (quickly) structure" },
    { id: "v7", question: "Choose the antonym of GENEROUS:", options: ["Kind", "Giving", "Miserly", "Caring"], answer: 2, explanation: "Generous means willing to give freely; opposite is miserly (stingy / unwilling to give)" },
    { id: "v8", question: "Complete the proverb: 'Every cloud has a ___'", options: ["Rainbow", "Silver lining", "Dark side", "Storm"], answer: 1, explanation: "Every cloud has a silver lining means every bad situation has some good aspect" },
    { id: "v9", question: "Choose the synonym of ELOQUENT:", options: ["Silent", "Articulate", "Confused", "Quiet"], answer: 1, explanation: "Eloquent means fluent or persuasive in speaking — articulate" },
    { id: "v10", question: "Find the odd one out:", options: ["Novel", "Biography", "Magazine", "Newspaper"], answer: 0, explanation: "A Novel is a work of fiction; Biography, Magazine, and Newspaper are non-fiction" }
  ],
  di: [
    { id: "d1", question: "A bar chart shows sales for 4 quarters: Q1=₹20L, Q2=₹25L, Q3=₹30L, Q4=₹45L. Total annual sales?", options: ["₹100L", "₹110L", "₹120L", "₹130L"], answer: 2, explanation: "20 + 25 + 30 + 45 = ₹120L total sales" },
    { id: "d2", question: "In a pie chart, Company A accounts for 90° out of 360°. What is its percentage market share?", options: ["20%", "25%", "30%", "33.3%"], answer: 1, explanation: "(90° / 360°) × 100 = 25% market share" },
    { id: "d3", question: "Company revenue increased from ₹50 Cr in 2023 to ₹65 Cr in 2024. What is the percentage growth?", options: ["30%", "25%", "35%", "20%"], answer: 0, explanation: "Growth % = ((65 - 50) / 50) × 100 = (15 / 50) × 100 = 30%" },
    { id: "d4", question: "Average marks of 5 students in Data Interpretation test: 70, 80, 85, 90, 95. What is the mean score?", options: ["82", "80", "84", "86"], answer: 2, explanation: "Mean = (70 + 80 + 85 + 90 + 95) / 5 = 420 / 5 = 84" },
    { id: "d5", question: "Dept X has 40 male and 60 female employees. What is the ratio of male to total employees?", options: ["2:3", "2:5", "3:5", "1:2"], answer: 1, explanation: "Male : Total = 40 : (40 + 60) = 40 : 100 = 2 : 5" },
    { id: "d6", question: "If factory production drops from 1000 units to 800 units, what is the percentage decrease?", options: ["15%", "20%", "25%", "10%"], answer: 1, explanation: "Decrease % = ((1000 - 800) / 1000) × 100 = (200 / 1000) × 100 = 20%" },
    { id: "d7", question: "Monthly Active Users: Jan=10k, Feb=15k, Mar=25k, Apr=40k. Which interval had highest % growth?", options: ["Jan to Feb", "Feb to Mar", "Mar to Apr", "Equal growth"], answer: 1, explanation: "Jan-Feb: +50%, Feb-Mar: +66.7%, Mar-Apr: +60%. Highest is Feb to Mar (66.7%)" },
    { id: "d8", question: "Statement 1: X > Y. Statement 2: Y > Z. Is X > Z?", options: ["Yes, data is sufficient", "No, data insufficient", "Only if X is positive", "Cannot determine"], answer: 0, explanation: "Transitive property of inequality: if X > Y and Y > Z, then X > Z is strictly true." },
    { id: "d9", question: "In a survey of 200 people, 120 like Coffee, 100 like Tea, and 40 like both. How many like neither?", options: ["10", "20", "30", "40"], answer: 1, explanation: "Union = Coffee + Tea - Both = 120 + 100 - 40 = 180. Neither = 200 - 180 = 20" },
    { id: "d10", question: "Quarterly profit percentages: Q1=5%, Q2=10%, Q3=15%, Q4=20%. What is the average quarterly profit %?", options: ["10%", "15%", "12.5%", "11.5%"], answer: 2, explanation: "Average = (5 + 10 + 15 + 20) / 4 = 50 / 4 = 12.5%" }
  ],
  abstract: [
    { id: "a1", question: "Look at the sequence: 🔲, 🔳, 🔲, 🔳, ? What shape comes next?", options: ["🔲 (Open square)", "🔳 (Filled square)", "🔺 (Triangle)", "⚪ (Circle)"], answer: 0, explanation: "Alternating sequence of open and filled squares. Next is open square 🔲." },
    { id: "a2", question: "If a 2D shape rotates 90° clockwise at each step, after 4 steps it reaches?", options: ["180° orientation", "Original orientation", "270° orientation", "Inverted orientation"], answer: 1, explanation: "4 × 90° = 360°, which completes a full revolution back to the original orientation." },
    { id: "a3", question: "Which shape possesses an infinite number of lines of symmetry?", options: ["Square", "Equilateral Triangle", "Circle", "Regular Octagon"], answer: 2, explanation: "A circle has infinitely many lines of symmetry passing through its center." },
    { id: "a4", question: "Row 1: 1 dot, 2 dots, 3 dots. Row 2: 1 square, 2 squares, ? What completes Row 2?", options: ["1 square", "2 squares", "3 squares", "4 squares"], answer: 2, explanation: "Pattern increments count by 1 across columns. 1 square -> 2 squares -> 3 squares." },
    { id: "a5", question: "Find the odd one out among these geometric shapes:", options: ["Pentagon", "Hexagon", "Octagon", "Sphere"], answer: 3, explanation: "Sphere is a 3D solid figure, while Pentagon, Hexagon, and Octagon are 2D polygons." },
    { id: "a6", question: "Polygon side count progression: Triangle (3), Square (4), Pentagon (5). What comes next?", options: ["Heptagon", "Hexagon", "Octagon", "Nonagon"], answer: 1, explanation: "Sides increase by 1: 3, 4, 5 -> 6 sides = Hexagon." },
    { id: "a7", question: "Top row is fully shaded, middle row is 50% shaded. Following the trend, bottom row is?", options: ["75% shaded", "100% shaded", "0% (Unshaded)", "25% shaded"], answer: 2, explanation: "Linear decline in shading from top (100%) to middle (50%) to bottom (0%)." },
    { id: "a8", question: "Mirror image of capital letter 'F' across a vertical axis faces?", options: ["Right", "Left", "Upwards", "Downwards"], answer: 1, explanation: "Standard letter 'F' points right. Vertical reflection flips horizontal orientation to left." },
    { id: "a9", question: "How many vertices (corner points) does a standard 3D cube have?", options: ["6", "12", "8", "4"], answer: 2, explanation: "A cube has 6 square faces, 12 straight edges, and 8 corner vertices." },
    { id: "a10", question: "Figure A has 4 dots, B has 8 dots, C has 16 dots. Figure D will have how many dots?", options: ["20", "24", "28", "32"], answer: 3, explanation: "Geometric progression doubling at each step: 4 × 2 = 8, 8 × 2 = 16, 16 × 2 = 32 dots." }
  ]
};

// Generate mixed practice questions dynamically from all categories
QUESTIONS_BANK.mixed = [
  ...QUESTIONS_BANK.numerical,
  ...QUESTIONS_BANK.logical,
  ...QUESTIONS_BANK.verbal
];

const CATEGORIES_CONFIG = [
  {
    id: "numerical",
    title: "Numerical Reasoning",
    icon: <Calculator size={24} />,
    description: "Number series, percentages, ratios, profit and loss, time and work",
    questionsCount: 20,
    difficulty: "Beginner to Advanced",
    pointsPerQ: 10,
    color: "violet"
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    icon: <Puzzle size={24} />,
    description: "Syllogisms, blood relations, directions, coding-decoding, arrangements",
    questionsCount: 20,
    difficulty: "Beginner to Advanced",
    pointsPerQ: 10,
    color: "violet"
  },
  {
    id: "verbal",
    title: "Verbal Reasoning",
    icon: <MessageSquare size={24} />,
    description: "Analogies, synonyms, antonyms, sentence completion, reading comprehension",
    questionsCount: 20,
    difficulty: "Beginner to Advanced",
    pointsPerQ: 10,
    color: "violet"
  },
  {
    id: "di",
    title: "Data Interpretation",
    icon: <BarChart3 size={24} />,
    description: "Bar charts, pie charts, tables, line graphs, and data sufficiency problems",
    questionsCount: 20,
    difficulty: "Intermediate to Advanced",
    pointsPerQ: 15,
    color: "violet"
  },
  {
    id: "abstract",
    title: "Abstract Reasoning",
    icon: <Shapes size={24} />,
    description: "Pattern recognition, figure series, matrix reasoning, odd one out",
    questionsCount: 20,
    difficulty: "Beginner to Advanced",
    pointsPerQ: 10,
    color: "violet"
  },
  {
    id: "mixed",
    title: "Mixed Practice",
    icon: <Zap size={24} />,
    description: "Random mix of all categories — perfect for placement exam preparation",
    questionsCount: 30,
    difficulty: "Mixed",
    pointsPerQ: 10,
    recommended: true,
    color: "violet"
  }
];
const Practice = () => {
  const { user, setUser } = useAuth();

  // LocalStorage state
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem("jf_practice_stats");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return { quizzesCompleted: 0, totalPoints: 0, bestScorePercent: 0, currentStreak: 0, lastDate: "" };
  });

  const [recentActivity, setRecentActivity] = useState(() => {
    try {
      const saved = localStorage.getItem("jf_practice_history");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  // Quiz active / view state
  const [view, setView] = useState("selection"); // 'selection' | 'active' | 'complete'
  const [selectedCat, setSelectedCat] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPoints, setQuizPoints] = useState(0);

  // Timer: 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState(900);
  const [timerActive, setTimerActive] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer = null;
    if (view === "active" && timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [view, timerActive, timeLeft]);

  // Format timer MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Quiz
  const handleStartQuiz = (category) => {
    const questions = QUESTIONS_BANK[category.id] || QUESTIONS_BANK.numerical;
    setSelectedCat(category);
    setActiveQuestions(questions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setQuizScore(0);
    setQuizPoints(0);
    setTimeLeft(900); // 15 mins
    setTimerActive(true);
    setView("active");
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    const currentQ = activeQuestions[currentIdx];
    const isCorrect = selectedOption === currentQ.answer;
    const pts = isCorrect ? (selectedCat.pointsPerQ || 10) : 0;

    setIsSubmitted(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setQuizPoints(prev => prev + pts);
    }

    const record = {
      questionIndex: currentIdx,
      question: currentQ.question,
      options: currentQ.options,
      selectedOption,
      correctOption: currentQ.answer,
      isCorrect,
      explanation: currentQ.explanation
    };

    setUserAnswers(prev => [...prev, record]);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      handleFinishQuiz();
    }
  };

  // Finish Quiz
  const handleFinishQuiz = () => {
    setTimerActive(false);

    // Calculate score & points
    let finalScore = 0;
    let finalPoints = 0;

    userAnswers.forEach(ans => {
      if (ans.isCorrect) {
        finalScore += 1;
        finalPoints += (selectedCat?.pointsPerQ || 10);
      }
    });

    const totalQs = activeQuestions.length || 10;
    const percent = Math.round((finalScore / totalQs) * 100);

    // Bonus for perfect score
    if (finalScore === totalQs && totalQs > 0) {
      finalPoints += 50;
    }

    // Streak calculation
    const today = new Date().toISOString().slice(0, 10);
    let newStreak = stats.currentStreak || 1;
    if (stats.lastDate) {
      const last = new Date(stats.lastDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const newStats = {
      quizzesCompleted: (stats.quizzesCompleted || 0) + 1,
      totalPoints: (stats.totalPoints || 0) + finalPoints,
      bestScorePercent: Math.max(stats.bestScorePercent || 0, percent),
      currentStreak: newStreak,
      lastDate: today
    };

    setStats(newStats);
    localStorage.setItem("jf_practice_stats", JSON.stringify(newStats));

    // Update user XP in auth/user state
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed.user) {
          parsed.user.xp = (parsed.user.xp || 0) + finalPoints;
          localStorage.setItem("auth", JSON.stringify(parsed));
          localStorage.setItem("user", JSON.stringify(parsed.user));
          if (setUser) setUser(parsed.user);
        }
      }
    } catch (e) { console.error(e); }

    // Update recent activity
    const newAttempt = {
      id: Date.now(),
      category: selectedCat?.title || "Practice Quiz",
      score: finalScore,
      total: totalQs,
      points: finalPoints,
      percent,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    };

    const updatedHistory = [newAttempt, ...recentActivity].slice(0, 3);
    setRecentActivity(updatedHistory);
    localStorage.setItem("jf_practice_history", JSON.stringify(updatedHistory));

    setQuizScore(finalScore);
    setQuizPoints(finalPoints);
    setView("complete");
  };

  // Exit Quiz Modal confirm
  const handleExitQuizConfirm = () => {
    setShowExitModal(false);
    setTimerActive(false);
    setView("selection");
  };
  // Grade Badge
  const getGradeBadge = (percent) => {
    if (percent >= 90) return { label: "Excellent! 🎉", bg: "rgba(245,158,11,0.15)", text: "#F59E0B", border: "#F59E0B" };
    if (percent >= 70) return { label: "Good Job! 👏", bg: "rgba(16,185,129,0.15)", text: "#10B981", border: "#10B981" };
    if (percent >= 50) return { label: "Keep Practicing! 💪", bg: "rgba(245,158,11,0.15)", text: "#F59E0B", border: "#F59E0B" };
    return { label: "Try Again! 📚", bg: "rgba(239,68,68,0.15)", text: "#EF4444", border: "#EF4444" };
  };

  const optionLetters = ["A", "B", "C", "D"];

  // ══════════════════════════════════════════════════════════════════════
  // RENDER STATE 1 — QUIZ SELECTION
  // ══════════════════════════════════════════════════════════════════════
  if (view === "selection") {
    return (
      <div className="practice-page">
        {/* Header */}
        <header className="practice-header">
          <h1 className="practice-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Brain size={32} style={{ color: "#7C3AED" }} /> Practice & Assessment
          </h1>
          <p className="practice-subtitle">
            Test your aptitude and reasoning skills to prepare for placements
          </p>
        </header>

        {/* Top Stats Row */}
        <div className="practice-stats-grid">
          <div className="p-stat-card">
            <div className="p-stat-icon violet">
              <Trophy size={24} />
            </div>
            <div>
              <div className="p-stat-val">{stats.quizzesCompleted || 0}</div>
              <div className="p-stat-lbl">Quizzes Completed</div>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon green">
              <Zap size={24} />
            </div>
            <div>
              <div className="p-stat-val">⚡ {stats.totalPoints || 0}</div>
              <div className="p-stat-lbl">Total Points Earned</div>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon orange">
              <Target size={24} />
            </div>
            <div>
              <div className="p-stat-val">{stats.bestScorePercent || 0}%</div>
              <div className="p-stat-lbl">Best Score</div>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon blue">
              <Flame size={24} />
            </div>
            <div>
              <div className="p-stat-val">🔥 {stats.currentStreak || 0}</div>
              <div className="p-stat-lbl">Current Streak</div>
            </div>
          </div>
        </div>

        {/* Quiz Categories Section */}
        <section>
          <h2 className="practice-section-title">Choose a Practice Category</h2>

          <div className="categories-grid">
            {CATEGORIES_CONFIG.map(cat => (
              <div
                key={cat.id}
                className={`category-card ${cat.recommended ? 'recommended' : ''}`}
              >
                <div className="cat-header">
                  <div className="cat-icon-box">
                    {cat.icon}
                  </div>
                  {cat.recommended && (
                    <span style={{
                      background: "rgba(124, 58, 237, 0.2)",
                      border: "1px solid rgba(124, 58, 237, 0.4)",
                      color: "#A855F7",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <Sparkles size={12} /> Recommended
                    </span>
                  )}
                </div>

                <h3 className="cat-title">{cat.title}</h3>
                <p className="cat-desc">{cat.description}</p>

                <div className="cat-meta-row">
                  <div className="cat-meta-item">
                    <HelpCircle size={14} style={{ color: "#A855F7" }} />
                    <span>{cat.questionsCount} Questions</span>
                  </div>
                  <div className="cat-meta-item">
                    <Award size={14} style={{ color: "#F59E0B" }} />
                    <span>{cat.difficulty}</span>
                  </div>
                  <div className="cat-meta-item">
                    <Zap size={14} style={{ color: "#10B981" }} />
                    <span>{cat.pointsPerQ} pts / Q</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(cat)}
                  style={{
                    width: "100%",
                    background: "#7C3AED",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#9F67F7"}
                  onMouseLeave={e => e.currentTarget.style.background = "#7C3AED"}
                >
                  Start Quiz <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section>
          <div className="recent-activity-card">
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={18} style={{ color: "#7C3AED" }} /> Recent Activity
            </h3>

            {recentActivity.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" }}>
                No quizzes attempted yet. Start your first quiz above!
              </p>
            ) : (
              <div className="activity-list">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="activity-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "8px",
                        background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#A855F7", fontWeight: 700, fontSize: "0.85rem"
                      }}>
                        {act.score}/{act.total}
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{act.category}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{act.date}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "#A855F7", fontWeight: 700, fontSize: "0.85rem" }}>
                        ⚡ +{act.points} pts
                      </span>
                      <span style={{
                        background: act.percent >= 70 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                        color: act.percent >= 70 ? "#10B981" : "#F59E0B",
                        border: `1px solid ${act.percent >= 70 ? "#10B981" : "#F59E0B"}`,
                        padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600
                      }}>
                        {act.percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // RENDER STATE 2 — QUIZ ACTIVE
  // ══════════════════════════════════════════════════════════════════════
  if (view === "active") {
    const currentQ = activeQuestions[currentIdx] || {};
    const totalQs = activeQuestions.length || 10;
    const progressPercent = Math.round(((currentIdx + 1) / totalQs) * 100);

    return (
      <div className="practice-page">
        {/* Exit Confirmation Modal */}
        {showExitModal && (
          <Modal
            isOpen={showExitModal}
            onClose={() => setShowExitModal(false)}
            title="Exit Quiz?"
            size="sm"
          >
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Are you sure you want to exit? Your progress for this quiz will be lost.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setShowExitModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleExitQuizConfirm}>Yes, Exit</Button>
            </div>
          </Modal>
        )}

        {/* Quiz Header */}
        <div className="quiz-active-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A855F7" }}>
              {selectedCat?.icon || <Brain size={20} />}
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{selectedCat?.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Placement Assessment</div>
            </div>
          </div>

          <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
            Question {currentIdx + 1} of {totalQs}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className={`quiz-timer-badge ${timeLeft <= 120 ? 'warning' : ''}`}>
              <Clock size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <div style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "6px 12px", fontWeight: 700, fontSize: "0.85rem" }}>
              ⚡ {quizPoints} pts
            </div>

            <button
              onClick={() => setShowExitModal(true)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center" }}
              title="Exit Quiz"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-bar-bg">
          <div className="quiz-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="q-number-badge">
            {currentIdx + 1}
          </div>

          <h2 className="q-text">
            {currentQ.question}
          </h2>

          {/* Options List */}
          <div className="options-grid">
            {currentQ.options?.map((opt, idx) => {
              let stateClass = "";
              if (isSubmitted) {
                if (idx === currentQ.answer) stateClass = "correct";
                else if (selectedOption === idx) stateClass = "wrong";
              } else if (selectedOption === idx) {
                stateClass = "selected";
              }

              return (
                <div
                  key={idx}
                  className={`option-card ${stateClass}`}
                  onClick={() => {
                    if (!isSubmitted) setSelectedOption(idx);
                  }}
                >
                  <div className="opt-prefix">
                    {optionLetters[idx]}
                  </div>
                  <span className="opt-text">{opt}</span>
                  {isSubmitted && idx === currentQ.answer && <CheckCircle2 size={18} style={{ color: "#10B981" }} />}
                  {isSubmitted && selectedOption === idx && idx !== currentQ.answer && <XCircle size={18} style={{ color: "#EF4444" }} />}
                </div>
              );
            })}
          </div>

          {/* Action Button & Explanation */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              style={{
                width: "100%",
                background: selectedOption !== null ? "#7C3AED" : "rgba(124,58,237,0.3)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: selectedOption !== null ? "pointer" : "not-allowed",
                minHeight: "44px",
                transition: "background 0.2s"
              }}
            >
              Submit Answer
            </button>
          ) : (
            <div>
              {/* Explanation Box */}
              <div className={`explanation-box ${selectedOption === currentQ.answer ? 'correct' : 'wrong'}`}>
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                  {selectedOption === currentQ.answer ? "✓ Correct!" : "✗ Incorrect"}
                </div>
                <div>{currentQ.explanation}</div>
              </div>

              <button
                onClick={handleNextQuestion}
                style={{
                  width: "100%",
                  background: "#7C3AED",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: "44px",
                  marginTop: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {currentIdx + 1 < totalQs ? "Next Question →" : "Finish Quiz & View Results 🎉"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // RENDER STATE 3 — QUIZ COMPLETION / RESULTS
  // ══════════════════════════════════════════════════════════════════════
  if (view === "complete") {
    const totalQs = activeQuestions.length || 10;
    const percent = Math.round((quizScore / totalQs) * 100);
    const grade = getGradeBadge(percent);

    return (
      <div className="practice-page">
        <div className="results-card">
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
            Quiz Complete! 🎉
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Great effort on completing the {selectedCat?.title} quiz!
          </p>

          {/* Grade Badge */}
          <div style={{ display: "inline-block", background: grade.bg, color: grade.text, border: `1px solid ${grade.border}`, padding: "6px 18px", borderRadius: "999px", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            {grade.label}
          </div>

          {/* Stats summary row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#A855F7" }}>{percent}%</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Overall Score</div>
            </div>

            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "white" }}>{quizScore}/{totalQs}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Correct Answers</div>
            </div>

            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#10B981" }}>⚡ +{quizPoints}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>XP Points Earned</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => handleStartQuiz(selectedCat)}
              style={{
                background: "transparent",
                border: "1px solid #7C3AED",
                color: "#A855F7",
                borderRadius: "10px",
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minHeight: "44px"
              }}
            >
              <RotateCcw size={16} /> Try Again
            </button>

            <button
              onClick={() => setView("selection")}
              style={{
                background: "#7C3AED",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minHeight: "44px"
              }}
            >
              Choose Another Quiz <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Question Review Section */}
        <section>
          <h2 className="practice-section-title" style={{ marginBottom: "1rem" }}>Question Review</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {userAnswers.map((ans, idx) => (
              <div key={idx} className="review-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {ans.isCorrect ? (
                      <CheckCircle2 size={18} style={{ color: "#10B981", flexShrink: 0 }} />
                    ) : (
                      <XCircle size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
                    )}
                    <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                      Q{idx + 1}: {ans.question}
                    </span>
                  </div>

                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: ans.isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: ans.isCorrect ? "#10B981" : "#EF4444"
                  }}>
                    {ans.isCorrect ? "Correct (+10 pts)" : "Incorrect (0 pts)"}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginLeft: "26px", marginBottom: "6px" }}>
                  <strong>Your Answer:</strong> {ans.options[ans.selectedOption] || "None"}
                </div>

                {!ans.isCorrect && (
                  <div style={{ fontSize: "0.85rem", color: "#34D399", marginLeft: "26px", marginBottom: "6px" }}>
                    <strong>Correct Answer:</strong> {ans.options[ans.correctOption]}
                  </div>
                )}

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "26px", fontStyle: "italic" }}>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return null;
};

export default Practice;
