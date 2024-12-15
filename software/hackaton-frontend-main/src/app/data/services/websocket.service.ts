import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true, // Permite cookies, se necessário
      transports: ['websocket'], // Force o uso do protocolo WebSocket
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket Server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.warn('Disconnected from WebSocket Server');
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
