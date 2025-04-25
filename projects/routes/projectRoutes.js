const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.get('/new', projectController.getNewProjectForm);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.get('/:id/edit', projectController.getEditProjectForm);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/team', projectController.addTeamMember);

module.exports = router;
