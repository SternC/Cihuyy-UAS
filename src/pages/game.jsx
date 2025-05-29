import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './game.css';

const TheGame = () => {
  const navigate = useNavigate();
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
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

  const [currentEvent, setCurrentEvent] = useState(null);
  const locations = [
    {
      id: 'home',
      name: 'Rumah Utama',
      position: {x: -1300, y: 560  },
      radius: 80,
      path: '/home'
    },
    {
      id: 'borobudur',
      name: 'Dapur',
      position: {  x: -800, y: 800},
      radius: 100,
      path: '/kitchen'
    },
    {
      id: 'garden',
      name: 'Taman',
      position: { x: 400, y: 50 },
      radius: 120,
      path: '/garden'
    },
    {
      id: 'workshop',
      name: 'Bengkel',
      position: { x: -100, y: -300 },
      radius: 90,
      path: '/workshop'
    }
    // Tambahkan lokasi lainnya
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

  // Fungsi navigasi
  const handleNavigate = () => {
    if (currentEvent) {
      navigate(currentEvent.path);
    }
  };

  // Map boundaries (adjust these values according to your map size)
  const mapWidth = 3840;  // Total width of your map in pixels
  const mapHeight = 2160; // Total height of your map in pixels
  const viewportWidth = 1190;  // Width of your visible game area
  const viewportHeight = 530; // Height of your visible game area

  // Calculate boundaries (divided by 2 since the player is centered)
  const maxX = (mapWidth - viewportWidth) / 2;
  const minX = -maxX;
  const maxY = (mapHeight - viewportHeight) / 2;
  const minY = -maxY;

  const handleMove = (dx, dy) => {
    // Calculate potential new position
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;
    
    // Apply boundaries
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    // Only update if position changed
    if (newX !== playerPos.x || newY !== playerPos.y) {
      setPlayerPos({ x: newX, y: newY });
      setCameraPos({ x: -newX, y: -newY });
      
      // Update rotation based on custom angles
      if (dx > 0 && dy === 0) setRotation(50);      // Kanan
      else if (dx < 0 && dy === 0) setRotation(230); // Kiri
      else if (dx === 0 && dy > 0) setRotation(140);  // Bawah
      else if (dx === 0 && dy < 0) setRotation(-40); // Atas
      // Diagonal movements
      else if (dx > 0 && dy < 0) setRotation(20);    // Kanan atas
      else if (dx > 0 && dy > 0) setRotation(80);    // Kanan bawah
      else if (dx < 0 && dy < 0) setRotation(260);   // Kiri atas
      else if (dx < 0 && dy > 0) setRotation(200);   // Kiri bawah
    }
  };


  // Keyboard event handler for diagonal movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle WASD (case insensitive)
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      }
      // Handle arrow keys (exact match)
      else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setKeys(prev => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e) => {
      // Handle WASD (case insensitive)
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
      }
      // Handle arrow keys (exact match)
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

  // Handle continuous movement and diagonal combinations
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const moveAmount = 20; // Reduced for smoother diagonal movement
      let dx = 0;
      let dy = 0;

      // Check both arrow keys and WASD
      if (keys.ArrowUp || keys.w) dy -= moveAmount;
      if (keys.ArrowDown || keys.s) dy += moveAmount;
      if (keys.ArrowLeft || keys.a) dx -= moveAmount;
      if (keys.ArrowRight || keys.d) dx += moveAmount;

      // Normalize diagonal movement speed
      if (dx !== 0 && dy !== 0) {
        const diagonalAmount = moveAmount * 0.7071; // 1/√2 for 45° movement
        dx = dx > 0 ? diagonalAmount : -diagonalAmount;
        dy = dy > 0 ? diagonalAmount : -diagonalAmount;
      }

      if (dx !== 0 || dy !== 0) {
        handleMove(dx, dy);
      }
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [keys]);

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

  return (
    <div className='mainGameContainer'>
      <div className="titleContainer">
        <Link to="/"><button className="quitButton"><div className="circle">X</div></button></Link>
        <h1>the game</h1> 
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
                  src="rocket.png" 
                  alt="Selected Character"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease'
                }}/>
            </div>

            <div className="w-full h-full overflow-hidden relative">
                  <img
                  src="theMainSpace.png"
                  className="w-100% h-100% object-cover object-center"
                  style={{
                    transform: `translate(${cameraPos.x}px, ${cameraPos.y}px) scale(4)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                />
            </div>
          
            <div class="direction">
              <div class="divider">
                  <button
                      onMouseDown={() => setKeys(prev => ({ ...prev, ArrowUp: true }))}
                      onMouseUp={() => setKeys(prev => ({ ...prev, ArrowUp: false }))}
                      onMouseLeave={() => {
                        if (keys.ArrowUp) setKeys(prev => ({ ...prev, ArrowUp: false }))
                      }}
                      style={{ userSelect: 'none' }}
                      >
                      <img className="transform -rotate-90" src="direction.png"/>
                  </button>
              </div>
              <div class="divider">
                  <button 
                      onMouseDown={() => setKeys(prev => ({ ...prev, ArrowLeft: true }))}
                      onMouseUp={() => setKeys(prev => ({ ...prev, ArrowLeft: false }))}
                      onMouseLeave={() => {
                        if (keys.ArrowLeft) setKeys(prev => ({ ...prev, ArrowLeft: false }))
                      }}
                      style={{ userSelect: 'none' }}
                      >
                      <img className="transform rotate-180" src="direction.png"/>
                  </button>
                  <button 
                      onMouseDown={() => setKeys(prev => ({ ...prev, ArrowDown: true }))}
                      onMouseUp={() => setKeys(prev => ({ ...prev, ArrowDown: false }))}
                      onMouseLeave={() => {
                        if (keys.ArrowDown) setKeys(prev => ({ ...prev, ArrowDown: false }))
                      }}
                      style={{ userSelect: 'none' }}
                      >
                      <img className="transform rotate-90" src="direction.png"/>
                  </button>
                  <button 
                      onMouseDown={() => setKeys(prev => ({ ...prev, ArrowRight: true }))}
                      onMouseUp={() => setKeys(prev => ({ ...prev, ArrowRight: false }))}
                      onMouseLeave={() => {
                        if (keys.ArrowRight) setKeys(prev => ({ ...prev, ArrowRight: false }))
                      }}
                      style={{ userSelect: 'none' }}
                      >
                      <img src="direction.png"/>
                  </button>
              </div>
            </div>

            <div className="miniMapContainer" >
              <img src="theMainSpace.png" className="miniMapImage" />
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
              {currentEvent ? (
                <button onClick={handleNavigate}>
                  Enter {currentEvent.name}
                </button>
              ) : (
                <span>No nearby locations</span>
              )}
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default TheGame;