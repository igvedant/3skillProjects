import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../config';

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleQuestionTextChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectIndexChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswerIndex = Number(value);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    const updated = questions.filter((_, idx) => idx !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!title.trim()) {
      alert('Quiz title is required.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        alert(`Question ${i + 1} text is empty.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Option ${j + 1} of Question ${i + 1} is empty.`);
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          questions
        })
      });

      if (!res.ok) throw new Error('Failed to create quiz');

      alert('Quiz created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '8px' }}>
        Create a <span className="gradient-text">New Quiz</span>
      </h2>
      <p className="subtitle" style={{ marginBottom: '32px' }}>
        Add your quiz title, description, and list of questions to create a playable quiz game.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Quiz General Settings */}
        <div style={styles.sectionHeader}>
          <h3>Quiz Info</h3>
        </div>
        
        <div className="form-group">
          <label htmlFor="quiz-title">Quiz Title *</label>
          <input
            id="quiz-title"
            type="text"
            className="form-control"
            placeholder="e.g. Node.js Fundamentals"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quiz-desc">Description</label>
          <textarea
            id="quiz-desc"
            className="form-control"
            placeholder="Brief description of what this quiz covers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={submitting}
          />
        </div>

        {/* Quiz Questions Section */}
        <div style={styles.sectionHeader}>
          <h3>Questions ({questions.length})</h3>
        </div>

        {questions.map((question, qIdx) => (
          <div key={qIdx} className="creator-question-block">
            {questions.length > 1 && (
              <button
                type="button"
                className="remove-question-btn"
                onClick={() => removeQuestion(qIdx)}
                title="Remove Question"
              >
                ✕
              </button>
            )}

            <h4 style={{ color: 'var(--color-secondary)', marginBottom: '16px' }}>
              Question {qIdx + 1}
            </h4>

            <div className="form-group">
              <label>Question Text *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the question query..."
                value={question.questionText}
                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div style={styles.optionsGrid}>
              {question.options.map((option, oIdx) => (
                <div key={oIdx} className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Option {oIdx + 1} *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Option ${oIdx + 1} text`}
                    value={option}
                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: 0, marginTop: '12px' }}>
              <label>Correct Answer *</label>
              <select
                className="form-control"
                value={question.correctAnswerIndex}
                onChange={(e) => handleCorrectIndexChange(qIdx, e.target.value)}
                disabled={submitting}
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', marginBottom: '32px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addQuestion}
            disabled={submitting}
            style={{ flex: 1 }}
          >
            + Add Another Question
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '32px 0' }} />

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <Link to="/" className="btn btn-secondary" disabled={submitting}>
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating Quiz...' : 'Create & Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  sectionHeader: {
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '8px',
    marginBottom: '20px',
    marginTop: '32px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  }
};

export default CreateQuiz;
