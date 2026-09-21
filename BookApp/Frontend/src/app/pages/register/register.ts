import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  credentials: RegisterRequest = { username: '', password: '' };
  errorMessage = '';
  successMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.successMessage = 'Registrering lyckades! Du kan nu logga in.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.title || 'Registrering misslyckades. Användarnamnet kanske redan finns.';
        console.error(err);
      }
    });
  }
}
