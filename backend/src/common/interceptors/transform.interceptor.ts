import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
          return response;
        }
        
        let data = response;
        let message = 'Operation successful';
        let meta = undefined;
        
        if (response && typeof response === 'object' && response !== null) {
          if ('message' in response && 'data' in response) {
            data = response.data;
            message = response.message;
            if ('meta' in response) {
              meta = response.meta;
            }
          } else if ('message' in response) {
            const { message: msg, ...rest } = response;
            message = msg;
            data = Object.keys(rest).length > 0 ? rest : null;
          }
        }
        
        return {
          success: true,
          data: data ?? null,
          message,
          ...(meta !== undefined ? { meta } : {}),
        };
      }),
    );
  }
}
