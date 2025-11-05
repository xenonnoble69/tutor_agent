import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Calendar, Target, Clock, Award, BookOpen, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topicMastery, setTopicMastery] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [revisionDue, setRevisionDue] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, masteryData, planData, revisionData] = await Promise.all([
        api.getProgressStats().catch(() => null),
        api.getTopicMastery().catch(() => []),
        api.getStudyPlan().catch(() => null),
        api.getRevisionDue().catch(() => [])
      ]);
      
      setStats(statsData);
      setTopicMastery(masteryData);
      setStudyPlan(planData);
      setRevisionDue(revisionData);
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getMasteryColor = (level) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-500';
    if (level >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMasteryLabel = (level) => {
    if (level >= 80) return 'Mastered';
    if (level >= 60) return 'Good';
    if (level >= 40) return 'Learning';
    return 'Beginner';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Your Progress</h1>
          </div>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats?.total_topics_studied || 0}</span>
            </div>
            <p className="text-blue-100">Topics Studied</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats?.quizzes_completed || 0}</span>
            </div>
            <p className="text-green-100">Quizzes Completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">
                {stats?.average_score ? `${Math.round(stats.average_score)}%` : 'N/A'}
              </span>
            </div>
            <p className="text-purple-100">Average Score</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats?.study_streak || 0}</span>
            </div>
            <p className="text-orange-100">Day Streak</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('mastery')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'mastery'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Topic Mastery
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'plan'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Study Plan
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'revision'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Revision Due
            {revisionDue.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {revisionDue.length}
              </span>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Activity</h2>
              {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_activity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>

            {/* Learning Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Learning Insights</h2>
              <div className="space-y-4">
                {stats?.strongest_topics && stats.strongest_topics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">Strongest Topics</h3>
                    <div className="space-y-1">
                      {stats.strongest_topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats?.weakest_topics && stats.weakest_topics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-orange-700 mb-2">Needs Improvement</h3>
                    <div className="space-y-1">
                      {stats.weakest_topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-gray-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats?.recommended_action && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="text-sm font-semibold text-indigo-900 mb-1">Recommendation</h3>
                    <p className="text-sm text-indigo-700">{stats.recommended_action}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Topic Mastery Tab */}
        {activeTab === 'mastery' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Topic Mastery Levels</h2>
            
            {topicMastery.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No topic mastery data yet</p>
                <p className="text-sm text-gray-400 mt-2">Complete some quizzes to see your progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topicMastery.map((topic, idx) => {
                  const mastery = topic.mastery_level || 0;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{topic.topic_name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span>{topic.attempts || 0} attempts</span>
                            <span>•</span>
                            <span className={`font-medium ${
                              mastery >= 80 ? 'text-green-600' :
                              mastery >= 60 ? 'text-yellow-600' :
                              mastery >= 40 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {getMasteryLabel(mastery)}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {Math.round(mastery)}%
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getMasteryColor(mastery)} transition-all duration-500`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>

                      {topic.last_studied && (
                        <p className="text-xs text-gray-500 mt-2">
                          Last studied: {new Date(topic.last_studied).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Study Plan Tab */}
        {activeTab === 'plan' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">AI-Generated Study Plan</h2>
            
            {!studyPlan ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No study plan available yet</p>
                <p className="text-sm text-gray-400 mt-2">Complete a syllabus to get a personalized study plan</p>
              </div>
            ) : (
              <div className="space-y-6">
                {studyPlan.overview && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="font-semibold text-indigo-900 mb-2">Overview</h3>
                    <p className="text-indigo-700">{studyPlan.overview}</p>
                  </div>
                )}

                {studyPlan.schedule && studyPlan.schedule.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Study Schedule</h3>
                    <div className="space-y-3">
                      {studyPlan.schedule.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-shrink-0 w-16 text-center">
                            <div className="text-sm font-semibold text-indigo-600">
                              {item.week ? `Week ${item.week}` : `Day ${item.day}`}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.topic}</h4>
                            {item.activities && item.activities.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {item.activities.map((activity, aIdx) => (
                                  <li key={aIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {item.duration && (
                              <p className="text-xs text-gray-500 mt-2">
                                Estimated time: {item.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {studyPlan.tips && studyPlan.tips.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">Study Tips</h3>
                    <ul className="space-y-1">
                      {studyPlan.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Revision Due Tab */}
        {activeTab === 'revision' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Topics Due for Revision</h2>
            
            {revisionDue.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold">All caught up!</p>
                <p className="text-sm text-gray-500 mt-2">No topics need revision right now</p>
              </div>
            ) : (
              <div className="space-y-4">
                {revisionDue.map((item, idx) => {
                  const daysOverdue = item.days_overdue || 0;
                  const isOverdue = daysOverdue > 0;
                  
                  return (
                    <div key={idx} className={`border-l-4 rounded-lg p-5 ${
                      isOverdue ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.topic_name}</h3>
                          <div className="mt-2 space-y-1 text-sm">
                            {item.last_reviewed && (
                              <p className="text-gray-600">
                                Last reviewed: {new Date(item.last_reviewed).toLocaleDateString()}
                              </p>
                            )}
                            {item.due_date && (
                              <p className={isOverdue ? 'text-red-700 font-medium' : 'text-yellow-700'}>
                                {isOverdue ? `${daysOverdue} days overdue` : 'Due soon'}
                              </p>
                            )}
                            {item.mastery_level !== undefined && (
                              <p className="text-gray-600">
                                Current mastery: {Math.round(item.mastery_level)}%
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            toast.success('Taking you to the quiz page...');
                            // Navigate to quiz page (you'd implement this with routing)
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                            isOverdue
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-yellow-600 hover:bg-yellow-700'
                          }`}
                        >
                          Review Now
                        </button>
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
