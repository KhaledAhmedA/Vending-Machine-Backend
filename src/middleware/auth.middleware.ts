// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export interface AuthRequest extends Request {
//     user?: {
//         id: string;
//         role: 'buyer' | 'seller';
//     };
// }

// const JWT_SECRET = process.env.JWT_SECRET!;

// export const authenticate = (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
// ) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader?.startsWith('Bearer '))
//         return res.status(401).json({ message: 'Missing token' });

//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };

// export const authorizeRoles = (...roles: ('buyer' | 'seller')[]) => {
//     return (req: AuthRequest, res: Response, next: NextFunction) => {
//         if (!roles.includes(req.user?.role!)) {
//             return res.status(403).json({ message: 'Forbidden: Role not authorized' });
//         }
//         next();
//     };
// };




import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: 'buyer' | 'seller';
    };
}


dotenv.config();


if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// ✅ Authenticate Middleware
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing token' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// ✅ Authorize Roles Middleware
export const authorizeRoles = (
    ...roles: ('buyer' | 'seller')[]
): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: Role not authorized' });
            return;
        }
        next();
    };
};
