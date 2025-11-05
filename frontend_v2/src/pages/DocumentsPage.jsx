import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { documentsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentsAPI.list();
      setDocuments(data.documents || []);
    } catch (error) {
      toast.error('Failed to load documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      toast.error(`File type not supported. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading('Uploading and processing document...');

    try {
      const result = await documentsAPI.upload(file);
      toast.success(result.message, { id: uploadToast });
      loadDocuments();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
    event.target.value = null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (documentId, filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    const deleteToast = toast.loading('Deleting document...');
    try {
      await documentsAPI.delete(documentId);
      toast.success('Document deleted successfully', { id: deleteToast });
      loadDocuments();
    } catch (error) {
      toast.error('Failed to delete document', { id: deleteToast });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Upload Study Materials
        </h1>
        <p className="text-lg text-gray-600">
          Upload your PDFs, DOCX, or text files to get started with AI-powered learning
        </p>
      </div>

      {/* Info Alert */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-primary-800">
          <p className="font-medium mb-1">Supported Formats</p>
          <p>PDF, DOCX, TXT files up to 10MB. Documents will be processed and chunked for AI analysis.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="card p-8">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 text-primary-600 mb-3 animate-spin" />
                  <p className="text-sm text-gray-600 font-medium">Processing document...</p>
                  <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, or TXT (max 10MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Documents List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Uploaded Documents
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          {documents.length > 0 && (
            <button
              onClick={loadDocuments}
              className="btn-secondary text-sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents uploaded yet
            </h3>
            <p className="text-gray-600">
              Upload your study materials above to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="bg-primary-50 p-3 rounded-lg group-hover:bg-primary-100 transition-colors">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {doc.filename}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 mr-1 text-success-600" />
                        {doc.chunks_count} chunks
                      </span>
                      <span>•</span>
                      <span>Uploaded {formatDate(doc.upload_date)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete document"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
