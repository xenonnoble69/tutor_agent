import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Brain, 
  BarChart3, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

// Pages
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import SyllabusPage from './pages/SyllabusPage';
import LessonsPage from './pages/LessonsPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Agentic AI Tutor
                  </span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/" icon={<Home className="h-4 w-4" />}>
                  Home
                </NavLink>
                <NavLink to="/documents" icon={<FileText className="h-4 w-4" />}>
                  Documents
                </NavLink>
                <NavLink to="/syllabus" icon={<BookOpen className="h-4 w-4" />}>
                  Syllabus
                </NavLink>
                <NavLink to="/lessons" icon={<Brain className="h-4 w-4" />}>
                  Lessons
                </NavLink>
                <NavLink to="/quiz" icon={<GraduationCap className="h-4 w-4" />}>
                  Quiz
                </NavLink>
                <NavLink to="/progress" icon={<BarChart3 className="h-4 w-4" />}>
                  Progress
                </NavLink>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
              <div className="px-4 pt-2 pb-3 space-y-1">
                <MobileNavLink to="/" icon={<Home className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/documents" icon={<FileText className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Documents
                </MobileNavLink>
                <MobileNavLink to="/syllabus" icon={<BookOpen className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Syllabus
                </MobileNavLink>
                <MobileNavLink to="/lessons" icon={<Brain className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Lessons
                </MobileNavLink>
                <MobileNavLink to="/quiz" icon={<GraduationCap className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Quiz
                </MobileNavLink>
                <MobileNavLink to="/progress" icon={<BarChart3 className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                  Progress
                </MobileNavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/syllabus" element={<SyllabusPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>© 2025 Agentic AI Tutor. Powered by Google Gemini.</p>
              <p className="mt-1">Built with ❤️ using React & FastAPI</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-primary-50 text-primary-700 shadow-sm'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default App;
