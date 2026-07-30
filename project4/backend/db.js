const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isLocalMock = false;

// Set up local data directory for JSON fallback
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const quizzesFile = path.join(dataDir, 'quizzes.json');
const scoresFile = path.join(dataDir, 'scores.json');

// Prepopulate quizzes if file doesn't exist
if (!fs.existsSync(quizzesFile)) {
  const defaultQuizzes = [
    {
      _id: 'quiz_javascript_basics',
      title: 'JavaScript Basics',
      description: 'Test your fundamental knowledge of JavaScript variable scopes, types, operators, and syntax.',
      questions: [
        {
          _id: 'q_js_1',
          questionText: 'What is the correct syntax to output "Hello World" to the console in JavaScript?',
          options: [
            'response.write("Hello World")',
            'console.log("Hello World")',
            'document.write("Hello World")',
            'print("Hello World")'
          ],
          correctAnswerIndex: 1
        },
        {
          _id: 'q_js_2',
          questionText: 'Which keyword is used to declare a block-scoped variable in modern JavaScript?',
          options: [
            'var',
            'let',
            'const',
            'both let and const'
          ],
          correctAnswerIndex: 3
        },
        {
          _id: 'q_js_3',
          questionText: 'How do you write a comment in JavaScript?',
          options: [
            '// this is a comment',
            '<!-- this is a comment -->',
            '/* this is a comment */',
            'both // and /* */ are correct'
          ],
          correctAnswerIndex: 3
        },
        {
          _id: 'q_js_4',
          questionText: 'What will "typeof null" return in JavaScript?',
          options: [
            '"null"',
            '"undefined"',
            '"object"',
            '"number"'
          ],
          correctAnswerIndex: 2
        },
        {
          _id: 'q_js_5',
          questionText: 'Which operator is used for strict equality comparison (compares both value and type)?',
          options: [
            '=',
            '==',
            '===',
            '!=='
          ],
          correctAnswerIndex: 2
        }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'quiz_html_css_basics',
      title: 'HTML & CSS Basics',
      description: 'Challenge your understanding of basic HTML markup tags and CSS flexbox styling.',
      questions: [
        {
          _id: 'q_hc_1',
          questionText: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Text Markup Language',
            'Hyper Tabular Markup Language',
            'Home Tool Markup Language'
          ],
          correctAnswerIndex: 0
        },
        {
          _id: 'q_hc_2',
          questionText: 'Which HTML tag is used to define an internal style sheet?',
          options: [
            '<css>',
            '<script>',
            '<style>',
            '<link>'
          ],
          correctAnswerIndex: 2
        },
        {
          _id: 'q_hc_3',
          questionText: 'Which CSS property is used to change the text color of an element?',
          options: [
            'text-color',
            'font-color',
            'fgcolor',
            'color'
          ],
          correctAnswerIndex: 3
        },
        {
          _id: 'q_hc_4',
          questionText: 'What is the correct HTML element for inserting a line break?',
          options: [
            '<break>',
            '<lb>',
            '<br>',
            '<hr>'
          ],
          correctAnswerIndex: 2
        },
        {
          _id: 'q_hc_5',
          questionText: 'In CSS Flexbox, which property aligns items along the main axis?',
          options: [
            'align-items',
            'justify-content',
            'align-content',
            'flex-direction'
          ],
          correctAnswerIndex: 1
        }
      ],
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(quizzesFile, JSON.stringify(defaultQuizzes, null, 2));
}

if (!fs.existsSync(scoresFile)) {
  fs.writeFileSync(scoresFile, JSON.stringify([], null, 2));
}

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quizdb';
  try {
    mongoose.set('strictQuery', false);
    // Timeout quickly so the server doesn't hang if MongoDB isn't running
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('>>> Connected to MongoDB database successfully! <<<');
  } catch (err) {
    console.warn('\n================================================================');
    console.warn('WARNING: Could not connect to MongoDB database.');
    console.warn('Reason:', err.message);
    console.warn('Running in LOCAL MOCK DATABASE MODE (using local JSON files).');
    console.warn('Data will be saved in backend/data/ directory.');
    console.warn('================================================================\n');
    isLocalMock = true;
  }
};

const getIsLocalMock = () => isLocalMock;

module.exports = { connectDB, getIsLocalMock, quizzesFile, scoresFile };
