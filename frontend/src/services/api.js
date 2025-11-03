import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Documents API
export const documentsAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/documents/list');
    return response.data;
  },
  delete: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },
};

// Syllabus API
export const syllabusAPI = {
  parse: async (syllabusText, courseName) => {
    const response = await api.post('/syllabus/parse', {
      syllabus_text: syllabusText,
      course_name: courseName,
    });
    return response.data;
  },
  map: async (syllabusId) => {
    const response = await api.post(`/syllabus/map/${syllabusId}`);
    return response.data;
  },
  list: async () => {
    const response = await api.get('/syllabus/list');
    return response.data;
  },
  getTopics: async (syllabusId) => {
    const response = await api.get(`/syllabus/${syllabusId}/topics`);
    return response.data;
  },
};

// Lessons API
export const lessonsAPI = {
  createPlan: async (syllabusId) => {
    const response = await api.post(`/lessons/plan/${syllabusId}`);
    return response.data;
  },
  teach: async (topic, userMessage = null, sessionId = null) => {
    const response = await api.post('/lessons/teach', {
      topic,
      user_message: userMessage,
      session_id: sessionId,
    });
    return response.data;
  },
  getSession: async (sessionId) => {
    const response = await api.get(`/lessons/session/${sessionId}`);
    return response.data;
  },
};

// Quiz API
export const quizAPI = {
  generate: async (topic, numQuestions = 5, difficulty = 'medium') => {
    const response = await api.post('/quiz/generate', {
      topic,
      num_questions: numQuestions,
      difficulty,
    });
    return response.data;
  },
  submit: async (quizId, answers) => {
    const response = await api.post('/quiz/submit', {
      quiz_id: quizId,
      answers,
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/quiz/history');
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getStats: async () => {
    const response = await api.get('/progress/stats');
    return response.data;
  },
  getTopicMastery: async () => {
    const response = await api.get('/progress/topics');
    return response.data;
  },
  getStudyPlan: async () => {
    const response = await api.get('/progress/study-plan');
    return response.data;
  },
  getRevisionDue: async () => {
    const response = await api.get('/progress/revision-due');
    return response.data;
  },
};

export default api;
