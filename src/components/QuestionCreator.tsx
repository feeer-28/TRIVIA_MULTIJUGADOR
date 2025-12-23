import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Question } from '../types';

interface QuestionCreatorProps {
  onQuestionAdded: () => void;
  onStartGame: () => void;
}

export function QuestionCreator({ onQuestionAdded, onStartGame }: QuestionCreatorProps) {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState<'multiple' | 'boolean'>('multiple');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30);
  const [points, setPoints] = useState(100);
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { addQuestion, state } = useGame();

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const newQuestion: Omit<Question, 'id'> = {
        text: question,
        type,
        options: type === 'boolean' ? ['Verdadero', 'Falso'] : options.filter(opt => opt.trim()),
        correctAnswer,
        timeLimit,
        points
      };

      addQuestion(newQuestion);
      setQuestions([...questions, newQuestion]);
      onQuestionAdded();
      
      // Reset form
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      setTimeLimit(30);
      setPoints(100);
      
      // Show success feedback
      setSuccessMessage(`✅ Pregunta ${questions.length + 1} agregada exitosamente!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error al agregar la pregunta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const canAddQuestion = question.trim() && (
    type === 'boolean' || 
    (type === 'multiple' && options.filter(opt => opt.trim()).length >= 2)
  ) && !isLoading;
  
  const canStartGame = questions.length >= 1 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">📝 Crear Preguntas</h1>
              <p className="text-gray-600">Sala: {state.currentRoom?.code}</p>
              <p className="text-sm text-gray-500">Mínimo 1 pregunta para iniciar el juego</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Preguntas creadas:</p>
              <p className="text-2xl font-bold text-purple-600">{questions.length}</p>
              <p className="text-xs text-gray-500">Jugadores: {state.currentRoom?.players.length || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Form */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Nueva Pregunta</h2>
              
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pregunta
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Escribe tu pregunta aquí..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Pregunta
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'multiple' | 'boolean')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="multiple">Opción Múltiple</option>
                    <option value="boolean">Verdadero/Falso</option>
                  </select>
                </div>

                {type === 'multiple' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opciones
                    </label>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={correctAnswer === index}
                          onChange={() => setCorrectAnswer(index)}
                          className="text-purple-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder={`Opción ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {type === 'boolean' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Respuesta Correcta
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="booleanAnswer"
                          checked={correctAnswer === 0}
                          onChange={() => setCorrectAnswer(0)}
                          className="text-purple-600 mr-2"
                        />
                        Verdadero
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="booleanAnswer"
                          checked={correctAnswer === 1}
                          onChange={() => setCorrectAnswer(1)}
                          className="text-purple-600 mr-2"
                        />
                        Falso
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo (segundos)
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="10"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puntos
                    </label>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="10"
                      max="1000"
                      step="10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canAddQuestion}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                    canAddQuestion
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Agregando...
                    </span>
                  ) : (
                    `📝 Agregar Pregunta ${questions.length + 1}`
                  )}
                </button>
              </form>
            </div>

            {/* Questions List & Players */}
            <div className="space-y-6">
              {/* Questions List */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Preguntas Agregadas ({questions.length})</h2>
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay preguntas agregadas</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border">
                        <p className="font-medium text-sm">{q.text}</p>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{q.type === 'multiple' ? 'Múltiple' : 'V/F'}</span>
                          <span>{q.timeLimit}s - {q.points}pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Start Game Button */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  {questions.length === 0 ? (
                    <div className="text-center text-gray-600">
                      <p>📝 Crea al menos 1 pregunta para iniciar el juego</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        ✅ {questions.length} pregunta{questions.length === 1 ? '' : 's'} lista{questions.length === 1 ? '' : 's'}
                      </p>
                      <button
                        onClick={onStartGame}
                        disabled={!canStartGame}
                        className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 ${
                          canStartGame
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Preparando...
                          </span>
                        ) : (
                          '🚀 ¡Iniciar Juego Ahora!'
                        )}
                      </button>
                      {state.currentRoom && state.currentRoom.players.length < 2 && (
                        <p className="text-xs text-amber-600 mt-2">
                          💡 Consejo: Invita más jugadores para mayor diversión
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Players List */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Jugadores Conectados</h2>
                <div className="space-y-2">
                  {state.currentRoom?.players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${player.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="font-medium">{player.nickname}</span>
                        {player.id === state.currentRoom?.moderatorId && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Moderador</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
