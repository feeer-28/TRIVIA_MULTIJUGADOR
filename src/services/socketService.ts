import { io, Socket } from 'socket.io-client';
import type { Room, Player, Question, Answer, WebSocketMessage } from '../types';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners: Map<string, (message: WebSocketMessage) => void> = new Map();
  private currentPlayerId: string | null = null;

  constructor() {
    if (SocketService.instance) {
      return SocketService.instance;
    }
    SocketService.instance = this;
  }

  connect(): void {
    if (this.socket?.connected) return;

    // Use environment variable for production, localhost for development
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    this.socket = io(serverUrl);

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.currentPlayerId = null;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Room events
    this.socket.on('roomCreated', (data) => {
      this.currentPlayerId = data.moderatorId;
      this.notifyListeners({
        type: 'ROOM_CREATED',
        payload: { room: data.room }
      });
    });

    this.socket.on('roomJoined', (data) => {
      this.currentPlayerId = data.playerId;
      this.notifyListeners({
        type: 'ROOM_CREATED', // Use same type for consistency
        payload: { room: data.room }
      });
    });

    this.socket.on('playerJoined', (data) => {
      this.notifyListeners({
        type: 'PLAYER_JOINED',
        payload: { player: data.player, room: data.room }
      });
    });

    this.socket.on('playerLeft', (data) => {
      this.notifyListeners({
        type: 'PLAYER_LEFT',
        payload: { playerId: data.playerId, room: data.room }
      });
    });

    // Game events
    this.socket.on('questionStarted', (data) => {
      this.notifyListeners({
        type: 'QUESTION_STARTED',
        payload: { question: data.question, timeLimit: data.timeLimit }
      });
    });

    this.socket.on('answerSubmitted', (data) => {
      this.notifyListeners({
        type: 'ANSWER_SUBMITTED',
        payload: { answer: data.answer }
      });
    });

    this.socket.on('questionEnded', (data) => {
      this.notifyListeners({
        type: 'QUESTION_ENDED',
        payload: { results: data.results, scores: data.scores }
      });
    });

    this.socket.on('gameFinished', (data) => {
      this.notifyListeners({
        type: 'GAME_FINISHED',
        payload: { finalScores: data.finalScores }
      });
    });

    // Error handling
    this.socket.on('error', (data) => {
      this.notifyListeners({
        type: 'ERROR',
        payload: { message: data.message }
      });
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  private notifyListeners(message: WebSocketMessage): void {
    this.listeners.forEach(callback => {
      setTimeout(() => callback(message), 0);
    });
  }

  // Subscribe to messages
  subscribe(playerId: string, callback: (message: WebSocketMessage) => void): void {
    this.listeners.set(playerId, callback);
  }

  // Unsubscribe from messages
  unsubscribe(playerId: string): void {
    this.listeners.delete(playerId);
  }

  // Create a new room
  createRoom(moderatorNickname: string): { room: Room; moderatorId: string } {
    if (!this.socket) {
      throw new Error('Not connected to server');
    }

    this.socket.emit('createRoom', { moderatorNickname });
    
    // Return placeholder - actual data will come via event
    return { 
      room: {} as Room, 
      moderatorId: this.socket.id || '' 
    };
  }

  // Join a room
  joinRoom(roomCode: string, playerNickname: string): { success: boolean; room?: Room; playerId?: string; error?: string } {
    if (!this.socket) {
      throw new Error('Not connected to server');
    }

    this.socket.emit('joinRoom', { roomCode, playerNickname });
    
    // Return placeholder - actual data will come via event
    return { success: true };
  }

  // Leave room
  leaveRoom(playerId: string): void {
    if (!this.socket) return;
    this.socket.emit('leaveRoom');
  }

  // Add question (moderator only)
  addQuestion(playerId: string, question: Omit<Question, 'id'>): { success: boolean; error?: string } {
    if (!this.socket) {
      return { success: false, error: 'Not connected to server' };
    }

    this.socket.emit('addQuestion', { question });
    return { success: true };
  }

  // Start question (moderator only)
  startQuestion(playerId: string): { success: boolean; error?: string } {
    if (!this.socket) {
      return { success: false, error: 'Not connected to server' };
    }

    this.socket.emit('startQuestion');
    return { success: true };
  }

  // Submit answer
  submitAnswer(playerId: string, selectedOption: number): { success: boolean; error?: string } {
    if (!this.socket) {
      return { success: false, error: 'Not connected to server' };
    }

    this.socket.emit('submitAnswer', { selectedOption });
    return { success: true };
  }

  // End current question (moderator only)
  endQuestion(playerId: string): { success: boolean; error?: string } {
    if (!this.socket) {
      return { success: false, error: 'Not connected to server' };
    }

    this.socket.emit('endQuestion');
    return { success: true };
  }

  // Get current player ID
  getCurrentPlayerId(): string | null {
    return this.currentPlayerId;
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
