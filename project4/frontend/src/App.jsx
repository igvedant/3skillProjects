import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import QuizSession from './components/QuizSession';
import QuizResult from './components/QuizResult';
import Leaderboard from './components/Leaderboard';
import CreateQuiz from './components/CreateQuiz';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:id" element={<QuizSession />} />
            <Route path="/result" element={<QuizResult />} />
            <Route path="/leaderboard/:id" element={<Leaderboard />} />
            <Route path="/create" element={<CreateQuiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
