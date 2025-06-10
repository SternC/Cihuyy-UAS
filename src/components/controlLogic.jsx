import { useState, useEffect, useCallback } from 'react';

export const useMovement = (initialPosition, mapBoundaries) => {
  const [position, setPosition] = useState(initialPosition);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
  });

  // Calculate movement boundaries based on map and viewport size
  const maxX = (mapBoundaries.mapWidth - mapBoundaries.viewportWidth) / 2;
  const minX = -maxX;
  const maxY = (mapBoundaries.mapHeight - mapBoundaries.viewportHeight) / 2;
  const minY = -maxY;

  const handleMove = useCallback((dx, dy) => {
    setPosition(prevPos => {
      // Calculate new position
      let newX = prevPos.x + dx;
      let newY = prevPos.y + dy;
      
      // Constrain to map boundaries
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
      
      return { x: newX, y: newY };
    });
  }, [minX, maxX, minY, maxY]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        const keyName = key.length === 1 ? key : e.key;
        setKeys(prev => ({ ...prev, [keyName]: true }));
        
        // Handle character flipping
        if (key === 'a' || key === 'arrowleft') setIsFlipped(true);
        if (key === 'd' || key === 'arrowright') setIsFlipped(false);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        const keyName = key.length === 1 ? key : e.key;
        setKeys(prev => ({ ...prev, [keyName]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement handling
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const moveAmount = 3;
      let dx = 0;
      let dy = 0;

      if (keys.ArrowUp || keys.w) dy -= moveAmount;
      if (keys.ArrowDown || keys.s) dy += moveAmount;
      if (keys.ArrowLeft || keys.a) dx -= moveAmount;
      if (keys.ArrowRight || keys.d) dx += moveAmount;

      const moving = dx !== 0 || dy !== 0;
      setIsMoving(moving);

      if (moving) {
        handleMove(dx, dy);
      }
    }, 16);

    return () => clearInterval(moveInterval);
  }, [keys, handleMove]);

  return {
    position,
    rotation,
    keys,
    isFlipped,
    setKeys,
    setIsFlipped,
    isMoving,
    setIsMoving
  };
};