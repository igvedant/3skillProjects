import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from '../config';

const Leaderboard = () => {
  const { id } = useParams();
  const [scores, setScores] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [id]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      // Fetch scores
      const scoreRes = await fetch(`${API_BASE}/scores/${id}`);
      if (!scoreRes.ok) throw new Error('Failed to fetch leaderboard');
      const scoreData = await scoreRes.json();
      setScores(scoreData);

      // Fetch quiz details for the title
      const quizRes = await fetch(`${API_BASE}/quizzes/${id}`);
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        setQuizTitle(quizData.title);
      } else {
        setQuizTitle('Quiz');
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Could not load leaderboard data.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="glass-card center-flex">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading leaderboard rankings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card center-flex">
        <h3 style={{ color: 'var(--color-incorrect)' }}>Error Loading Leaderboard</h3>
        <p className="subtitle">{error}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
          GLOBAL STANDINGS
        </span>
        <h2 style={{ marginTop: '8px', marginBottom: '4px' }}>
          <span className="gradient-text">{quizTitle}</span> Leaderboard
        </h2>
        <p className="subtitle" style={{ marginBottom: 0 }}>
          Top 10 highest scoring players on this quiz.
        </p>
      </div>

      {scores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            No scores submitted yet for this quiz. Be the first to claim the top spot!
          </p>
          <Link to={`/quiz/${id}`} className="btn btn-primary">
            Play Quiz Now
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Accuracy</th>
                <th>Played On</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => {
                const rank = index + 1;
                let rankClass = 'rank-other';
                if (rank === 1) rankClass = 'rank-1';
                else if (rank === 2) rankClass = 'rank-2';
                else if (rank === 3) rankClass = 'rank-3';

                return (
                  <tr key={score._id}>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`rank-badge ${rankClass}`}>{rank}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: rank === 1 ? '#fbbf24' : 'var(--text-primary)' }}>
                      {score.username} {rank === 1 && '👑'}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {score.score} / {score.totalQuestions}
                    </td>
                    <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                      {Math.round((score.score / score.totalQuestions) * 100)}%
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(score.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link to="/" className="btn btn-secondary">
          🏠 Back to Quiz List
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;
