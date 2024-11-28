import { useState } from 'react';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Scoreboard from './components/Scoreboard';
import Intro from './components/Intro';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro'); // Pantalla inicial

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleGameOver = (score) => {
    setCurrentScreen('scoreboard');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleIntroComplete = () => {
    setCurrentScreen('menu'); // Cambia al menú después de la introducción
  };

  return (
    <div className="app-container">
      {currentScreen === 'intro' && (
        <Intro onComplete={handleIntroComplete} />
      )}
      {currentScreen === 'menu' && (
        <MainMenu onStartGame={handleStartGame} onViewScores={() => setCurrentScreen('scoreboard')} />
      )}
      {currentScreen === 'game' && (
        <Game onGameOver={handleGameOver} />
      )}
      {currentScreen === 'scoreboard' && (
        <Scoreboard onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
