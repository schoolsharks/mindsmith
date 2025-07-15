import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';

const errorHandlerMiddleware = (
    err: any,
    req: any,
    res: any,
    next: () => void
) => {
    console.log("---errorHandlerMiddleware---");
    console.log(err);
    let error: AppError;

    if (err instanceof AppError) {
        error = err;
    } else {
        error = new AppError(
            err.message || 'Something went wrong, try again later',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        );
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(',');
        error = new AppError(message, StatusCodes.BAD_REQUEST);
    }

    if (err.code && err.code === 11000) {
        error = new AppError(
            `${Object.keys(err.keyValue)} field must be unique`,
            StatusCodes.BAD_REQUEST
        );
    }

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};

export default errorHandlerMiddleware;

