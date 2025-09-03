import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, Player, Room, Question, WebSocketMessage } from '../types';
import { websocketService } from '../services/websocketService';

interface GameContextType {
  state: GameState;
  createRoom: (nickname: string) => void;
  joinRoom: (roomCode: string, nickname: string) => void;
  leaveRoom: () => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  startQuestion: () => void;
  endQuestion: () => void;
  submitAnswer: (selectedOption: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction =
  | { type: 'SET_ROOM'; payload: Room }
  | { type: 'SET_PLAYER'; payload: { player: Player; isModerator: boolean } }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question | null }
  | { type: 'SET_TIME_REMAINING'; payload: number }
  | { type: 'UPDATE_PLAYERS'; payload: Player[] }
  | { type: 'SET_SHOW_RESULTS'; payload: boolean }
  | { type: 'RESET_GAME' }
  | { type: 'SET_GAME_FINISHED'; payload: boolean };

const initialState: GameState = {
  currentRoom: null,
  currentPlayer: null,
  isModerator: false,
  currentQuestion: null,
  timeRemaining: 0,
  answers: [],
  showResults: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_PLAYER':
      return { 
        ...state, 
        currentPlayer: action.payload.player, 
        isModerator: action.payload.isModerator 
      };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload, showResults: false };
    case 'SET_TIME_REMAINING':
      return { ...state, timeRemaining: action.payload };
    case 'UPDATE_PLAYERS':
      return { 
        ...state, 
        currentRoom: state.currentRoom ? { 
          ...state.currentRoom, 
          players: action.payload 
        } : null 
      };
    case 'SET_SHOW_RESULTS':
      return { ...state, showResults: action.payload };
    case 'SET_GAME_FINISHED':
      return { 
        ...state, 
        currentRoom: state.currentRoom ? { 
          ...state.currentRoom, 
          isGameFinished: action.payload 
        } : null 
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.currentPlayer) {
      websocketService.subscribe(state.currentPlayer.id, handleWebSocketMessage);
      
      return () => {
        if (state.currentPlayer) {
          websocketService.unsubscribe(state.currentPlayer.id);
        }
      };
    }
  }, [state.currentPlayer]);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'ROOM_CREATED':
        dispatch({ type: 'SET_ROOM', payload: message.payload.room });
        break;
      case 'PLAYER_JOINED':
        dispatch({ type: 'SET_ROOM', payload: message.payload.room });
        break;
      case 'PLAYER_LEFT':
        dispatch({ type: 'SET_ROOM', payload: message.payload.room });
        break;
      case 'QUESTION_STARTED':
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: message.payload.question });
        dispatch({ type: 'SET_TIME_REMAINING', payload: message.payload.timeLimit });
        startTimer(message.payload.timeLimit);
        break;
      case 'QUESTION_ENDED':
        dispatch({ type: 'UPDATE_PLAYERS', payload: message.payload.scores });
        dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: null });
        break;
      case 'GAME_FINISHED':
        dispatch({ type: 'UPDATE_PLAYERS', payload: message.payload.finalScores });
        dispatch({ type: 'SET_GAME_FINISHED', payload: true });
        dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
        break;
      case 'ERROR':
        alert(message.payload.message);
        break;
    }
  };

  const startTimer = (timeLimit: number) => {
    let timeLeft = timeLimit;
    const timer = setInterval(() => {
      timeLeft -= 1;
      dispatch({ type: 'SET_TIME_REMAINING', payload: timeLeft });
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
      }
    }, 1000);
  };

  const createRoom = (nickname: string) => {
    const { room, moderatorId } = websocketService.createRoom(nickname);
    const moderator = room.players.find(p => p.id === moderatorId)!;
    
    dispatch({ type: 'SET_PLAYER', payload: { player: moderator, isModerator: true } });
    dispatch({ type: 'SET_ROOM', payload: room });
  };

  const joinRoom = (roomCode: string, nickname: string) => {
    const result = websocketService.joinRoom(roomCode, nickname);
    
    if (result.success && result.room && result.playerId) {
      const player = result.room.players.find(p => p.id === result.playerId)!;
      
      dispatch({ type: 'SET_PLAYER', payload: { player, isModerator: false } });
      dispatch({ type: 'SET_ROOM', payload: result.room });
    } else {
      alert(result.error || 'Error al unirse a la sala');
    }
  };

  const leaveRoom = () => {
    if (state.currentPlayer) {
      websocketService.leaveRoom(state.currentPlayer.id);
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const addQuestion = (question: Omit<Question, 'id'>) => {
    if (state.currentPlayer) {
      const result = websocketService.addQuestion(state.currentPlayer.id, question);
      if (!result.success) {
        alert(result.error || 'Error al agregar pregunta');
      }
    }
  };

  const startQuestion = () => {
    if (state.currentPlayer) {
      const result = websocketService.startQuestion(state.currentPlayer.id);
      if (!result.success) {
        alert(result.error || 'Error al iniciar pregunta');
      }
    }
  };

  const endQuestion = () => {
    if (state.currentPlayer) {
      const result = websocketService.endQuestion(state.currentPlayer.id);
      if (!result.success) {
        alert(result.error || 'Error al finalizar pregunta');
      }
    }
  };

  const submitAnswer = (selectedOption: number) => {
    if (state.currentPlayer) {
      const result = websocketService.submitAnswer(state.currentPlayer.id, selectedOption);
      if (!result.success) {
        alert(result.error || 'Error al enviar respuesta');
      }
    }
  };

  const contextValue: GameContextType = {
    state,
    createRoom,
    joinRoom,
    leaveRoom,
    addQuestion,
    startQuestion,
    endQuestion,
    submitAnswer,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
