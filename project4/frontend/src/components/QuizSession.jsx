import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const QuizSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [tempSelected, setTempSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuiz();
    return () => clearInterval(timerRef.current);
  }, [id]);

  useEffect(() => {
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      startQuestionTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex, quiz]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/quizzes/${id}`);
      if (!res.ok) throw new Error('Quiz not found');
      const data = await res.json();
      setQuiz(data);
      setSelectedAnswers(new Array(data.questions.length).fill(null));
      setError(null);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Could not load quiz. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const startQuestionTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(15);
    setIsAnswered(false);
    setTempSelected(null);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setTempSelected(optionIndex);
    setIsAnswered(true);

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const handleTimeOut = () => {
    setIsAnswered(true);
    setTempSelected(null); // No selection
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = null; // null represents unanswered
    setSelectedAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // It was the last question, submit results!
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      clearInterval(timerRef.current);
      
      const res = await fetch(`${API_BASE}/quizzes/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers })
      });
      
      if (!res.ok) throw new Error('Failed to submit answers');
      const results = await res.json();
      
      // Navigate to the results page, passing the results state
      navigate('/result', {
        state: {
          results,
          quizId: quiz._id,
          quizTitle: quiz.title
        }
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Error grading quiz. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card center-flex">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Preparing your quiz session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card center-flex">
        <h3 style={{ color: 'var(--color-incorrect)' }}>Error Loading Quiz</h3>
        <p className="subtitle">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="glass-card center-flex">
        <h3>Empty Quiz</h3>
        <p className="subtitle">This quiz has no questions.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  // Timer progress bar width and class selection
  const timerPercent = (timeLeft / 15) * 100;
  let timerClass = '';
  if (timeLeft <= 5 && timeLeft > 2) timerClass = 'warning';
  else if (timeLeft <= 2) timerClass = 'critical';

  return (
    <div className="glass-card">
      {/* Quiz Progress Header */}
      <div className="quiz-header-meta">
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
            {quiz.title.toUpperCase()}
          </span>
          <h4 style={{ margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </h4>
        </div>
        <div className={`timer-text ${timeLeft <= 5 ? 'danger' : ''}`}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      {/* Timer Bar */}
      <div className="timer-bar-container">
        <div 
          className={`timer-bar ${timerClass}`} 
          style={{ width: `${timerPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', lineHeight: 1.4 }}>
          {currentQuestion.questionText}
        </h2>
      </div>

      {/* Answers Options */}
      <div style={{ marginBottom: '32px' }}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = tempSelected === idx;
          return (
            <button
              key={idx}
              className={`option-button ${isSelected ? 'correct' : ''}`}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              style={
                isSelected 
                  ? { border: '2px solid var(--color-secondary)', boxShadow: '0 0 10px var(--color-secondary-glow)' } 
                  : {}
              }
            >
              <span>{option}</span>
              {isSelected && <span style={{ fontSize: '1.2rem' }}>⭐</span>}
            </button>
          );
        })}
      </div>

      {/* Timeout / Answered Prompt Overlay */}
      {isAnswered && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: tempSelected === null ? 'var(--color-incorrect)' : 'var(--color-secondary)' }}>
            {tempSelected === null ? "⏱️ Time's up! Unanswered." : '✓ Answer locked.'}
          </span>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSession;
