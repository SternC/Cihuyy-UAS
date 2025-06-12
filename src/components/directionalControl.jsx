import React, { useEffect, useRef } from 'react';

const DirectionalControls = ({ keys, setKeys, isFlipped, setIsFlipped }) => {
  const intervalRef = useRef(null);
  const pressedKeyRef = useRef(null);

  const startMovement = (key) => {
    if (intervalRef.current) return;
    
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

  const stopMovement = () => {
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
          className='z-10'
          onMouseDown={() => startMovement('ArrowUp')}
          onMouseUp={stopMovement}
          onMouseLeave={stopMovement}
          style={{ userSelect: 'none' }}
        >
          <img className="transform -rotate-90" src="direction.png" alt="Up"/>
        </button>
      </div>
      <div className="divider">
        <button 
          className='z-10'
          onMouseDown={() => {
            setKeys(prev => ({ ...prev, ArrowLeft: true }));
            setIsFlipped(true);  
          }}
          onMouseUp={() => setKeys(prev => ({ ...prev, ArrowLeft: false }))}
          onMouseLeave={() => {
            if (keys.ArrowLeft) setKeys(prev => ({ ...prev, ArrowLeft: false }))
          }}
          style={{ userSelect: 'none' }}
        >
          <img className="transform rotate-180" src="direction.png" alt="Left"/>
        </button>
        <button 
          className='z-10'
          onMouseDown={() => startMovement('ArrowDown')}
          onMouseUp={stopMovement}
          onMouseLeave={stopMovement}
          style={{ userSelect: 'none' }}
        >
          <img className="transform rotate-90" src="direction.png" alt="Down"/>
        </button>
        <button 
          className='z-10'
          onMouseDown={() => {
            setKeys(prev => ({ ...prev, ArrowRight: true }));
            setIsFlipped(false); 
          }}
          onMouseUp={() => setKeys(prev => ({ ...prev, ArrowRight: false }))}
          onMouseLeave={() => {
            if (keys.ArrowRight) setKeys(prev => ({ ...prev, ArrowRight: false }))
          }}
          style={{ userSelect: 'none' }}
        >
          <img src="direction.png" alt="Right"/>
        </button>
      </div>
    </div>
  );
};

export default DirectionalControls;