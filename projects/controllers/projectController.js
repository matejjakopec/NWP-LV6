const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  const projects = await Project.find();
  res.render('projects/index', { projects });
};

exports.getNewProjectForm = (req, res) => {
  res.render('projects/new');
};

exports.createProject = async (req, res) => {
  const { name, description, price, tasks, startDate, endDate } = req.body;
  await Project.create({ name, description, price, tasks, startDate, endDate });
  res.redirect('/projects');
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).send('Project not found');
  }
  res.render('projects/show', { project });
};

exports.getEditProjectForm = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).send('Project not found');
  }
  res.render('projects/edit', { project });
};

exports.updateProject = async (req, res) => {
  const { name, description, price, tasks, startDate, endDate } = req.body;
  await Project.findByIdAndUpdate(req.params.id, {
    name, description, price, tasks, startDate, endDate
  });
  res.redirect('/projects');
};

exports.deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect('/projects');
};

exports.addTeamMember = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).send('Project not found');
  }
  project.teamMembers.push({ name: req.body.name, role: req.body.role });
  await project.save();
  res.redirect(`/projects/${req.params.id}`);
};