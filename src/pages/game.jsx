import React from 'react';
import { useNavigate } from 'react-router-dom';
import './game.css';

const theGame = () => {
  const navigate = useNavigate();
  

  const handleQuit = () => {
    navigate('/'); 
  };

  

  return (
    <div className='mainGameContainer'>
      <div className="titleContainer">
        <button className="quitButton" onClick={handleQuit}>
          <div className="circle">X</div>
        </button>
        <h1>the game</h1> 
      </div>
      <div className='gameContainer'>
        <div class="barContainer">
          <div class="divider">
            <div class="Bar flex items-center gap-2 w-full">
              <div class="progressContain h-4">
                  <div class="progressBar h-4 w-1/2" data-status="meal"></div>
              </div>
            </div>
          <div class="Bar flex items-center gap-2 w-full">
              <div class="progressContain h-4">
                  <div class="progressBar h-4 w-1/2" data-status="sleep"></div>
              </div>
            </div>
          </div>
                      
          <div class="divider">
            <div class="Bar flex items-center gap-2 w-full">
                <div class="progressContain h-4">
                    <div class="progressBar h-4 w-1/2" data-status="hygiene"></div>
                </div>
            </div>
            <div class="Bar flex items-center gap-2 w-full">
              <div class="progressContain h-4">
                  <div class="progressBar h-4 w-1/2" data-status="happy"></div>
                </div>
              </div>
          </div>
        </div>

        <div className='mapStatusContainer'>
          <div className='mapContainer'>
          <div class="absolute character-info text-center justify-center">
              <div class="nameBackground">
                  <h2 id="charName" class="text-l font-bold"></h2>
              </div>
              <img id="charImage" src="#" alt="Selected Character"/>
          </div>
            <img src="mainMap.jpeg" alt="Map" />
          </div> 
          <div className='statusContainer'> 
          </div>
        </div>
      </div>
        
    </div>
  );
};

export default theGame;