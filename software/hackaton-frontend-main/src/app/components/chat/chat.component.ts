import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { NbCardModule, NbChatModule } from '@nebular/theme';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgIf, NgFor, NbCardModule, NbChatModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  isChatOpen: boolean = false;
  messages = [] as any[];
  isTyping: boolean = false; // Controle para "Digitando..."
  private socket?: Socket;
  private currentMessageIndex: number | null = null; // Índice da mensagem em atualização

  ngOnInit() {
    // Adiciona uma mensagem inicial

    // Conectar ao WebSocket
    this.socket = io('http://localhost:3000/pump-selector', {
      withCredentials: true,
    });

    // Escutar partes das mensagens do backend
    this.socket.on('response', (data: string) => {
      if (!this.isTyping) {
        this.isTyping = true; // Ativa a animação
        // Adiciona uma mensagem "vazia" para ser atualizada
        this.currentMessageIndex = this.messages.push({ text: '', reply: false }) - 1;
      }

      if (this.currentMessageIndex !== null) {
        // Concatena o texto na mensagem atual
        this.messages[this.currentMessageIndex].text += data;
      }
    });

    // Sinaliza o término da mensagem
    this.socket.on('end', () => {
      this.isTyping = false; // Desativa a animação
      this.currentMessageIndex = null; // Finaliza a atualização da mensagem
    });

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor WebSocket');
    });

    const messageText = localStorage.getItem('adviceData');

    // Envia a mensagem para o backend
    this.socket?.emit('chat', messageText);
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }

    localStorage.removeItem('adviceData');
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(event: any) {
    const messageText = event.message;

    // Adiciona a mensagem do usuário ao chat
    this.messages.push({ text: messageText, reply: true });

    // Envia a mensagem para o backend
    this.socket?.emit('chat', messageText);
  }
}
