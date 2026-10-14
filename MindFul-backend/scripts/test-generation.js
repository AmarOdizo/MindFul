const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
let apiKey = '';
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('GEMINI_API_KEY=')) {
    apiKey = trimmed.substring('GEMINI_API_KEY='.length).trim();
  }
});

async function testGeneration() {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
  ];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in one word.");
      const response = await result.response;
      console.log(`✅ SUCCESS [${modelName}]:`, response.text().trim());
    } catch (e) {
      console.log(`❌ FAILED  [${modelName}]:`, e.message.substring(0, 100));
    }
  }
}

testGeneration();
