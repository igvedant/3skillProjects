const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { getIsLocalMock, scoresFile } = require('../db');
const fs = require('fs');

// POST save a new score
router.post('/', async (req, res) => {
  const { username, quizId, quizTitle, score, totalQuestions } = req.body;

  if (!username || !quizId || score === undefined || !totalQuestions) {
    return res.status(400).json({ message: 'Missing required score fields' });
  }

  try {
    if (getIsLocalMock()) {
      const data = fs.readFileSync(scoresFile, 'utf8');
      const scores = JSON.parse(data);
      
      const newScore = {
        _id: 'score_' + Date.now(),
        username,
        quizId,
        quizTitle: quizTitle || 'Quiz',
        score: Number(score),
        totalQuestions: Number(totalQuestions),
        createdAt: new Date().toISOString()
      };
      
      scores.push(newScore);
      fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));
      return res.status(201).json(newScore);
    } else {
      const newScore = new Score({
        username,
        quizId,
        quizTitle,
        score,
        totalQuestions
      });
      const savedScore = await newScore.save();
      return res.status(201).json(savedScore);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET scores leaderboard for a specific quiz
router.get('/:quizId', async (req, res) => {
  try {
    if (getIsLocalMock()) {
      const data = fs.readFileSync(scoresFile, 'utf8');
      const scores = JSON.parse(data);
      
      // Filter by quizId, sort by percentage score descending, break ties with oldest first
      const leaderboard = scores
        .filter(s => s.quizId === req.params.quizId)
        .sort((a, b) => {
          const ratioA = a.score / a.totalQuestions;
          const ratioB = b.score / b.totalQuestions;
          if (ratioB !== ratioA) {
            return ratioB - ratioA; // Higher score percentage first
          }
          return new Date(a.createdAt) - new Date(b.createdAt); // Older submission first
        })
        .slice(0, 10); // Top 10 only
        
      return res.json(leaderboard);
    } else {
      const scores = await Score.find({ quizId: req.params.quizId })
        .sort({ score: -1, createdAt: 1 })
        .limit(10);
      return res.json(scores);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
