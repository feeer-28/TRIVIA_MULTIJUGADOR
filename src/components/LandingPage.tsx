interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 animate-bounce-slow">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full p-8 shadow-2xl border border-white/20">
            <span className="text-8xl">🧠</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
          Trivia
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mt-2">
            Multijugador
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
          Desafía a tus amigos en tiempo real
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 text-white/80">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>⚡</span>
            <span>Tiempo Real</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>👥</span>
            <span>Multijugador</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>🎯</span>
            <span>Preguntas Personalizadas</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50"
        >
          <span className="relative z-10 flex items-center space-x-3">
            <span>Jugar Ahora</span>
            <span className="transform group-hover:translate-x-1 transition-transform">🚀</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        {/* Quick info */}
        <p className="mt-8 text-white/60 text-sm">
          No requiere registro • Gratis • Diversión instantánea
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-white/10 text-6xl animate-pulse">?</div>
      <div className="absolute bottom-20 right-20 text-white/10 text-6xl animate-pulse animation-delay-2000">?</div>
      <div className="absolute top-1/3 right-10 text-white/10 text-4xl animate-pulse animation-delay-4000">!</div>
    </div>
  );
}
