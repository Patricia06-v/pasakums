import { Component, inject, OnInit, signal } from '@angular/core';
import { UserGlobalSignal } from '../../globalSignals/userglobalsignal';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventDTO } from '../../models/eventDTO';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Events implements OnInit {
  globalUser = inject(UserGlobalSignal);
  router = inject(Router);
  eventService = inject(EventService);
  
  events = signal<EventDTO[]>([]);
  
  eventForm = inject(FormBuilder).group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    date: ['', Validators.required],
    maxParticipants: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    if (!this.globalUser.userGlobalSignal().id) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (res: any) => res.status === 200 && this.events.set(res.body),
      error: () => alert("Kļūda ielādējot pasākumus! Backend nav pieejams.")
    });
  }

  createEvent() {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach(k => this.eventForm.get(k)?.markAsTouched());
      return;
    }

    const data = { ...this.eventForm.value, creatorId: this.globalUser.userGlobalSignal().id! };
    
    this.eventService.createEvent(data).subscribe({
      next: (res: any) => {
        if (res.status === 201) {
          alert("Pasākums izveidots!");
          this.eventForm.reset({ maxParticipants: 1 });
          this.loadEvents();
        }
      },
      error: () => alert("Kļūda! Backend nav pieejams.")
    });
  }

  joinEvent(event: EventDTO) {
    this.eventService.joinEvent({ eventId: event.id!, userId: this.globalUser.userGlobalSignal().id! }).subscribe({
      next: (res: any) => res.status === 200 && (alert("Pieteikts!"), this.loadEvents()),
      error: () => alert("Kļūda! Backend nav pieejams.")
    });
  }

  leaveEvent(event: EventDTO) {
    this.eventService.leaveEvent(event.id!, this.globalUser.userGlobalSignal().id!).subscribe({
      next: (res: any) => res.status === 200 && (alert("Atcelts!"), this.loadEvents()),
      error: () => alert("Kļūda! Backend nav pieejams.")
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
