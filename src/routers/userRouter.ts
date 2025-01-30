import express from 'express';
import { createUser, deleteUser, getUsers, loginUser, updateUser } from '../controllers/user';
import { authenticateUser } from '../middlewares/auth';

export const userRouter = express.Router(); // CREATE USER ROUTER

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);  

userRouter.use(authenticateUser);

userRouter.get('/all', getUsers);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);