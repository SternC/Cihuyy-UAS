import { useState, useEffect, useCallback } from 'react';

export const useMovement = (initialPosition, mapBoundaries, colBoundaries) => {
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

  const { mapWidth, mapHeight, viewportWidth, viewportHeight } = mapBoundaries;
  const maxX = (mapWidth - viewportWidth) / 2;
  const minX = -maxX;
  const maxY = (mapHeight - viewportHeight) / 2;
  const minY = -maxY;

  const checkCollision = (newX, newY) => {
    const playerSize = 32; // Match your character size
    const playerLeft = newX - playerSize / 2;
    const playerRight = newX + playerSize / 2;
    const playerTop = newY - playerSize / 2;
    const playerBottom = newY + playerSize / 2;

    return colBoundaries.some(boundary => {
      return (
        playerRight > boundary.position.x &&
        playerLeft < boundary.position.x + boundary.width &&
        playerBottom > boundary.position.y &&
        playerTop < boundary.position.y + boundary.height
      );
    });
  };

  const handleMove = useCallback((dx, dy) => {
    let newX = position.x + dx;
    let newY = position.y + dy;

    // Check map boundaries first
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    // Then check collision with objects
    if (!checkCollision(newX, newY)) {
      setPosition({ x: newX, y: newY });
    }
  }, [position, minX, maxX, minY, maxY, colBoundaries]);

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