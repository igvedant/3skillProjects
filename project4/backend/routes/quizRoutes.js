const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { getIsLocalMock, quizzesFile } = require('../db');
const fs = require('fs');

// Helper to strip correct answers from quiz questions
const stripAnswers = (quiz) => {
  const quizObj = quiz.toObject ? quiz.toObject() : JSON.parse(JSON.stringify(quiz));
  if (quizObj.questions && Array.isArray(quizObj.questions)) {
    quizObj.questions = quizObj.questions.map(q => {
      const { correctAnswerIndex, ...qRest } = q;
      return qRest;
    });
  }
  return quizObj;
};

// GET all quizzes (with correct answers stripped out)
router.get('/', async (req, res) => {
  try {
    if (getIsLocalMock()) {
      const data = fs.readFileSync(quizzesFile, 'utf8');
      const quizzes = JSON.parse(data);
      const clientQuizzes = quizzes.map(quiz => stripAnswers(quiz));
      return res.json(clientQuizzes);
    } else {
      const quizzes = await Quiz.find();
      const clientQuizzes = quizzes.map(quiz => stripAnswers(quiz));
      return res.json(clientQuizzes);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single quiz by ID (with correct answers stripped out)
router.get('/:id', async (req, res) => {
  try {
    if (getIsLocalMock()) {
      const data = fs.readFileSync(quizzesFile, 'utf8');
      const quizzes = JSON.parse(data);
      const quiz = quizzes.find(q => q._id === req.params.id);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
      return res.json(stripAnswers(quiz));
    } else {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
      return res.json(stripAnswers(quiz));
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST submit answers and return score + grading feedback
router.post('/:id/submit', async (req, res) => {
  const { answers } = req.body; // Array of selected option indices (e.g., [1, null, 2, 0, 3])
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Answers array is required' });
  }

  try {
    let quiz;
    if (getIsLocalMock()) {
      const data = fs.readFileSync(quizzesFile, 'utf8');
      const quizzes = JSON.parse(data);
      quiz = quizzes.find(q => q._id === req.params.id);
    } else {
      quiz = await Quiz.findById(req.params.id);
    }

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const feedback = quiz.questions.map((q, idx) => {
      const selectedIndex = answers[idx] !== undefined ? answers[idx] : null;
      const correctIndex = q.correctAnswerIndex;
      const isCorrect = selectedIndex === correctIndex;
      if (isCorrect) score++;
      
      return {
        questionText: q.questionText,
        options: q.options,
        selectedIndex,
        correctIndex,
        isCorrect
      };
    });

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      feedback
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new quiz
router.post('/', async (req, res) => {
  const { title, description, questions } = req.body;
  
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Title and questions are required' });
  }

  // Format questions to ensure correctAnswerIndex is a number
  const formattedQuestions = questions.map(q => ({
    questionText: q.questionText,
    options: q.options,
    correctAnswerIndex: Number(q.correctAnswerIndex)
  }));

  try {
    if (getIsLocalMock()) {
      const data = fs.readFileSync(quizzesFile, 'utf8');
      const quizzes = JSON.parse(data);
      
      const newQuiz = {
        _id: 'quiz_' + Date.now(),
        title,
        description: description || '',
        questions: formattedQuestions.map((q, idx) => ({
          _id: 'q_' + idx + '_' + Date.now(),
          ...q
        })),
        createdAt: new Date().toISOString()
      };
      
      quizzes.push(newQuiz);
      fs.writeFileSync(quizzesFile, JSON.stringify(quizzes, null, 2));
      return res.status(201).json(newQuiz);
    } else {
      const newQuiz = new Quiz({
        title,
        description,
        questions: formattedQuestions
      });
      const savedQuiz = await newQuiz.save();
      return res.status(201).json(savedQuiz);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
