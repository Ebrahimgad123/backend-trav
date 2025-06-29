// middleware/parseJsonFields.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';

export const parseJSONFields = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return next(new AppError(`Invalid JSON format in field "${field}"`, 400));
        }
      }
    }
    next();
  };
};
