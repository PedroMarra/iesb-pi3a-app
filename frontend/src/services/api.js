// src/services/api.js
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────
// IMPORTANTE: Troque pelo IP da sua máquina na rede local.
// Para descobrir: no Windows rode "ipconfig", no Mac/Linux "ifconfig"
// NÃO use "localhost" — o celular não vai conseguir encontrar.
// Exemplo: 'http://192.168.1.10:3000'
// ─────────────────────────────────────────────────────────────────
export const BASE_URL = 'http://192.168.0.150:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ID do usuário logado (fixo para o projeto acadêmico)
export const CURRENT_USER_ID = 'u1';

// ── Posts ──────────────────────────────────────────────────────────

export const getPosts = (search = '', category = '') =>
  api.get('/posts', { params: { search, category } });

export const getPostById = (id) => api.get(`/posts/${id}`);

export const createPost = (data) => api.post('/posts', data);

export const deletePost = (id, userId) =>
  api.delete(`/posts/${id}`, { data: { userId } });

export const likePost = (id, userId) =>
  api.post(`/posts/${id}/like`, { userId });

// ── Comentários ────────────────────────────────────────────────────

export const addComment = (postId, userId, text) =>
  api.post(`/posts/${postId}/comments`, { userId, text });

// ── Usuários ───────────────────────────────────────────────────────

export const getUserById = (id) => api.get(`/users/${id}`);

export const getUserPosts = (id) => api.get(`/users/${id}/posts`);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// ── Horários (Gestor Académico) ───────────────────────────────────
export const getSchedules = (userId = CURRENT_USER_ID) =>
  api.get('/schedules', { params: { userId } });
export const createSchedule = (data) =>
  api.post('/schedules', { userId: CURRENT_USER_ID, ...data });
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// ── Notas (Gestor Académico) ───────────────────────────────────────
export const getGrades = (userId = CURRENT_USER_ID) =>
  api.get('/grades', { params: { userId } });
export const createGrade = (data) =>
  api.post('/grades', { userId: CURRENT_USER_ID, ...data });
export const updateGrade = (id, data) => api.put(`/grades/${id}`, data);
export const deleteGrade = (id) => api.delete(`/grades/${id}`);

export default api;
