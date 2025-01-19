import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * The gorestInterceptor function is a TypeScript HTTP interceptor that adds an Authorization header
 * with a bearer token retrieved from the AuthService to the outgoing request headers.
 * @param req - HttpRequest<unknown> - The HTTP request being intercepted
 * @param {HttpHandlerFn} next - The `next` parameter in the `gorestInterceptor` function is a function
 * that represents the next interceptor in the chain or the backend server handler that will process
 * the modified request. When you call `next(newReq)`, you are essentially passing the modified request
 * to the next interceptor or the backend server
 * @returns The `gorestInterceptor` function is returning an Observable of type `HttpEvent<unknown>`.
 */
export const gorestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authToken = inject(AuthService).getAuthToken();
  let headers: HttpHeaders = new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
  authToken
    ? (headers = headers.append('Authorization', `Bearer ${authToken}`))
    : null;
  const newReq = req.clone({
    headers: headers,
  });
  return next(newReq);
};
