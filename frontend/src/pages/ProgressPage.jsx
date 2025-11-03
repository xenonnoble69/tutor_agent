import { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { progressAPI } from '../services/api';

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [topicMastery, setTopicMastery] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const [statsData, masteryData, planData] = await Promise.all([
        progressAPI.getStats(),
        progressAPI.getTopicMastery(),
        progressAPI.getStudyPlan(),
      ]);
      setStats(statsData);
      setTopicMastery(masteryData);
      setStudyPlan(planData);
    } catch (error) {
      console.error('Failed to load progress', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Learning Progress
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="h-8 w-8" />}
            title="Topics Completed"
            value={`${stats?.topics_completed || 0}/${stats?.total_topics || 0}`}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Average Score"
            value={`${stats?.average_score?.toFixed(0) || 0}%`}
            color="green"
          />
          <StatCard
            icon={<Award className="h-8 w-8" />}
            title="Strong Areas"
            value={stats?.strong_areas?.length || 0}
            color="purple"
          />
          <StatCard
            icon={<Calendar className="h-8 w-8" />}
            title="Weak Areas"
            value={stats?.weak_areas?.length || 0}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strong & Weak Areas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Areas Analysis
            </h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-green-600 mb-2">
                💪 Strong Areas
              </h3>
              {stats?.strong_areas?.length > 0 ? (
                <div className="space-y-2">
                  {stats.strong_areas.map((area, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No strong areas yet. Keep learning!</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-orange-600 mb-2">
                🎯 Needs Improvement
              </h3>
              {stats?.weak_areas?.length > 0 ? (
                <div className="space-y-2">
                  {stats.weak_areas.map((area, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                      <span className="text-sm text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Great! No weak areas identified.</p>
              )}
            </div>
          </div>

          {/* Study Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Weekly Study Plan
            </h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-primary-600 mb-2">
                📚 New Topics to Study
              </h3>
              {studyPlan?.topics_to_study?.length > 0 ? (
                <div className="space-y-2">
                  {studyPlan.topics_to_study.map((topic, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-primary-50 rounded">
                      <span className="text-sm text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">All topics covered!</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-purple-600 mb-2">
                🔄 Topics to Revise
              </h3>
              {studyPlan?.topics_to_revise?.length > 0 ? (
                <div className="space-y-2">
                  {studyPlan.topics_to_revise.map((topic, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
                      <span className="text-sm text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No revisions needed right now.</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated Time:</span>
                <span className="font-medium text-gray-900">
                  {studyPlan?.estimated_hours || 0} hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Mastery */}
        {topicMastery.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Topic Mastery Levels
            </h2>
            <div className="space-y-4">
              {topicMastery.map((topic, idx) => (
                <div key={idx} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{topic.topic}</div>
                      <div className="text-sm text-gray-500">
                        {topic.attempts} attempts • Last practiced:{' '}
                        {new Date(topic.last_practiced).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        topic.score >= 80 ? 'text-green-600' :
                        topic.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {topic.score.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        topic.score >= 80 ? 'bg-green-600' :
                        topic.score >= 60 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!stats?.topics_completed && topicMastery.length === 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Learning Journey
            </h3>
            <p className="text-gray-600 mb-6">
              Upload documents, add your syllabus, and start learning to see your progress here.
            </p>
            <a
              href="/documents"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}
