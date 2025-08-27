# 🧠 Trivia Multijugador

Una aplicación de trivia multijugador en tiempo real desarrollada con React + TypeScript + Tailwind CSS, con comunicación entre pestañas usando BroadcastChannel API.

## 🚀 Características Principales

- **Pantalla de Inicio (Home)**: Interfaz principal con opciones para crear o unirse a una sala
- **Crear Sala**: El usuario ingresa su nickname y se convierte automáticamente en moderador
- **Unirse a Sala**: Los jugadores ingresan código de sala y nickname para participar
- **Creación de Preguntas**: Solo el moderador puede crear preguntas con:
  - Texto de la pregunta (textarea expandible)
  - Tipo de pregunta (opción múltiple o verdadero/falso)
  - Opciones de respuesta (hasta 4 opciones para múltiple)
  - Selección de respuesta correcta
  - Tiempo límite personalizable (10-120 segundos)
  - Puntos por respuesta correcta (10-1000 puntos)
- **Juego en Tiempo Real**: 
  - Sincronización perfecta entre múltiples pestañas/dispositivos
  - Temporizador visual en tiempo real con barra de progreso
  - Envío de respuestas con retroalimentación instantánea
  - Cálculo automático de puntajes y clasificación
  - Finalización automática de preguntas por tiempo límite
  - Estados de espera entre preguntas
- **Sistema de Puntuación**: Marcador en tiempo real con clasificación por posiciones
- **Gestión de Salas**: Códigos únicos de 4 caracteres, validación de nicknames únicos

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS con diseño completamente responsive
- **Estado Global**: React Context API + useReducer para gestión predecible
- **Comunicación**: BroadcastChannel API + localStorage para sincronización
- **Persistencia**: localStorage con sincronización automática entre pestañas
- **Patrón de Diseño**: Singleton para WebSocket service
- **Validación**: Validación de formularios en tiempo real
- **Iconografía**: Emojis nativos para mejor UX

## 📦 Instalación y Configuración

```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd trivia-multijugador

# Instalar todas las dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview

# Linting del código
npm run lint
```

## 🎮 Flujo Completo del Juego

### 1. **Inicio de Sesión**
- El usuario accede a la aplicación desde `http://localhost:5173`
- Ve la pantalla de bienvenida con dos opciones principales

### 2. **Creación de Sala (Moderador)**
- Ingresa su nickname (máximo 20 caracteres)
- El sistema genera automáticamente un código único de 4 caracteres
- Se convierte en moderador de la sala
- Accede a la interfaz de creación de preguntas

### 3. **Unión a Sala (Jugadores)**
- Ingresan el código de sala de 4 caracteres
- Proporcionan su nickname único
- Se valida que la sala exista y el juego no haya comenzado
- Entran en estado de espera hasta que el moderador inicie

### 4. **Creación de Preguntas (Solo Moderador)**
- Crea preguntas con texto personalizado
- Selecciona tipo: opción múltiple (2-4 opciones) o verdadero/falso
- Configura tiempo límite (10-120 segundos)
- Asigna puntos (10-1000 por pregunta correcta)
- Ve lista de jugadores conectados en tiempo real
- Inicia el juego cuando hay al menos 1 pregunta

### 5. **Juego en Tiempo Real**
- Todos los jugadores ven la pregunta simultáneamente
- Temporizador visual con barra de progreso
- Los jugadores seleccionan sus respuestas
- El tiempo se agota automáticamente
- Se muestran resultados instantáneos con puntajes actualizados

### 6. **Finalización**
- Después de todas las preguntas, se muestra el marcador final
- Clasificación de jugadores por puntaje total
- Opción de volver al inicio para nueva partida

## 📂 Estructura Completa del Proyecto

```
trivia-multijugador/
├── public/                    # Archivos estáticos públicos
│   └── vite.svg              # Icono de Vite
├── src/                      # Código fuente principal
│   ├── assets/               # Recursos estáticos
│   │   └── react.svg         # Logo de React
│   ├── components/           # Componentes de React
│   │   ├── Home.tsx          # Pantalla principal de bienvenida
│   │   ├── CreateRoom.tsx    # Formulario para crear sala
│   │   ├── JoinRoom.tsx      # Formulario para unirse a sala
│   │   ├── QuestionCreator.tsx # Interfaz para crear preguntas
│   │   └── GameRoom.tsx      # Sala de juego en tiempo real
│   ├── context/              # Gestión de estado global
│   │   └── GameContext.tsx   # Context API y hooks del juego
│   ├── services/             # Lógica de negocio y servicios
│   │   └── websocketService.ts # Servicio WebSocket simulado
│   ├── types/                # Definiciones de TypeScript
│   │   └── index.ts          # Interfaces y tipos del juego
│   ├── App.tsx               # Componente raíz de la aplicación
│   ├── App.css               # Estilos específicos del App
│   ├── index.css             # Estilos globales y Tailwind
│   └── main.tsx              # Punto de entrada de la aplicación
├── .gitignore                # Archivos ignorados por Git
├── README.md                 # Documentación principal del proyecto
├── DOCUMENTATION.md          # Documentación técnica detallada
├── eslint.config.js          # Configuración de ESLint
├── index.html                # Template HTML principal
├── package.json              # Dependencias y scripts del proyecto
├── package-lock.json         # Versiones exactas de dependencias
├── postcss.config.js         # Configuración de PostCSS
├── tailwind.config.js        # Configuración de Tailwind CSS
├── tsconfig.json             # Configuración principal de TypeScript
├── tsconfig.app.json         # Configuración de TypeScript para la app
├── tsconfig.node.json        # Configuración de TypeScript para Node
└── vite.config.ts            # Configuración de Vite
```

## 🎯 Funcionalidades Completamente Implementadas

### ✅ Gestión de Salas y Jugadores
- Creación de salas con códigos únicos de 4 caracteres alfanuméricos
- Sistema de roles diferenciado (moderador/jugador)
- Validación de nicknames únicos por sala (máximo 20 caracteres)
- Unión a salas existentes con validación de código
- Lista de jugadores conectados en tiempo real
- Abandono de salas con limpieza automática

### ✅ Sistema de Preguntas Avanzado
- Creación de preguntas dinámicas con validación completa
- Dos tipos de preguntas: opción múltiple (2-4 opciones) y verdadero/falso
- Configuración personalizable de tiempo límite (10-120 segundos)
- Sistema de puntuación flexible (10-1000 puntos por pregunta)
- Selección visual de respuesta correcta
- Vista previa de preguntas creadas

### ✅ Juego en Tiempo Real
- Sincronización perfecta entre múltiples pestañas/dispositivos
- Temporizador visual con cuenta regresiva y barra de progreso
- Envío de respuestas con retroalimentación instantánea
- Cálculo automático de puntajes basado en corrección
- Finalización automática de preguntas por tiempo límite
- Estados de espera entre preguntas con controles de moderador
- Marcador en tiempo real con clasificación por posiciones

### ✅ Interfaz y Experiencia de Usuario
- Diseño completamente responsive con Tailwind CSS
- Gradientes y animaciones suaves
- Iconografía con emojis nativos
- Estados de carga y feedback visual
- Validación de formularios en tiempo real
- Manejo de errores con mensajes descriptivos

### ✅ Arquitectura Técnica
- Comunicación entre pestañas con BroadcastChannel API
- Persistencia automática con localStorage
- Sincronización de estado entre múltiples instancias
- Gestión de estado global con Context API + useReducer
- Patrón Singleton para WebSocket service
- Simulación realista de WebSockets con delays
- Limpieza automática de recursos y listeners

## 🏗️ Arquitectura del Proyecto

### Componentes Principales

- **`App.tsx`**: Router principal que maneja los estados de la aplicación
- **`Home.tsx`**: Pantalla de inicio con opciones principales
- **`CreateRoom.tsx`**: Formulario para crear sala (moderador)
- **`JoinRoom.tsx`**: Formulario para unirse a sala (jugador)
- **`QuestionCreator.tsx`**: Interfaz para crear preguntas (solo moderador)
- **`GameRoom.tsx`**: Sala de juego en tiempo real

### Servicios

- **`websocketService.ts`**: Servicio singleton que simula WebSockets
  - Gestión de salas y jugadores
  - Broadcasting de mensajes entre pestañas
  - Persistencia en localStorage
  - Comunicación con BroadcastChannel API

### Context y Estado

- **`GameContext.tsx`**: Proveedor de estado global
  - Manejo de salas, jugadores y preguntas
  - Suscripción a mensajes del WebSocket service
  - Reducers para actualizar estado

### Tipos TypeScript

- **`types/index.ts`**: Definiciones de interfaces
  - `Room`, `Player`, `Question`, `Answer`
  - `GameState`, `WebSocketMessage`

## 🔧 Personalización

### Estilos y UI
```typescript
// En cualquier componente, puedes cambiar las clases de Tailwind
className="bg-blue-600 hover:bg-blue-700" // Cambiar colores
className="text-xl font-bold" // Cambiar tipografía
```

### Configuración de Juego
```typescript
// En QuestionCreator.tsx - valores por defecto
setTimeLimit(30); // Tiempo por defecto
setPoints(100);   // Puntos por defecto

// En websocketService.ts - códigos de sala
private generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // Cambiar longitud o caracteres permitidos
}
```

### Tipos de Preguntas
```typescript
// En types/index.ts - agregar nuevos tipos
export type QuestionType = 'multiple' | 'boolean' | 'text' | 'numeric';
```

## 📝 Notas Técnicas

### Comunicación Entre Pestañas
- **BroadcastChannel API**: Comunicación en tiempo real entre pestañas
- **localStorage**: Persistencia de salas y sincronización
- **Singleton Pattern**: Una sola instancia del WebSocket service

### Flujo de Datos
1. **Moderador crea sala** → Se guarda en localStorage → Se notifica a otras pestañas
2. **Jugador se une** → Se actualiza la sala → Broadcasting a todos los jugadores
3. **Pregunta iniciada** → BroadcastChannel envía a todas las pestañas → Se actualiza UI
4. **Respuesta enviada** → Se calcula puntaje → Se actualiza estado global

### Limitaciones
- Funciona solo en el mismo origen (mismo dominio)
- Las salas se pierden al cerrar todas las pestañas
- No hay validación de red/conectividad real
- Máximo de jugadores limitado por rendimiento del navegador

## 🚀 Posibles Mejoras

- **Backend real**: Implementar servidor WebSocket
- **Base de datos**: Persistencia permanente de salas y estadísticas
- **Autenticación**: Sistema de usuarios registrados
- **Salas privadas**: Contraseñas para salas
- **Más tipos de preguntas**: Texto libre, numérica, selección múltiple
- **Estadísticas**: Historial de partidas y rankings
- **Chat en vivo**: Comunicación entre jugadores
- **Temas personalizados**: Categorías de preguntas
