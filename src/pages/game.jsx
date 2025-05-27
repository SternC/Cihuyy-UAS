import React from 'react';
import { Link } from 'react-router-dom';
import './game.css';


const theGame = () => {
  return (
    <div className='mainGameContainer'>
      <div className="titleContainer">
        <Link to="/"><button className="quitButton"><div className="circle">X</div></button></Link>
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

            <div className="charInfo absolute text-center justify-center">
                <div class="nameBackground">
                    <h2 id="charName" class="text-l font-bold"></h2>
                </div>
                <img id="charImage" src="rocket.png" alt="Selected Character"/>
            </div>
              <img src="spaceMap.jpg" className="spaceMap" />
          
            <div class="direction">
              <div class="divider">
                  <button>
                      <img className="transform -rotate-90" src="direction.png"/>
                  </button>
              </div>
              <div class="divider">
                  <button>
                      <img className="transform rotate-180" src="direction.png"/>
                  </button>
                  <button>
                      <img className="transform rotate-90" src="direction.png"/>
                  </button>
                  <button>
                      <img src="direction.png"/>
                  </button>
              </div>
            </div>

            <div className="miniMapContainer" >
              <img src="spaceMap.jpg" className="miniMapImage" />
              <div className="miniMapMarker"></div> {/* Optional: shows player position */}
            </div>

            <div className='inventory-container'>
              <button 
                className="inventory-button" 
                //onClick={() => navigate('/inventory')} 
              >
                Inventory
              </button>
            </div>

            <div className='eventcontainer'>
              Event not found!
            </div>

          </div> 

        
        </div>
      </div>
        
    </div>
  );
};

export default theGame;