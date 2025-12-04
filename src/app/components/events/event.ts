import { Component, inject, OnInit, signal } from '@angular/core';
import { UserGlobalSignal } from '../../globalSignals/userglobalsignal';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/eventModel';
import { EventDTO } from '../../models/eventDTO';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Events implements OnInit {

  // Sānu noteikumi/teksti
  readonly rules = `
    <h3>Pasākumu noteikumi</h3>
    <p>Šeit jūs varat izveidot jaunus pasākumus vai pieteikties esošajiem.</p>
    <p>Pilni pasākumi ir atzīmēti, un atceltie tiek rādīti kā atcelti.</p>
  `;

  globalUser = inject(UserGlobalSignal);
  router = inject(Router);

  eventService = inject(EventService);

  events = signal<EventDTO[]>([]);

  rulesBoolean = signal<boolean>(true);

  // Forma pasākuma izveidei
  eventSignal = signal<EventModel>({
    title: "",
    description: "",
    date: "",
    maxParticipants: 1,
  });
eventForm: any;

  // Validācija - placeholder until form-signals library is available
  // private eventSchema = schema<EventModel>((p: any) => {
  //   required(p.title);
  //   required(p.description);
  //   required(p.date);
  //   min(p.maxParticipants, 1);
  // });

  // eventForm = form(this.eventSignal, this.eventSchema);

  isFormValid(): boolean {
    const event = this.eventSignal();
    return !!event.title && !!event.description && !!event.date && event.maxParticipants >= 1;
  }

  ngOnInit() {
    if (this.globalUser.userGlobalSignal().id === 0) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadEvents();
  }

  // Ielādē pasākumus
  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.body) {
          this.events.set(response.body);
        }
      }
    });
  }

  onRules(event: boolean) {
    this.rulesBoolean.set(event);
  }

  clearInput(input: HTMLInputElement) {
    input.value = '';
  }

  // ❗❗ Izveidot jaunu pasākumu
  createEvent() {
    if (!this.isFormValid()) return;

    this.eventService.createEvent({
      ...this.eventSignal(),
      creatorId: this.globalUser.userGlobalSignal().id!
    }).subscribe({
      next: (response: any) => {
        if (response.status === 201 && response.body) {
          alert("Pasākums izveidots!");
          this.loadEvents();
        }
      },
      error: () => alert("Kļūda izveidojot pasākumu!")
    });
  }

  // ❗❗ Pieteikties pasākumam
  joinEvent(event: EventDTO) {
    this.eventService.joinEvent({ eventId: event.id!, userId: this.globalUser.userGlobalSignal().id! }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          alert("Pieteikums veiksmīgs!");
          this.loadEvents();
        }
      },
      error: () => alert("Nevar pieteikties pasākumam!")
    });
  }

  // ❗❗ Atcelt pieteikumu
  leaveEvent(event: EventDTO) {
    this.eventService.leaveEvent(event.id!, this.globalUser.userGlobalSignal().id!).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          alert("Pieteikums atcelts!");
          this.loadEvents();
        }
      },
      error: () => alert("Nevar atcelt pieteikumu!")
    });
  }
}
