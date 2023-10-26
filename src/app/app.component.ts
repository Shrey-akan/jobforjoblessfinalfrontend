import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private cookie: CookieService) { }
  title = 'jobax';
  showFooter = true;
  ngOnInit() {
    const refreshToken = this.cookie.get('refreshToken');
    console.log("Checking the method is running");
    console.log("checking the value of refreshToken",refreshToken);
    if (refreshToken) {
      this.http.post('http://localhost:9001/refreshToken', { refreshToken }).subscribe(
       {
        next:(response: any) => {
          if (response.accessToken) {
            const accessToken = response.accessToken;
            AuthInterceptor.accessToken = accessToken;
            this.cookie.set('accessToken', accessToken);
          }
        },
        error:(error) => {
          // Handle the error here
          console.error('Error while refreshing the token:', error);
          // You can also display an error message to the user if needed
        }
       }
      );
    }
    
  }

  
}
