import { createContext, useState, useContext } from 'react';

const PositionContext = createContext();

export const PositionProvider = ({ children }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [currentMap, setCurrentMap] = useState('game'); // 'game', 'home', 'temple', dll.

  return (
    <PositionContext.Provider value={{ playerPosition, setPlayerPosition, currentMap, setCurrentMap }}>
      {children}
    </PositionContext.Provider>
  );
};

export const usePosition = () => useContext(PositionContext);