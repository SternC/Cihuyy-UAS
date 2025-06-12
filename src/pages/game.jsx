import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./game.css";
import PreventArrowScroll from "../components/preventArrowScroll";
import { InventoryPopup } from "../pages/inventoryPopUp.jsx";

const TheGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryType, setInventoryType] = useState("food");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const animationRef = useRef();

  const mapWidth = 3840;
  const mapHeight = 2160;
  const viewWidth = 900;
  const viewHeight = 530;

  // Player movement state
  const [playerPos, setPlayerPos] = useState({
    x: mapWidth / 2,
    y: mapHeight / 2,
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
  const locations = [
    {
      id: "home",
      name: "Home",
      position: { x: -1300, y: 540 },
      radius: 100,
      path: "/home",
    },
    {
      id: "borobudur",
      name: "Temple",
      position: { x: -35, y: 40 },
      radius: 100,
      path: "/temple",
    },
    {
      id: "village",
      name: "Penglipuran",
      position: { x: -590, y: -660 },
      radius: 100,
      path: "/village",
    },
    {
      id: "cave",
      name: "Pindul",
      position: { x: 1250, y: -60 },
      radius: 100,
      path: "/cave",
    },
    {
      id: "beach",
      name: "Kuta",
      position: { x: 800, y: 700 },
      radius: 100,
      path: "/beach",
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

  // Simple movement without velocity
  const updatePosition = () => {
    const speed = 8;
    let dx = 0;
    let dy = 0;

    if (keys.ArrowUp || keys.w) dy -= speed;
    if (keys.ArrowDown || keys.s) dy += speed;
    if (keys.ArrowLeft || keys.a) dx -= speed;
    if (keys.ArrowRight || keys.d) dx += speed;

    // Diagonal movement (normalize to same speed)
    if (dx !== 0 && dy !== 0) {
      const diagonalSpeed = speed * 0.7071; // 1/sqrt(2)
      dx = dx > 0 ? diagonalSpeed : -diagonalSpeed;
      dy = dy > 0 ? diagonalSpeed : -diagonalSpeed;
    }

    if (dx !== 0 || dy !== 0) {
      let newX = playerPos.x + dx;
      let newY = playerPos.y + dy;

      // Boundary checks
      newX = Math.max(0, Math.min(mapWidth, newX));
      newY = Math.max(0, Math.min(mapHeight, newY));

      setPlayerPos({ x: newX, y: newY });
      setIsMoving(true);

      // Update rotation based on movement direction
      if (dx !== 0 || dy !== 0) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setRotation(angle + 90); // +90 because rocket image points up by default
      }
    } else {
      setIsMoving(false);
    }

    animationRef.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
      } else if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        setKeys((prev) => ({ ...prev, [e.key]: true }));
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

    // Start the animation loop
    animationRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationRef.current);
    };
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
        d: false,
      });
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <PreventArrowScroll>
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
          <div className="timeMoney">
            <div className="timeContainer">
              <span className="timeText">Time: 12:00</span>
            </div>
            <div className="moneyContainer">
              <span className="moneyText">Money: 100.000</span>
            </div>
          </div>
          <div className="barContainer">
            <div className="divider">
              <div className="Bar flex items-center w-full">
                <img src="symbol/mealSymbol.png" className="w-6 h-6" />
                <div className="progressContain h-4">
                  <div
                    className="progressBar h-4 w-1/2 "
                    data-status="meal"
                  ></div>
                </div>
              </div>
              <div className="Bar flex items-center gap-2 w-full">
                <img src="symbol/sleepSymbol.png" className="w-6 h-6" />
                <div className="progressContain h-4">
                  <div
                    className="progressBar h-4 w-1/2"
                    data-status="sleep"
                  ></div>
                </div>
              </div>
            </div>

            <div className="divider">
              <div className="Bar flex items-center gap-2 w-full">
                <img src="symbol/cleanSymbol.png" className="w-6 h-6" />
                <div className="progressContain h-4">
                  <div
                    className="progressBar h-4 w-1/2"
                    data-status="hygiene"
                  ></div>
                </div>
              </div>
              <div className="Bar flex items-center gap-2 w-full">
                <img src="symbol/happySymbol.png" className="w-6 h-6" />
                <div className="progressContain h-4">
                  <div
                    className="progressBar h-4 w-1/2"
                    data-status="happy"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mapStatusContainer">
            <div className="w-[900px] h-[530px] relative overflow-hidden p-[15px] rounded-[20px] bg-[linear-gradient(135deg,_#666,_#ccc,_#888)]">
              <div
                className="absolute z-10"
                style={{
                  left: `${playerPos.x + cameraPos.x}px`,
                  top: `${playerPos.y + cameraPos.y}px`,
                  transform: "translate(-50%, -50%)",
                  transition: "left 0.1s linear, top 0.1s linear",
                }}
              >
                <img
                  id="charImage"
                  src="rocket.png"
                  alt="Rocket"
                  className="transition-transform duration-100"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: "60px",
                    height: "60px",
                  }}
                />
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
                    src="theMainSpace.png"
                    alt="map"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                  />
                </div>
              </div>

              <div className="direction">
                <div className="divider">
                  <button
                    onMouseDown={() =>
                      setKeys((prev) => ({ ...prev, ArrowUp: true }))
                    }
                    onMouseUp={() =>
                      setKeys((prev) => ({ ...prev, ArrowUp: false }))
                    }
                    onMouseLeave={() => {
                      if (keys.ArrowUp)
                        setKeys((prev) => ({ ...prev, ArrowUp: false }));
                    }}
                    style={{ userSelect: "none" }}
                  >
                    <img className="transform -rotate-90" src="direction.png" />
                  </button>
                </div>
                <div className="divider">
                  <button
                    onMouseDown={() =>
                      setKeys((prev) => ({ ...prev, ArrowLeft: true }))
                    }
                    onMouseUp={() =>
                      setKeys((prev) => ({ ...prev, ArrowLeft: false }))
                    }
                    onMouseLeave={() => {
                      if (keys.ArrowLeft)
                        setKeys((prev) => ({ ...prev, ArrowLeft: false }));
                    }}
                    style={{ userSelect: "none" }}
                  >
                    <img className="transform rotate-180" src="direction.png" />
                  </button>
                  <button
                    onMouseDown={() =>
                      setKeys((prev) => ({ ...prev, ArrowDown: true }))
                    }
                    onMouseUp={() =>
                      setKeys((prev) => ({ ...prev, ArrowDown: false }))
                    }
                    onMouseLeave={() => {
                      if (keys.ArrowDown)
                        setKeys((prev) => ({ ...prev, ArrowDown: false }));
                    }}
                    style={{ userSelect: "none" }}
                  >
                    <img className="transform rotate-90" src="direction.png" />
                  </button>
                  <button
                    onMouseDown={() =>
                      setKeys((prev) => ({ ...prev, ArrowRight: true }))
                    }
                    onMouseUp={() =>
                      setKeys((prev) => ({ ...prev, ArrowRight: false }))
                    }
                    onMouseLeave={() => {
                      if (keys.ArrowRight)
                        setKeys((prev) => ({ ...prev, ArrowRight: false }));
                    }}
                    style={{ userSelect: "none" }}
                  >
                    <img src="direction.png" />
                  </button>
                </div>
              </div>

              <div
                className="miniMapContainer"
                style={{
                  width: "150px",
                  height: "80px",
                  position: "absolute",
                  top: "20px", // Changed from bottom to top
                  right: "20px",
                  border: "2px solid white",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <img
                  src="theMainSpace.png"
                  className="miniMapImage"
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
                    top: `${(playerPos.y / mapHeight) * 100}%`,
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
              <div className="eventcontainer flex justify-center items-center">
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
    </PreventArrowScroll>
  );
};

export default TheGame;
