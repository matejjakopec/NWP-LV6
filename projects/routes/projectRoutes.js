const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', projectController.getAllProjects);
router.get('/new', projectController.getNewProjectForm);
router.post('/', projectController.createProject);

router.get('/leader', projectController.getLeaderProjects);
router.get('/member', projectController.getMemberProjects);
router.get('/archive', ensureAuthenticated, projectController.getArchivedProjects);
router.post('/:id/update-tasks', ensureAuthenticated, projectController.updateTasksOnly);

router.get('/:id/edit', projectController.getEditProjectForm);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/team', projectController.addTeamMember);
router.get('/:id', projectController.getProjectById);

module.exports = router;