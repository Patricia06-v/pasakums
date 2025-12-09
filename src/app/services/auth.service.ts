import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  username: string;
  email?: string;
  createdEvents?: number;
  joinedEvents?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => (localStorage.setItem('token', res.token), localStorage.setItem('currentUser', JSON.stringify(res.user)))),
      catchError(() => {
        const mock: LoginResponse = {
          token: 'mock-token-' + Date.now(),
          user: { id: 1, username: credentials.username, email: credentials.username + '@example.com', createdEvents: 0, joinedEvents: 0 }
        };
        localStorage.setItem('token', mock.token);
        localStorage.setItem('currentUser', JSON.stringify(mock.user));
        return of(mock);
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data).pipe(
      catchError(() => of({
        message: 'Reģistrācija veiksmīga (mock)',
        user: { id: Math.floor(Math.random() * 1000), username: data.username, email: data.email, createdEvents: 0, joinedEvents: 0 }
      }))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
 