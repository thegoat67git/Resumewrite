const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai').default;
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Enable CORS for the frontend origin and handle preflight requests explicitly
app.use(cors());
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || 'https://resumewrite.onrender.com';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname)));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Optimize Resume
app.post('/api/optimize-resume', async (req, res) => {
  try {
    const { resumeContent } = req.body;

    if (!resumeContent || resumeContent.trim().length === 0) {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    const prompt = `You are a professional resume writer and career expert. Your task is to optimize the following resume while maintaining all factual accuracy. Do NOT invent, fabricate, or assume any experience, qualifications, skills, or achievements that are not explicitly mentioned.

IMPORTANT RULES:
- Improve wording, structure, and professional presentation
- Enhance action verbs and achievement descriptions
- Ensure ATS compatibility (clean formatting, standard section names)
- Fix grammar, spelling, and punctuation errors
- Organize information logically and professionally
- Do NOT add or invent any experience, skills, or qualifications
- Do NOT make assumptions about achievements
- If information is vague or unclear, note it in a separate "NOTES FOR USER" section at the end

Original Resume:
${resumeContent}

Please provide the optimized resume in the following structured JSON format:
{
  "optimizedResume": "The full optimized resume text here",
  "changes": ["List of key improvements made"],
  "notes": ["Any notes for the user about missing information or clarifications needed"]
}`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Always maintain factual accuracy and never fabricate information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.json({
        optimizedResume: content,
        changes: ['Resume optimized successfully'],
        notes: []
      });
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    console.error('Error optimizing resume:', error);
    res.status(500).json({ error: 'Failed to optimize resume. Please try again.' });
  }
});

// Generate Resume From Scratch - Initial Questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { stage } = req.body;

    const prompts = {
      contact: `Generate a JSON object with 3-4 brief, focused questions to collect minimal contact information for a resume. 
      Focus on: name, email, location (city/state only - NO full address).
      Format: { "questions": [{ "id": "field_name", "question": "Question text", "placeholder": "Example", "type": "text|email|text", "required": true }] }`,
      
      professional: `Generate a JSON object with 3-4 questions about professional summary and career goals.
      Ask about: years of experience, primary role/title, key strengths (3-5 words), and career objective.
      Format: { "questions": [{ "id": "field_name", "question": "Question text", "placeholder": "Example", "type": "text|textarea", "required": true }] }`,
      
      experience: `Generate a JSON object with 4-5 questions to gather work experience details.
      For one job position, ask about: job title, company name, start date, end date (or "current"), key responsibilities, and major achievements.
      Format: { "questions": [{ "id": "field_name", "question": "Question text", "placeholder": "Example", "type": "text|date|textarea", "required": true }] }`,
      
      education: `Generate a JSON object with 3-4 questions about education.
      Ask about: degree earned, field of study, university name, graduation year.
      Format: { "questions": [{ "id": "field_name", "question": "Question text", "placeholder": "Example", "type": "text|select", "required": false }] }`,
      
      skills: `Generate a JSON object with 2-3 questions about professional skills.
      Ask about: technical skills (comma-separated), soft skills, certifications.
      Format: { "questions": [{ "id": "field_name", "question": "Question text", "placeholder": "Example", "type": "textarea", "required": false }] }`
    };

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompts[stage] || prompts.contact
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to generate questions' });
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
  }
});

// Generate Resume From Collected Data
app.post('/api/generate-resume', async (req, res) => {
  try {
    const { userData } = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const userDataSummary = JSON.stringify(userData, null, 2);

    const prompt = `You are a professional resume writer. Based on the following user information, create a polished, ATS-friendly, professional resume.

IMPORTANT:
- Use only the information provided - do NOT fabricate or assume any details
- Use professional, action-oriented language
- Organize logically with clear sections
- Ensure ATS compatibility
- If critical information is missing, note it in the response

User Information:
${userDataSummary}

Generate a complete professional resume in text format with clear section headers. Format it for professional use.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Create professional resumes using only provided information. Never fabricate details.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const resume = response.choices[0].message.content;
    res.json({ resume });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume. Please try again.' });
  }
});

// Edit Resume with AI assistance
app.post('/api/edit-resume', async (req, res) => {
  try {
    const { resumeContent, editInstructions } = req.body;

    if (!resumeContent || !editInstructions) {
      return res.status(400).json({ error: 'Resume content and edit instructions are required' });
    }

    const prompt = `You are a professional resume writer. The user wants to edit their resume with the following instructions:

Edit Instructions: ${editInstructions}

Current Resume:
${resumeContent}

Please apply the requested edits while maintaining professional quality and factual accuracy. Do NOT add information that wasn't mentioned. Return the updated resume.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Apply edits professionally while maintaining accuracy.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const updatedResume = response.choices[0].message.content;
    res.json({ resume: updatedResume });
  } catch (error) {
    console.error('Error editing resume:', error);
    res.status(500).json({ error: 'Failed to edit resume. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Resume Builder Server running on http://localhost:${PORT}`);
});
