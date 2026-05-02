import api from '../../utils/api';

const getTasks = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}`);
  return response.data.data; // Return the array of tasks
};

const getDashboardStats = async (projectId) => {
  const response = await api.get(`/tasks/dashboard/${projectId}`);
  return response.data.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data.data;
};

const updateTaskStatus = async ({ taskId, status }) => {
  const response = await api.put(`/tasks/${taskId}`, { status });
  return response.data.data;
};

const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data.data;
};

const taskService = {
  getTasks,
  getDashboardStats,
  createTask,
  updateTaskStatus,
  deleteTask,
};

export default taskService;
