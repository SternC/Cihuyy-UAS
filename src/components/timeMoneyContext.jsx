// contexts/GameContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

export const TimeMoneyProvider = ({ children }) => {
  // State untuk waktu
  const [time, setTime] = useState(() => {
    // Inisialisasi waktu default 12:00
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return now;
  });

  // State untuk uang
  const [money, setMoney] = useState(100000);

  // Update waktu setiap detik (real-time)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        const newTime = new Date(prevTime);
        newTime.setSeconds(newTime.getSeconds() + 1);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fungsi untuk mengubah uang (+/-)
  const updateMoney = (amount) => {
    setMoney(prev => {
      const newAmount = prev + amount;
      return newAmount < 0 ? 0 : newAmount; // Pastikan tidak minus
    });
  };

  // Format waktu menjadi HH:MM
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
      rawTime: time // Jika perlu akses object Date
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useMoneyTime = () => useContext(GameContext);