import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============= DOCUMENTS API =============
export const documentsAPI = {
  upload: async (file, userId = 1) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/documents/upload?user_id=${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  list: async (userId = 1) => {
    const response = await api.get(`/api/documents/list?user_id=${userId}`);
    return response.data;
  },

  delete: async (documentId) => {
    const response = await api.delete(`/api/documents/${documentId}`);
    return response.data;
  },
};

// ============= SYLLABUS API =============
export const syllabusAPI = {
  parse: async (syllabusText, courseName = null, userId = 1) => {
    const response = await api.post(`/api/syllabus/parse?user_id=${userId}`, {
      syllabus_text: syllabusText,
      course_name: courseName,
    });
    return response.data;
  },

  map: async (syllabusId) => {
    const response = await api.post(`/api/syllabus/map/${syllabusId}`);
    return response.data;
  },

  list: async (userId = 1) => {
    const response = await api.get(`/api/syllabus/list?user_id=${userId}`);
    return response.data;
  },

  getTopics: async (syllabusId) => {
    const response = await api.get(`/api/syllabus/${syllabusId}/topics`);
    return response.data;
  },
};

// ============= LESSONS API =============
export const lessonsAPI = {
  createPlan: async (syllabusId) => {
    const response = await api.post(`/api/lessons/plan/${syllabusId}`);
    return response.data;
  },

  teach: async (topic, userMessage = null, sessionId = null, userId = 1) => {
    const response = await api.post(`/api/lessons/teach?user_id=${userId}`, {
      topic,
      user_message: userMessage,
      session_id: sessionId,
    });
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/api/lessons/session/${sessionId}`);
    return response.data;
  },
};

// ============= QUIZ API =============
export const quizAPI = {
  generate: async (topic, numQuestions = 5, difficulty = 'medium') => {
    const response = await api.post('/api/quiz/generate', {
      topic,
      num_questions: numQuestions,
      difficulty,
    });
    return response.data;
  },

  submit: async (quizId, answers, userId = 1) => {
    const response = await api.post(`/api/quiz/submit?user_id=${userId}`, {
      quiz_id: quizId,
      answers,
    });
    return response.data;
  },

  getHistory: async (userId = 1) => {
    const response = await api.get(`/api/quiz/history?user_id=${userId}`);
    return response.data;
  },
};

// ============= PROGRESS API =============
export const progressAPI = {
  getStats: async (userId = 1) => {
    const response = await api.get(`/api/progress/stats?user_id=${userId}`);
    return response.data;
  },

  getTopicMastery: async (userId = 1) => {
    const response = await api.get(`/api/progress/topics?user_id=${userId}`);
    return response.data;
  },

  getStudyPlan: async (userId = 1) => {
    const response = await api.get(`/api/progress/study-plan?user_id=${userId}`);
    return response.data;
  },

  getRevisionDue: async (userId = 1) => {
    const response = await api.get(`/api/progress/revision-due?user_id=${userId}`);
    return response.data;
  },
};

// ============= HEALTH CHECK API =============
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  root: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default api;
