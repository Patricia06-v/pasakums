import { Injectable, signal, computed } from '@angular/core';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class UserGlobalSignal {

  // Glabā tikai to, kas pasākumu sistēmai nepieciešams
  userGlobalSignal = signal<UserModel>(this.loadUserFromStorage());
  
  private loadUserFromStorage(): UserModel {
    const stored = localStorage.getItem('userModel');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    return {
      id: 0,
      name: '',
      password: '',
      joinedEvents: undefined,
      createdEvents: undefined
    };
  }
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
  console.log('setUser called with:', user);
  userSignal.set(user);
  

  const userModel: UserModel = {
    id: user.id || 0,
    name: user.username || user.name || '',
    password: '',
    joinedEvents: user.joinedEvents || 0,
    createdEvents: user.createdEvents || 0
  };
  console.log('UserModel created:', userModel);
  
  localStorage.setItem('userModel', JSON.stringify(userModel));
}


