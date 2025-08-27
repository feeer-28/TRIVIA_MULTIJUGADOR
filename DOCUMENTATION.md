# 📚 Documentación Técnica Completa - Trivia Multijugador

## 🎯 Resumen del Proyecto

Este proyecto es una aplicación de trivia multijugador completamente funcional que permite a múltiples usuarios jugar en tiempo real desde diferentes pestañas del navegador. Utiliza tecnologías modernas de frontend y simula WebSockets para la comunicación en tiempo real.

## 📁 Estructura Detallada del Proyecto

### Directorio Raíz
```
trivia-multijugador/
├── public/                    # Archivos estáticos servidos directamente
├── src/                       # Código fuente de la aplicación
├── .gitignore                 # Archivos y carpetas ignorados por Git
├── README.md                  # Documentación principal del usuario
├── DOCUMENTATION.md           # Esta documentación técnica detallada
├── eslint.config.js           # Configuración de linting con ESLint
├── index.html                 # Template HTML principal
├── package.json               # Dependencias y scripts del proyecto
├── package-lock.json          # Versiones exactas de dependencias
├── postcss.config.js          # Configuración de PostCSS (ES Modules)
├── tailwind.config.js         # Configuración de Tailwind CSS (ES Modules)
├── tsconfig.json              # Configuración principal de TypeScript
├── tsconfig.app.json          # Configuración de TypeScript para la aplicación
├── tsconfig.node.json         # Configuración de TypeScript para Node.js
└── vite.config.ts             # Configuración del bundler Vite
```

### `/src` - Código Fuente Principal

```
src/
├── assets/                    # Recursos estáticos (imágenes, iconos)
│   └── react.svg             # Logo oficial de React
├── components/               # Componentes de React reutilizables
│   ├── Home.tsx              # Pantalla principal de bienvenida
│   ├── CreateRoom.tsx        # Formulario para crear nueva sala
│   ├── JoinRoom.tsx          # Formulario para unirse a sala existente
│   ├── QuestionCreator.tsx   # Interfaz para crear preguntas (moderador)
│   └── GameRoom.tsx          # Sala de juego en tiempo real
├── context/                  # Gestión de estado global
│   └── GameContext.tsx       # Context API con reducers y hooks
├── services/                 # Lógica de negocio y servicios
│   └── websocketService.ts   # Servicio singleton para WebSocket simulado
├── types/                    # Definiciones de TypeScript
│   └── index.ts              # Interfaces y tipos del dominio
├── App.tsx                   # Componente raíz con routing de estados
├── App.css                   # Estilos específicos del componente App
├── index.css                 # Estilos globales y configuración Tailwind
└── main.tsx                  # Punto de entrada de la aplicación React
```

## 🧩 Análisis Detallado de Componentes (`/src/components/`)

### `Home.tsx` - Pantalla Principal
**Propósito**: Punto de entrada de la aplicación con opciones principales
**Props Recibidas**:
- `onCreateRoom: () => void` - Función callback para navegar a creación de sala
- `onJoinRoom: () => void` - Función callback para navegar a unión de sala

**Características Implementadas**:
- Interfaz de bienvenida con gradiente azul-púrpura (`bg-gradient-to-br from-blue-600 to-purple-700`)
- Título principal con emoji de cerebro: "🧠 Trivia Multijugador"
- Dos botones principales estilizados con Tailwind CSS
- Diseño completamente responsive para móviles y escritorio
- Iconografía con emojis nativos (🎯 para crear, 🚪 para unirse)
- Animaciones hover suaves en los botones
- Centrado perfecto vertical y horizontal

### `CreateRoom.tsx`
**Propósito**: Formulario para que el moderador cree una nueva sala
**Props**:
- `onBack: () => void` - Volver a la pantalla anterior
- `onRoomCreated: () => void` - Callback cuando se crea la sala

**Funcionalidades**:
- Input para nickname del moderador (máximo 20 caracteres)
- Validación de campos requeridos
- Estado de loading durante la creación
- Genera código de sala único de 4 caracteres

### `JoinRoom.tsx`
**Propósito**: Formulario para que los jugadores se unan a una sala existente
**Props**:
- `onBack: () => void` - Volver a la pantalla anterior
- `onRoomJoined: () => void` - Callback cuando se une exitosamente

**Funcionalidades**:
- Input para código de sala (4 caracteres, auto-uppercase)
- Input para nickname del jugador (máximo 20 caracteres)
- Validación de campos y código de sala
- Manejo de errores (sala no encontrada, nickname duplicado)

### `QuestionCreator.tsx`
**Propósito**: Interfaz para que el moderador cree preguntas
**Props**:
- `onQuestionAdded: () => void` - Callback cuando se agrega pregunta
- `onStartGame: () => void` - Callback para iniciar el juego

**Funcionalidades**:
- Formulario para crear preguntas con:
  - Texto de la pregunta (textarea)
  - Tipo: múltiple opción o verdadero/falso
  - Opciones de respuesta (hasta 4 para múltiple)
  - Selección de respuesta correcta
  - Tiempo límite (10-120 segundos)
  - Puntos (10-1000)
- Lista de preguntas agregadas
- Lista de jugadores conectados
- Botón para iniciar juego (requiere al menos 1 pregunta)

### `GameRoom.tsx`
**Propósito**: Sala de juego en tiempo real
**Props**:
- `onGameEnd: () => void` - Callback cuando termina el juego

**Estados de la Interfaz**:
1. **Esperando pregunta**: Muestra jugadores conectados y botones del moderador
2. **Pregunta activa**: Muestra pregunta, opciones, temporizador y barra de progreso
3. **Resultados**: Muestra marcador actual y clasificación

**Funcionalidades**:
- Temporizador visual con cuenta regresiva
- Barra de progreso que se llena con el tiempo
- Selección de respuestas con feedback visual
- Marcador en tiempo real
- Controles especiales para moderador (iniciar/finalizar pregunta)

## 🔄 Context y Estado (`/src/context/`)

### `GameContext.tsx`
**Propósito**: Proveedor de estado global de la aplicación

**Estado Global (`GameState`)**:
```typescript
interface GameState {
  currentRoom: Room | null;        // Sala actual
  currentPlayer: Player | null;    // Jugador actual
  isModerator: boolean;            // Si es moderador
  currentQuestion: Question | null; // Pregunta activa
  timeRemaining: number;           // Tiempo restante
  answers: Answer[];               // Respuestas enviadas
  showResults: boolean;            // Mostrar resultados
}
```

**Acciones del Reducer**:
- `SET_ROOM`: Actualizar sala actual
- `SET_PLAYER`: Configurar jugador y rol
- `SET_CURRENT_QUESTION`: Establecer pregunta activa
- `SET_TIME_REMAINING`: Actualizar temporizador
- `UPDATE_PLAYERS`: Actualizar lista de jugadores
- `SET_SHOW_RESULTS`: Mostrar/ocultar resultados
- `SET_GAME_FINISHED`: Marcar juego como terminado
- `RESET_GAME`: Reiniciar estado

**Funciones Principales**:
- `createRoom(nickname)`: Crear nueva sala
- `joinRoom(roomCode, nickname)`: Unirse a sala
- `leaveRoom()`: Abandonar sala
- `addQuestion(question)`: Agregar pregunta (solo moderador)
- `startQuestion()`: Iniciar pregunta (solo moderador)
- `endQuestion()`: Finalizar pregunta (solo moderador)
- `submitAnswer(option)`: Enviar respuesta

## 🔧 Servicios (`/src/services/`)

### `websocketService.ts`
**Propósito**: Servicio singleton que simula WebSockets y maneja la lógica del juego

**Patrón Singleton**:
```typescript
class WebSocketService {
  private static instance: WebSocketService;
  
  constructor() {
    if (WebSocketService.instance) {
      return WebSocketService.instance;
    }
    // Inicialización...
    WebSocketService.instance = this;
  }
}
```

**Propiedades Privadas**:
- `rooms: Map<string, Room>` - Mapa de salas por código
- `listeners: Map<string, callback>` - Callbacks de jugadores
- `playerRooms: Map<string, string>` - Mapeo jugador → sala
- `broadcastChannel: BroadcastChannel` - Canal de comunicación entre pestañas

**Métodos Públicos**:

#### `createRoom(moderatorNickname: string)`
- Genera código único de 4 caracteres
- Crea sala con moderador
- Guarda en localStorage
- Retorna sala y ID del moderador

#### `joinRoom(roomCode: string, playerNickname: string)`
- Valida que la sala exista
- Verifica que el juego no haya comenzado
- Valida nickname único
- Agrega jugador a la sala
- Notifica a todos los jugadores
- Retorna resultado con éxito/error

#### `addQuestion(playerId: string, question: Omit<Question, 'id'>)`
- Valida que sea el moderador
- Valida que el juego no haya comenzado
- Agrega pregunta a la sala
- Guarda cambios

#### `startQuestion(playerId: string)`
- Valida que sea el moderador
- Verifica que haya preguntas disponibles
- Avanza al siguiente índice de pregunta
- Marca juego como iniciado
- Hace broadcast de la pregunta a todos
- Programa finalización automática

#### `submitAnswer(playerId: string, selectedOption: number)`
- Valida que haya pregunta activa
- Calcula si la respuesta es correcta
- Actualiza puntaje del jugador
- Notifica respuesta enviada

#### `endQuestion(playerId: string)`
- Valida que sea el moderador
- Determina si es la última pregunta
- Hace broadcast de resultados o finalización
- Actualiza estado de la sala

**Métodos Privados**:

#### `broadcast(roomCode: string, message: WebSocketMessage, excludePlayerId?: string)`
- Envía mensaje a todos los jugadores de la sala
- Excluye jugador específico si se proporciona
- Usa callbacks locales y BroadcastChannel para otras pestañas
- Simula delay de red (50ms)

#### `loadRoomsFromStorage()` / `saveRoomsToStorage()`
- Carga/guarda salas desde/hacia localStorage
- Convierte fechas correctamente
- Notifica cambios a otras pestañas

#### `generateRoomCode()` / `generateId()`
- Genera códigos únicos para salas y jugadores
- Usa caracteres alfanuméricos

**Comunicación Entre Pestañas**:
```typescript
// Enviar mensaje a otras pestañas
this.broadcastChannel.postMessage({
  type: 'WEBSOCKET_MESSAGE',
  playerId: player.id,
  message: message
});

// Escuchar mensajes de otras pestañas
this.broadcastChannel.addEventListener('message', (event) => {
  this.handleCrossTabMessage(event.data);
});
```

## 📝 Tipos TypeScript (`/src/types/`)

### `index.ts`
**Definiciones de Interfaces**:

```typescript
export interface Player {
  id: string;
  nickname: string;
  score: number;
  isConnected: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'boolean';
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

export interface Room {
  id: string;
  code: string;
  moderatorId: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  isGameStarted: boolean;
  isGameFinished: boolean;
  createdAt: Date;
}

export interface Answer {
  playerId: string;
  questionId: string;
  selectedOption: number;
  timestamp: Date;
  isCorrect: boolean;
}

export interface WebSocketMessage {
  type: 'ROOM_CREATED' | 'PLAYER_JOINED' | 'PLAYER_LEFT' | 
        'QUESTION_STARTED' | 'QUESTION_ENDED' | 'GAME_FINISHED' | 
        'ANSWER_SUBMITTED' | 'ERROR';
  payload: any;
}
```

## 🔄 Flujo de Datos Completo

### 1. Creación de Sala
```
Usuario → CreateRoom → GameContext.createRoom() → 
websocketService.createRoom() → localStorage → 
BroadcastChannel → otras pestañas
```

### 2. Unirse a Sala
```
Usuario → JoinRoom → GameContext.joinRoom() → 
websocketService.joinRoom() → broadcast('PLAYER_JOINED') → 
todas las pestañas actualizan lista de jugadores
```

### 3. Crear Pregunta
```
Moderador → QuestionCreator → GameContext.addQuestion() → 
websocketService.addQuestion() → sala.questions.push() → 
localStorage
```

### 4. Iniciar Pregunta
```
Moderador → GameRoom → GameContext.startQuestion() → 
websocketService.startQuestion() → broadcast('QUESTION_STARTED') → 
todas las pestañas muestran pregunta + temporizador
```

### 5. Enviar Respuesta
```
Jugador → GameRoom → GameContext.submitAnswer() → 
websocketService.submitAnswer() → calcular puntaje → 
broadcast('ANSWER_SUBMITTED')
```

### 6. Finalizar Pregunta
```
Temporizador → websocketService.endQuestion() → 
broadcast('QUESTION_ENDED' | 'GAME_FINISHED') → 
todas las pestañas muestran resultados
```

## 🛠️ Configuración y Personalización

### Valores por Defecto
```typescript
// QuestionCreator.tsx
const [timeLimit, setTimeLimit] = useState(30);    // 30 segundos
const [points, setPoints] = useState(100);         // 100 puntos

// websocketService.ts
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Códigos de sala
setTimeout(() => callback(message), 50);           // Delay de red simulado
```

### Límites y Validaciones
```typescript
// Inputs
maxLength={20}        // Nickname máximo
maxLength={4}         // Código de sala
min="10" max="120"    // Tiempo límite
min="10" max="1000"   // Puntos
```

## 🐛 Manejo de Errores

### Errores Comunes
- **"Sala no encontrada"**: Código incorrecto o sala expirada
- **"El nickname ya está en uso"**: Nombre duplicado en la sala
- **"El juego ya ha comenzado"**: Intentar unirse a juego activo
- **"Solo el moderador puede..."**: Acción restringida a moderador
- **"No hay preguntas disponibles"**: Intentar iniciar sin preguntas

### Debugging
- Errores se logean en `console.error()`
- Alertas para errores críticos
- Validaciones en formularios
- Estados de loading para operaciones asíncronas

## 🔒 Limitaciones y Consideraciones

### Técnicas
- **Mismo origen**: BroadcastChannel solo funciona en el mismo dominio
- **Memoria**: Salas se pierden al cerrar todas las pestañas
- **Rendimiento**: Limitado por capacidad del navegador
- **Sincronización**: Dependiente de localStorage y BroadcastChannel

### Seguridad
- No hay autenticación real
- Códigos de sala predecibles
- Sin validación de entrada maliciosa
- Estado expuesto en localStorage

### UX
- Sin indicadores de conectividad
- Sin recuperación automática de errores
- Sin confirmaciones para acciones destructivas
- Sin historial de partidas
