const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
const rooms = new Map();
const playerRooms = new Map();

// Helper functions
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create room
  socket.on('createRoom', (data) => {
    const { moderatorNickname } = data;
    const roomCode = generateRoomCode();
    const moderatorId = socket.id;
    
    const moderator = {
      id: moderatorId,
      nickname: moderatorNickname,
      score: 0,
      isConnected: true
    };

    const room = {
      id: generateId(),
      code: roomCode,
      moderatorId,
      players: [moderator],
      questions: [],
      currentQuestionIndex: -1,
      isGameStarted: false,
      isGameFinished: false,
      createdAt: new Date()
    };

    rooms.set(roomCode, room);
    playerRooms.set(moderatorId, roomCode);
    
    socket.join(roomCode);
    socket.emit('roomCreated', { room, moderatorId });
    
    console.log(`Room ${roomCode} created by ${moderatorNickname}`);
  });

  // Join room
  socket.on('joinRoom', (data) => {
    const { roomCode, playerNickname } = data;
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    if (room.isGameStarted) {
      socket.emit('error', { message: 'El juego ya ha comenzado' });
      return;
    }

    if (room.players.some(p => p.nickname === playerNickname)) {
      socket.emit('error', { message: 'El nickname ya está en uso' });
      return;
    }

    const playerId = socket.id;
    const player = {
      id: playerId,
      nickname: playerNickname,
      score: 0,
      isConnected: true
    };

    room.players.push(player);
    playerRooms.set(playerId, roomCode);
    
    socket.join(roomCode);
    socket.emit('roomJoined', { room, playerId });
    
    // Notify all players in room
    io.to(roomCode).emit('playerJoined', { player, room });
    
    console.log(`${playerNickname} joined room ${roomCode}`);
  });

  // Add question
  socket.on('addQuestion', (data) => {
    const { question } = data;
    const roomCode = playerRooms.get(socket.id);
    
    if (!roomCode) {
      socket.emit('error', { message: 'No estás en una sala' });
      return;
    }

    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    if (room.moderatorId !== socket.id) {
      socket.emit('error', { message: 'Solo el moderador puede agregar preguntas' });
      return;
    }

    if (room.isGameStarted) {
      socket.emit('error', { message: 'No se pueden agregar preguntas durante el juego' });
      return;
    }

    const newQuestion = {
      ...question,
      id: generateId()
    };

    room.questions.push(newQuestion);
    socket.emit('questionAdded', { success: true });
    
    console.log(`Question added to room ${roomCode}`);
  });

  // Start question
  socket.on('startQuestion', () => {
    const roomCode = playerRooms.get(socket.id);
    
    if (!roomCode) {
      socket.emit('error', { message: 'No estás en una sala' });
      return;
    }

    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    if (room.moderatorId !== socket.id) {
      socket.emit('error', { message: 'Solo el moderador puede iniciar preguntas' });
      return;
    }

    if (room.questions.length === 0) {
      socket.emit('error', { message: 'No hay preguntas disponibles' });
      return;
    }

    const nextIndex = room.currentQuestionIndex + 1;
    if (nextIndex >= room.questions.length) {
      socket.emit('error', { message: 'No hay más preguntas' });
      return;
    }

    room.currentQuestionIndex = nextIndex;
    room.isGameStarted = true;
    const currentQuestion = room.questions[nextIndex];

    // Broadcast question to all players
    io.to(roomCode).emit('questionStarted', { 
      question: currentQuestion, 
      timeLimit: currentQuestion.timeLimit 
    });

    // Auto-end question after time limit
    setTimeout(() => {
      socket.emit('endQuestion');
    }, currentQuestion.timeLimit * 1000);

    console.log(`Question ${nextIndex + 1} started in room ${roomCode}`);
  });

  // Submit answer
  socket.on('submitAnswer', (data) => {
    const { selectedOption } = data;
    const roomCode = playerRooms.get(socket.id);
    
    if (!roomCode) {
      socket.emit('error', { message: 'No estás en una sala' });
      return;
    }

    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    if (room.currentQuestionIndex < 0) {
      socket.emit('error', { message: 'No hay pregunta activa' });
      return;
    }

    const currentQuestion = room.questions[room.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Update player score
    if (isCorrect) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.score += currentQuestion.points;
      }
    }

    const answer = {
      playerId: socket.id,
      questionId: currentQuestion.id,
      selectedOption,
      timestamp: new Date(),
      isCorrect
    };

    // Broadcast answer submitted
    io.to(roomCode).emit('answerSubmitted', { answer });
    socket.emit('answerSubmitted', { success: true });

    console.log(`Answer submitted in room ${roomCode}: ${isCorrect ? 'correct' : 'incorrect'}`);
  });

  // End question
  socket.on('endQuestion', () => {
    const roomCode = playerRooms.get(socket.id);
    
    if (!roomCode) {
      socket.emit('error', { message: 'No estás en una sala' });
      return;
    }

    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    if (room.moderatorId !== socket.id) {
      socket.emit('error', { message: 'Solo el moderador puede finalizar preguntas' });
      return;
    }

    if (room.currentQuestionIndex < 0) {
      socket.emit('error', { message: 'No hay pregunta activa' });
      return;
    }

    // Check if this was the last question
    const isLastQuestion = room.currentQuestionIndex >= room.questions.length - 1;

    if (isLastQuestion) {
      room.isGameFinished = true;
      // Broadcast final results
      io.to(roomCode).emit('gameFinished', { 
        finalScores: [...room.players].sort((a, b) => b.score - a.score) 
      });
    } else {
      // Broadcast current results
      io.to(roomCode).emit('questionEnded', { 
        results: [],
        scores: [...room.players].sort((a, b) => b.score - a.score)
      });
    }

    console.log(`Question ended in room ${roomCode}`);
  });

  // Leave room
  socket.on('leaveRoom', () => {
    const roomCode = playerRooms.get(socket.id);
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    // Remove player from room
    room.players = room.players.filter(p => p.id !== socket.id);
    
    // If moderator leaves, end the game
    if (socket.id === room.moderatorId) {
      io.to(roomCode).emit('error', { message: 'El moderador ha abandonado la sala' });
      rooms.delete(roomCode);
      return;
    }

    // Notify remaining players
    io.to(roomCode).emit('playerLeft', { playerId: socket.id, room });
    
    playerRooms.delete(socket.id);
    socket.leave(roomCode);
    
    console.log(`Player left room ${roomCode}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const roomCode = playerRooms.get(socket.id);
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        // Mark player as disconnected
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.isConnected = false;
        }
        
        // If moderator disconnects, end the game
        if (socket.id === room.moderatorId) {
          io.to(roomCode).emit('error', { message: 'El moderador se ha desconectado' });
          rooms.delete(roomCode);
        } else {
          io.to(roomCode).emit('playerLeft', { playerId: socket.id, room });
        }
      }
      playerRooms.delete(socket.id);
    }
    
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
