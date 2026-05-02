import express from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksForProject,
  getDashboardStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.route('/project/:projectId')
  .get(getTasksForProject);

router.route('/dashboard/:projectId')
  .get(getDashboardStats);

export default router;
