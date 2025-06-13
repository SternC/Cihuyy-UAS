import { Link } from 'react-router-dom';

const GameOverScreen = ({ hunger, sleep, hygiene, happiness, resetGame }) => {
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1>GAME OVER</h1>
        <p>One of your stats has reached zero!</p>
        <div className="game-over-stats">
          <p>Hunger: {hunger}%</p>
          <p>Sleep: {sleep}%</p>
          <p>Hygiene: {hygiene}%</p>
          <p>Happiness: {happiness}%</p>
        </div>
        <Link to="/">
          <button className="quit-button" onClick={resetGame}>
            Return to Main Menu
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GameOverScreen;