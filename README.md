# Resumewrite - Resume Builder

Professional AI-powered resume builder with two workflows: optimize existing resumes and create from scratch.

## Features

- ✨ Resume Optimization - Enhance existing resumes with AI
- 📝 Resume Creation - Guided step-by-step process
- 🤖 GPT-4o AI Integration - Professional-grade resume generation
- 💾 PDF Export - Download as professional PDF
- 📱 Responsive Design - Works on desktop and mobile
- 🔒 Privacy-First - Minimal data collection
- ✓ ATS-Optimized - Employer-ready formatting

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
# Edit .env and add your OpenAI API key

# Start server
npm start
```

Server runs on `http://localhost:3000`

Open `Resumewriter.html` in your browser.

## Deployment on Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step instructions.

Quick summary:
1. Push code to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy (free tier available)

Your backend will be live at: `https://resumewrite-builder.onrender.com`

## Project Structure

```
.
├── Resumewriter.html           # Main frontend
├── api-config.js               # Smart API URL configuration
├── resume-builder-server.js    # Express backend
├── package.json                # Dependencies
├── .env                        # Environment variables (don't commit)
├── .env.example                # Template for .env
├── .gitignore                  # Git ignore rules
└── DEPLOYMENT.md               # Deployment guide
```

## API Endpoints

- `POST /api/optimize-resume` - Optimize existing resume
- `POST /api/generate-questions` - Get questions for current step
- `POST /api/generate-resume` - Generate resume from collected data
- `POST /api/edit-resume` - Apply edits to existing resume
- `GET /api/health` - Health check

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL` - Model to use (default: gpt-4o)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Dependencies

- **express** - Web server framework
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **openai** - OpenAI API client
- **html2pdf** - PDF generation (frontend)

## License

ISC
