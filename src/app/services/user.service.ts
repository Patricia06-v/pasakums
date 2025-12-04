import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/userModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly URL = environment.apiUrl + '/users';
  private http = inject(HttpClient);

  // POST: Lietotāja reģistrācija
  register(user: UserModel): Observable<any> {
    return this.http.post(`${this.URL}/register`, user, {
      observe: 'response'
    });
  }

  // POST: Pieteikšanās
  login(user: UserModel): Observable<any> {
    return this.http.post(`${this.URL}/login`, user, {
      observe: 'response'
    });
  }

  // GET: Lietotāja dati
  getUser(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.URL}/${id}`);
  }

  // GET: Lietotāja pasākumi
  getUserEvents(id: number): Observable<any> {
    return this.http.get(`${this.URL}/${id}/events`);
  }

  // DELETE: Dzēst lietotāju
  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`, {
      observe: 'response'
    });
  }
}
