import { Injectable, signal, computed } from '@angular/core';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class UserGlobalSignal {

  // Glabā tikai to, kas pasākumu sistēmai nepieciešams
  userGlobalSignal = signal<UserModel>({
    id: 0,
    name: '',
    password: '',
    joinedEvents: undefined,
    createdEvents: undefined
  });
}

export interface User {

  id: string;

  username: string;

}



export const userSignal = signal<User | null>(null);



export const isLoggedIn = computed(() => userSignal() !== null);



export const username = computed(() => userSignal()?.username ?? '');



export function clearUser() {

  userSignal.set(null);

}

export function setUser(user: any) {
  // Implementation to set user signal
  userSignal.set(user);
}


