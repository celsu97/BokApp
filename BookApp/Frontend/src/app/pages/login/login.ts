import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.errorMessage = 'Fel användarnamn eller lösenord.';
        console.error(err);
      }
    });
  }
}
