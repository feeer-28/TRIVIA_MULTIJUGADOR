export interface Player {
  id: string;
  nickname: string;
  score: number;
  isConnected: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'boolean';
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

export interface Room {
  id: string;
  code: string;
  moderatorId: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  isGameStarted: boolean;
  isGameFinished: boolean;
  createdAt: Date;
}

export interface Answer {
  playerId: string;
  questionId: string;
  selectedOption: number;
  timestamp: Date;
  isCorrect: boolean;
}

export interface GameState {
  currentRoom: Room | null;
  currentPlayer: Player | null;
  isModerator: boolean;
  currentQuestion: Question | null;
  timeRemaining: number;
  answers: Answer[];
  showResults: boolean;
}

export type WebSocketMessage = 
  | { type: 'ROOM_CREATED'; payload: { room: Room } }
  | { type: 'PLAYER_JOINED'; payload: { player: Player; room: Room } }
  | { type: 'PLAYER_LEFT'; payload: { playerId: string; room: Room } }
  | { type: 'QUESTION_STARTED'; payload: { question: Question; timeLimit: number } }
  | { type: 'ANSWER_SUBMITTED'; payload: { answer: Answer } }
  | { type: 'QUESTION_ENDED'; payload: { results: Answer[]; scores: Player[] } }
  | { type: 'GAME_FINISHED'; payload: { finalScores: Player[] } }
  | { type: 'ERROR'; payload: { message: string } };
