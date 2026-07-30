import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/quizzes`);
      if (!res.ok) throw new Error('Failed to fetch quizzes');
      const data = await res.json();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Could not load quizzes. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '12px' }}>
          Welcome to <span className="gradient-text">BrainWave Quiz</span>
        </h1>
        <p className="subtitle" style={{ marginBottom: 0 }}>
          Test your skills across various topics, submit your scores to the leaderboard, and challenge your friends!
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Available Quizzes</h2>
        <Link to="/create" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          + Create Custom Quiz
        </Link>
      </div>

      {loading && (
        <div className="center-flex">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading quizzes...</p>
        </div>
      )}

      {error && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--color-incorrect)', padding: '24px' }}>
          <h3 style={{ color: 'var(--color-incorrect)', marginBottom: '8px' }}>Connection Error</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-secondary" onClick={fetchQuizzes}>Try Again</button>
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="glass-card center-flex">
          <h3>No Quizzes Found</h3>
          <p className="subtitle">Create the very first quiz to get started!</p>
          <Link to="/create" className="btn btn-primary">Create a Quiz</Link>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div className="grid-2">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="glass-card quiz-card">
              <div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{quiz.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
                  {quiz.description || 'No description provided.'}
                </p>
              </div>
              <div className="quiz-card-footer">
                <span className="questions-count">
                  {quiz.questions ? quiz.questions.length : 0} Questions
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/leaderboard/${quiz._id}`} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    Leaderboard
                  </Link>
                  <Link to={`/quiz/${quiz._id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Play Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
