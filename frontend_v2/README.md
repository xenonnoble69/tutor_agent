# Agentic AI Tutor - Frontend v2

A modern, professional React-based frontend for the Agentic AI Tutor system. Built with React, Vite, TailwindCSS, and full integration with the backend API.

## ✨ Features

### 📚 Complete Feature Set
- **Documents Management**: Upload, view, and delete PDF documents with drag-and-drop support
- **Syllabus Creation**: Parse syllabus text, map topics to documents, and manage syllabi
- **Interactive Lessons**: AI-powered teaching chat and lesson plan generation
- **Quiz System**: Generate custom quizzes, take tests, view results with explanations
- **Progress Tracking**: Comprehensive analytics, topic mastery, study plans, and revision reminders

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Beautiful gradient backgrounds and smooth animations
- Professional component library with consistent styling
- Toast notifications for user feedback
- Loading states and error handling throughout

### 🔌 Full Backend Integration
- Complete API client covering all backend endpoints
- Proper error handling and retry logic
- Real-time updates and data synchronization
- File upload with progress tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend server running at `http://localhost:8000`

### Installation

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Or manually install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
frontend_v2/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page with hero and features
│   │   ├── DocumentsPage.jsx     # Document upload and management
│   │   ├── SyllabusPage.jsx      # Syllabus parsing and topic mapping
│   │   ├── LessonsPage.jsx       # AI teaching chat and lesson plans
│   │   ├── QuizPage.jsx          # Quiz generation, taking, and results
│   │   └── ProgressPage.jsx      # Progress analytics and study plans
│   ├── services/
│   │   └── api.js                # Complete API client
│   ├── App.jsx                   # Main app shell with routing
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles with Tailwind
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # TailwindCSS configuration
├── package.json                  # Dependencies and scripts
└── setup.sh                      # Automated setup script
```

## 🎯 Pages Overview

### Home Page
- Hero section with call-to-action
- Feature highlights with icons
- Benefits and system overview
- Quick navigation to other pages

### Documents Page
- Upload PDF documents (drag-and-drop or click)
- View all uploaded documents in a grid
- Delete documents with confirmation
- Real-time upload progress
- Document metadata display

### Syllabus Page
- Create new syllabus from text input
- Parse syllabus and extract topics
- Map topics to uploaded documents
- View and manage all syllabi
- Topics list with document assignments

### Lessons Page
- AI-powered teaching chat
- Context-aware responses
- Lesson plan generation
- Topic selection and customization
- Chat history with markdown support
- Beautiful message bubbles

### Quiz Page
- Generate custom quizzes with:
  - Syllabus selection
  - Topic filtering
  - Number of questions (1-20)
  - Difficulty levels (easy/medium/hard)
- Interactive quiz taking interface
- Detailed results with explanations
- Quiz history tracking
- Score analytics

### Progress Page
- Overview dashboard with stats:
  - Topics studied
  - Quizzes completed
  - Average score
  - Study streak
- Topic mastery tracking with progress bars
- AI-generated study plans
- Revision due reminders
- Recent activity timeline
- Learning insights and recommendations

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **React Router v6**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icon library
- **React Hot Toast**: Elegant notifications

## 🔧 Configuration

### Backend API URL
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### Environment Variables
Create a `.env` file for custom configuration:
```env
VITE_API_BASE_URL=http://localhost:8000
```

Then update `api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

## 📦 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Styling Guidelines

### Color Palette
- **Primary**: Purple/Blue gradient (`from-purple-600 to-blue-600`)
- **Success**: Green (`green-500`, `green-600`)
- **Warning**: Yellow/Orange (`yellow-500`, `orange-500`)
- **Error**: Red (`red-500`, `red-600`)
- **Neutral**: Gray shades for text and backgrounds

### Component Patterns
- Cards: White background with `rounded-xl shadow-lg`
- Buttons: Gradient backgrounds with hover effects
- Inputs: Border with focus ring in primary color
- Loading: Spinning border animation
- Toast: Clean notifications with appropriate colors

## 🔌 API Integration

The `api.js` service provides methods for all backend endpoints:

### Documents
- `uploadDocument(file)` - Upload PDF
- `getDocuments()` - List all documents
- `deleteDocument(id)` - Delete document

### Syllabus
- `uploadSyllabus(text)` - Create syllabus from text
- `getSyllabuses()` - List all syllabi
- `mapTopicToDocuments(data)` - Map topics to documents
- `getMappings(syllabusId)` - Get topic mappings

### Lessons
- `chat(message, syllabusId, history)` - AI teaching chat
- `generateLessonPlan(syllabusId, topics)` - Generate lesson plan

### Quiz
- `generateQuiz(params)` - Generate quiz
- `submitQuiz(submission)` - Submit quiz answers
- `getQuizHistory()` - Get quiz history

### Progress
- `getProgressStats()` - Overall progress statistics
- `getTopicMastery()` - Topic-wise mastery levels
- `getStudyPlan()` - AI-generated study plan
- `getRevisionDue()` - Topics needing revision

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder will contain the production-ready files.

### Deploy with Docker
A Dockerfile is included in the original frontend folder that can be adapted.

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL`

## 🐛 Troubleshooting

### CORS Issues
Make sure the backend has proper CORS configuration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Connection Errors
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify API URL in `api.js`
3. Check browser console for detailed errors

### Build Issues
1. Clear node_modules: `rm -rf node_modules`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install`

## 🤝 Contributing

This is a complete frontend implementation. To extend:

1. Add new pages in `src/pages/`
2. Add routes in `App.jsx`
3. Add API methods in `api.js`
4. Follow existing component patterns
5. Use TailwindCSS utility classes
6. Ensure responsive design

## 📝 License

See the main project LICENSE file.

## 🎓 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)

---

**Built with ❤️ for the Agentic AI Tutor project**
