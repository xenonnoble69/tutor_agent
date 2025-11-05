import { Link } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Brain, 
  GraduationCap, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  Target
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <Sparkles className="h-20 w-20 text-primary-600 relative" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Welcome to Agentic AI Tutor
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your intelligent learning companion that maps study materials to syllabus topics,
          generates personalized lessons, and adapts to your learning pace.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/documents"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl group"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/progress"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-primary-200"
          >
            View Progress
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<FileText className="h-8 w-8" />}
          title="Upload Documents"
          description="Upload PDFs, DOCX, or text files with your study materials"
          link="/documents"
          color="blue"
        />
        <FeatureCard
          icon={<BookOpen className="h-8 w-8" />}
          title="Add Syllabus"
          description="Paste or upload your course syllabus to map content"
          link="/syllabus"
          color="green"
        />
        <FeatureCard
          icon={<Brain className="h-8 w-8" />}
          title="Smart Lessons"
          description="AI-powered personalized lessons and teaching sessions"
          link="/lessons"
          color="purple"
        />
        <FeatureCard
          icon={<GraduationCap className="h-8 w-8" />}
          title="Take Quizzes"
          description="Test your knowledge with auto-generated quizzes"
          link="/quiz"
          color="orange"
        />
      </div>

      {/* How It Works */}
      <div className="card p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Step
            number="1"
            icon={<FileText className="h-6 w-6" />}
            title="Upload Materials"
            description="Upload your lecture notes, textbooks, or study materials"
          />
          <Step
            number="2"
            icon={<BookOpen className="h-6 w-6" />}
            title="Add Syllabus"
            description="Paste your course syllabus for topic mapping"
          />
          <Step
            number="3"
            icon={<Brain className="h-6 w-6" />}
            title="Learn & Practice"
            description="Get personalized lessons and take quizzes"
          />
          <Step
            number="4"
            icon={<BarChart3 className="h-6 w-6" />}
            title="Track Progress"
            description="Monitor your learning journey and weak areas"
          />
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BenefitCard
          icon={<Zap className="h-8 w-8" />}
          title="AI-Powered"
          description="Leveraging Google Gemini for intelligent content analysis and personalized teaching"
        />
        <BenefitCard
          icon={<Target className="h-8 w-8" />}
          title="Adaptive Learning"
          description="Adjusts to your pace and focuses on areas that need improvement"
        />
        <BenefitCard
          icon={<CheckCircle className="h-8 w-8" />}
          title="Comprehensive Tracking"
          description="Detailed progress analytics and personalized study plans"
        />
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
          Start your journey towards smarter, more efficient learning today.
        </p>
        <Link
          to="/documents"
          className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl group"
        >
          Start Learning Now
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700',
    green: 'from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700',
  };

  return (
    <Link
      to={link}
      className="card p-6 hover:scale-105 transition-transform duration-200 group cursor-pointer"
    >
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}

function Step({ number, icon, title, description }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {number}
          </div>
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <div className="card p-6 text-center">
      <div className="inline-flex p-4 rounded-xl bg-primary-50 text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
