import React, { useState, useEffect } from 'react';
import { FileQuestion, Send, History, Trophy, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function QuizPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [syllabuses, setSyllabuses] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  
  // Current quiz state
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  
  // History state
  const [quizHistory, setQuizHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadSyllabuses();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadQuizHistory();
    }
  }, [activeTab]);

  const loadSyllabuses = async () => {
    try {
      const data = await api.getSyllabuses();
      setSyllabuses(data);
      if (data.length > 0) {
        setSelectedSyllabus(data[0].id);
        setTopics(data[0].topics || []);
      }
    } catch (error) {
      toast.error('Failed to load syllabuses');
    }
  };

  const handleSyllabusChange = (syllabusId) => {
    setSelectedSyllabus(syllabusId);
    const syllabus = syllabuses.find(s => s.id === parseInt(syllabusId));
    setTopics(syllabus?.topics || []);
    setSelectedTopics([]);
  };

  const handleTopicToggle = (topicName) => {
    setSelectedTopics(prev =>
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const generateQuiz = async () => {
    if (!selectedSyllabus) {
      toast.error('Please select a syllabus');
      return;
    }

    setLoading(true);
    try {
      const quiz = await api.generateQuiz({
        syllabus_id: parseInt(selectedSyllabus),
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
        num_questions: numQuestions,
        difficulty: difficulty
      });
      
      setCurrentQuiz(quiz);
      setAnswers({});
      setResults(null);
      setActiveTab('take');
      toast.success('Quiz generated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    if (!currentQuiz || Object.keys(answers).length === 0) {
      toast.error('Please answer at least one question');
      return;
    }

    setLoading(true);
    try {
      const submission = {
        quiz_id: currentQuiz.quiz_id,
        answers: answers
      };
      
      const result = await api.submitQuiz(submission);
      setResults(result);
      setActiveTab('results');
      toast.success(`Quiz submitted! Score: ${result.score}/${result.total_questions}`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizHistory = async () => {
    setHistoryLoading(true);
    try {
      const history = await api.getQuizHistory();
      setQuizHistory(history);
    } catch (error) {
      toast.error('Failed to load quiz history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyBadge = (diff) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[diff] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileQuestion className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Quiz Generator</h1>
          </div>
          <p className="text-gray-600">Test your knowledge with AI-generated quizzes</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'generate'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Generate Quiz
          </button>
          {currentQuiz && (
            <button
              onClick={() => setActiveTab('take')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'take'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileQuestion className="w-4 h-4 inline mr-2" />
              Take Quiz
            </button>
          )}
          {results && (
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'results'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Results
            </button>
          )}
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            History
          </button>
        </div>

        {/* Generate Quiz Tab */}
        {activeTab === 'generate' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Configure Your Quiz</h2>
            
            <div className="space-y-6">
              {/* Syllabus Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Syllabus *
                </label>
                <select
                  value={selectedSyllabus}
                  onChange={(e) => handleSyllabusChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a syllabus...</option>
                  {syllabuses.map(syl => (
                    <option key={syl.id} value={syl.id}>
                      {syl.name || `Syllabus ${syl.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topics Selection */}
              {topics.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Topics (optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {topics.map((topic, idx) => {
                      const topicName = typeof topic === 'string' ? topic : topic.name;
                      return (
                        <label key={idx} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topicName)}
                            onChange={() => handleTopicToggle(topicName)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{topicName}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to include all topics
                  </p>
                </div>
              )}

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions: {numQuestions}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        difficulty === level
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateQuiz}
                disabled={loading || !selectedSyllabus}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Quiz...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FileQuestion className="w-5 h-5" />
                    Generate Quiz
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Take Quiz Tab */}
        {activeTab === 'take' && currentQuiz && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentQuiz.title || 'Quiz'}</h2>
                  <p className="text-gray-600 mt-1">{currentQuiz.questions?.length || 0} Questions</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyBadge(currentQuiz.difficulty || 'medium')}`}>
                  {(currentQuiz.difficulty || 'medium').charAt(0).toUpperCase() + (currentQuiz.difficulty || 'medium').slice(1)}
                </span>
              </div>
            </div>

            {currentQuiz.questions?.map((question, idx) => (
              <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
                    {question.topic && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {question.topic}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 ml-11">
                  {question.options?.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[question.id] === option
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submitQuiz}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Submit Quiz
                </span>
              )}
            </button>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && results && (
          <div className="space-y-6">
            {/* Score Summary */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <div className="text-6xl font-bold my-6">
                  {results.score}/{results.total_questions}
                </div>
                <div className="text-xl opacity-90">
                  {Math.round((results.score / results.total_questions) * 100)}% Correct
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            {results.details?.map((detail, idx) => {
              const isCorrect = detail.correct;
              return (
                <div key={idx} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{detail.question}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        
                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Your answer:</span>{' '}
                            <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {detail.user_answer}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Correct answer:</span>{' '}
                              <span className="text-green-700">{detail.correct_answer}</span>
                            </p>
                          )}
                        </div>

                        {detail.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">{detail.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveTab('generate');
                  setCurrentQuiz(null);
                  setAnswers({});
                  setResults(null);
                }}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Take Another Quiz
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Quiz History</h2>
            
            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : quizHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quiz history yet</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Take your first quiz →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quizHistory.map((quiz) => {
                  const percentage = Math.round((quiz.score / quiz.total_questions) * 100);
                  return (
                    <div key={quiz.quiz_id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {quiz.title || `Quiz ${quiz.quiz_id}`}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(quiz.created_at).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyBadge(quiz.difficulty)}`}>
                              {quiz.difficulty}
                            </span>
                            {quiz.topics && quiz.topics.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {quiz.topics.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                            {quiz.score}/{quiz.total_questions}
                          </div>
                          <div className="text-sm text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
