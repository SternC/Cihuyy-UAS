// hooks/useMovement.js
import { useState, useEffect } from 'react';

export const useMovement = (initialPosition, mapBoundaries) => {
  const [position, setPosition] = useState(initialPosition);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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

  const { mapWidth, mapHeight, viewportWidth, viewportHeight } = mapBoundaries;
  const maxX = (mapWidth - viewportWidth) / 2;
  const minX = -maxX;
  const maxY = (mapHeight - viewportHeight) / 2;
  const minY = -maxY;

  const handleMove = (dx, dy) => {
    let newX = position.x + dx;
    let newY = position.y + dy;
    
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
        if (e.key.toLowerCase() === 'a') setIsFlipped(true);
        if (e.key.toLowerCase() === 'd') setIsFlipped(false);
      }
      else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setKeys(prev => ({ ...prev, [e.key]: true }));
        if (e.key === 'ArrowLeft') setIsFlipped(true);
        if (e.key === 'ArrowRight') setIsFlipped(false);
      }
    };

    const handleKeyUp = (e) => {
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
      }
      else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setKeys(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Removed keys dependency

  // Movement logic
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const moveAmount = 20;
      let dx = 0;
      let dy = 0;

      if (keys.ArrowUp || keys.w) dy -= moveAmount;
      if (keys.ArrowDown || keys.s) dy += moveAmount;
      if (keys.ArrowLeft || keys.a) dx -= moveAmount;
      if (keys.ArrowRight || keys.d) dx += moveAmount;

      if (dx !== 0 && dy !== 0) {
        const diagonalAmount = moveAmount * 0.7071;
        dx = dx > 0 ? diagonalAmount : -diagonalAmount;
        dy = dy > 0 ? diagonalAmount : -diagonalAmount;
      }

      if (dx !== 0 || dy !== 0) {
        handleMove(dx, dy);
      }
    }, 16);

    return () => clearInterval(moveInterval);
  }, [keys]);

  // Reset keys on mouse up
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setKeys({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        w: false,
        a: false,
        s: false,
        d: false
      });
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return {
    position,
    setPosition,
    rotation,
    keys,
    isFlipped,
    setKeys,
    handleMove
  };
};