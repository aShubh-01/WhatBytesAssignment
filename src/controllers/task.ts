import { prisma } from '../config';
import { TaskStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { taskDataSchema, optionalTaskDataSchema } from '../validators/validationSchemas';

export const createTask = async (req: Request, res: Response) => {
    const { assignedUserId, title, description } = req.body;
    const projectId = req.params.projectId;

    try {
        const validateData = taskDataSchema.safeParse(req.body);        // VALIDATE TASK DATA IN PAYLOAD
        if(!validateData.success) {
            res.status(400).json({
                message: 'Invalid task data schema',
                issues: validateData.error.issues.map((i) => i.message)
            });
            return
        };

        const newTask = await prisma.task.create({      // CREATE TASK 
            data: {
                title,
                description,
                projectId: Number(projectId),
                assignedUserId: Number(assignedUserId)
            }
        });

        res.status(200).json({
            message: 'Task created',
            taskId: newTask.id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to create task' })
    }
}

export const getTaskByFilter = async (req: Request, res: Response) => {
    const { status, userId } = req.query;
    
    try {
        if(!status || !userId) {
            res.status(200).json({ message: 'Invalid query parameters' })
            return
        }
        
        const tasks = await prisma.task.findMany({
            where: { status: (status as TaskStatus), assignedUserId: Number(userId) }
        });

        if(tasks.length < 1) {
            res.status(401).json({ message: "Tasks not found" });
            return
        }

        res.status(200).json({ 
            message: 'Filtered Tasks fetched',
            tasks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to '})
    }
}

export const getTasks = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    try {
        const existingProject = await prisma.project.findFirst({     // CHECK IF PROJECT EXISTS
            where: { id: Number(projectId) }
        });

        if(!existingProject) {
            res.status(400).json({ message: 'Project does not exist'});
            return
        }

        let allTasks = await prisma.task.findMany({         // FETCH TASKS IN THAT PROJECT
            where: { projectId: Number(projectId )},
            select: { 
                title: true, 
                description: true, 
                status: true, 
                assignedUser: {
                    select: { username: true }
                }
            }
        });

        allTasks = allTasks.map((task : any) => {       // MODIFY THE PAYLOAD FOR READABILITY
            return {
                title: task.title,
                description: task.description,
                status: task.status,
                assignedUser: task.assignedUser.username
            }
        })

        res.status(200).json({  
            message: 'Tasks fetched',
            tasks: allTasks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to get tasks' })
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        const validateData = optionalTaskDataSchema.safeParse(req.body);    // VALIDATE TASK DATA FOR UPDATE
        if(!validateData.success) {
            res.status(400).json({
                message: 'Invalid task data schema',
                issues: validateData.error.issues.map((i) => i.message)
            });
            return
        };

        const existingTask = await prisma.task.findFirst({ where: { id: Number(taskId)} }); // CHECK IF TASK EXISTS

        if(!existingTask) {
            res.status(401).json({ message: 'Task does not exist'});
            return
        }

        await prisma.task.update({      // UPDATE TASK
            where: { id: Number(taskId) },
            data: req.body 
        });

        res.status(200).json({ message: 'Task updated' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to update task' })
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        const existingTask = await prisma.task.findFirst({ where: { id: Number(taskId)} }); // CHECK IF TASK EXISTS

        if(!existingTask) {
            res.status(401).json({ message: 'Task does not exist'});
            return
        }

        await prisma.task.delete({ where: { id: Number(taskId) } }); // DELETE TASK

        res.status(200).json({ message: 'Task deleted' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to delete task' })
    }
}