import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Map } from 'lucide-react';
import { syllabusAPI } from '../services/api';

export default function SyllabusPage() {
  const [syllabusText, setSyllabusText] = useState('');
  const [courseName, setCourseName] = useState('');
  const [syllabi, setSyllabi] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [topics, setTopics] = useState([]);
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSyllabi();
  }, []);

  const loadSyllabi = async () => {
    try {
      const data = await syllabusAPI.list();
      setSyllabi(data.syllabi);
    } catch (error) {
      console.error('Failed to load syllabi', error);
    }
  };

  const handleParseSyllabus = async () => {
    if (!syllabusText.trim()) {
      setMessage({ type: 'error', text: 'Please enter syllabus text' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await syllabusAPI.parse(syllabusText, courseName);
      setMessage({ type: 'success', text: `Parsed ${result.total_topics} topics successfully` });
      setSelectedSyllabus(result.syllabus_id);
      loadSyllabi();
      setSyllabusText('');
      setCourseName('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to parse syllabus' });
    } finally {
      setLoading(false);
    }
  };

  const handleMapTopics = async (syllabusId) => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await syllabusAPI.map(syllabusId);
      setMapping(result);
      
      if (result.topics_needing_content.length > 0) {
        setMessage({
          type: 'warning',
          text: `${result.topics_needing_content.length} topics need more content`
        });
      } else {
        setMessage({ type: 'success', text: 'All topics mapped successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to map topics' });
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (syllabusId) => {
    try {
      const data = await syllabusAPI.getTopics(syllabusId);
      setTopics(data.topics);
      setSelectedSyllabus(syllabusId);
    } catch (error) {
      console.error('Failed to load topics', error);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Syllabus Management
        </h1>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' :
            message.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
            'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Syllabus
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name (Optional)
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Computer Networks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syllabus Text
                </label>
                <textarea
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  placeholder={`Paste your syllabus here...\n\nExample:\nUnit 1: Networks\n- OSI Model\n- TCP/IP\n\nUnit 2: Security\n- Encryption\n- Firewalls`}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <button
                onClick={handleParseSyllabus}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Processing...' : 'Parse Syllabus'}
              </button>
            </div>
          </div>

          {/* Syllabi List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Syllabi
            </h2>

            {syllabi.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No syllabi added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {syllabi.map((syl) => (
                  <div
                    key={syl.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {syl.course_name || 'Untitled Course'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {syl.topics_count} topics
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadTopics(syl.id)}
                        className="flex-1 text-sm bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        View Topics
                      </button>
                      <button
                        onClick={() => handleMapTopics(syl.id)}
                        disabled={loading}
                        className="flex-1 text-sm bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Map className="h-4 w-4" />
                        <span>Map Content</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Topics Display */}
        {topics.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg"
                >
                  {topic.has_sufficient_content ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {topic.name}
                    </div>
                    <div className="text-xs text-gray-500">{topic.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mapping Results */}
        {mapping && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mapping Results
            </h2>
            <div className="space-y-2">
              {mapping.mappings.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">{m.topic}</div>
                    <div className="text-sm text-gray-500">
                      {m.relevant_chunks.length} chunks • {(m.confidence_score * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  {m.has_sufficient_content ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
