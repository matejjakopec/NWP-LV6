const Project = require('../models/Project');
const User = require('../models/User');

exports.getAllProjects = async (req, res) => {
  const projects = await Project.find().populate('teamMembers');
  res.render('projects/index', { projects });
};

exports.getNewProjectForm = async (req, res) => {
  try {
    const users = await User.find();
    res.render('projects/new', { users });
  } catch (err) {
    console.error('Error loading users:', err);
    res.status(500).send('Could not load form');
  }
};

exports.createProject = async (req, res) => {
  const { name, description, price, tasks, startDate, endDate, isArchived } = req.body;

  const teamMembers = Array.isArray(req.body.teamMembers)
    ? req.body.teamMembers
    : req.body.teamMembers ? [req.body.teamMembers] : [];

    await Project.create({
      name,
      description,
      price,
      tasks,
      startDate,
      endDate,
      isArchived: isArchived === 'on',
      leader: req.user._id,
      teamMembers
    });

  res.redirect('/projects');
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('teamMembers');
  if (!project) {
    return res.status(404).send('Project not found');
  }
  res.render('projects/show', { project });
};

exports.getEditProjectForm = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const users = await User.find();
  if (!project) {
    return res.status(404).send('Project not found');
  }
  res.render('projects/edit', { project, users });
};

exports.updateProject = async (req, res) => {
  const { name, description, price, tasks, startDate, endDate, isArchived } = req.body;

  const teamMembers = Array.isArray(req.body.teamMembers)
    ? req.body.teamMembers
    : req.body.teamMembers ? [req.body.teamMembers] : [];

  await Project.findByIdAndUpdate(req.params.id, {
    name,
    description,
    price,
    tasks,
    startDate,
    endDate,
    isArchived: isArchived === 'on',
    teamMembers
  });

  res.redirect('/projects');
};

exports.deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect('/projects');
};

exports.addTeamMember = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const user = await User.findById(req.body.userId);
  if (!project || !user) {
    return res.status(404).send('Project or user not found');
  }

  if (!project.teamMembers.includes(user._id)) {
    project.teamMembers.push(user._id);
    await project.save();
  }

  res.redirect(`/projects/${req.params.id}`);
};

exports.getLeaderProjects = async (req, res) => {
  const projects = await Project.find({ leader: req.user._id });
  res.render('projects/leader', { projects });
};

exports.getMemberProjects = async (req, res) => {
  const projects = await Project.find({
    teamMembers: req.user._id,
    leader: { $ne: req.user._id }
  });
  res.render('projects/member', { projects });
};

exports.updateTasksOnly = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) return res.status(404).send('Not found');

  if (
    project.teamMembers.includes(req.user._id) &&
    project.leader.toString() !== req.user._id.toString()
  ) {
    project.tasks = req.body.tasks;
    await project.save();
    return res.redirect(`/projects/${project._id}`);
  }

  return res.status(403).send('Forbidden');
};

exports.getArchivedProjects = async (req, res) => {
  const userId = req.user._id;

  const projects = await Project.find({
    isArchived: true,
    $or: [
      { leader: userId },
      { teamMembers: userId }
    ]
  }).populate('teamMembers leader');

  res.render('projects/archive', { projects });
};