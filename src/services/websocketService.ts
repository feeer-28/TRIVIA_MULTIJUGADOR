import type { Room, Player, Question, Answer, WebSocketMessage } from '../types';

class WebSocketService {
  private static instance: WebSocketService;
  private rooms: Map<string, Room> = new Map();
  private listeners: Map<string, (message: WebSocketMessage) => void> = new Map();
  private playerRooms: Map<string, string> = new Map();
  private broadcastChannel!: BroadcastChannel;

  constructor() {
    if (WebSocketService.instance) {
      return WebSocketService.instance;
    }

    // Load rooms from localStorage on initialization
    this.loadRoomsFromStorage();
    
    // Create BroadcastChannel for cross-tab communication
    this.broadcastChannel = new BroadcastChannel('trivia-game');
    
    // Listen for messages from other tabs
    this.broadcastChannel.addEventListener('message', (event) => {
        this.handleCrossTabMessage(event.data);
    });
    
    // Listen for storage changes from other tabs/windows (fallback)
    window.addEventListener('storage', (e) => {
      if (e.key === 'trivia-rooms') {
        this.loadRoomsFromStorage();
      }
    });

    WebSocketService.instance = this;
  }

  private handleCrossTabMessage(data: any) {
    if (data.type === 'WEBSOCKET_MESSAGE') {
      const { playerId, message } = data;
      if (this.listeners.has(playerId)) {
        const callback = this.listeners.get(playerId)!;
        callback(message);
      }
    } else if (data.type === 'RELOAD_ROOMS') {
      this.loadRoomsFromStorage();
    }
  }

  // Generate unique room code
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Load rooms from localStorage
  private loadRoomsFromStorage(): void {
    try {
      // Clear existing rooms first
      this.rooms.clear();
      
      const storedRooms = localStorage.getItem('trivia-rooms');
        if (storedRooms) {
        const roomsData = JSON.parse(storedRooms);
        Object.entries(roomsData).forEach(([code, roomData]: [string, any]) => {
          // Convert date strings back to Date objects
          const room: Room = {
            ...roomData,
            createdAt: new Date(roomData.createdAt)
          };
          this.rooms.set(code, room);
        });
      }
    } catch (error) {
      console.warn('Error loading rooms from storage:', error);
    }
  }

  // Save rooms to localStorage
  private saveRoomsToStorage(): void {
    try {
      const roomsData: Record<string, Room> = {};
      this.rooms.forEach((room, code) => {
        roomsData[code] = room;
      });
      localStorage.setItem('trivia-rooms', JSON.stringify(roomsData));
      
      // Notify other tabs to reload rooms
      this.broadcastChannel.postMessage({
        type: 'RELOAD_ROOMS'
      });
    } catch (error) {
      console.warn('Error saving rooms to storage:', error);
    }
  }

  // Subscribe to messages
  subscribe(playerId: string, callback: (message: WebSocketMessage) => void): void {
    this.listeners.set(playerId, callback);
  }

  // Unsubscribe from messages
  unsubscribe(playerId: string): void {
    this.listeners.delete(playerId);
    this.playerRooms.delete(playerId);
  }

  // Broadcast message to all players in a room
  private broadcast(roomCode: string, message: WebSocketMessage, excludePlayerId?: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) {
      console.error('Broadcast: Room not found:', roomCode);
      return;
    }

    room.players.forEach(player => {
      if (player.id !== excludePlayerId) {
        // Send to local listener if available
        if (this.listeners.has(player.id)) {
          const callback = this.listeners.get(player.id)!;
          setTimeout(() => callback(message), 50);
        }
        
        // Also broadcast to other tabs via BroadcastChannel
        this.broadcastChannel.postMessage({
          type: 'WEBSOCKET_MESSAGE',
          playerId: player.id,
          message: message
        });
      }
    });
  }

  // Send message to specific player
  private sendToPlayer(playerId: string, message: WebSocketMessage): void {
    if (this.listeners.has(playerId)) {
      const callback = this.listeners.get(playerId)!;
      setTimeout(() => callback(message), 50);
    }
  }

  // Create a new room
  createRoom(moderatorNickname: string): { room: Room; moderatorId: string } {
    const moderatorId = this.generateId();
    const roomCode = this.generateRoomCode();
    
    
    const moderator: Player = {
      id: moderatorId,
      nickname: moderatorNickname,
      score: 0,
      isConnected: true
    };

    const room: Room = {
      id: this.generateId(),
      code: roomCode,
      moderatorId,
      players: [moderator],
      questions: [],
      currentQuestionIndex: -1,
      isGameStarted: false,
      isGameFinished: false,
      createdAt: new Date()
    };

    this.rooms.set(roomCode, room);
    this.playerRooms.set(moderatorId, roomCode);
    this.saveRoomsToStorage();

    

    this.sendToPlayer(moderatorId, {
      type: 'ROOM_CREATED',
      payload: { room }
    });

    return { room, moderatorId };
  }

  // Join a room
  joinRoom(roomCode: string, playerNickname: string): { success: boolean; room?: Room; playerId?: string; error?: string } {
    
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      console.error('Room not found:', roomCode);
      return { success: false, error: 'Sala no encontrada' };
    }

    if (room.isGameStarted) {
      return { success: false, error: 'El juego ya ha comenzado' };
    }

    // Check if nickname is already taken
    if (room.players.some(p => p.nickname === playerNickname)) {
      return { success: false, error: 'El nickname ya está en uso' };
    }

    const playerId = this.generateId();
    const player: Player = {
      id: playerId,
      nickname: playerNickname,
      score: 0,
      isConnected: true
    };

    room.players.push(player);
    this.playerRooms.set(playerId, roomCode);
    this.saveRoomsToStorage();


    // Notify all players about the new player
    this.broadcast(roomCode, {
      type: 'PLAYER_JOINED',
      payload: { player, room }
    });

    return { success: true, room, playerId };
  }

  // Leave room
  leaveRoom(playerId: string): void {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (!room) return;

    // Remove player from room
    room.players = room.players.filter(p => p.id !== playerId);
    
    // If moderator leaves, end the game
    if (playerId === room.moderatorId) {
      this.broadcast(roomCode, {
        type: 'ERROR',
        payload: { message: 'El moderador ha abandonado la sala' }
      });
      this.rooms.delete(roomCode);
      this.saveRoomsToStorage();
      return;
    }

    // Notify remaining players
    this.broadcast(roomCode, {
      type: 'PLAYER_LEFT',
      payload: { playerId, room }
    });

    this.playerRooms.delete(playerId);
    this.saveRoomsToStorage();
  }

  // Add question (moderator only)
  addQuestion(playerId: string, question: Omit<Question, 'id'>): { success: boolean; error?: string } {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return { success: false, error: 'No estás en una sala' };

    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, error: 'Sala no encontrada' };

    if (room.moderatorId !== playerId) {
      return { success: false, error: 'Solo el moderador puede agregar preguntas' };
    }

    if (room.isGameStarted) {
      return { success: false, error: 'No se pueden agregar preguntas durante el juego' };
    }

    const newQuestion: Question = {
      ...question,
      id: this.generateId()
    };

    room.questions.push(newQuestion);
    this.saveRoomsToStorage();
    return { success: true };
  }

  // Start question (moderator only)
  startQuestion(playerId: string): { success: boolean; error?: string } {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return { success: false, error: 'No estás en una sala' };

    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, error: 'Sala no encontrada' };

    if (room.moderatorId !== playerId) {
      return { success: false, error: 'Solo el moderador puede iniciar preguntas' };
    }

    if (room.questions.length === 0) {
      return { success: false, error: 'No hay preguntas disponibles' };
    }

    const nextIndex = room.currentQuestionIndex + 1;
    if (nextIndex >= room.questions.length) {
      return { success: false, error: 'No hay más preguntas' };
    }

    room.currentQuestionIndex = nextIndex;
    room.isGameStarted = true;
    const currentQuestion = room.questions[nextIndex];
    this.saveRoomsToStorage();

    // Broadcast question to all players
    this.broadcast(roomCode, {
      type: 'QUESTION_STARTED',
      payload: { question: currentQuestion, timeLimit: currentQuestion.timeLimit }
    });

    // Auto-end question after time limit
    setTimeout(() => {
      this.endQuestion(playerId);
    }, currentQuestion.timeLimit * 1000);

    return { success: true };
  }

  // Submit answer
  submitAnswer(playerId: string, selectedOption: number): { success: boolean; error?: string } {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return { success: false, error: 'No estás en una sala' };

    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, error: 'Sala no encontrada' };

    if (room.currentQuestionIndex < 0) {
      return { success: false, error: 'No hay pregunta activa' };
    }

    const currentQuestion = room.questions[room.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Update player score
    if (isCorrect) {
      const player = room.players.find(p => p.id === playerId);
      if (player) {
        player.score += currentQuestion.points;
        this.saveRoomsToStorage();
      }
    }

    const answer: Answer = {
      playerId,
      questionId: currentQuestion.id,
      selectedOption,
      timestamp: new Date(),
      isCorrect
    };

    // Store answer (in a real app, you'd have a separate answers storage)
    // For now, we'll just broadcast it
    this.broadcast(roomCode, {
      type: 'ANSWER_SUBMITTED',
      payload: { answer }
    });

    return { success: true };
  }

  // End current question (moderator only)
  endQuestion(playerId: string): { success: boolean; error?: string } {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return { success: false, error: 'No estás en una sala' };

    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, error: 'Sala no encontrada' };

    if (room.moderatorId !== playerId) {
      return { success: false, error: 'Solo el moderador puede finalizar preguntas' };
    }

    if (room.currentQuestionIndex < 0) {
      return { success: false, error: 'No hay pregunta activa' };
    }

    // Check if this was the last question
    const isLastQuestion = room.currentQuestionIndex >= room.questions.length - 1;

    if (isLastQuestion) {
      room.isGameFinished = true;
      this.saveRoomsToStorage();
      // Broadcast final results
      this.broadcast(roomCode, {
        type: 'GAME_FINISHED',
        payload: { finalScores: [...room.players].sort((a, b) => b.score - a.score) }
      });
    } else {
      // Broadcast current results
      this.broadcast(roomCode, {
        type: 'QUESTION_ENDED',
        payload: { 
          results: [], // In a real app, you'd collect all answers for this question
          scores: [...room.players].sort((a, b) => b.score - a.score)
        }
      });
    }

    return { success: true };
  }

  // Get room by code
  getRoom(roomCode: string): Room | null {
    return this.rooms.get(roomCode) || null;
  }

  // Get room by player ID
  getRoomByPlayerId(playerId: string): Room | null {
    const roomCode = this.playerRooms.get(playerId);
    if (!roomCode) return null;
    return this.rooms.get(roomCode) || null;
  }
}

export const websocketService = new WebSocketService();
