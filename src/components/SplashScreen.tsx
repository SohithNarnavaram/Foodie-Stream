import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(particleArray);

    // Logo scale animation
    setTimeout(() => {
      setLogoScale(1);
      setLogoOpacity(1);
    }, 100);

    // Text fade in
    setTimeout(() => {
      setTextOpacity(1);
    }, 600);

    // Start fade out after 2.5 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Complete after animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-orange-500 to-yellow-500 transition-opacity duration-500",
        !isVisible && "opacity-0 pointer-events-none"
      )}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 bg-white/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `splash-pulse ${2 + particle.delay}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div
          className="mb-6 transition-all duration-700 ease-out"
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <div className="relative inline-block animate-float">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-white rounded-full p-8 shadow-2xl transform transition-transform duration-300 hover:scale-105">
              <Flame className="w-20 h-20 text-primary" strokeWidth={2.5} />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10 animate-pulse" />
          </div>
        </div>

        {/* App Name */}
        <div
          className="transition-all duration-700"
          style={{ 
            opacity: textOpacity,
            transform: `translateY(${textOpacity === 0 ? '20px' : '0px'})`
          }}
        >
          <h1 className="text-6xl font-bold text-white mb-3 drop-shadow-2xl tracking-tight">
            FoodieStream
          </h1>
          <p className="text-white/95 text-xl font-semibold drop-shadow-lg">
            Watch Live. Trust More.
          </p>
        </div>

        {/* Loading dots */}
        <div
          className={cn(
            "flex justify-center gap-2 mt-8 transition-opacity duration-700",
            textOpacity === 0 && "opacity-0"
          )}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-full bg-white/10">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
              fill="white"
              fillOpacity="0.1"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z;M0,60 Q300,100 600,60 T1200,60 L1200,120 L0,120 Z;M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
              />
            </path>
          </svg>
        </div>
      </div>
    </div>
  );
};

