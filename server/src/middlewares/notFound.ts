import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("---notFoundMiddleware---");
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND);
  next(error);
};

export default notFoundMiddleware;


