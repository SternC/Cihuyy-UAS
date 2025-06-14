import React, { useEffect, useRef } from 'react';

const DirectionalControls = ({ keys, setKeys, isFlipped, setIsFlipped }) => {
  const intervalRef = useRef(null);
  const pressedKeyRef = useRef(null);

  const startMovement = (key) => {
    if (intervalRef.current) return;
    
    // Handle flipping for left/right movement
    if (key === 'ArrowLeft') {
      setIsFlipped(true);
    } else if (key === 'ArrowRight') {
      setIsFlipped(false);
    }
    
    setKeys(prev => ({ ...prev, [key]: true }));
    pressedKeyRef.current = key;
    
    intervalRef.current = setInterval(() => {
      setKeys(prev => ({ ...prev, [key]: true }));
    }, 100);
  };

  const stopMovement = (key) => {
    if (!intervalRef.current) return;
    
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    
    if (pressedKeyRef.current) {
      setKeys(prev => ({ ...prev, [pressedKeyRef.current]: false }));
      pressedKeyRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="direction">
      <div className="divider">
        <button
          onMouseDown={() => startMovement('ArrowUp')}
          onMouseUp={() => stopMovement('ArrowUp')}
          onMouseLeave={() => stopMovement('ArrowUp')}
          style={{ userSelect: 'none' }}
        >
          <img className="transform -rotate-90" src="direction.png" alt="Up"/>
        </button>
      </div>
      <div className="divider">
        <button 
          onMouseDown={() => startMovement('ArrowLeft')}
          onMouseUp={() => stopMovement('ArrowLeft')}
          onMouseLeave={() => stopMovement('ArrowLeft')}
          style={{ userSelect: 'none' }}
        >
          <img className="transform rotate-180" src="direction.png" alt="Left"/>
        </button>
        <button 
          onMouseDown={() => startMovement('ArrowDown')}
          onMouseUp={() => stopMovement('ArrowDown')}
          onMouseLeave={() => stopMovement('ArrowDown')}
          style={{ userSelect: 'none' }}
        >
          <img className="transform rotate-90" src="direction.png" alt="Down"/>
        </button>
        <button 
          onMouseDown={() => startMovement('ArrowRight')}
          onMouseUp={() => stopMovement('ArrowRight')}
          onMouseLeave={() => stopMovement('ArrowRight')}
          style={{ userSelect: 'none' }}
        >
          <img src="direction.png" alt="Right"/>
        </button>
      </div>
    </div>
  );
};

export default DirectionalControls;