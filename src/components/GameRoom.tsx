import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

interface GameRoomProps {
  onGameEnd: () => void;
}

export function GameRoom({ onGameEnd }: GameRoomProps) {
  const { state, submitAnswer, startQuestion, endQuestion } = useGame();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (state.currentQuestion) {
      setSelectedOption(null);
      setHasAnswered(false);
    }
  }, [state.currentQuestion]);

  useEffect(() => {
    if (state.currentRoom?.isGameFinished) {
      onGameEnd();
    }
  }, [state.currentRoom?.isGameFinished, onGameEnd]);

  const handleAnswerSubmit = () => {
    if (selectedOption !== null && !hasAnswered) {
      submitAnswer(selectedOption);
      setHasAnswered(true);
    }
  };

  const handleStartNextQuestion = () => {
    startQuestion();
  };

  const handleEndQuestion = () => {
    endQuestion();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  if (state.showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Resultados</h1>
              <p className="text-gray-600">Sala: {state.currentRoom?.code}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Marcador Actual</h2>
              <div className="space-y-3">
                {state.currentRoom?.players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="font-medium">{player.nickname}</span>
                        {player.id === state.currentPlayer?.id && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Tú</span>
                        )}
                      </div>
                      <span className="text-xl font-bold text-gray-800">{player.score}</span>
                    </div>
                  ))}
              </div>
            </div>

            {state.isModerator && !state.currentRoom?.isGameFinished && (
              <div className="text-center">
                <button
                  onClick={handleStartNextQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                >
                  Siguiente Pregunta
                </button>
              </div>
            )}

            {state.currentRoom?.isGameFinished && (
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">🎉 ¡Juego Terminado!</h3>
                  <p className="text-gray-600">Gracias por jugar</p>
                </div>
                <button
                  onClick={onGameEnd}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                >
                  Volver al Inicio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!state.currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⏳ Esperando pregunta...</h2>
          <p className="text-gray-600 mb-6">Sala: {state.currentRoom?.code}</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-2">Jugadores conectados:</h3>
            <div className="space-y-2">
              {state.currentRoom?.players.map((player) => (
                <div key={player.id} className="flex items-center justify-between">
                  <span>{player.nickname}</span>
                  <span className="font-bold">{player.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {state.isModerator && (
            <div className="space-y-3">
              <button
                onClick={handleStartNextQuestion}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Iniciar Pregunta
              </button>
              <button
                onClick={handleEndQuestion}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Terminar Juego
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🧠 Trivia en Vivo</h1>
              <p className="text-gray-600">Sala: {state.currentRoom?.code}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">
                {formatTime(state.timeRemaining)}
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - (state.timeRemaining / state.currentQuestion.timeLimit * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-indigo-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {state.currentQuestion.text}
            </h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tipo: {state.currentQuestion.type === 'multiple' ? 'Opción Múltiple' : 'Verdadero/Falso'}</span>
              <span>Puntos: {state.currentQuestion.points}</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {state.currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !hasAnswered && setSelectedOption(index)}
                disabled={hasAnswered}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : hasAnswered
                    ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                    selectedOption === index
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!hasAnswered && (
            <div className="text-center">
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedOption === null}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
              >
                Enviar Respuesta
              </button>
            </div>
          )}

          {hasAnswered && (
            <div className="text-center">
              <div className="bg-green-100 text-green-800 py-3 px-6 rounded-xl inline-block">
                ✅ Respuesta enviada
              </div>
            </div>
          )}

          {/* Moderator Controls */}
          {state.isModerator && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <button
                  onClick={handleEndQuestion}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Finalizar Pregunta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
