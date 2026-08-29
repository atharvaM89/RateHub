import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent: any = exception.getResponse();
      if (typeof resContent === 'object' && resContent !== null) {
        message = Array.isArray(resContent.message) 
          ? resContent.message.join(', ') 
          : (resContent.message || exception.message);
      } else {
        message = exception.message;
      }
      
      if (status === HttpStatus.BAD_REQUEST) {
        errorCode = 'BAD_REQUEST';
      } else if (status === HttpStatus.UNAUTHORIZED) {
        errorCode = 'UNAUTHORIZED';
      } else if (status === HttpStatus.FORBIDDEN) {
        errorCode = 'FORBIDDEN';
      } else if (status === HttpStatus.NOT_FOUND) {
        errorCode = 'NOT_FOUND';
      } else if (status === HttpStatus.CONFLICT) {
        errorCode = 'CONFLICT';
      } else if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
        errorCode = 'VALIDATION_ERROR';
      }
    } else {
      console.error(exception);
      // Prisma constraint violations mapping
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this unique field already exists.';
        errorCode = 'CONFLICT';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found.';
        errorCode = 'NOT_FOUND';
      }
    }

    response.status(status).json({
      success: false,
      message,
      errorCode,
    });
  }
}
