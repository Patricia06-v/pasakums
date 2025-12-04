import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EventModel } from '../models/eventModel';
import { JoinEventDTO } from '../models/joinEventDTO';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly URL = environment.apiUrl + "/events";
  private http = inject(HttpClient);

  // GET: List all events
  list(): Observable<any> {
    return this.http.get<any[]>(this.URL);
  }

  // POST: Join an event
  join(eventId: number): Observable<any> {
    return this.http.post(`${this.URL}/${eventId}/join`, {});
  }

  // GET: Visi pasākumi
  getAllEvents(): Observable<any> {
    return this.http.get<EventModel[]>(this.URL, { observe: 'response' });
  }

  // GET: Konkrēts pasākums
  getEventById(eventId: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.URL}/${eventId}`);
  }

  // POST: Izveidot jaunu pasākumu
  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.URL}`, event, { observe: 'response' });
  }

 leaveEvent(eventId: number, userId: number): Observable<any> {
    return this.http.post(`${this.URL}/leave`, { eventId, userId }, { observe: 'response' });
  }

  // POST: Pieteikties pasākumam
  joinEvent(dto: JoinEventDTO): Observable<any> {
    return this.http.post(`${this.URL}/join`, dto, { observe: 'response' });
  }

  // POST: Atcelt pieteikumu
  cancelJoin(dto: JoinEventDTO): Observable<any> {
    return this.http.post(`${this.URL}/cancel`, dto, { observe: 'response' });
  }

  // DELETE: Dzēst pasākumu (admins / īpašnieks)
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.URL}/${eventId}`, { observe: 'response' });
  }
}