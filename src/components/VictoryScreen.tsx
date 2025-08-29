import { useEffect } from 'react';
import type { Player } from '../types';

// Importar canvas-confetti con dynamic import
let confetti: any;

interface VictoryScreenProps {
  winner: Player;
  allPlayers: Player[];
  onContinue: () => void;
}

export function VictoryScreen({ winner, allPlayers, onContinue }: VictoryScreenProps) {
  useEffect(() => {
    // Cargar canvas-confetti dinámicamente
    const loadConfetti = async () => {
      const confettiModule = await import('canvas-confetti');
      confetti = confettiModule.default;
      
      // Confetti explosion when component mounts
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Big confetti burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors
        });
      }, 500);
    };

    loadConfetti();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 text-6xl animate-bounce">🎉</div>
          <div className="absolute top-4 right-4 text-6xl animate-bounce delay-100">🏆</div>
          <div className="absolute bottom-4 left-4 text-6xl animate-bounce delay-200">⭐</div>
          <div className="absolute bottom-4 right-4 text-6xl animate-bounce delay-300">🎊</div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Crown animation */}
          <div className="mb-6">
            <div className="text-8xl animate-pulse">👑</div>
          </div>

          {/* Winner announcement */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">
            ¡GANADOR!
          </h1>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 mb-6 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold mb-2">{winner.nickname}</h2>
            <p className="text-xl">
              <span className="text-2xl font-bold">{winner.score}</span> puntos
            </p>
          </div>

          {/* Podium */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">🏆 Clasificación Final</h3>
            <div className="space-y-3">
              {allPlayers
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((player, index) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400' 
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400'
                        : 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="font-semibold text-lg">{player.nickname}</span>
                      {player.id === winner.id && (
                        <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full animate-pulse">
                          ¡CAMPEÓN!
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-bold">{player.score}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Celebration message */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
            <p className="text-lg text-gray-700">
              🎊 ¡Felicitaciones {winner.nickname}! 🎊
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ¡Una partida increíble para todos!
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🏠 Volver al Inicio
            </button>
            
            <button
              onClick={async () => {
                // Trigger more confetti on click
                if (!confetti) {
                  const confettiModule = await import('canvas-confetti');
                  confetti = confettiModule.default;
                }
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.8 },
                  colors: ['#FFD700', '#FF6B6B', '#4ECDC4']
                });
              }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              🎉 ¡Más Confetti!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
