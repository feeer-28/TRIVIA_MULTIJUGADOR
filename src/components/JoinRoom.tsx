import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

interface JoinRoomProps {
  onBack: () => void;
  onRoomJoined: () => void;
}

export function JoinRoom({ onBack, onRoomJoined }: JoinRoomProps) {
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { joinRoom } = useGame();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !nickname.trim()) return;

    setIsLoading(true);
    try {
      joinRoom(roomCode.trim().toUpperCase(), nickname.trim());
      onRoomJoined();
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚪 Unirse a Sala</h1>
          <p className="text-gray-600">Ingresa el código de la sala</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Sala
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono tracking-wider"
              placeholder="AB12"
              maxLength={4}
              required
            />
          </div>
          
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Ingresa tu nickname"
              maxLength={20}
              required
            />
          </div>
          
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!roomCode.trim() || !nickname.trim() || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {isLoading ? 'Uniéndose...' : 'Unirse a Sala'}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Volver
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>El código de sala tiene 4 caracteres (ej: AB12)</p>
        </div>
      </div>
    </div>
  );
}
