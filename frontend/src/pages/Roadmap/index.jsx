import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import {
  Zap, Lock, CheckCircle, PlayCircle, FileQuestion,
  FolderGit2, Award, ChevronDown, ChevronUp, Flame
} from 'lucide-react';
import './Roadmap.css';

// Lesson type → icon + CSS class
const typeConfig = {
  Video:       { icon: <PlayCircle size={16} />,   cls: 'video' },
  Quiz:        { icon: <FileQuestion size={16} />,  cls: 'quiz' },
  Project:     { icon: <FolderGit2 size={16} />,   cls: 'project' },
  Certificate: { icon: <Award size={16} />,         cls: 'certificate' },
};

const Roadmap = () => {
  const { user } = useAuth();

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('auth'))?.user; } catch { return null; }
  })();
  const currentUser = user || storedUser || {};

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState({ 0: true });
  const [addedToRoadmap, setAddedToRoadmap] = useState({});

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/roadmap/progress');
      if (res.data && res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Roadmap fetch error:', err);
      // Fallback mock data
      setRoadmap(buildMockRoadmap(currentUser.dreamJob || 'Software Engineer'));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (lesson, levelNumber) => {
    if (lesson.completed) return;
    try {
      const res = await api.post('/api/roadmap/progress', {
        lessonId: lesson.id,
        levelNumber,
        xpEarned: lesson.xp
      });
      if (res.data && res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      // Optimistic update fallback
      setRoadmap(prev => {
        if (!prev) return prev;
        const newLevels = prev.levels.map(lv => {
          if (lv.number !== levelNumber) return lv;
          const newLessons = lv.lessons.map(l =>
            l.id === lesson.id ? { ...l, completed: true } : l
          );
          const completedCount = newLessons.filter(l => l.completed).length;
          return { ...lv, lessons: newLessons, completedCount };
        });
        // Recompute unlocks
        for (let i = 1; i < newLevels.length; i++) {
          newLevels[i].unlocked = newLevels[i - 1].completedCount === newLevels[i - 1].totalLessons;
        }
        const newTotalXP = (prev.totalXP || 0) + lesson.xp;
        const newTotalCompleted = newLevels.reduce((s, l) => s + l.completedCount, 0);
        return { ...prev, levels: newLevels, totalXP: newTotalXP, totalCompleted: newTotalCompleted };
      });
    }
  };

  const toggleLevel = (idx) =>
    setExpandedLevels(prev => ({ ...prev, [idx]: !prev[idx] }));

  // Find today's next incomplete lesson
  const nextLesson = roadmap?.levels
    ?.find(lv => lv.unlocked && lv.completedCount < lv.totalLessons)
    ?.lessons?.find(l => !l.completed);

  const overallPercent = roadmap
    ? Math.round((roadmap.totalCompleted / (roadmap.totalLessons || 1)) * 100)
    : 0;

  const dayStreak = 3; // mock — would come from backend

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-secondary)' }}>
        <Zap size={24} style={{ color: '#A855F7', marginRight: '10px' }} />
        Loading your roadmap...
      </div>
    );
  }

  return (
    <div className="roadmap-page">
      {/* ── Header ── */}
      <div className="roadmap-header">
        <h1 className="roadmap-title">Career Roadmap</h1>
        <p className="roadmap-subtitle">
          Your personalized learning journey to become a{' '}
          <span style={{ color: '#A855F7', fontWeight: 700 }}>
            {roadmap?.dreamJob || currentUser.dreamJob || 'Software Engineer'}
          </span>
          {roadmap?.dreamCompany ? (
            <> at <span style={{ color: '#A855F7', fontWeight: 700 }}>{roadmap.dreamCompany}</span></>
          ) : ''}
        </p>

        <div className="roadmap-top-bar">
          <div className="roadmap-progress-wrap">
            <div className="roadmap-progress-label">
              <span>Overall Progress</span>
              <span>{roadmap?.totalCompleted || 0}/{roadmap?.totalLessons || 20} lessons</span>
            </div>
            <div className="roadmap-progress-bar-bg">
              <div className="roadmap-progress-bar-fill" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
          <div className="roadmap-xp-badge">
            <Zap size={16} />
            {roadmap?.totalXP || 0} XP
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="roadmap-layout">

        {/* ── LEVELS COLUMN ── */}
        <div className="roadmap-levels">
          {roadmap?.levels?.map((level, idx) => {
            const isExpanded = expandedLevels[idx] !== false;
            const pct = Math.round((level.completedCount / level.totalLessons) * 100);
            const isComplete = level.completedCount === level.totalLessons;

            return (
              <React.Fragment key={level.number}>
                {/* Connector between levels */}
                {idx > 0 && <div className="roadmap-connector" />}

                <div className={`level-card ${level.unlocked ? (isComplete ? 'glow' : '') : 'locked'}`}>
                  {/* Card Header */}
                  <div className="level-card-header">
                    <div className="level-card-titles">
                      <span className="level-number-badge">LEVEL {level.number}</span>
                      <h3 className="level-card-title">{level.title}</h3>
                      <p className="level-card-desc">
                        {idx === 0 && 'Build your core knowledge base'}
                        {idx === 1 && 'Master the key skills for your role'}
                        {idx === 2 && 'Apply skills to real industry problems'}
                        {idx === 3 && 'Prepare for interviews and placement'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div className={`level-status-badge ${level.unlocked ? (isComplete ? 'complete' : 'unlocked') : 'locked'}`}>
                        {level.unlocked
                          ? (isComplete ? '✦ Complete' : '● Unlocked')
                          : <><Lock size={11} /> Locked</>}
                      </div>
                      <button
                        onClick={() => toggleLevel(idx)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Level Progress */}
                  <div className="level-progress-row">
                    <div className="level-progress-bar-bg">
                      <div className="level-progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="level-progress-label">{level.completedCount}/{level.totalLessons}</span>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="lessons-list">
                      {level.lessons.map(lesson => {
                        const cfg = typeConfig[lesson.type] || typeConfig.Video;
                        return (
                          <div key={lesson.id} className="lesson-item">
                            {/* Lesson Icon */}
                            <div className={`lesson-icon ${lesson.completed ? 'completed' : cfg.cls}`}>
                              {lesson.completed ? <CheckCircle size={16} /> : cfg.icon}
                            </div>

                            {/* Info */}
                            <div className="lesson-info">
                              <div className="lesson-title">{lesson.title}</div>
                              <div className="lesson-meta">
                                <span className={`lesson-type-badge ${cfg.cls}`}>{lesson.type}</span>
                                <span className="lesson-xp">+{lesson.xp} XP</span>
                              </div>
                            </div>

                            {/* Action */}
                            <div className="lesson-action">
                              {lesson.completed ? (
                                <button className="lesson-btn completed-btn" disabled>✓ Done</button>
                              ) : level.unlocked ? (
                                <button
                                  className="lesson-btn start"
                                  onClick={() => handleComplete(lesson, level.number)}
                                >
                                  Start →
                                </button>
                              ) : (
                                <button className="lesson-btn locked-btn" disabled><Lock size={12} /></button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="roadmap-sidebar">

          {/* Progress Stats */}
          <div className="rs-card">
            <div className="rs-card-title"><Zap size={16} style={{ color: '#A855F7' }} /> Your Progress</div>
            <div className="rs-stat-row">
              <span className="rs-stat-label">Current Level</span>
              <span className="rs-stat-value violet">
                Level {roadmap?.levels?.find(l => l.unlocked && l.completedCount < l.totalLessons)?.number || roadmap?.levels?.length || 1}
              </span>
            </div>
            <div className="rs-stat-row">
              <span className="rs-stat-label">Total XP</span>
              <span className="rs-stat-value violet">{roadmap?.totalXP || 0} XP</span>
            </div>
            <div className="rs-stat-row">
              <span className="rs-stat-label">Lessons Completed</span>
              <span className="rs-stat-value">{roadmap?.totalCompleted || 0}/{roadmap?.totalLessons || 20}</span>
            </div>
            <div className="rs-stat-row">
              <span className="rs-stat-label">Day Streak</span>
              <span className="rs-stat-value green">🔥 {dayStreak} days</span>
            </div>
          </div>

          {/* Today's Goal */}
          <div className="rs-card">
            <div className="rs-card-title"><Flame size={16} style={{ color: '#F59E0B' }} /> Today's Goal</div>
            {nextLesson ? (
              <div className="today-goal-card">
                <p className="today-goal-title">{nextLesson.title}</p>
                <p className="today-goal-type">{nextLesson.type} · +{nextLesson.xp} XP</p>
                <button
                  className="today-goal-btn"
                  onClick={() => {
                    const level = roadmap?.levels?.find(l =>
                      l.lessons.some(ls => ls.id === nextLesson.id)
                    );
                    if (level) handleComplete(nextLesson, level.number);
                  }}
                >
                  Start Now →
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {overallPercent === 100
                  ? '🎉 All lessons completed! You\'re placement ready!'
                  : 'Complete Level 1 to unlock more goals.'}
              </p>
            )}
          </div>

          {/* Achievements */}
          <div className="rs-card">
            <div className="rs-card-title"><Award size={16} style={{ color: '#F59E0B' }} /> Achievements</div>
            <div className="achievements-grid">
              {[
                { icon: '🥉', label: 'Bronze\nStarter', unlocked: (roadmap?.totalCompleted || 0) >= 1 },
                { icon: '🥈', label: 'Silver\nLearner', unlocked: (roadmap?.totalCompleted || 0) >= 5 },
                { icon: '🥇', label: 'Gold\nExpert', unlocked: (roadmap?.totalCompleted || 0) >= 10 },
                { icon: '⚡', label: 'XP\nHunter', unlocked: (roadmap?.totalXP || 0) >= 100 },
                { icon: '🔥', label: 'Streak\nKing', unlocked: dayStreak >= 3 },
                { icon: '🏆', label: 'Level\nMaster', unlocked: roadmap?.levels?.some(l => l.completedCount === l.totalLessons) },
              ].map((ach, i) => (
                <div
                  key={i}
                  className="achievement-item"
                  style={{ opacity: ach.unlocked ? 1 : 0.3 }}
                  title={ach.unlocked ? 'Earned!' : 'Not yet earned'}
                >
                  <span className="achievement-icon">{ach.icon}</span>
                  <span className="achievement-label">{ach.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Fallback mock roadmap when API is unavailable
function buildMockRoadmap(jobRole) {
  const LESSON_TYPES = ['Video', 'Video', 'Quiz', 'Project', 'Certificate'];
  const LESSON_XP    = [10, 10, 20, 100, 50];
  const levelNames   = ['Foundation', 'Skill Development', 'Industry Ready', 'Placement Ready'];

  const levels = levelNames.map((title, idx) => ({
    number: idx + 1,
    title,
    unlocked: idx === 0,
    completedCount: 0,
    totalLessons: 5,
    lessons: LESSON_TYPES.map((type, i) => ({
      id: `L${idx + 1}-${i + 1}`,
      title: `${title} Lesson ${i + 1}`,
      type,
      xp: LESSON_XP[i],
      completed: false,
    })),
  }));

  return { levels, totalXP: 0, totalCompleted: 0, totalLessons: 20, dreamJob: jobRole, dreamCompany: '' };
}

export default Roadmap;
