import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

interface CreateRoomProps {
  onBack: () => void;
  onRoomCreated: () => void;
}

export function CreateRoom({ onBack, onRoomCreated }: CreateRoomProps) {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createRoom } = useGame();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsLoading(true);
    try {
      createRoom(nickname.trim());
      onRoomCreated();
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Crear Sala</h1>
          <p className="text-gray-600">Serás el moderador de la trivia</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Ingresa tu nickname"
              maxLength={20}
              required
            />
          </div>
          
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!nickname.trim() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              {isLoading ? 'Creando...' : 'Crear Sala'}
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
          <p>Como moderador podrás crear preguntas y controlar el juego</p>
        </div>
      </div>
    </div>
  );
}
