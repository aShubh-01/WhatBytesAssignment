import express from 'express';
import { taskRouter } from './taskRouter';
import { createProject, deleteProject, getProjects, updateProject } from '../controllers/project';
import { authenticateUser } from '../middlewares/auth';

export const projectRouter = express.Router(); // CREATE PROJECT ROUTER

projectRouter.use(authenticateUser);

projectRouter.post('/', createProject);
projectRouter.get('/all', getProjects);
projectRouter.put('/:id', updateProject);
projectRouter.delete('/:id', deleteProject);

projectRouter.use('/:projectId/tasks', taskRouter);