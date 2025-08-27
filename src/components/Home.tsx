
interface HomeProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function Home({ onCreateRoom, onJoinRoom }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧠 Trivia</h1>
          <p className="text-gray-600">Juego multijugador en tiempo real</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onCreateRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>🎯</span>
            <span>Crear Sala</span>
          </button>
          
          <button
            onClick={onJoinRoom}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>🚪</span>
            <span>Unirse a Sala</span>
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Crea una sala como moderador o únete con un código</p>
        </div>
      </div>
    </div>
  );
}
