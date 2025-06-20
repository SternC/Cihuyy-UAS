import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./game.css";
import PreventArrowScroll from "../components/preventArrowScroll";
import { useMoneyTime } from "../components/timeMoneyContext";
import { InventoryPopup } from "../pages/inventoryPopup.jsx";
import DirectionalControls from "../components/directionalControlSpace";
import GameOverScreen from "../components/gameOverScreen";

const SimpleProgressBar = ({ value }) => (
  <div style={{ width: "100%", height: "20px", backgroundColor: "#ddd" }}>
    <div
      style={{ width: `${value}%`, height: "100%", backgroundColor: "blue" }}
    />
  </div>
);

const TheGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showQuitModule, setShowQuitModule] = useState(false);

  // Game map dimensions
  const mapWidth = 3840;
  const mapHeight = 2160;
  const viewWidth = 900;
  const viewHeight = 530;

  // Default position
  const defaultPosition = { x: mapWidth / 2, y: mapHeight / 2 };

  // Player state - updated initialization
  const [playerPos, setPlayerPos] = useState(() => {
    if (location.state?.spawnPoint) {
      return location.state.spawnPoint;
    }
    return defaultPosition;
  });

  const [rotation, setRotation] = useState(0);
  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const [isMoving, setIsMoving] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const animationRef = useRef();

  // Ambil semua status dari useMoneyTime
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
  stopGame, // Add this
} = useMoneyTime();

  // Game locations
  const locations = [
    {
      id: "home",
      name: "Go to Home",
      position: { x: mapWidth / 2 - 1460, y: mapHeight / 2 + 625 },
      radius: 100,
      path: "/home",
      onEnter: () => updateStatus("sleep", 50), // Contoh: Menambah sleep 50 saat masuk Home
      exitPoint: { x: mapWidth / 2 - 1460, y: mapHeight / 2 + 525 }, // Example exit point
    },
    {
      id: "borobudur",
      name: "Go to Borobudur Temple",
      position: { x: 1915, y: 1180 },
      radius: 100,
      path: "/temple",
      onEnter: () => updateStatus("happiness", 30), // Contoh: Menambah happiness 30
      exitPoint: { x: 1915, y: 1280 }, // Example exit point
    },
    {
      id: "village",
      name: "Go to Penglipuran Village",
      position: { x: mapWidth / 2 - 645, y: mapHeight / 2 - 715 },
      radius: 100,
      path: "/village",
      onEnter: () => updateStatus("hygiene", 20), // Contoh: Menambah hygiene 20
      exitPoint: { x: mapWidth / 2 - 645, y: mapHeight / 2 - 615 }, // Example exit point
    },
    {
      id: "cave",
      name: "Go to Pindul Cave",
      position: { x: mapWidth / 2 + 1370, y: mapHeight / 2 - 90 },
      radius: 100,
      path: "/cave",
      onEnter: () => updateStatus("happiness", 20),
      exitPoint: { x: mapWidth / 2 + 1370, y: mapHeight / 2 + 10 }, // Example exit point
    },
    {
      id: "beach",
      name: "Go to Kuta Beach",
      position: { x: mapWidth / 2 + 900, y: mapHeight / 2 + 780 },
      radius: 100,
      path: "/beach",
      onEnter: () => updateStatus("happiness", 40),
      exitPoint: { x: mapWidth / 2 + 900, y: mapHeight / 2 + 680 }, // Example exit point
    },
  ];

  // Camera calculations
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

  // Player movement logic
  const updatePosition = useCallback(() => {
    const speed = 5;
    let dx = 0;
    let dy = 0;

    if (keys.ArrowUp || keys.w) dy -= speed;
    if (keys.ArrowDown || keys.s) dy += speed;
    if (keys.ArrowLeft || keys.a) dx -= speed;
    if (keys.ArrowRight || keys.d) dx += speed;

    if (dx !== 0 && dy !== 0) {
      const diagonalSpeed = speed * 0.7071;
      dx = dx > 0 ? diagonalSpeed : -diagonalSpeed;
      dy = dy > 0 ? diagonalSpeed : -diagonalSpeed;
    }

    if (dx !== 0 || dy !== 0) {
      const leftBound = 10;
      const rightBound = mapWidth - 100;
      const topBound = 10;
      const bottomBound = mapHeight - 100;
      setPlayerPos((prevPos) => ({
        x: Math.max(leftBound, Math.min(rightBound, prevPos.x + dx)),
        y: Math.max(topBound, Math.min(bottomBound, prevPos.y + dy)),
      }));

      setIsMoving(true);

      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 51.2;
      setRotation((prev) => {
        let diff = ((targetAngle - prev + 540) % 360) - 180;
        return prev + diff * 0.7;
      });
    } else {
      setIsMoving(false);
    }

    animationRef.current = requestAnimationFrame(updatePosition);
  }, [keys, mapWidth, mapHeight]);

  // Check nearby locations
  const checkNearbyLocations = useCallback(() => {
    const detectionRadius = 100;

    const nearbyLocation = locations.find((loc) => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - loc.position.x, 2) +
          Math.pow(playerPos.y - loc.position.y, 2)
      );
      return distance <= detectionRadius;
    });

    setCurrentEvent(nearbyLocation || null);
  }, [playerPos]);

  const handleNavigate = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (currentEvent) {
        // Trigger the location's onEnter effect
        currentEvent.onEnter();

        // Navigate to the location
        navigate(currentEvent.path, {
          state: {
            spawnPoint: currentEvent.exitPoint,
            returnPoint: playerPos,
          },
          replace: true,
        });
      }
    },
    [currentEvent, navigate, playerPos]
  );

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
      } else if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        setKeys((prev) => ({ ...prev, [e.key]: true }));
      } else if (e.key === "i" || e.key === "I") {
        setIsInventoryOpen((prev) => !prev);
      }
    };

    const handleKeyUp = (e) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
      } else if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        setKeys((prev) => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle mouse up globally
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
        d: false,
      });
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(updatePosition);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updatePosition]);

  // Check nearby locations when player moves
  useEffect(() => {
    checkNearbyLocations();
  }, [playerPos, checkNearbyLocations]);

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
            <Link to="/">
              <button className="quitButton">
                <div className="circle">X</div>
              </button>
            </Link>
            <h1>SPACE</h1>
          </div>

          <div className="gameContainer">
            {/* Status bars */}
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

            {/* Main game view */}
            <div className="mapStatusContainer">
              <div className="w-[900px] h-[530px] relative overflow-hidden p-[15px] rounded-[20px] bg-[linear-gradient(135deg,_#666,_#ccc,_#888)]">
                {/* Player character */}
                <div
                  className="absolute z-10"
                  style={{
                    transform: `translate(${playerPos.x + cameraPos.x}px, ${
                      playerPos.y + cameraPos.y
                    }px) rotate(${rotation}deg)`,
                    transition: "transform 0.1s linear",
                  }}
                >
                  <img
                    src="rocket.png"
                    alt="Player"
                    style={{
                      width: "50px",
                      height: "auto",
                    }}
                  />
                </div>

                {/* Game map */}
                <div className="w-full h-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0"
                    style={{
                      width: `${mapWidth}px`,
                      height: `${mapHeight}px`,
                      transform: `translate(${cameraPos.x}px, ${cameraPos.y}px)`,
                    }}
                  >
                    <img
                      src="theMainSpace.png"
                      alt="Game Map"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                  </div>
                </div>

                {/* Direction controls */}
                <DirectionalControls
                  keys={keys}
                  setKeys={setKeys}
                  isFlipped={false}
                  setIsFlipped={() => {}}
                />

                {/* Mini map */}
                <div
                  className="miniMapContainer"
                  style={{
                    width: "150px",
                    height: "80px",
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    border: "2px solid white",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="theMainSpace.png"
                    className="miniMapImage"
                    alt="Mini Map"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: "0.8",
                    }}
                  />
                  <div
                    className="miniMapMarker"
                    style={{
                      position: "absolute",
                      width: "6px",
                      height: "6px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      left: `${(playerPos.x / mapWidth) * 100}%`,
                      top: `${(playerPos.y / mapHeight) * 85}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  ></div>
                </div>

                {/* Inventory button */}
                <div className="inventory-container">
                  <button
                    className="inventory-button"
                    onClick={() => setIsInventoryOpen(true)}
                    aria-label="Open inventory"
                  >
                    Inventory
                  </button>

                  <InventoryPopup
                    isOpened={isInventoryOpen}
                    onClose={() => setIsInventoryOpen(false)}
                  />
                </div>

                {/* Location event */}
                {currentEvent && (
                  <div className="eventcontainer flex justify-center items-center">
                    <button
                      onClick={handleNavigate}
                      onMouseDown={(e) => e.preventDefault()}
                      className="location-button"
                    >
                      {currentEvent.name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showQuitModule && (
        <QuitModule
          onConfirm={() => {
            stopGame();
            resetGame(); // Reset all stats
            navigate("/"); // Then navigate home
          }}
          onCancel={() => setShowQuitModule(false)}
        />
      )}
    </PreventArrowScroll>
  );
};

export default TheGame;
