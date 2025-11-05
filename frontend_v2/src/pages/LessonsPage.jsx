import { useState, useEffect, useRef } from 'react';
import { Brain, Send, Loader2, MessageCircle, BookOpen, List } from 'lucide-react';
import { lessonsAPI, syllabusAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function LessonsPage() {
  const [topic, setTopic] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [syllabi, setSyllabi] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [view, setView] = useState('teach'); // 'teach' or 'plan'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadSyllabi();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSyllabi = async () => {
    try {
      const data = await syllabusAPI.list();
      setSyllabi(data.syllabi || []);
    } catch (error) {
      console.error('Failed to load syllabi', error);
    }
  };

  const startTeaching = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await lessonsAPI.teach(topic);
      setSessionId(response.session_id);
      setMessages([
        {
          role: 'assistant',
          content: response.message,
          followUp: response.follow_up_question,
          timestamp: new Date().toISOString()
        }
      ]);
      toast.success('Teaching session started!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to start teaching session');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await lessonsAPI.teach(topic, userInput, sessionId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        followUp: response.follow_up_question,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createLessonPlan = async () => {
    if (!selectedSyllabus) {
      toast.error('Please select a syllabus');
      return;
    }

    setLoading(true);
    const planToast = toast.loading('Creating lesson plan...');
    
    try {
      const plan = await lessonsAPI.createPlan(selectedSyllabus);
      setLessonPlan(plan);
      toast.success(`Created ${plan.total_lessons} lessons!`, { id: planToast });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create lesson plan', { id: planToast });
    } finally {
      setLoading(false);
    }
  };

  const startLessonFromPlan = (lessonTopic) => {
    setTopic(lessonTopic);
    setView('teach');
    setMessages([]);
    setSessionId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Learning Center
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized lessons and interactive teaching
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('teach')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'teach'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <MessageCircle className="h-4 w-4 inline mr-2" />
            Teach
          </button>
          <button
            onClick={() => setView('plan')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'plan'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List className="h-4 w-4 inline mr-2" />
            Lesson Plan
          </button>
        </div>
      </div>

      {view === 'teach' ? (
        <div className="space-y-6">
          {/* Topic Input */}
          {messages.length === 0 && (
            <div className="card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="h-8 w-8 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  What would you like to learn today?
                </h2>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && startTeaching()}
                  placeholder="Enter a topic (e.g., OSI Model, TCP/IP Protocol)"
                  className="input-field flex-1"
                  disabled={loading}
                />
                <button
                  onClick={startTeaching}
                  disabled={loading || !topic.trim()}
                  className="btn-primary px-8"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Start Learning'}
                </button>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {messages.length > 0 && (
            <div className="card flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Learning: {topic}</h3>
                    <p className="text-sm text-gray-500">AI Tutor Session</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMessages([]);
                    setSessionId(null);
                    setTopic('');
                  }}
                  className="btn-secondary text-sm"
                >
                  New Topic
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl p-4 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      {msg.followUp && (
                        <p className="mt-3 pt-3 border-t border-white/20 text-sm italic opacity-90">
                          💭 {msg.followUp}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-xl">
                      <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your response or question..."
                    className="input-field flex-1"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !userInput.trim()}
                    className="btn-primary px-6"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Lesson Plan View */
        <div className="space-y-6">
          {/* Syllabus Selection */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Generate Lesson Plan
            </h2>
            <div className="flex space-x-3">
              <select
                value={selectedSyllabus || ''}
                onChange={(e) => setSelectedSyllabus(e.target.value)}
                className="input-field flex-1"
                disabled={loading}
              >
                <option value="">Select a syllabus...</option>
                {syllabi.map(syl => (
                  <option key={syl.id} value={syl.id}>
                    {syl.course_name || 'Untitled Course'} ({syl.topics_count} topics)
                  </option>
                ))}
              </select>
              <button
                onClick={createLessonPlan}
                disabled={loading || !selectedSyllabus}
                className="btn-primary px-8"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Generate Plan'}
              </button>
            </div>
          </div>

          {/* Lesson Plan Display */}
          {lessonPlan && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Lesson Plan ({lessonPlan.total_lessons} Lessons)
                </h2>
                <span className="badge-primary">
                  {lessonPlan.total_lessons * 45} minutes total
                </span>
              </div>
              
              <div className="space-y-3">
                {lessonPlan.lessons.map((lesson) => (
                  <div
                    key={lesson.lesson_number}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                            {lesson.lesson_number}
                          </span>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 ml-11">
                          <span className="flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            {lesson.topic}
                          </span>
                          <span>•</span>
                          <span>{lesson.estimated_duration}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startLessonFromPlan(lesson.topic)}
                        className="btn-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Start Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
