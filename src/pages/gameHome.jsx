import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMovement } from "../components/controlLogic.jsx";
import DirectionalControls from "../components/directionalControl.jsx";
import { useCharacter } from "../components/characterContext.jsx";
import { useMoneyTime } from "../components/timeMoneyContext.jsx";
import "./game.css";
import PreventArrowScroll from "../components/preventArrowScroll.jsx";
import { InventoryPopup } from "./inventoryPopup.jsx";
import GameOverScreen from "../components/gameOverScreen.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { character } = useCharacter();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const mobileViewWidth = 400; // Sesuaikan dengan CSS media query Anda
  const mobileViewHeight = 300; // Sesuaikan dengan kebutuhan

  const {
    time,
    money,
    hunger,
    sleep,
    hygiene,
    happiness,
    updateStatus,
    isGameOver,
    resetGame,
  } = useMoneyTime();

  const mapWidth = 1650;
  const mapHeight = 1650;
  const viewWidth = 900;
  const viewHeight = 530;

  const spawnPoint = { x: mapWidth / 2 - 170, y: mapHeight / 2 + 610 };
  const exitPoint = { x: 3840 / 2 - 1510, y: 2160 / 2 + 575 };

  const manualBoundaries = {
    left: 95,
    right: 1580,
    top: 95,
    bottom: 1580,
  };

  const {
    position: playerPos,
    rotation,
    keys,
    isFlipped,
    setKeys,
    setIsFlipped,
    isMoving,
    setIsMoving,
  } = useMovement(spawnPoint, mapWidth, mapHeight, manualBoundaries);

  // Calculate camera bounds
  // Gunakan viewport size yang sesuai berdasarkan ukuran layar
  const currentViewWidth = isMobile ? mobileViewWidth : viewWidth;
  const currentViewHeight = isMobile ? mobileViewHeight : viewHeight;

  // Calculate camera bounds
  const minOffsetX = currentViewWidth - mapWidth;
  const minOffsetY = currentViewHeight - mapHeight;
  const maxOffsetX = 0;
  const maxOffsetY = 0;

  // Calculate desired camera position (centered on player)
  const desiredOffsetX = currentViewWidth/2 - playerPos.x;
  const desiredOffsetY = currentViewHeight/2 - playerPos.y;

  // Clamp the camera position to keep it within map bounds
  const clampedOffsetX = Math.max(minOffsetX, Math.min(maxOffsetX, desiredOffsetX));
  const clampedOffsetY = Math.max(minOffsetY, Math.min(maxOffsetY, desiredOffsetY));

  // Determine if we're at the edge of the map
  const isAtLeftEdge = desiredOffsetX > maxOffsetX;
  const isAtRightEdge = desiredOffsetX < minOffsetX;
  const isAtTopEdge = desiredOffsetY > maxOffsetY;
  const isAtBottomEdge = desiredOffsetY < minOffsetY;

  // Calculate player position relative to viewport when at edges
  const playerViewportX = isAtLeftEdge || isAtRightEdge 
    ? playerPos.x + clampedOffsetX 
    : currentViewWidth/2;

  const playerViewportY = isAtTopEdge || isAtBottomEdge 
    ? playerPos.y + clampedOffsetY 
    : currentViewHeight/2;

  const locations = [
    {
      id: "game",
      name: "Go Outside",
      position: spawnPoint,
      radius: 50,
      path: "/game",
    },
    {
      id: "bath",
      name: "Take A Bath",
      position: { x: mapWidth / 2 + 600, y: mapHeight / 2 - 400 },
      radius: 100,
    },
    {
      id: "sleep",
      name: "Sleep",
      position: { x: mapWidth / 2 - 500, y: mapHeight / 2 - 400 },
      radius: 300,
    },
    {
      id: "eat",
      name: "Eat",
      position: { x: mapWidth / 2 - 500, y: mapHeight / 2 + 450 },
      radius: 200,
    },
    {
      id: "watch",
      name: "Watch TV",
      position: { x: mapWidth / 2 + 430, y: mapHeight / 2 + 400 },
      radius: 175,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "i" || e.key === "I") {
        setIsInventoryOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      navigate(currentEvent.path, {
        state: {
          spawnPoint: exitPoint,
          returnPoint: playerPos,
        },
      });
    }
  };

  const getCharacterImage = (color, isMoving) => {
    const characterImages = {
      red: isMoving ? "charGIF6.gif" : "charGIFStatic6.gif",
      yellow: isMoving ? "charGIF3.gif" : "charGIFStatic3.gif",
      purple: isMoving ? "charGIF1.gif" : "charGIFStatic.gif",
      cyan: isMoving ? "charGIF2.gif" : "charGIFStatic2.gif",
      brown: isMoving ? "charGIF5.gif" : "charGIFStatic5.gif",
    };
    return (
      characterImages[color] || (isMoving ? "charGIF.gif" : "charGIFStatic.gif")
    );
  };


  return (
    <PreventArrowScroll>
      {isGameOver ? (
        <GameOverScreen
          hunger={hunger}
          sleep={sleep}
          hygiene={hygiene}
          happiness={happiness}
          resetGame={() => {
            const defaultPos = resetGame();
            setPlayerPos(defaultPos);
          }}
        />
      ) : (
        <div className="mainGameContainer">
          <div className="titleContainer">
            <Link to="/" state={{ spawnPoint: exitPoint }}>
              <button className="quitButton">
                <div className="circle">X</div>
              </button>
            </Link>
            <h1>HOME</h1>
          </div>
          <div className="gameContainer">
            <div className="timeMoney">
              <div className="timeContainer">
                <span className="timeText">Time: {time}</span>
              </div>
              <div className="moneyContainer">
                <span className="moneyText">
                  Money: {new Intl.NumberFormat("id-ID").format(money)}
                </span>
              </div>
            </div>
            <div className="barContainer">
              <div className="divider">
                <div className="Bar flex items-center w-full">
                  <img
                    src="symbol/mealSymbol.png"
                    className="w-6 h-6"
                    alt="Meal"
                  />
                  <div className="progressContain h-4">
                    <div
                      key={`hunger-${hunger}`}
                      className="progressBar h-4"
                      style={{ width: `${hunger}%` }}
                      data-status="meal"
                    ></div>
                  </div>
                </div>
                <div className="Bar flex items-center gap-2 w-full">
                  <img
                    src="symbol/sleepSymbol.png"
                    className="w-6 h-6"
                    alt="Sleep"
                  />
                  <div className="progressContain h-4">
                    <div
                      className="progressBar h-4"
                      style={{ width: `${sleep}%` }}
                      data-status="sleep"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="divider">
                <div className="Bar flex items-center gap-2 w-full">
                  <img
                    src="symbol/cleanSymbol.png"
                    className="w-6 h-6"
                    alt="Clean"
                  />
                  <div className="progressContain h-4">
                    <div
                      className="progressBar h-4"
                      style={{ width: `${hygiene}%` }}
                      data-status="hygiene"
                    ></div>
                  </div>
                </div>
                <div className="Bar flex items-center gap-2 w-full">
                  <img
                    src="symbol/happySymbol.png"
                    className="w-6 h-6"
                    alt="Happy"
                  />
                  <div className="progressContain h-4">
                    <div
                      className="progressBar h-4"
                      style={{ width: `${happiness}%` }}
                      data-status="happy"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mapStatusContainer relative mx-auto">
              <div className={`absolute ${isMobile ? 'w-[400px] h-[300px]' : 'w-[900px] h-[530px]'} z-5`}>
                <DirectionalControls
                  keys={keys}
                  setKeys={setKeys}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                />
              </div>
              <div className={`${isMobile ? 'w-[400px] h-[300px]' : 'w-[900px] h-[530px]'} relative overflow-hidden p-[15px] rounded-[20px] bg-[linear-gradient(135deg,_#666,_#ccc,_#888)]`}>
                {/* Player Character - Now Centered */}
                <div className="theChar absolute z-4" style={{
                  left: `${playerViewportX}px`,
                  top: `${playerViewportY}px`,
                  transform: 'translate(-50%, -50%)'
                }}>
                  <div className="flex flex-col items-center relative">
                    <div className="nameBackground mb-0">
                      <h2 className="text-sm font-bold text-white px-2 py-1 rounded-lg">
                        {character.name || "Your Character"}
                      </h2>
                    </div>
                    <img
                      id="charImage"
                      src={`/characters/${getCharacterImage(character.color, isMoving)}`}
                      alt="Character"
                      style={{
                        transform: `rotate(${rotation}deg) scale(1.5) ${
                          isFlipped ? "scaleX(-1)" : "scaleX(1)"
                        }`,
                        transition: "none",
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                </div>

                {/* Map Container - Moves Opposite of Player */}
                <div className="w-full h-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0"
                    style={{
                      width: `${mapWidth}px`,
                      height: `${mapHeight}px`,
                      left: `${clampedOffsetX}px`,
                      top: `${clampedOffsetY}px`,
                      transition: "left 0.3s ease, top 0.3s ease",
                    }}
                  >
                    <img
                      src="/map/homeMap.png"
                      alt="map"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                  </div>
                </div>

                <div className="miniMapContainer absolute bottom-[360px] right-10 w-[150px] h-[150px] border-2 border-white rounded overflow-hidden bg-black z-20">
                  <img
                    src="/map/homeMap.png"
                    className="miniMapImage"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div
                    className="miniMapMarker"
                    style={{
                      left: `${(playerPos.x / mapWidth) * 150}px`,
                      top: `${(playerPos.y / mapHeight) * 150}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  ></div>
                </div>
                <div className="inventory-container">
                  <button
                    className="inventory-button"
                    onClick={() => setIsInventoryOpen(true)}
                  >
                    Inventory
                  </button>
                  <InventoryPopup
                    isOpened={isInventoryOpen}
                    onClose={() => setIsInventoryOpen(false)}
                  />
                </div>

                {currentEvent ? (
                  <div className="eventcontainer flex justify-center items-center">
                    <button onClick={handleNavigate}>
                      {currentEvent.name}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </PreventArrowScroll>
  );
};

export default Home;