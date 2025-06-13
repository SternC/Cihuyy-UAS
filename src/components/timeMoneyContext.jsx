import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

export const TimeMoneyProvider = ({ children }) => {
  // State untuk waktu
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now;
  });

  // State untuk uang
  const [money, setMoney] = useState(100000);

  // State untuk status pemain
  const [hunger, setHunger] = useState(100);
  const [sleep, setSleep] = useState(100);
  const [hygiene, setHygiene] = useState(100);
  const [happiness, setHappiness] = useState(100);

  // State untuk game over
  const [isGameOver, setIsGameOver] = useState(false);

  // State untuk track apakah game sudah dimulai
  const [gameStarted, setGameStarted] = useState(false);

  // Faktor percepatan waktu
  const timeAccelerationFactor = 15;

  // Check if any status reached 0
  const checkGameOver = () => {
    if (isGameOver) return true;
    if (hunger <= 0 || sleep <= 0 || hygiene <= 0 || happiness <= 0) {
      setIsGameOver(true);
      return true;
    }
    return false;
  };

  const stopGame = () => {
    setGameStarted(false);
    resetGame(); // This will reset all stats to default
  };

  // Function to start the game
  const startGame = () => {
    setGameStarted(true);
  };

  // Modify the status update effect to only run when game has started
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const timer = setInterval(() => {
      // Check game over before updates
      if (checkGameOver()) return;

      // Update time
      setTime(prevTime => {
        const newTime = new Date(prevTime);
        newTime.setSeconds(newTime.getSeconds() + timeAccelerationFactor);
        return newTime;
      });

      // Update status
      setHunger(prev => Math.max(0, prev - 0.75));
      setSleep(prev => Math.max(0, prev - 0.75));
      setHygiene(prev => Math.max(0, prev - 0.75));
      setHappiness(prev => Math.max(0, prev - 0.75));

      // Check game over after updates
      checkGameOver();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isGameOver, hunger, sleep, hygiene, happiness]);// Add isGameOver to dependencies

  // Fungsi untuk mengubah uang
  const updateMoney = (amount) => {
    if (isGameOver) return; // Prevent changes if game is over
    setMoney(prev => {
      const newAmount = prev + amount;
      return newAmount < 0 ? 0 : newAmount;
    });
  };

  // Fungsi untuk mengubah status pemain
  const updateStatus = (statusType, amount) => {
    if (isGameOver) return; // Prevent changes if game is over
    
    const clamp = (value) => Math.min(100, Math.max(0, value));

    switch (statusType) {
      case 'hunger':
        setHunger(prev => clamp(prev + amount));
        break;
      case 'sleep':
        setSleep(prev => clamp(prev + amount));
        break;
      case 'hygiene':
        setHygiene(prev => clamp(prev + amount));
        break;
      case 'happiness':
        setHappiness(prev => clamp(prev + amount));
        break;
      default:
        console.warn(`Unknown status type: ${statusType}`);
    }
    
    // Check game over after status update
    checkGameOver();
  };

  // Fungsi untuk reset game
const resetGame = () => {
  setTime(new Date());
  setMoney(100000);
  setHunger(100);
  setSleep(100);
  setHygiene(100);
  setHappiness(100);
  setIsGameOver(false);
  // Return the default spawn point
  return;
};

  // Format waktu
  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <GameContext.Provider value={{
      time: formattedTime,
      money,
      updateMoney,
      rawTime: time,
      hunger,
      sleep,
      hygiene,
      happiness,
      updateStatus,
      isGameOver,
      resetGame,
      startGame,
      stopGame, // Add this to the context value
      gameStarted
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useMoneyTime = () => useContext(GameContext);