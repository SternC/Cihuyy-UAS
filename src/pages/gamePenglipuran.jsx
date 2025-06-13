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

const Village = () => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isProgressBarActive, setIsProgressBarActive] = useState(false); // Added for progress bar
  const [progressBarValue, setProgressBarValue] = useState(0); // Added for progress bar value
  const [activeInteraction, setActiveInteraction] = useState(null); // Added to store the active interaction
  const { character } = useCharacter();

  const {
    time,
    money,
    hunger,
    sleep,
    hygiene,
    happiness,
    updateStatus,
    updateMoney, // <--- ADDED: To update money
    isGameOver,
    resetGame,
  } = useMoneyTime();

  const mapWidth = 1100;
  const mapHeight = 1100;
  const viewWidth = 900;
  const viewHeight = 530;

  const spawnPoint = { x: mapWidth / 2 + 15, y: mapHeight / 2 + 440 }; // Adjusted spawn point
  const exitPoint = { x: 3840 / 2 - 685, y: 2160 / 2 - 755 }; // Matching position in main game world

  const manualBoundaries = {
    left: 50,
    right: 1030,
    top: 50,
    bottom: 1030,
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
    setPlayerPos, // Added to reset player position after game over
  } = useMovement(spawnPoint, mapWidth, mapHeight, manualBoundaries);

  const cameraClamp = {
    left: viewWidth / 2,
    right: Math.max(viewWidth / 2, mapWidth - viewWidth / 2),
    top: viewHeight / 2,
    bottom: Math.max(viewHeight / 2, mapHeight - viewHeight / 2),
  };

  const cameraX = Math.max(
    viewWidth / 2,
    Math.min(playerPos.x, mapWidth - viewWidth / 2)
  );
  const cameraY = Math.max(
    viewHeight / 2,
    Math.min(playerPos.y, mapHeight - viewHeight / 2)
  );

  const cameraPos = {
    x: -(cameraX - viewWidth / 2),
    y: -(cameraY - viewHeight / 2),
  };

  const locations = [
    {
      id: "game",
      name: "Go Outside",
      position: spawnPoint, // Use spawnPoint as exit point
      radius: 20,
      path: "/game",
      interactionTime: 0, // No interaction time for navigation
    },
    {
      id: "shopping",
      name: "Buy something",
      position: { x: mapWidth / 2 + 250, y: mapHeight / 2 + 150 },
      radius: 50,
      effect: () => {
        updateMoney(-15000); // Spend money for shopping
        updateStatus("happiness", 15); // Increase happiness
      },
      interactionTime: 3000, // 3 seconds
    },
    {
      id: "visit",
      name: "Visit Villager", //rest+, happiness +,
      position: { x: mapWidth / 2 - 300, y: mapHeight / 2 - 200 },
      radius: 50,
      effect: () => {
        updateStatus("sleep", 10); // Increase sleep
        updateStatus("happiness", 20); // Increase happiness
        updateStatus("hunger", -5); // Decrease hunger slightly
      },
      interactionTime: 4000, // 4 seconds
    },
    {
      id: "clean",
      name: "Clean House", //DAPET UANG, hygene down
      position: { x: mapWidth / 2 - 300, y: mapHeight / 2 + 350 },
      radius: 50,
      effect: () => {
        updateMoney(10000); // Earn money
        updateStatus("hygiene", -15); // Decrease hygiene (gets dirty while cleaning)
        updateStatus("happiness", 5); // Slight happiness increase from good deed
        updateStatus("hunger", -10); // Decrease hunger from exertion
      },
      interactionTime: 5000, // 5 seconds
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
      // Only check proximity if no progress bar is active
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
  }, [playerPos, isProgressBarActive]); // Add isProgressBarActive to dependencies

  // Progress Bar Logic (Copied from gameBorobudur.jsx and gameKuta.jsx)
  useEffect(() => {
    let interval;
    if (isProgressBarActive && activeInteraction) {
      setProgressBarValue(0);
      let currentProgress = 0;
      // Calculate step based on interactionTime to ensure it reaches 100%
      const step = activeInteraction.interactionTime > 0 ? 100 / (activeInteraction.interactionTime / 100) : 100;

      interval = setInterval(() => {
        currentProgress += step;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          activeInteraction.effect(); // Apply the effect when progress is 100%
          setIsProgressBarActive(false);
          setProgressBarValue(0);
          setActiveInteraction(null);
        }
        setProgressBarValue(currentProgress);
      }, 100); // Update every 100ms
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isProgressBarActive, activeInteraction]);

  const handleInteraction = () => {
    if (currentEvent) {
      if (currentEvent.path) {
        // If it's a navigation event
        navigate(currentEvent.path, {
          state: {
            spawnPoint: exitPoint,
            returnPoint: playerPos,
          },
        });
      } else if (currentEvent.effect && currentEvent.interactionTime > 0) {
        // If it's an interaction with a progress bar
        setIsProgressBarActive(true);
        setActiveInteraction(currentEvent);
      } else if (currentEvent.effect && currentEvent.interactionTime === 0) {
        // If it's an instant interaction
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
            <Link to="/game" state={{ spawnPoint: exitPoint }}>
              <button className="quitButton">
                <div className="circle">X</div>
              </button>
            </Link>
            <h1>PENGLIPURAN VILLAGE</h1>
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
                    {/* Gunakan state `hunger` untuk mengatur lebar */}
                    <div
                      key={`hunger-${hunger}`}
                      className="progressBar h-4"
                      style={{ width: `${hunger}%` }} // Atur lebar berdasarkan persentase hunger
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
                    {/* Gunakan state `sleep` untuk mengatur lebar */}
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
                    {/* Gunakan state `hygiene` untuk mengatur lebar */}
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
                    {/* Gunakan state `happiness` untuk mengatur lebar */}
                    <div
                      className="progressBar h-4"
                      style={{ width: `${happiness}%` }}
                      data-status="happy"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mapStatusContainer relative">
              <div className="absolute w-[900px] h-[530px] z-5">
                <DirectionalControls
                  keys={keys}
                  setKeys={setKeys}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                />
              </div>
              <div className="w-[900px] h-[530px] relative overflow-hidden p-[15px] rounded-[20px] bg-[linear-gradient(135deg,_#666,_#ccc,_#888)]">
                <div
                  className="absolute z-4"
                  style={{
                    left: `${playerPos.x + cameraPos.x}px`,
                    top: `${playerPos.y + cameraPos.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex flex-col items-center relative">
                    <div className="nameBackground mb-0">
                      <h2 className="text-sm font-bold text-white px-2 py-1 rounded-lg">
                        {character.name || "Your Character"}
                      </h2>
                    </div>

                    <img
                      id="charImage"
                      src={`/characters/${getCharacterImage(
                        character.color,
                        isMoving
                      )}`}
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

                <div className="w-full h-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0"
                    style={{
                      width: `${mapWidth}px`,
                      height: `${mapHeight}px`,
                      transform: `translate(${cameraPos.x}px, ${cameraPos.y}px)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <img
                      src="/map/villageMap.png"
                      alt="map"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute bottom-[360px] right-10 w-[150px] h-[150px] border-2 border-white rounded overflow-hidden bg-black z-20">
                  <img
                    src="/map/villageMap.png"
                    className="miniMapImage"
                    style={{ width: "100%", height: "150px" }}
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

                {/* Progress Bar Overlay */}
                {isProgressBarActive && activeInteraction ? (
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
                ) : null}

                {/* Location event (Modified to consider progress bar) */}
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
    </PreventArrowScroll>
  );
};

export default Village;