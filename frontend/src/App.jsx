import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, FileText, GraduationCap, BarChart3, Home } from 'lucide-react';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import SyllabusPage from './pages/SyllabusPage';
import LearnPage from './pages/LearnPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Agentic AI Tutor
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <NavLink to="/" icon={<Home className="h-5 w-5" />}>
                  Home
                </NavLink>
                <NavLink to="/documents" icon={<FileText className="h-5 w-5" />}>
                  Documents
                </NavLink>
                <NavLink to="/syllabus" icon={<BookOpen className="h-5 w-5" />}>
                  Syllabus
                </NavLink>
                <NavLink to="/learn" icon={<GraduationCap className="h-5 w-5" />}>
                  Learn
                </NavLink>
                <NavLink to="/progress" icon={<BarChart3 className="h-5 w-5" />}>
                  Progress
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/syllabus" element={<SyllabusPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default App;
