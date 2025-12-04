import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { setUser } from '../../globalSignals/userglobalsignal';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  errorMessage = '';

  onClick() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Lūdzu, aizpildiet visus laukus pareizi';
      return;
    }

    const username = this.loginForm.value.name;
    const password = this.loginForm.value.password;

    this.authService.login({ username, password }).subscribe({
      next: (response: any) => {
        // Update global user signal
        setUser(response.user);
        
        // Navigate to events page
        this.router.navigate(['/event']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.errorMessage = 'Nepareizs lietotājvārds vai parole';
      }
    });
  }

}
