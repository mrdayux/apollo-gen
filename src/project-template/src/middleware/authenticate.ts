import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import configurations from '../configuration';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        req.viewer = jwt.verify(token, configurations.app.sessionStoreSecret) as Viewer;
        return next();
    }
    return next();
};

export default authenticate;
