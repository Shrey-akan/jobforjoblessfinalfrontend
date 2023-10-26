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

    if (refreshToken) {
      this.http.post('http://localhost:9001/refreshToken?refreshToken=' + refreshToken, {}).subscribe((response: any) => {
        if (response.accessToken) {
          const accessToken = response.accessToken; // Assuming this is where you get the access token
          AuthInterceptor.accessToken = accessToken;
          this.cookie.set('accessToken', response.accessToken);
        }
      });
    }
  }

  
}
