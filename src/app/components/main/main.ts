import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  providers: [EventService],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {
  private eventService = inject(EventService);
  events: any[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = '';
    
    this.eventService.list().subscribe({
      next: (events: any[]) => {
        this.events = events;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Neizdevās ielādēt pasākumus';
        this.loading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  joinEvent(eventId: number) {
    if (!eventId) return;
    
    this.eventService.join(eventId).subscribe({
      next: (event: any) => {
        console.log('Successfully joined event:', event);
        this.loadEvents(); // Refresh the list
      },
      error: (err: any) => {
        console.error('Error joining event:', err);
      }
    });
  }
}
