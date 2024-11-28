import React, { useEffect, useRef } from 'react';
import './MainMenu.css';

function MainMenu({ onStartGame, onViewScores }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Carga los GIFs como imágenes
    const gifImages = [
      '/gifs/face1.gif',
      '/gifs/face2.gif',
      '/gifs/face3.gif',
      '/gifs/gif.gif',
    ].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    let currentFrame = 0;

    // Animar los GIFs
    const interval = setInterval(() => {
      if (ctx && gifImages[currentFrame]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
        ctx.drawImage(gifImages[currentFrame], 0, 0, canvas.width, canvas.height);
        currentFrame = (currentFrame + 1) % gifImages.length; // Cambia al siguiente GIF
      }
    }, 1000); // Cambia el GIF cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-menu">
      <h1>Soul Savior</h1>
      <div className="menu-buttons">
        <button onClick={onStartGame}>Start Game</button>
        <button onClick={onViewScores}>View Scores</button>
      </div>
      {/* Televisor con animación */}
      <div className="televisor-container">
        <canvas
          ref={canvasRef}
          width="400"
          height="300"
          style={{
            border: '5px solid green',
            borderRadius: '10px',
            marginTop: '20px',
            backgroundColor: 'black',
          }}
        />
      </div>
    </div>
  );
}

export default MainMenu;
