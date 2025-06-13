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
import QuitModule from "../components/quitModule";

const Beach = () => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isProgressBarActive, setIsProgressBarActive] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [activeInteraction, setActiveInteraction] = useState(null);
  const { character } = useCharacter();
  const [showQuitModule, setShowQuitModule] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const mobileViewWidth = 400;
  const mobileViewHeight = 300;

  const {
    time,
    money,
    hunger,
    sleep,
    hygiene,
    happiness,
    updateStatus,
    updateMoney,
    isGameOver,
    resetGame,
    stopGame,
  } = useMoneyTime();

  const mapWidth = 1120;
  const mapHeight = 1120;
  const viewWidth = 900;
  const viewHeight = 530;

  const spawnPoint = { x: mapWidth / 2 - 385, y: mapHeight / 2 + 410 };
  const exitPoint = { x: 3840 / 2 + 860, y: 2160 / 2 + 740 };

  const manualBoundaries = {
    left: 50,
    right: 1060,
    top: 50,
    bottom: 1050,
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
    setPlayerPos,
  } = useMovement(spawnPoint, mapWidth, mapHeight, manualBoundaries);

  // Calculate camera bounds based on responsive viewport
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
      interactionTime: 0,
    },
    {
      id: "sunbathe",
      name: "Sunbathe",
      position: { x: mapWidth / 2 - 110, y: mapHeight / 2 + 130 },
      radius: 70,
      effect: () => {
        updateStatus("happiness", 20);
        updateStatus("sleep", 10);
        updateStatus("hygiene", -5);
      },
      interactionTime: 4000,
    },
    {
      id: "build",
      name: "Build a Sand Castle",
      position: { x: mapWidth / 2 + 275, y: mapHeight / 2 + 150 },
      radius: 75,
      effect: () => {
        updateStatus("happiness", 25);
        updateStatus("hunger", -10);
        updateStatus("hygiene", -10);
      },
      interactionTime: 5000,
    },
    {
      id: "swim",
      name: "Go Swim",
      position: { x: mapWidth / 2, y: mapHeight / 2 - 700 },
      radius: 500,
      effect: () => {
        updateStatus("hygiene", 30);
        updateStatus("happiness", 15);
        updateStatus("hunger", -15);
        updateStatus("sleep", -5);
      },
      interactionTime: 6000,
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
      if (!isProgressBarActive) {
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
      }
    };

    checkLocationProximity();
  }, [playerPos, isProgressBarActive]);

  useEffect(() => {
    let interval;
    if (isProgressBarActive && activeInteraction) {
      setProgressBarValue(0);
      let currentProgress = 0;
      const step = 100 / (activeInteraction.interactionTime / 100);

      interval = setInterval(() => {
        currentProgress += step;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          activeInteraction.effect();
          setIsProgressBarActive(false);
          setProgressBarValue(0);
          setActiveInteraction(null);
        }
        setProgressBarValue(currentProgress);
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isProgressBarActive, activeInteraction]);

  const handleInteraction = () => {
    if (currentEvent) {
      if (currentEvent.path) {
        navigate(currentEvent.path, {
          state: {
            spawnPoint: exitPoint,
            returnPoint: playerPos,
          },
        });
      } else if (currentEvent.effect && currentEvent.interactionTime > 0) {
        setIsProgressBarActive(true);
        setActiveInteraction(currentEvent);
      } else if (currentEvent.effect && currentEvent.interactionTime === 0) {
        currentEvent.effect();
      }
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
            <button
              className="quitButton"
              onClick={() => setShowQuitModule(true)}
            >
              <div className="circle">X</div>
            </button>
            <h1>KUTA BEACH</h1>
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
                      src="/map/kutaMap.png"
                      alt="Kuta Beach Map"
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
                    src="/map/kutaMap.png"
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

                {/* Progress bar container */}
                {isProgressBarActive && activeInteraction && (
                  <div className="progressBarOverlay">
                    <div className="progressBarContainer">
                      <h3>{activeInteraction.name}...</h3>
                      <div className="progressBackground">
                        <div
                          className="progressFill"
                          style={{ width: `${progressBarValue}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {currentEvent && !isProgressBarActive ? (
                  <div className="eventcontainer flex justify-center items-center">
                    <button onClick={handleInteraction}>
                      {currentEvent.name}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
      {showQuitModule && (
        <QuitModule
          onConfirm={() => {
            stopGame();
            resetGame();
            navigate("/");
          }}
          onCancel={() => setShowQuitModule(false)}
        />
      )}
    </PreventArrowScroll>
  );
};

export default Beach;