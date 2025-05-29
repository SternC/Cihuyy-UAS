import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMovement } from "../components/controlLogic.jsx";
import DirectionalControls from "../components/directionalControl.jsx";
import { useCharacter } from "../components/characterContext.jsx";
import "./game.css";
import PreventArrowScroll from "../components/preventArrowScroll.jsx";


const Temple = () => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState(null);
  const { character } = useCharacter();

  const getCharacterImage = (color, isMoving) => {
    const characterImages = {
      red: isMoving ? "charGIF6.gif" : "charGIFStatic6.gif",
      blue: isMoving ? "charGIF4.gif" : "charGIFStatic4.gif",
      purple: isMoving ? "charGIF.gif" : "charGIFStatic.gif",
      cyan: isMoving ? "charGIF2.gif" : "charGIFStatic2.gif",
      brown: isMoving ? "charGIF5.gif" : "charGIFStatic5.gif",
    };
    return characterImages[color] || (isMoving ? "charGIF.gif" : "charGIFStatic.gif");
  };


  const mapBoundaries = {
    mapWidth: 1152,
    mapHeight: 1152,
    viewportWidth: 10,
    viewportHeight: 0,
  };

  const { minX, maxX, minY, maxY } = {
    minX: -(mapBoundaries.mapWidth - mapBoundaries.viewportWidth) / 2,
    maxX: (mapBoundaries.mapWidth - mapBoundaries.viewportWidth) / 2,
    minY: -(mapBoundaries.mapHeight - mapBoundaries.viewportHeight) / 2,
    maxY: (mapBoundaries.mapHeight - mapBoundaries.viewportHeight) / 2,
  };

  const {
    position: playerPos,
    rotation,
    keys,
    isFlipped,
    setKeys,
    setIsFlipped,
    isMoving, 
    setIsMoving 
  } = useMovement({ x: 0, y: 0 }, mapBoundaries);

  const cameraPos = { x: -playerPos.x, y: -playerPos.y };

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

  return (
    <PreventArrowScroll>
    <div className="mainGameContainer">
      <div className="titleContainer">
        <Link to="/">
          <button className="quitButton">
            <div className="circle">X</div>
          </button>
        </Link>
        <h1>Shrine</h1>
      </div>
      <div className="gameContainer">
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
            <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute text-center justify-center z-10">
              <div className="flex flex-col items-center relative">
                <div className="nameBackground mb-4 ">
                  <h2 className="text-xl font-bold text-white px-4 py-2 rounded-lg">
                    {character.name || "Your Character"}
                  </h2>
                </div>

                <img
                  id="charImage"
                  src={`/characters/${getCharacterImage(character.color, isMoving)}`}
                  alt="Character"
                  style={{
                    transform: `rotate(${rotation}deg) scale(2.5) ${
                      isFlipped ? "scaleX(-1)" : "scaleX(1)"
                    }`,
                    transition: "none",
                    left: isFlipped ? "20px" : "0",
                    transformOrigin: "center",
                  }}
                />
              </div>
            </div>

            <div className="w-full h-full overflow-hidden relative">
              <img
                src="/map/BorobudurMap.png"
                className="w-100% h-100% object-cover object-center"
                style={{
                  transform: `translate(${cameraPos.x}px, ${cameraPos.y}px) scale(2.5)`,
                  transformOrigin: "center",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>

            <DirectionalControls
              keys={keys}
              setKeys={setKeys}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />

            <div className="miniMapContainer">
              <img src="/map/BorobudurMap.png" className="miniMapImage" />
              <div
                className="miniMapMarker"
                style={{
                  left: `${((playerPos.x - minX) / (maxX - minX)) * 97}%`,
                  top: `${((playerPos.y - minY) / (maxY - minY)) * 94}%`,
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

export default Temple;
