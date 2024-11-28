import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import GameScene from './GameScene';
import './Game.css';

// Componente para cargar el modelo 3D del escenario
function HellArena() {
  const { scene } = useGLTF('/Models/HELL ARENA.glb');
  return <primitive object={scene} scale={100} position={[300, -200, 0]} />;

}
function SpaceBackground() {
  const texture = useLoader(TextureLoader, '/textures/nightskycolor.png'); // Ruta a tu imagen
  return <primitive attach="background" object={texture} />;
}


function Game({ onGameOver }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Ocultar el cursor al entrar en el juego
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'default'; // Restaurar el cursor al salir del juego
    };
  }, []);

  useEffect(() => {
    // Temporizador para el tiempo restante
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      onGameOver(score); // Finalizar el juego cuando el tiempo llega a 0
    }
  }, [timeLeft, score, onGameOver]);

  const handleBoxDestroy = () => {
    setScore((prev) => prev + 100); // Incrementar el puntaje
  };

  return (
    <div className="game-container">
      {/* Elemento de mira (crosshair) */}
      <div className="crosshair"></div>
      
      {/* HUD del juego */}
      <div className="game-hud">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timeLeft}s</div>
      </div>

      {/* Escenario 3D */}
      <Canvas
        style={{ background: '#808080' }} // Fondo gris
        camera={{ position: [0, 2, 8], fov: 75 }}
      >
         <SpaceBackground /> {/* Aquí se agrega el fondo */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <HellArena /> {/* Escenario del infierno */}
        <GameScene onBoxDestroy={handleBoxDestroy} /> {/* Interacción del jugador */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}

export default Game;
