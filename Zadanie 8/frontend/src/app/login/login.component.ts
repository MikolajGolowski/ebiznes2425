import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  /**
   *
   */
  constructor(public http: HttpClient) {
  }

  public username: string = '';
  public password: string = '';

  login() {
    this.http.post("http://localhost:3000/login", {username: this.username, password: this.password})
    .subscribe({
      next: (response: any) => {
        alert(JSON.stringify(response));
      },
      error: (error: any) => {
        alert('Error:' + JSON.stringify(error));
      },
    });
  }
}
