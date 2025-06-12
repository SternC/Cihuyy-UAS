import { useState, useEffect, useCallback } from 'react';

export const useMovement = (initialPosition, mapWidth, mapHeight) => {
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
    d: false,
  });

  const handleMove = useCallback((dx, dy) => {
    setPosition((prevPos) => {
      let newX = prevPos.x + dx;
      let newY = prevPos.y + dy;

      newX = Math.max(0, Math.min(newX, mapWidth));
      newY = Math.max(0, Math.min(newY, mapHeight));

      return { x: newX, y: newY };
    });
  }, [mapWidth, mapHeight]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        const keyName = key.length === 1 ? key : e.key;
        setKeys(prev => ({ ...prev, [keyName]: true }));

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
