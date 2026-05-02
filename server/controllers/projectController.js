import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id], // Creator is automatically a member
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    // Find projects where the user is either the admin or in the members array
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    })
      .populate('admin', 'name email')
      .populate('members', 'name email');

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a member to a project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin only)
export const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if req.user is the admin
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add members. Admin only.' });
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin only)
export const removeMember = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if req.user is the admin
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members. Admin only.' });
    }

    // Cannot remove the admin
    if (project.admin.toString() === memberId) {
      return res.status(400).json({ success: false, message: 'Admin cannot be removed from members' });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== memberId
    );

    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
