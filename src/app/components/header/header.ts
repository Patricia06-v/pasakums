import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { userSignal, isLoggedIn, username, clearUser } from '../../globalSignals/userglobalsignal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  router = inject(Router);
  
  // global signals
  isLoggedIn = isLoggedIn;
  username = username;

  @Output() createEventAction = new EventEmitter<void>();
  @Output() myEventsAction = new EventEmitter<void>();

  createEvent() {
    this.createEventAction.emit();
  }

  showMyEvents() {
    this.myEventsAction.emit();
  }

  newAccount() {
    this.router.navigate(['/register']);
  }

  header() {
    this.router.navigate(['/']);
  }

  events() {
    this.router.navigate(['/events']);
  }

  logout() {
    clearUser();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    if (confirm('Vai tiešām vēlaties dzēst savu kontu?')) {
      const user = userSignal();
      if (user?.id) {
        
        console.log('Deleting account:', user.id);
        clearUser();
        this.router.navigate(['/register']);
      }
    }
  }
}