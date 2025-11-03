import { useState, useEffect } from 'react';
import { MessageCircle, Send, BookOpen, FileQuestion } from 'lucide-react';
import { lessonsAPI, quizAPI } from '../services/api';

export default function LearnPage() {
  const [mode, setMode] = useState('teach'); // 'teach' or 'quiz'
  const [topic, setTopic] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const startTeaching = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await lessonsAPI.teach(topic);
      setSessionId(response.session_id);
      setMessages([
        {
          role: 'assistant',
          content: response.message,
          followUp: response.follow_up_question
        }
      ]);
    } catch (error) {
      alert('Failed to start teaching session');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setMessages([...messages, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await lessonsAPI.teach(topic, userInput, sessionId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        followUp: response.follow_up_question
      }]);
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await quizAPI.generate(topic, 5, 'medium');
      setQuiz(response);
      setAnswers({});
      setQuizResult(null);
    } catch (error) {
      alert('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const result = await quizAPI.submit(quiz.quiz_id, answers);
      setQuizResult(result);
    } catch (error) {
      alert('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Learning Center
        </h1>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setMode('teach')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                mode === 'teach'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Interactive Teaching</span>
              </div>
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                mode === 'quiz'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileQuestion className="h-5 w-5" />
                <span>Take Quiz</span>
              </div>
            </button>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g., OSI Model)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={mode === 'teach' ? startTeaching : startQuiz}
              disabled={loading || !topic.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Loading...' : mode === 'teach' ? 'Start Learning' : 'Generate Quiz'}
            </button>
          </div>
        </div>

        {/* Teaching Mode */}
        {mode === 'teach' && messages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.followUp && (
                      <p className="mt-2 text-sm opacity-75 italic">
                        {msg.followUp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !userInput.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && quiz && !quizResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quiz: {quiz.topic}
            </h2>
            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <div key={q.question_id} className="border-b border-gray-200 pb-6 last:border-0">
                  <p className="font-medium text-gray-900 mb-3">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={q.question_id}
                          value={option}
                          checked={answers[q.question_id] === option}
                          onChange={() => setAnswers({ ...answers, [q.question_id]: option })}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submitQuiz}
              disabled={loading || Object.keys(answers).length < quiz.questions.length}
              className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        )}

        {/* Quiz Results */}
        {quizResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quiz Results
            </h2>
            <div className="mb-6 p-6 bg-primary-50 rounded-lg">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">
                  {quizResult.score.toFixed(0)}%
                </div>
                <div className="text-gray-600">
                  {quizResult.correct_answers} out of {quizResult.total_questions} correct
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {quizResult.feedback.map((f, idx) => (
                <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className={`font-medium ${f.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                    Question {idx + 1}: {f.is_correct ? 'Correct ✓' : 'Incorrect ✗'}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{f.feedback}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setQuiz(null);
                setQuizResult(null);
                setAnswers({});
              }}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
