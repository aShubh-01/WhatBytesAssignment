import { Request, Response, NextFunction } from 'express';
import { jwtSecret } from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    try {
        if(!token) {
            res.status(400).json({ message: 'Token not found'});
            return
        }

        const decodedJwt = jwt.verify(token, jwtSecret) as JwtPayload;
        
        if(!decodedJwt || !decodedJwt.userId) {
            res.status(500).json({ message: 'Unable to decode token '});
            return
        }

        (req as any).userId = decodedJwt.userId;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to authenticate request '});
    }
}