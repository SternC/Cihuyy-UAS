import React from 'react';

const DirectionalControls = ({ keys, setKeys, isFlipped, setIsFlipped }) => {
  return (
    <div className="direction">
      <div className="divider">
        <button
          onMouseDown={() => setKeys(prev => ({ ...prev, ArrowUp: true }))}
          onMouseUp={() => setKeys(prev => ({ ...prev, ArrowUp: false }))}
          onMouseLeave={() => {
            if (keys.ArrowUp) setKeys(prev => ({ ...prev, ArrowUp: false }))
          }}
          style={{ userSelect: 'none' }}
        >
          <img className="transform -rotate-90" src="direction.png" alt="Up"/>
        </button>
      </div>
      <div className="divider">
        <button 
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
          onMouseDown={() => setKeys(prev => ({ ...prev, ArrowDown: true }))}
          onMouseUp={() => setKeys(prev => ({ ...prev, ArrowDown: false }))}
          onMouseLeave={() => {
            if (keys.ArrowDown) setKeys(prev => ({ ...prev, ArrowDown: false }))
          }}
          style={{ userSelect: 'none' }}
        >
          <img className="transform rotate-90" src="direction.png" alt="Down"/>
        </button>
        <button 
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