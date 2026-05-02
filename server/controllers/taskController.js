import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin only)
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, project, assignedTo } = req.body;

    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only Admin can create tasks
    if (proj.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized. Only project admin can create tasks.' });
    }

    // Verify assignedTo user is a member of the project
    if (assignedTo && !proj.members.includes(assignedTo)) {
      return res.status(400).json({ success: false, message: 'Assigned user must be a member of the project' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (Admin can update all, Member can update status if assigned)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const proj = task.project;
    const isAdmin = proj.admin.toString() === req.user._id.toString();
    const isAssignedMember = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    // If not admin, they can only update the status
    if (!isAdmin) {
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else {
      // Admin can update everything
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.priority = req.body.priority || task.priority;
      task.status = req.body.status || task.status;
      
      if (req.body.assignedTo) {
        if (!proj.members.includes(req.body.assignedTo)) {
           return res.status(400).json({ success: false, message: 'Assigned user must be a member of the project' });
        }
        task.assignedTo = req.body.assignedTo;
      }
    }

    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getTasksForProject = async (req, res, next) => {
  try {
    const proj = await Project.findById(req.params.projectId);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // User must be a member of the project
    if (!proj.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view tasks for this project' });
    }

    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for a project
// @route   GET /api/tasks/dashboard/:projectId
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const proj = await Project.findById(req.params.projectId);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // User must be a member
    if (!proj.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view dashboard' });
    }

    // Get tasks based on role: Admin sees all, member sees only theirs
    const isAdmin = proj.admin.toString() === req.user._id.toString();
    const query = { project: req.params.projectId };
    
    if (!isAdmin) {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query);

    const totalTasks = tasks.length;
    
    const tasksByStatus = {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length,
    };

    const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

    // Tasks per user (meaningful mostly for admin)
    const tasksPerUser = {};
    if (isAdmin) {
      tasks.forEach(t => {
        const userId = t.assignedTo ? t.assignedTo.toString() : 'Unassigned';
        tasksPerUser[userId] = (tasksPerUser[userId] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        tasksByStatus,
        overdueTasks,
        tasksPerUser: isAdmin ? tasksPerUser : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const proj = task.project;
    const isAdmin = proj.admin.toString() === req.user._id.toString();

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized. Only project admin can delete tasks' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
