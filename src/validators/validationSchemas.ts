import zod from 'zod';

export const userDataSchema = zod.object({
    username: zod.string({ message: 'Username must be string'}).min(1, { message: 'Username cannot be empty'}),
    email: zod.string({ message: 'Email must be string'}).min(1, { message: 'Email cannot be empty '}).includes('@', { message: `email missing '@'`}).includes('.com', { message: `email missing '.com`}),
    password: zod.string({ message: 'Password must be string'}).min(8, { message: 'Password must be atleast 8 characters long'}),
});

export const projectDataSchema = zod.object({
    userId: zod.number({ message: 'User Id must be a number'}).optional(),
    projectName: zod.string({ message: 'Project name must be string'}).min(1, { message: 'Project name cannot be empty'}),
    description: zod.string({ message: 'Description must be string'}).min(1, { message: 'Project description cannot be empty'}).max(500, { message: 'Project description cannot succeed 500 characters'}),
    status: zod.enum(["PLANNED", "ONGOING", "COMPLETED"], { message: `Project status can only be either 'PLANNED', 'ONGOING' OR 'COMPLETED'`}).optional()
});

export const taskDataSchema = zod.object({
    assignedUserId: zod.number({ message: 'User Id must be a number'}).optional(),
    title: zod.string({ message: 'Task title must be string'}).min(1, { message: 'Task title cannot be empty '}),
    description: zod.string({ message: 'Task description must be string'}).min(1, { message: 'Task description cannot be empty'}).max(500, { message: 'Task description cannot succeed 500 characters'}),
    status: zod.enum(["TODO", "IN_PROGRESS", "DONE"], { message: `Task status can only be either 'TODO', 'IN_PROGRESS' OR 'DONE'`}).optional(),
});

export const optionalUserDataSchema = userDataSchema.partial();

export const optionalProjectDataSchema = projectDataSchema.partial();

export const optionalTaskDataSchema = taskDataSchema.partial();