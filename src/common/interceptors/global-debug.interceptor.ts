import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class GlobalDebugInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const method = request.method;
    const url = request.url;
    const body = request.body;
    const headers = request.headers;
    const params = request.params;
    const query = request.query;

    // Log request
    console.log('\n=== REQUEST DEBUG ===');
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Body:`, JSON.stringify(body, null, 2));
    console.log(`Headers:`, JSON.stringify(headers, null, 2));
    console.log(`Params:`, JSON.stringify({ ...params, ...query }, null, 2));
    console.log('=====================\n');

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;
        
        // Log response
        console.log('\n=== RESPONSE DEBUG ===');
        console.log(`Status Code: ${statusCode}`);
        console.log(`Duration: ${duration}ms`);
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('======================\n');
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;
        
        // Log error response
        console.log('\n=== ERROR DEBUG ===');
        console.log(`Status Code: ${statusCode}`);
        console.log(`Duration: ${duration}ms`);
        console.log('Error:', JSON.stringify({
          message: error.message,
          statusCode: error.status,
          stack: error.stack
        }, null, 2));
        console.log('==================\n');
        
        throw error;
      }),
    );
  }
} 