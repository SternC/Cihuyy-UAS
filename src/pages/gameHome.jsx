import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMovement } from "../components/controlLogic.jsx";
import DirectionalControls from "../components/directionalControl.jsx";
import { useCharacter } from "../components/characterContext.jsx";
import "./game.css";
import PreventArrowScroll from "../components/preventArrowScroll.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState(null);
  const { character } = useCharacter();

  const {
    position: playerPos,
    rotation,
    keys,
    isFlipped,
    setKeys,
    setIsFlipped,
    isMoving,
    setIsMoving,
  } = useMovement({ x: 1000, y: 1000 });

  const mapWidth = 1650;
  const mapHeight = 1650;
  const viewWidth = 900;
  const viewHeight = 530;

  const cameraClamp = {
    left: viewWidth / 2,
    right: mapWidth - viewWidth / 2,
    top: viewHeight / 2,
    bottom: mapHeight - viewHeight / 2,
  };

  const cameraX = Math.min(
    cameraClamp.right,
    Math.max(playerPos.x, cameraClamp.left)
  );
  const cameraY = Math.min(
    cameraClamp.bottom,
    Math.max(playerPos.y, cameraClamp.top)
  );

  const cameraPos = {
    x: -(cameraX - viewWidth / 2),
    y: -(cameraY - viewHeight / 2),
  };

  const locations = [
    {
      id: "shrine",
      name: "Shrine",
      position: { x: 200, y: 200 },
      radius: 50,
      path: "/shrine",
    },
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
      <div className="mainGameContainer">
        <div className="titleContainer">
          <Link to="/game">
            <button className="quitButton">
              <div className="circle">X</div>
            </button>
          </Link>
          <h1>HOME</h1>
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
                    className="progressBar h-4 w-1/2"
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

              <DirectionalControls
                keys={keys}
                setKeys={setKeys}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
              />

              <div className="absolute bottom-[360px] right-10 w-[150px] h-[150px] border-2 border-white rounded overflow-hidden bg-black z-20">
                <img
                  src="/map/homeMap.png"
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
                <button className="inventory-button">Inventory</button>
              </div>

              {currentEvent && (
                <div className="eventcontainer flex justify-center items-center">
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
    </PreventArrowScroll>
  );
};

export default Home;
