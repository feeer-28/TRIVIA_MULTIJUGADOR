import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Home } from './components/Home';
import { CreateRoom } from './components/CreateRoom';
import { JoinRoom } from './components/JoinRoom';
import { QuestionCreator } from './components/QuestionCreator';
import { GameRoom } from './components/GameRoom';

type AppState = 'home' | 'create-room' | 'join-room' | 'question-creator' | 'waiting-room' | 'game-room';

function AppContent() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const { leaveRoom } = useGame();

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
