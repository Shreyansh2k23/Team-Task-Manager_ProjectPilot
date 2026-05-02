import express from 'express';
import {
  createProject,
  getProjects,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All project routes require authentication
router.use(protect);

router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id/members')
  .put(addMember);

router.route('/:id/members/:userId')
  .delete(removeMember);

export default router;
