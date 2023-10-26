import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router'; // Import the Router module

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static accessToken: string = '';
  private refresh: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Intercepting request...');
    console.log('Access Token:', AuthInterceptor.accessToken);

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    });

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !this.refresh) {
        this.refresh = true;

        // Make a request to refresh the access token
        return this.http.post('http://localhost:9001/refresh', {}, { withCredentials: true }).pipe(
          switchMap((res: any) => {
            AuthInterceptor.accessToken = res.accessToken;

            // Clone the original request with the new access token
            const newRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`
              }
            });

            this.refresh = false;

            return next.handle(newRequest);
          })
        );
      }

      // If the user is not authenticated (for example, a 401 response), navigate to the login page and display an alert
      if (err.status === 401) {
        this.router.navigate(['/login']); // Navigate to the login page
        window.alert('You are not authenticated. Please log in to access this page.');
      }

      return throwError(() => err);
    }));
  }
}
