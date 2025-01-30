import express from 'express';
import cors from 'cors';
import { port } from './config';
import { userRouter } from './routers/userRouter';
import { projectRouter } from './routers/projectRouter';
import { taskRouter } from './routers/taskRouter';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {res.send('API Working')});

app.use('/users', userRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

app.listen(port, () => console.log(`API running on port ${port}`));