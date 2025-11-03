import { Link } from 'react-router-dom';
import { FileText, BookOpen, GraduationCap, BarChart3, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Sparkles className="h-16 w-16 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Agentic AI Tutor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your intelligent learning companion that maps your study materials to syllabus topics,
          generates personalized lessons, and adapts to your learning pace.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
          icon={<GraduationCap className="h-8 w-8" />}
          title="Start Learning"
          description="Interactive lessons, quizzes, and personalized teaching"
          link="/learn"
          color="purple"
        />
        <FeatureCard
          icon={<BarChart3 className="h-8 w-8" />}
          title="Track Progress"
          description="Monitor your learning journey and weak areas"
          link="/progress"
          color="orange"
        />
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Getting Started
        </h2>
        <div className="space-y-4">
          <Step
            number="1"
            title="Upload Study Materials"
            description="Start by uploading your lecture notes, textbooks, or study materials."
          />
          <Step
            number="2"
            title="Add Your Syllabus"
            description="Paste your course syllabus so the AI can map topics to your materials."
          />
          <Step
            number="3"
            title="Begin Learning"
            description="Get personalized lessons, take quizzes, and track your progress."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Link
      to={link}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
    >
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
