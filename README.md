# 🧠 TRIVIA MULTIJUGADOR

Juego de preguntas y respuestas en tiempo real donde un moderador crea salas con preguntas personalizadas y múltiples jugadores compiten respondiendo con límite de tiempo.

![Trivia Multijugador](https://img.shields.io/badge/Status-Active-green) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white) ![Socket.IO](https://img.shields.io/badge/Socket.io-black?logo=socket.io&badgeColor=010101)

## 🎮 Características

- **🏠 Salas Privadas**: Códigos únicos de 4 caracteres
- **⏱️ Tiempo Real**: Sincronización automática entre jugadores
- **📝 Preguntas Personalizadas**: El moderador crea su propio contenido
- **⚡ Respuestas Rápidas**: Timer configurable por pregunta
- **🏆 Puntuación en Vivo**: Ranking actualizado automáticamente
- **📱 Multiplataforma**: Funciona en cualquier navegador
- **🎨 UI Moderna**: Interfaz intuitiva con animaciones

## 🚀 Demo Rápida

1. **Crear Sala**: Moderador ingresa su nickname → obtiene código de sala
2. **Unirse**: Otros jugadores usan el código para entrar
3. **Crear Preguntas**: Moderador agrega preguntas personalizadas
4. **¡Jugar!**: Todos responden simultáneamente con countdown
5. **Resultados**: Puntuación final y ganador

## 🛠️ Tecnologías

### Frontend
- **React 18** + **TypeScript** - Framework moderno y tipado estricto
- **Vite** - Build tool rápido con HMR
- **Socket.IO Client** - Comunicación WebSocket en tiempo real
- **Tailwind CSS** - Estilos utility-first
- **Context API** - Gestión de estado global

### Backend
- **Node.js** + **Express** - Servidor web
- **Socket.IO** - WebSocket bidireccional
- **CORS** - Cross-origin resource sharing
- **Almacenamiento en memoria** - Maps para salas temporales

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd TRIVIA_MULTIJUGADOR
```

### 2. Instalar dependencias del cliente
```bash
npm install
```

### 3. Instalar dependencias del servidor
```bash
cd server
npm install
cd ..
```

## 🚦 Ejecutar en Desarrollo

### Terminal 1: Iniciar servidor backend
```bash
cd server
npm start
# Servidor corriendo en http://localhost:3001
```

### Terminal 2: Iniciar cliente frontend
```bash
npm run dev
# Cliente corriendo en http://localhost:5173
```

**¡Listo!** Abre http://localhost:5173 en tu navegador.

## 🏗️ Arquitectura

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   React Client  │ ←─────────────→ │   Node.js API   │
│                 │    Socket.IO    │                 │
│ • UI/UX         │                 │ • Game Logic    │
│ • State Mgmt    │                 │ • Room Mgmt     │
│ • Real-time     │                 │ • Timer Control │
└─────────────────┘                 └─────────────────┘
```

## 📁 Estructura del Proyecto

```
TRIVIA_MULTIJUGADOR/
├── src/                          # Frontend React
│   ├── components/               # Componentes UI
│   │   ├── LandingPage.tsx      # Página inicial
│   │   ├── Home.tsx             # Menú principal
│   │   ├── CreateRoom.tsx       # Crear sala
│   │   ├── JoinRoom.tsx         # Unirse a sala
│   │   ├── WaitingRoom.tsx      # Sala de espera
│   │   ├── QuestionCreator.tsx  # Crear preguntas
│   │   ├── GameRoom.tsx         # Juego en vivo
│   │   └── VictoryScreen.tsx    # Pantalla final
│   ├── context/                 # Estado global
│   │   └── GameContext.tsx      # Context API + reducers
│   ├── services/                # Servicios externos  
│   │   └── websocketService.ts  # Cliente Socket.IO
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts             # Interfaces del juego
│   └── hooks/                   # Hooks personalizados
│       └── useSyncWebSocket.ts  # Sincronización state
├── server/                      # Backend Node.js
│   ├── server.js               # Servidor principal
│   └── package.json            # Dependencias backend
├── public/                     # Assets estáticos
└── dist/                       # Build de producción
```

## 🎯 Flujo del Juego

### 1. **Crear Sala (Moderador)**
```typescript
// El moderador ingresa su nickname
websocketService.createRoom("Moderador") 
// → Recibe código único: "A1B2"
```

### 2. **Unirse a Sala (Jugadores)**
```typescript
// Jugadores usan el código para unirse
websocketService.joinRoom("A1B2", "Jugador1")
// → Se unen a la sala en tiempo real
```

### 3. **Crear Preguntas (Moderador)**
```typescript
// Moderador agrega preguntas personalizadas
const pregunta = {
  text: "¿Cuál es la capital de Francia?",
  type: "multiple",
  options: ["Madrid", "París", "Londres", "Roma"],
  correctAnswer: 1,
  timeLimit: 30,
  points: 100
}
```

### 4. **Iniciar Juego**
```typescript
// Servidor envía pregunta a todos simultáneamente
io.to(roomCode).emit('questionStarted', {
  question: currentQuestion,
  timeLimit: 30
})
```

### 5. **Responder en Tiempo Real**
```typescript
// Jugadores envían respuestas
websocketService.submitAnswer(selectedOption)
// → Timer cuenta regresiva en todos los clientes
```

### 6. **Resultados y Puntuación**
```typescript
// Servidor calcula puntos y envía ranking
io.to(roomCode).emit('questionEnded', {
  scores: updatedPlayerScores,
  correctAnswer: question.correctAnswer
})
```

## 🔧 Configuración

### Variables de Entorno
```bash
# .env (opcional)
VITE_SERVER_URL=http://localhost:3001
PORT=3001
```

### Puertos por Defecto
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **WebSocket**: ws://localhost:3001

## 📊 Estado del Juego

### Tipos Principales
```typescript
interface GameState {
  currentRoom: Room | null
  currentPlayer: Player | null  
  isModerator: boolean
  currentQuestion: Question | null
  timeRemaining: number
  showResults: boolean
  isGameStarted: boolean
}

interface Room {
  id: string
  code: string            // "A1B2"
  moderatorId: string
  players: Player[]
  questions: Question[]
  isGameStarted: boolean
  isGameFinished: boolean
}
```

## 🎨 UI/UX

- **🌈 Gradientes animados** para fondos dinámicos
- **⚡ Transiciones suaves** entre pantallas
- **🔔 Feedback visual** en todas las interacciones
- **📱 Responsive design** para móviles y desktop
- **🎯 Indicadores de estado** claros para cada jugador
- **⏲️ Timer visual** con cambio de color (verde → rojo)

## 🚀 Build y Deploy

### Build de Producción
```bash
# Compilar frontend
npm run build

# Build se genera en ./dist/
```

### Deploy Sugerido
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, Heroku
- **Full-stack**: Railway (monorepo)

### Dockerfile (Opcional)
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001 5173
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando se implementen)
npm test

# Linter y format
npm run lint
npm run format
```

## 🤝 Casos de Uso

### 🏫 **Educativo**
- Profesores crean trivia de sus materias
- Repasos interactivos antes de exámenes
- Gamificación del aprendizaje

### 🏢 **Corporativo** 
- Team building en reuniones
- Capacitación interactiva
- Onboarding de empleados

### 🎉 **Social**
- Fiestas y reuniones familiares
- Noches de juegos con amigos
- Competencias entre grupos

## ⚠️ Limitaciones Actuales

- **Sin persistencia**: Los datos se pierden al reiniciar el servidor
- **Escalabilidad**: Un solo proceso/servidor
- **Autenticación**: Sin sistema de usuarios permanentes  
- **Métricas**: Sin analytics de uso
- **Multimedia**: Solo preguntas de texto

## 🛣️ Roadmap

### 🎯 Corto Plazo
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Sistema de usuarios y autenticación
- [ ] Persistencia de salas y estadísticas
- [ ] Tests unitarios y e2e

### 🚀 Mediano Plazo  
- [ ] Dashboard de administración
- [ ] Plantillas de preguntas predefinidas
- [ ] Soporte para imágenes en preguntas
- [ ] App móvil (React Native)

### 🌟 Largo Plazo
- [ ] IA para generar preguntas automáticas
- [ ] Integración con sistemas LMS
- [ ] Streaming en vivo (Twitch/YouTube)
- [ ] Torneos y rankings globales

## 🐛 Troubleshooting

### Problemas Comunes

**El servidor no inicia:**
```bash
cd server
rm -rf node_modules
npm install
npm start
```

**Cliente no conecta al WebSocket:**
- Verificar que el servidor esté corriendo en puerto 3001
- Revisar CORS en server/server.js
- Comprobar firewall/antivirus

**Jugadores no reciben preguntas:**
- Revisar consola del navegador para errores WebSocket
- Verificar que todos están en la misma sala
- Recargar página si es necesario

## 📝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Desarrollador Principal** - Implementación completa del juego

## 🙏 Acknowledgments

- Inspirado en **Kahoot!** y **Jackbox Games**
- **Socket.IO** por la comunicación en tiempo real
- **React** y **TypeScript** por el desarrollo moderno
- Comunidad open source por las herramientas increíbles

---

**¡Diviértete creando y jugando trivia personalizada! 🎉**

Para reportar bugs o sugerir funcionalidades, crear un [issue](../../issues).
