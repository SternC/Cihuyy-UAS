import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMovement } from '../components/controlLogic.jsx';
import DirectionalControls from '../components/directionalControl.jsx';
import './game.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState(null);
  
  const mapBoundaries = {
    mapWidth: 1100,
    mapHeight: 1100,
    viewportWidth: 10,
    viewportHeight: 0
  };

  const { minX, maxX, minY, maxY } = {
    minX: -(mapBoundaries.mapWidth - mapBoundaries.viewportWidth) / 2,
    maxX: (mapBoundaries.mapWidth - mapBoundaries.viewportWidth) / 2,
    minY: -(mapBoundaries.mapHeight - mapBoundaries.viewportHeight) / 2,
    maxY: (mapBoundaries.mapHeight - mapBoundaries.viewportHeight) / 2
  };

  const {
    position: playerPos,
    rotation,
    keys,
    setKeys
  } = useMovement({ x: 0, y: 0 }, mapBoundaries);

  const cameraPos = { x: -playerPos.x, y: -playerPos.y };
  
  const locations = [
    {
      id: 'kitchen',
      name: 'Dapur',
      position: { x: 200, y: 200 },
      radius: 50,
      path: '/kitchen'
    }
  ];

  useEffect(() => {
    const checkLocationProximity = () => {
      for (const location of locations) {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - location.position.x, 2) + 
          Math.pow(playerPos.y - location.position.y, 2)
        );
        
        if (distance <= location.radius) {
          setCurrentEvent(location);
          return;
        }
      }
      setCurrentEvent(null);
    };

    checkLocationProximity();
  }, [playerPos]);

  const handleNavigate = () => {
    if (currentEvent) {
      navigate(currentEvent.path);
    }
  };

  return (
    <div className='mainGameContainer'>
      <div className="titleContainer">
        <Link to="/"><button className="quitButton"><div className="circle">X</div></button></Link>
        <h1>Home</h1> 
      </div>
      <div className='gameContainer'>
        <div className="barContainer">
          <div className="divider">
            <div className="Bar flex items-center w-full">
              <img src='symbol/mealSymbol.png' className='w-6 h-6'/>
              <div className="progressContain h-4">
                  <div className="progressBar h-4 w-1/2 " data-status="meal"></div>
              </div>
            </div>
          <div className="Bar flex items-center gap-2 w-full">
              <img src='symbol/sleepSymbol.png' className='w-6 h-6'/>
              <div className="progressContain h-4">
                  <div className="progressBar h-4 w-1/2" data-status="sleep"></div>
              </div>
            </div>
          </div>
          <div className="divider">
            <div className="Bar flex items-center gap-2 w-full">
                <img src='symbol/cleanSymbol.png' className='w-6 h-6'/>
                <div className="progressContain h-4">
                    <div className="progressBar h-4 w-1/2" data-status="hygiene"></div>
                </div>
            </div>
            <div className="Bar flex items-center gap-2 w-full">
              <img src='symbol/happySymbol.png' className='w-6 h-6'/>
              <div className="progressContain h-4">
                  <div className="progressBar h-4 w-1/2" data-status="happy"></div>
                </div>
              </div>
          </div>
        </div>
        
        <div className='mapStatusContainer'>
          <div className='w-[900px] h-[530px] relative overflow-hidden p-[15px] rounded-[20px] bg-[linear-gradient(135deg,_#666,_#ccc,_#888)]'>
            <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute text-center justify-center z-10">
                <div class="nameBackground">
                    <h2 id="charName" class="text-l font-bold"></h2>
                </div>
                <img id="charImage" 
                  src="/characters/charGIF.gif" 
                  alt="Selected Character"
                  style={{
                    transform: `rotate(${rotation}deg) scale(2.5)`,
                    transition: 'transform 0.2s ease'
                }}/>
            </div>
            
            <div className="w-full h-full overflow-hidden relative">
              <img
                src="/map/homeMap.png"
                className="w-100% h-100% object-cover object-center"
                style={{
                  transform: `translate(${cameraPos.x}px, ${cameraPos.y}px) scale(2.5)`,
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
            
            <DirectionalControls keys={keys} setKeys={setKeys} />
            
            <div className="miniMapContainer">
              <img src="/map/homeMap.png" className="miniMapImage" />
              <div 
                className="miniMapMarker"
                style={{
                  left: `${((playerPos.x - minX) / (maxX - minX)) * 97}%`,
                  top: `${((playerPos.y - minY) / (maxY - minY)) * 94}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
            
            <div className='inventory-container'>
              <button className="inventory-button">Inventory</button>
            </div>
            
            {currentEvent && (
              <div className='eventcontainer flex justify-center items-center'>
                <button 
                  onClick={handleNavigate}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Masuk {currentEvent.name}
                </button>
              </div>
            )}
          </div> 
        </div>
      </div>
    </div>
  );
};

export default Home;