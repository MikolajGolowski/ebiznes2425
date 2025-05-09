import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(public http: HttpClient) {
  }

  public username: string = '';
  public password: string = '';

  register() {
    this.http.post("http://localhost:3000/register", {username: this.username, password: this.password})
    .subscribe({
      next: (response: any) => {
        alert(JSON.stringify(response));
      },
      error: (error: any) => {
        alert('Error:' + JSON.stringify(error.message));
      },
    });
  }
}
