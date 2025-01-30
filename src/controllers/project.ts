import { Request, Response } from 'express';
import { prisma } from '../config';
import { projectDataSchema, optionalProjectDataSchema } from '../validators/validationSchemas';

export const createProject = async (req: Request, res: Response) => {
    const { projectName, description } = req.body; 
    const userId = (req as any).userId;

    try {
        const validateData = projectDataSchema.safeParse(req.body); // VALIDATE THE PROJECT DATA PAYLOAD
        if(!validateData.success) {
            res.status(400).json({
                message: 'Invalid project data schema',
                issues: validateData.error.issues.map((i) => i.message)
            });
            return
        };

        const newProject = await prisma.project.create({    // CREATE PROJECT
            data: {
                userId,
                projectName,
                description
            },
            select: { id: true }
        });

        res.status(200).json({          // RESPOND WITH PROJECT ID
            message: 'Project created',
            projectId: newProject.id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to create project' })
    }
}

export const updateProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const userId = (req as any).userId;

    try {
        const validateData = optionalProjectDataSchema.safeParse(req.body); // VALIDATE PAYLOAD
        if(!validateData.success) {
            res.status(400).json({
                message: 'Invalid project data schema',
                issues: validateData.error.issues.map((i) => i.message)
            });
            return
        };

        const existingProject = await prisma.project.findFirst({     // CHECK IF PROJECT EXISTS
            where: { id: Number(projectId) }
        });

        if(!existingProject) {
            res.status(400).json({ message: 'Project does not exist'});
            return
        }

        if(existingProject.userId != userId) {
            res.status(403).json({ message: 'Unauthorized access'});
            return
        }

        await prisma.project.update({       // UPDATE PROJECT
            where: { id: Number(projectId) },
            data: req.body
        });

        res.status(200).json({ message: 'Project updated' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to update project' })
    }
}

export const getProjects = async (req: Request, res: Response) => {
    try {
        const allProjects = await prisma.project.findMany({         // GET PROJECTS
            select: { projectName: true, description: true, status: true, createdAt: true }
        });

        if(allProjects.length < 1) {
            res.status(401).json({ message: 'No projects found'})
            return
        }

        res.status(200).json({ 
            message: 'Project fetched',
            projects: allProjects
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to get projects' })
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    try {
        const existingProject = await prisma.project.findFirst({        // FIND IF PROJECT EXISTS
            where: { id: Number(projectId) }
        });

        if(!existingProject) {
            res.status(400).json({ message: 'Project does not exist'});
            return
        }

        await prisma.project.delete({ where: { id: Number(projectId) } });      // DELETE IT

        res.status(200).json({ message: 'Project deleted' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to delete project' })
    }
}