import type { Room, Question, WebSocketMessage } from '../types';
import io, { Socket } from 'socket.io-client';

class WebSocketService {
  private socket!: Socket;
  private listeners: Map<string, (message: WebSocketMessage) => void> = new Map();
  private currentPlayerId: string = '';

  constructor() {
    if ((window as any).__triviaWebSocketService) {
      return (window as any).__triviaWebSocketService;
    }

    console.log('Initializing WebSocket Service');
    
    // Connect to server
    const serverUrl = import.meta.env.DEV 
      ? 'http://localhost:3001' 
      : window.location.origin;
    
    console.log('Connecting to server:', serverUrl);
    
    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupSocketListeners();
    (window as any).__triviaWebSocketService = this;
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('✓ Connected to WebSocket server:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Disconnected from WebSocket server');
    });

    this.socket.on('roomCreated', (data: any) => {
      console.log('Received roomCreated:', data);
      const callback = this.listeners.get(data.moderatorId);
      if (callback) {
        callback({
          type: 'ROOM_CREATED',
          payload: { room: data.room }
        });
      }
    });

    this.socket.on('playerJoined', (data: any) => {
      console.log('Received playerJoined:', data);
      const callback = this.listeners.get(this.currentPlayerId);
      if (callback) {
        callback({
          type: 'PLAYER_JOINED',
          payload: { player: data.player, room: data.room }
        });
      }
    });

    this.socket.on('playerLeft', (data: any) => {
      const callback = this.listeners.get(this.currentPlayerId);
      if (callback) {
        callback({
          type: 'PLAYER_LEFT',
          payload: { playerId: data.playerId, room: data.room }
        });
      }
    });

    this.socket.on('questionStarted', (data: any) => {
      const callback = this.listeners.get(this.currentPlayerId);
      if (callback) {
        callback({
          type: 'QUESTION_STARTED',
          payload: { question: data.question, timeLimit: data.timeLimit }
        });
      }
    });

    this.socket.on('questionEnded', (data: any) => {
      const callback = this.listeners.get(this.currentPlayerId);
      if (callback) {
        callback({
          type: 'QUESTION_ENDED',
          payload: { results: data.results, scores: data.scores }
        });
      }
    });

    this.socket.on('gameFinished', (data: any) => {
      const callback = this.listeners.get(this.currentPlayerId);
      if (callback) {
        callback({
          type: 'GAME_FINISHED',
          payload: { finalScores: data.finalScores }
        });
      }
    });

    this.socket.on('error', (data: any) => {
      console.error('Server error:', data.message);
      const callback = this.listeners.get(this.currentPlayerId);
      if (callback) {
        callback({
          type: 'ERROR',
          payload: { message: data.message }
        });
      }
    });
  }

  public static getInstance(): WebSocketService {
    if ((window as any).__triviaWebSocketService) {
      return (window as any).__triviaWebSocketService;
    }
    return new WebSocketService();
  }

  subscribe(playerId: string, callback: (message: WebSocketMessage) => void): void {
    this.currentPlayerId = playerId;
    this.listeners.set(playerId, callback);
  }

  unsubscribe(playerId: string): void {
    this.listeners.delete(playerId);
  }

  async createRoom(moderatorNickname: string): Promise<{ room: Room; moderatorId: string }> {
    return new Promise((resolve, reject) => {
      const onRoomCreated = (data: any) => {
        this.socket.off('roomCreated', onRoomCreated);
        this.currentPlayerId = data.moderatorId;
        resolve({ room: data.room, moderatorId: data.moderatorId });
      };

      const onError = (data: any) => {
        this.socket.off('roomCreated', onRoomCreated);
        this.socket.off('error', onError);
        reject(new Error(data.message));
      };

      this.socket.once('roomCreated', onRoomCreated);
      this.socket.once('error', onError);
      this.socket.emit('createRoom', { moderatorNickname });
    });
  }

  async joinRoom(roomCode: string, playerNickname: string): Promise<{ success: boolean; room?: Room; playerId?: string; error?: string }> {
    return new Promise((resolve) => {
      const onRoomJoined = (data: any) => {
        this.socket.off('roomJoined', onRoomJoined);
        this.socket.off('error', onError);
        this.currentPlayerId = data.playerId;
        resolve({ 
          success: true, 
          room: data.room, 
          playerId: data.playerId 
        });
      };

      const onError = (data: any) => {
        this.socket.off('roomJoined', onRoomJoined);
        this.socket.off('error', onError);
        resolve({ 
          success: false, 
          error: data.message 
        });
      };

      this.socket.once('roomJoined', onRoomJoined);
      this.socket.once('error', onError);
      this.socket.emit('joinRoom', { roomCode: roomCode.toUpperCase(), playerNickname });
    });
  }

  leaveRoom(playerId: string): void {
    this.socket.emit('leaveRoom', { playerId });
  }

  addQuestion(_playerId: string, question: Omit<Question, 'id'>): { success: boolean; error?: string } {
    this.socket.emit('addQuestion', { question });
    return { success: true };
  }

  startQuestion(_playerId: string): { success: boolean; error?: string } {
    this.socket.emit('startQuestion', {});
    return { success: true };
  }

  endQuestion(_playerId: string): { success: boolean; error?: string } {
    this.socket.emit('endQuestion', {});
    return { success: true };
  }

  submitAnswer(_playerId: string, selectedOption: number): { success: boolean; error?: string } {
    this.socket.emit('submitAnswer', { selectedOption });
    return { success: true };
  }

  getRoom(_roomCode: string): Room | null {
    return null; // Not needed with server
  }

  getRoomByPlayerId(_playerId: string): Room | null {
    return null; // Not needed with server
  }

  public loadRoomsFromStorage(): void {
    // Handled by server
  }

  public saveRoomsToStorage(): void {
    // Handled by server
  }
}

export const websocketService = new WebSocketService();
