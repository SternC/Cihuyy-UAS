import React from 'react';
import { useNavigate } from 'react-router-dom';
import './inventory.css';

const theGame = () => {
  const navigate = useNavigate();
  

  const handleQuit = () => {
    navigate('/'); 
  };

  

  return (
    <div className='mainInventoryContainer'>
      <div className="titleContainer">
        <button className="quitButton" onClick={handleQuit}>
          <div className="circle">X</div>
        </button>
        <h1>the game</h1> 
      </div>

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
        
      </div>
        
    </div>
  );
};

export default theGame;