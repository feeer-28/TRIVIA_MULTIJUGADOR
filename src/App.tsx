import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Home } from './components/Home';
import { CreateRoom } from './components/CreateRoom';
import { JoinRoom } from './components/JoinRoom';
import { QuestionCreator } from './components/QuestionCreator';
import { GameRoom } from './components/GameRoom';
import { VictoryScreen } from './components/VictoryScreen';

type AppState = 'home' | 'create-room' | 'join-room' | 'question-creator' | 'waiting-room' | 'game-room' | 'victory';

function AppContent() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const { leaveRoom, state } = useGame();

  const handleCreateRoom = () => {
    setCurrentState('create-room');
  };

  const handleJoinRoom = () => {
    setCurrentState('join-room');
  };

  const handleRoomCreated = () => {
    setCurrentState('question-creator');
  };

  const handleRoomJoined = () => {
    setCurrentState('waiting-room');
  };

  const handleStartGame = () => {
    setCurrentState('game-room');
  };

  const handleGameEnd = () => {
    // Check if game finished and show victory screen
    if (state.currentRoom?.isGameFinished && state.currentRoom?.players.length > 0) {
      setCurrentState('victory');
    } else {
      leaveRoom();
      setCurrentState('home');
    }
  };

  const handleVictoryContinue = () => {
    leaveRoom();
    setCurrentState('home');
  };

  const handleBack = () => {
    setCurrentState('home');
  };

  const handleQuestionAdded = () => {
    // Question was added successfully, stay in question creator
  };

  switch (currentState) {
    case 'home':
      return <Home onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
    
    case 'create-room':
      return <CreateRoom onBack={handleBack} onRoomCreated={handleRoomCreated} />;
    
    case 'join-room':
      return <JoinRoom onBack={handleBack} onRoomJoined={handleRoomJoined} />;
    
    case 'question-creator':
      return (
        <QuestionCreator 
          onQuestionAdded={handleQuestionAdded} 
          onStartGame={handleStartGame} 
        />
      );
    
    case 'waiting-room':
      return <GameRoom onGameEnd={handleGameEnd} />;
    
    case 'game-room':
      return <GameRoom onGameEnd={handleGameEnd} />;
    
    case 'victory':
      if (state.currentRoom?.players) {
        const winner = state.currentRoom.players.reduce((prev, current) => 
          prev.score > current.score ? prev : current
        );
        return (
          <VictoryScreen 
            winner={winner}
            allPlayers={state.currentRoom.players}
            onContinue={handleVictoryContinue}
          />
        );
      }
      return <Home onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
    
    default:
      return <Home onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
