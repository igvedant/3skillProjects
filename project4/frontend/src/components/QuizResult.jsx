import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../config';

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // If page is accessed directly without state, redirect to home
  if (!state || !state.results) {
    return (
      <div className="glass-card center-flex">
        <h3>No Quiz Results Found</h3>
        <p className="subtitle">Play a quiz first to see your results!</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  const { results, quizId, quizTitle } = state;
  const { score, totalQuestions, feedback } = results;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Custom congratulatory message based on score percentage
  let titleMessage = 'Keep Practicing!';
  let descMessage = 'You can do better. Try again to improve your score!';
  let emoji = '📚';

  if (percentage === 100) {
    titleMessage = 'Mastermind!';
    descMessage = 'Perfect score! You nailed every single question.';
    emoji = '👑';
  } else if (percentage >= 80) {
    titleMessage = 'Outstanding!';
    descMessage = 'Incredible job! You have an excellent grasp of this topic.';
    emoji = '🌟';
  } else if (percentage >= 60) {
    titleMessage = 'Well Done!';
    descMessage = 'Great job! You passed with a solid score.';
    emoji = '👍';
  }

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          quizId,
          quizTitle,
          score,
          totalQuestions
        })
      });

      if (!res.ok) throw new Error('Failed to save score');
      
      setSubmitted(true);
      // Wait a moment and navigate to leaderboard
      setTimeout(() => {
        navigate(`/leaderboard/${quizId}`);
      }, 1500);
    } catch (err) {
      console.error('Error saving score:', err);
      alert('Failed to submit score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Score Presentation Card */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>{emoji}</div>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          {titleMessage}
        </h1>
        <p className="subtitle" style={{ marginBottom: '24px' }}>{descMessage}</p>
        
        <div style={styles.scoreCircle}>
          <div style={styles.scoreText}>{score}</div>
          <div style={styles.scoreTotal}>out of {totalQuestions}</div>
          <div style={styles.scorePercentage}>{percentage}%</div>
        </div>
      </div>

      {/* Leaderboard Submission Form */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3>Submit to Leaderboard</h3>
        {submitted ? (
          <div style={{ color: 'var(--color-correct)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            ✓ Score submitted successfully! Opening leaderboard...
          </div>
        ) : (
          <form onSubmit={handleSubmitScore} style={{ marginTop: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Enter your name to save your score of {score}/{totalQuestions} on the global rankings:
            </p>
            <div style={styles.formRow}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
                disabled={submitting}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting || !username.trim()}>
                {submitting ? 'Saving...' : 'Submit Score'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-secondary">
          🏠 Back to Home
        </Link>
        <Link to={`/quiz/${quizId}`} className="btn btn-primary">
          🔄 Retake Quiz
        </Link>
      </div>

      {/* Question Breakdown Review */}
      <h2>Question Review</h2>
      <div style={{ marginTop: '16px' }}>
        {feedback.map((item, index) => {
          const isUserCorrect = item.isCorrect;
          
          return (
            <div 
              key={index} 
              className={`feedback-item ${isUserCorrect ? 'correct' : 'incorrect'}`}
            >
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1.05rem' }}>
                Question {index + 1}: {item.questionText}
              </h4>
              
              <div className="feedback-options-summary">
                {item.options.map((option, optIdx) => {
                  let optClass = 'neutral';
                  
                  // If this option is the correct one, highlight it as green
                  if (optIdx === item.correctIndex) {
                    optClass = 'answer-correct';
                  } 
                  // If user selected this option and it was incorrect, highlight it red
                  else if (optIdx === item.selectedIndex && !isUserCorrect) {
                    optClass = 'user-incorrect';
                  }
                  
                  return (
                    <div key={optIdx} className={`feedback-option ${optClass}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{option}</span>
                        {optIdx === item.correctIndex && (
                          <span style={{ color: 'var(--color-correct)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            Correct Answer
                          </span>
                        )}
                        {optIdx === item.selectedIndex && !isUserCorrect && (
                          <span style={{ color: 'var(--color-incorrect)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            Your Answer
                          </span>
                        )}
                        {optIdx === item.selectedIndex && isUserCorrect && (
                          <span style={{ color: 'var(--color-correct)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            Your Answer ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {item.selectedIndex === null && (
                <div style={{ marginTop: '12px', color: 'var(--color-incorrect)', fontSize: '0.9rem', fontWeight: 600 }}>
                  ⏱️ Unanswered (Time limit expired)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '4px solid var(--color-primary)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(147, 51, 234, 0.05)',
    boxShadow: '0 0 20px var(--color-primary-glow)',
  },
  scoreText: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: 1.1,
  },
  scoreTotal: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scorePercentage: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--color-secondary)',
    marginTop: '4px',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
  }
};

export default QuizResult;
