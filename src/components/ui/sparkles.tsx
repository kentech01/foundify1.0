import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SparkleProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

const SparkleIcon = ({ size = 10, color = "#6366f1", style, className }: SparkleProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    className={className}
  >
    <path
      d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
      fill={color}
    />
  </svg>
);

interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number; // 1 = slow, 10 = fast
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className = "h-full w-full",
  particleColor = "#FFFFFF",
  speed = 1,
}: SparklesCoreProps) => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const particleCount = particleDensity;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        delay: Math.random() * 5,
        duration: (Math.random() * 10 + 10) / speed,
      });
    }
    setParticles(newParticles);
  }, [maxSize, minSize, particleDensity, speed]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} id={id}>
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -20],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill={particleColor}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const SparkleButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  return (
    <button onClick={onClick} className={cn("relative group", className)}>
      <span className="absolute inset-0 overflow-hidden rounded-full">
         <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative z-10 flex items-center justify-center gap-2">
         {children}
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
}

export const FloatingSparkles = ({ count = 5, color = "bg-blue-400" }: { count?: number, color?: string }) => {
   return (
     <>
       {Array.from({ length: count }).map((_, i) => (
         <motion.div
            key={i}
            className={cn("absolute rounded-full opacity-60", color)}
            initial={{ 
               width: Math.random() * 4 + 2, 
               height: Math.random() * 4 + 2,
               x: Math.random() * 100 - 50,
               y: Math.random() * 100 - 50,
               opacity: 0
            }}
            animate={{
               y: [0, -30, 0],
               opacity: [0, 0.8, 0],
               scale: [0, 1.2, 0]
            }}
            transition={{
               duration: Math.random() * 3 + 2,
               repeat: Infinity,
               delay: Math.random() * 2,
               ease: "easeInOut"
            }}
            style={{
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
            }}
         />
       ))}
     </>
   )
}
