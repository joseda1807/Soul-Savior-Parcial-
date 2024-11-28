import React from 'react';

export default function Intro({ onComplete }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        src="./public/Videos/Video de WhatsApp 2024-11-26 a las 23.20.29_bbd7bca4.mp4" // Ruta del video
        autoPlay
        muted
        controls={false} // Sin controles de usuario
        onEnded={onComplete} // Llama a la función cuando el video termina
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}