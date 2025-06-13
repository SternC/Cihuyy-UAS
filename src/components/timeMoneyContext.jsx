// contexts/GameContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

export const TimeMoneyProvider = ({ children }) => {
  // State untuk waktu
  const [time, setTime] = useState(() => {
    // Inisialisasi waktu dengan waktu saat ini (real-time)
    const now = new Date();
    // Anda bisa mengatur waktu awal sesuai kebutuhan, misal 12:00:00 jika game dimulai pada jam tersebut
    return now;
  });

  // State untuk uang
  const [money, setMoney] = useState(100000);

  // State untuk status pemain, inisialisasi di nilai maksimal (100)
  const [hunger, setHunger] = useState(100);
  const [sleep, setSleep] = useState(100);
  const [hygiene, setHygiene] = useState(100);
  const [happiness, setHappiness] = useState(100);

  // Faktor percepatan waktu (15 kali dari waktu normal)
  const timeAccelerationFactor = 15;

  // Update waktu dan status setiap detik (real-time yang dipercepat)
  useEffect(() => {
  const timer = setInterval(() => {
    // 1. Update waktu
    setTime(prevTime => {
      const newTime = new Date(prevTime);
      newTime.setSeconds(newTime.getSeconds() + timeAccelerationFactor);
      return newTime;
    });

    // 2. Update status (dipisah dari setTime)
    setHunger(prev => Math.max(0, prev - 0.5)); // 0.5% per detik
    setSleep(prev => Math.max(0, prev - 0.5));
    setHygiene(prev => Math.max(0, prev - 0.5));
    setHappiness(prev => Math.max(0, prev - 5));
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

  // Fungsi baru untuk mengubah status pemain (untuk digunakan saat berinteraksi dengan item/lokasi)
  const updateStatus = (statusType, amount) => {
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
      rawTime: time, // Jika perlu akses object Date
      // Tambahkan status pemain ke konteks
      hunger,
      sleep,
      hygiene,
      happiness,
      updateStatus // Sediakan fungsi untuk mengubah status
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useMoneyTime = () => useContext(GameContext);