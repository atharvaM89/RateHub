var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Something went wrong';
        let errorCode = 'INTERNAL_SERVER_ERROR';
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resContent = exception.getResponse();
            if (typeof resContent === 'object' && resContent !== null) {
                message = Array.isArray(resContent.message)
                    ? resContent.message.join(', ')
                    : (resContent.message || exception.message);
            }
            else {
                message = exception.message;
            }
            if (status === HttpStatus.BAD_REQUEST) {
                errorCode = 'BAD_REQUEST';
            }
            else if (status === HttpStatus.UNAUTHORIZED) {
                errorCode = 'UNAUTHORIZED';
            }
            else if (status === HttpStatus.FORBIDDEN) {
                errorCode = 'FORBIDDEN';
            }
            else if (status === HttpStatus.NOT_FOUND) {
                errorCode = 'NOT_FOUND';
            }
            else if (status === HttpStatus.CONFLICT) {
                errorCode = 'CONFLICT';
            }
            else if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
                errorCode = 'VALIDATION_ERROR';
            }
        }
        else {
            console.error(exception);
            if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                message = 'A record with this unique field already exists.';
                errorCode = 'CONFLICT';
            }
            else if (exception.code === 'P2025') {
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
};
HttpExceptionFilter = __decorate([
    Catch()
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map