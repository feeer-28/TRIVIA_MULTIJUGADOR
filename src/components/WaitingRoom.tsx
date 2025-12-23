import { useGame } from '../context/GameContext';

interface WaitingRoomProps {
  onBack: () => void;
  onStartGame: () => void;
}

export function WaitingRoom({ onBack, onStartGame }: WaitingRoomProps) {
  const { state, leaveRoom } = useGame();

  const handleLeaveRoom = () => {
    leaveRoom();
    onBack();
  };

  if (!state.currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h2>
          <p className="text-gray-600 mb-6">No se pudo acceder a la sala</p>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏠 Sala de Espera</h1>
          <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block mb-2">
            <span className="text-2xl font-mono font-bold text-blue-600">
              {state.currentRoom.code}
            </span>
          </div>
          <p className="text-gray-600">Comparte este código con tus amigos</p>
          
          {/* Copy button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(state.currentRoom?.code || '');
              alert('¡Código copiado al portapapeles!');
            }}
            className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            📋 Copiar Código
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Jugadores Conectados ({state.currentRoom.players.length})
          </h2>
          <div className="space-y-3">
            {state.currentRoom.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.nickname.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{player.nickname}</span>
                  {player.id === state.currentRoom?.moderatorId && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      Moderador
                    </span>
                  )}
                  {player.id === state.currentPlayer?.id && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Tú
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Puntos:</span>
                  <span className="font-bold text-gray-800">{player.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Status */}
        <div className="mb-6">
          {state.isModerator ? (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">🎯</span>
                Panel del Moderador
              </h3>
              <div className="mb-4">
                <p className="text-blue-700 text-sm mb-2">
                  Como moderador, sigue estos pasos:
                </p>
                <ol className="text-blue-600 text-sm space-y-1">
                  <li>1. ✅ Espera a que se unan más jugadores (opcional)</li>
                  <li>2. 📝 Haz clic en "Crear Preguntas" para preparar el juego</li>
                  <li>3. 🚀 Inicia el juego cuando estés listo</li>
                </ol>
              </div>
              <div className="text-center">
                <button
                  onClick={onStartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  📝 Crear Preguntas
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2 flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Esperando al Moderador
              </h3>
              <p className="text-amber-700">
                El moderador está preparando las preguntas. ¡Relájate y prepárate para el desafío!
              </p>
              <p className="text-amber-600 text-sm mt-2">
                💡 Mientras esperas, puedes invitar a más amigos con el código de la sala
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleLeaveRoom}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Salir de la Sala
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Los jugadores pueden unirse usando el código de la sala</p>
          {import.meta.env.DEV && (
            <details className="mt-4 text-left bg-gray-100 p-4 rounded">
              <summary className="cursor-pointer font-medium">Debug Info</summary>
              <pre className="text-xs mt-2 whitespace-pre-wrap">
                {JSON.stringify({
                  roomCode: state.currentRoom?.code,
                  playerId: state.currentPlayer?.id,
                  isModerator: state.isModerator,
                  playersCount: state.currentRoom?.players.length
                }, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}