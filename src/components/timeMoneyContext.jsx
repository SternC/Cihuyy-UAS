// contexts/GameContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

export const TimeMoneyProvider = ({ children }) => {
  // State untuk waktu
  const [time, setTime] = useState(() => {
    // Inisialisasi waktu dengan waktu saat ini (real-time)
    // Anda bisa mengatur waktu awal sesuai kebutuhan, misal 12:00:00 jika game dimulai pada jam tersebut
    const now = new Date();
    // Misalnya, Anda ingin memulai dari jam 12 siang
    // now.setHours(12, 0, 0, 0);
    return now;
  });

  // State untuk uang
  const [money, setMoney] = useState(100000);

  // Faktor percepatan waktu (15 kali dari waktu normal)
  const timeAccelerationFactor = 15;

  // Update waktu setiap detik (real-time)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        const newTime = new Date(prevTime);
        // Tambahkan detik berdasarkan faktor percepatan
        newTime.setSeconds(newTime.getSeconds() + (1 * timeAccelerationFactor));
        return newTime;
      });
    }, 1000); // Interval setiap 1 detik

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