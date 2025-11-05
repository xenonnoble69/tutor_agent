import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Map, Loader2, Plus, Eye, Sparkles } from 'lucide-react';
import { syllabusAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function SyllabusPage() {
  const [syllabusText, setSyllabusText] = useState('');
  const [courseName, setCourseName] = useState('');
  const [syllabi, setSyllabi] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [topics, setTopics] = useState([]);
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'create'

  useEffect(() => {
    loadSyllabi();
  }, []);

  const loadSyllabi = async () => {
    try {
      const data = await syllabusAPI.list();
      setSyllabi(data.syllabi || []);
    } catch (error) {
      console.error('Failed to load syllabi', error);
    }
  };

  const handleParseSyllabus = async () => {
    if (!syllabusText.trim()) {
      toast.error('Please enter syllabus text');
      return;
    }

    setLoading(true);
    const parseToast = toast.loading('Parsing syllabus...');

    try {
      const result = await syllabusAPI.parse(syllabusText, courseName || null);
      toast.success(`Successfully parsed ${result.total_topics} topics!`, { id: parseToast });
      setSelectedSyllabus(result.syllabus_id);
      setSyllabusText('');
      setCourseName('');
      setView('list');
      loadSyllabi();
      loadTopics(result.syllabus_id);
    } catch (error) {
      toast.error('Failed to parse syllabus', { id: parseToast });
    } finally {
      setLoading(false);
    }
  };

  const handleMapTopics = async (syllabusId) => {
    setLoading(true);
    const mapToast = toast.loading('Mapping topics to content...');

    try {
      const result = await syllabusAPI.map(syllabusId);
      setMapping(result);
      
      if (result.topics_needing_content.length > 0) {
        toast.success(`Mapped ${result.total_mapped} topics. ${result.topics_needing_content.length} need more content.`, { id: mapToast });
      } else {
        toast.success('All topics mapped successfully!', { id: mapToast });
      }
      
      loadTopics(syllabusId);
    } catch (error) {
      toast.error('Failed to map topics', { id: mapToast });
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (syllabusId) => {
    try {
      const data = await syllabusAPI.getTopics(syllabusId);
      setTopics(data.topics || []);
      setSelectedSyllabus(syllabusId);
    } catch (error) {
      console.error('Failed to load topics', error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Syllabus Management
          </h1>
          <p className="text-lg text-gray-600">
            Parse your course syllabus and map topics to your study materials
          </p>
        </div>
        <button
          onClick={() => setView(view === 'create' ? 'list' : 'create')}
          className="btn-primary flex items-center space-x-2"
        >
          {view === 'create' ? (
            <>
              <Eye className="h-4 w-4" />
              <span>View Syllabi</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </>
          )}
        </button>
      </div>

      {view === 'create' ? (
        /* Create Form */
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Syllabus
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Name (Optional)
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Computer Networks 101"
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Syllabus Text *
              </label>
              <textarea
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder={`Paste your syllabus here...\n\nExample:\nUnit 1: Computer Networks\n- OSI Model\n- TCP/IP Protocol\n- Network Topology\n\nUnit 2: Network Security\n- Encryption\n- Firewalls\n- VPN`}
                rows={16}
                className="input-field font-mono text-sm"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Tip: Include units, modules, or chapters with bullet points or numbered lists for best results
              </p>
            </div>

            <button
              onClick={handleParseSyllabus}
              disabled={loading || !syllabusText.trim()}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Parse Syllabus
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Syllabi List */
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Your Syllabi ({syllabi.length})
            </h2>
          </div>

          {syllabi.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No syllabi added yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first syllabus to start mapping topics
              </p>
              <button
                onClick={() => setView('create')}
                className="btn-primary"
              >
                Add Syllabus
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {syllabi.map((syl) => (
                <div
                  key={syl.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {syl.course_name || 'Untitled Course'}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <BookOpen className="h-3.5 w-3.5 mr-1" />
                          {syl.topics_count} topics
                        </span>
                        <span>•</span>
                        <span>
                          Added {new Date(syl.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => loadTopics(syl.id)}
                      className="btn-secondary text-sm flex-1"
                    >
                      View Topics
                    </button>
                    <button
                      onClick={() => handleMapTopics(syl.id)}
                      disabled={loading}
                      className="btn-primary text-sm flex-1 flex items-center justify-center space-x-1"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Map className="h-4 w-4" />
                          <span>Map Content</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Topics Display */}
      {topics.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Topics ({topics.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors ${
                  topic.has_sufficient_content
                    ? 'border-success-200 bg-success-50'
                    : 'border-warning-200 bg-warning-50'
                }`}
              >
                {topic.has_sufficient_content ? (
                  <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {topic.name}
                  </div>
                  <div className="text-xs text-gray-600">{topic.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mapping Results */}
      {mapping && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Mapping Results
          </h2>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-900">
                {mapping.total_mapped - mapping.topics_needing_content.length} topics mapped successfully
              </span>
              <span className="text-sm font-medium text-primary-900">
                {mapping.topics_needing_content.length} need more content
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {mapping.mappings.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{m.topic}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {m.relevant_chunks.length} chunk{m.relevant_chunks.length !== 1 ? 's' : ''} • {(m.confidence_score * 100).toFixed(0)}% confidence
                  </div>
                </div>
                {m.has_sufficient_content ? (
                  <CheckCircle className="h-6 w-6 text-success-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-warning-600" />
                )}
              </div>
            ))}
          </div>

          {mapping.topics_needing_content.length > 0 && (
            <div className="mt-6 bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-warning-800">
                  <p className="font-medium mb-2">Topics Needing More Content:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {mapping.topics_needing_content.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                  <p className="mt-2">Consider uploading more relevant documents for these topics.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
