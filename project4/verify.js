const http = require('http');

console.log('Testing MERN Quiz App API endpoints...');

const testEndpoint = (url, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('\n1. Testing Backend Root Endpoint...');
    // We expect a text reply, but testEndpoint expects JSON. Let's write custom fetch for text.
    await new Promise((resolve, reject) => {
      http.get('http://localhost:5000/', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log('✓ Success! Response:', data);
          resolve();
        });
      }).on('error', reject);
    });

    console.log('\n2. Testing GET /api/quizzes endpoint...');
    const quizzesRes = await testEndpoint('http://localhost:5000/api/quizzes');
    console.log(`✓ Success! Status: ${quizzesRes.status}`);
    console.log(`Number of quizzes found: ${quizzesRes.data.length}`);
    if (quizzesRes.data.length > 0) {
      console.log('First Quiz Title:', quizzesRes.data[0].title);
      console.log('Questions count:', quizzesRes.data[0].questions.length);
      
      const quizId = quizzesRes.data[0]._id;
      console.log(`\n3. Testing GET /api/quizzes/${quizId} endpoint...`);
      const singleQuizRes = await testEndpoint(`http://localhost:5000/api/quizzes/${quizId}`);
      console.log(`✓ Success! Status: ${singleQuizRes.status}`);
      console.log('Quiz Title fetched:', singleQuizRes.data.title);

      console.log(`\n4. Testing POST /api/quizzes/${quizId}/submit endpoint...`);
      // Submit empty answers
      const submitBody = { answers: new Array(singleQuizRes.data.questions.length).fill(null) };
      const submitRes = await testEndpoint(`http://localhost:5000/api/quizzes/${quizId}/submit`, 'POST', submitBody);
      console.log(`✓ Success! Status: ${submitRes.status}`);
      console.log('Score returned:', submitRes.data.score);
      console.log('Feedback item count:', submitRes.data.feedback.length);
    }

    console.log('\nAll API integration tests passed successfully! 🚀');
  } catch (err) {
    console.error('\n✗ Test failed:', err.message);
    console.error('Make sure the backend server is running on http://localhost:5000');
  }
};

// Wait 1.5 seconds and run
setTimeout(runTests, 1000);
