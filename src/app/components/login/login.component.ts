import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  loginForm = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  registerForm = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  isRegisterMode = false;
  errorMessage = '';
  successMessage = '';

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = this.successMessage = '';
  }

  onClick() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Lūdzu, aizpildiet visus laukus pareizi';
      return;
    }

    const { name: username, password } = this.loginForm.value;
    this.authService.login({ username: username!, password: password! }).subscribe({
      next: (res: any) => (setUser(res.user), this.router.navigate(['/event'])),
      error: () => this.errorMessage = 'Nepareizs lietotājvārds vai parole'
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Lūdzu, aizpildiet visus laukus pareizi';
      return;
    }

    const { name: username, email, password } = this.registerForm.value;
    this.authService.register({ username: username!, email: email!, password: password! }).subscribe({
      next: () => {
        this.successMessage = 'Reģistrācija veiksmīga! Tagad varat pieslēgties.';
        this.registerForm.reset();
        setTimeout(() => (this.isRegisterMode = false, this.successMessage = ''), 2000);
      },
      error: () => this.errorMessage = 'Reģistrācija neizdevās. Iespējams, lietotājvārds jau eksistē.'
    });
  }
}
