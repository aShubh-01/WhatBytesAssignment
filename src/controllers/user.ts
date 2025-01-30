import { prisma, jwtSecret } from "../config";
import { optionalUserDataSchema, userDataSchema } from '../validators/validationSchemas';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

function createJWT(data: any) {         //FUNCTION TO CREATE JWT
    return jwt.sign(data, jwtSecret);
}

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const validateData = userDataSchema.safeParse(req.body);        //VALIDATE THE PAYLOAD CONTAINING USER DATA
        if(!validateData.success) {
            res.status(400).json({ 
                message: 'Invalid data schema',
                issues: validateData.error.issues.map((i) => i.message)
            })
            return
        }

        const existingUser = await prisma.user.findFirst({ where: { email } }); // CHECK IF A USER ALREADY EXISTS

        if(existingUser) {
            res.status(401).json({ message: 'Email already registered' })
            return
        }

        const newUser = await prisma.user.create({      // CREATE NEW USER
            data: {
                username: username,
                email: email,
                password: await bcrypt.hash(password, 10)       //HASH PASSWORD BEFORE STORING
            }
        })

        const token = createJWT({ userId: newUser.id });

        res.status(200).json({                      // RETURN JWT
            message: 'User signed up',
            token
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to create user '});
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const validateData = optionalUserDataSchema.safeParse(req.body);      // VALIDATE USER CREDENTIALS
        if(!validateData.success) {
            res.status(400).json({ 
                message: 'Invalid login credentials schema',
                issues: validateData.error.issues.map((i) => i.message)
            })
            return
        }

        const existingUser = await prisma.user.findFirst({ where: { email } });     // FIND USER

        if(!existingUser) {
            res.status(400).json({ message: 'User not found' })
            return
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);   // CHECK PASSWORD

        if(!matchPassword) {
            res.status(400).json({ message: 'Wrong password'});
            return
        }

        const token = createJWT({ userId: existingUser.id });

        res.status(200).json({                                  // LOG IN AND RETURN JWT
            message: 'User logged up',
            token
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to login user'});
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany({           // FETCH USERS(THEIR NAME AND EMAIL ONLY)
            select: {
                username: true,
                email: true
            }
        })

        if(allUsers.length < 1) {                           // RETURN THIS RESPONSE IF NO USERS ARE AVAILABLE
            res.status(200).json({ message: 'No users found'});
            return
        }

        res.status(200).json({                  // RESPOND WITH ALL USERS
            message: 'Users fetched',
            users: allUsers
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to fetch users'});
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        if(!userId) {                                               // CHECK FOR VALID USER ID
            res.status(400).json({ message: 'Invalid user id'});
            return
        }

        const validateData = optionalUserDataSchema.safeParse(req.body);        // VALIDATE THE UPDATE DATA FOR USER
        if(!validateData.success) {
            res.status(400).json({ 
                message: 'Invalid user data schema',
                issues: validateData.error.issues.map((i) => i.message)
            })
            return
        }

        const existingUser = await prisma.user.findFirst({ where: { id: Number(userId) } });    // FIND USER

        if(!existingUser) {
            res.status(400).json({ message: 'User not found' })
            return
        }

        if(req.body.password) (req as any).body.password = await bcrypt.hash(req.body.password, 10); // HASH THE PASSWORD IF IT IS INCLUDED IN THE PAYLOAD

        await prisma.user.update({              // UPDATE USER DATA
            where: { id: Number(userId )},
            data: req.body
        })

        res.status(200).json({
            message: 'User updated',
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to update user'});
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        if(!userId) {                                           // CHECK FOR USER ID
            res.status(400).json({ message: 'Invalid user id'});
            return
        }

        const existingUser = await prisma.user.findFirst({ where: { id: Number(userId) } });

        if(!existingUser) {
            res.status(400).json({ message: 'User not found' })
            return
        }

        await prisma.user.delete({ where: { id: Number(userId )} }); // DELETE USER

        res.status(200).json({ message: 'User deleted' })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to delete user'});
    }
}