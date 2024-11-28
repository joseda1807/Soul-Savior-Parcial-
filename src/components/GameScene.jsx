import React, { useState, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import useSound from 'use-sound';
import shootSound from '../assets/shoot.mp3';
import explosionSound from '../assets/explosion.mp3';
import backgroundMusic from '../assets/Musica_de_Batalla_Un_destino_[_YouConvert.net_].mp3';
import * as THREE from 'three';

// Componente para representar los objetivos
function Demonio({ position, onClick }) {
  const { scene } = useGLTF('/Models/demonio.glb');
  const ref = useRef();
  const { camera } = useThree();
  useFrame(() => {
    if (ref.current) {
      // Calcula la dirección hacia la cámara
      ref.current.lookAt(camera.position);
    }
  });
  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={10}
      onClick={onClick} // Detecta clics en el modelo
    />
  );
}

// Componente del proyectil
function Projectile({ initialPosition, direction, onRemove }) {
  const projectileRef = useRef();
  const velocity = direction.clone().multiplyScalar(0.2); // Multiplica para ajustar la velocidad del proyectil

  useFrame(() => {
    if (projectileRef.current) {
      projectileRef.current.position.add(velocity); // Mueve el proyectil en cada frame
    }
  });

  useEffect(() => {
    // Destruye el proyectil después de 5 segundos
    const timer = setTimeout(() => {
      onRemove();
    }, 5000); // 5 segundos
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <Sphere ref={projectileRef} args={[0.2]} position={initialPosition}>
      <meshStandardMaterial color="red" />
    </Sphere>
  );
}

// Componente principal de la escena
function GameScene({ onBoxDestroy }) {
  const [boxes, setBoxes] = useState([]); // Ahora representa demonios
  const [projectiles, setProjectiles] = useState([]);
  const [playShoot] = useSound(shootSound);
  const [playExplosion] = useSound(explosionSound);
  const [playMusic] = useSound(backgroundMusic, {
    volume: 0.3,
    loop: true,
  });
  const { camera } = useThree();

  useEffect(() => {
    playMusic();

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        // Obtiene la posición y dirección de la cámara
        const cameraPosition = new THREE.Vector3();
        const cameraDirection = new THREE.Vector3();
        camera.getWorldPosition(cameraPosition);
        camera.getWorldDirection(cameraDirection);

        // Crea el proyectil ligeramente frente a la cámara
        const projectilePosition = cameraPosition
          .clone()
          .add(cameraDirection.clone().multiplyScalar(2));

        const newProjectile = {
          id: Date.now(),
          position: projectilePosition.toArray(),
          direction: cameraDirection.clone(),
        };

        setProjectiles((prev) => [...prev, newProjectile]);
        playShoot();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [camera, playShoot, playMusic]);

  const generateRandomPosition = () => {
    return [
      Math.random() * 10 - 5,
      Math.random() * 5,
      Math.random() * 10 - 5,
    ];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (boxes.length < 5) {
        setBoxes((prev) => [...prev, generateRandomPosition()]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [boxes]);

  useFrame(() => {
    // Actualiza la posición de los proyectiles
    setProjectiles((prev) =>
      prev.map((projectile) => ({
        ...projectile,
        position: new THREE.Vector3(...projectile.position)
          .add(projectile.direction.clone().multiplyScalar(0.2))
          .toArray(),
      }))
    );

    // Verifica colisiones y elimina proyectiles
    setProjectiles((prev) =>
      prev.filter((projectile) => {
        const projectilePos = new THREE.Vector3(...projectile.position);

        // Remueve proyectiles que estén demasiado lejos (30 unidades desde el origen)
        if (projectilePos.length() > 30) return false;

        // Verifica colisiones con los demonios
        let collision = false;
        setBoxes((prevBoxes) => {
          const newBoxes = prevBoxes.filter((boxPos) => {
            const boxVector = new THREE.Vector3(...boxPos);
            const distance = projectilePos.distanceTo(boxVector);

            if (distance < 1) {
              collision = true;
              onBoxDestroy();
              playExplosion();
              return false;
            }
            return true;
          });
          return newBoxes;
        });

        return !collision;
      })
    );
  });

  return (
    <>
      {boxes.map((position, index) => (
        <Demonio
          key={index}
          position={position}
          onClick={() => {
            setBoxes((prev) => prev.filter((_, i) => i !== index));
            onBoxDestroy();
            playExplosion();
          }}
        />
      ))}
      {projectiles.map((projectile) => (
        <Projectile
          key={projectile.id}
          initialPosition={projectile.position}
          direction={projectile.direction}
          onRemove={() =>
            setProjectiles((prev) =>
              prev.filter((p) => p.id !== projectile.id)
            )
          }
        />
      ))}
    </>
  );
}

export default GameScene;
