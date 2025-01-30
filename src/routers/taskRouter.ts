import express from 'express';
import { createTask, deleteTask, getTaskByFilter, getTasks, updateTask } from '../controllers/task';

export const taskRouter = express.Router({ mergeParams: true }); // CREATE TASK ROUTER

taskRouter.post('/', createTask);
taskRouter.get('/', getTaskByFilter);
taskRouter.get('/all', getTasks);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);