import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacter } from '../components/characterContext.jsx';
import './character.css';

const CustomizationPage = () => {
  const { character, setCharacter } = useCharacter();
  const navigate = useNavigate();

  const characterSkins = {
    red: 'characters/charGIF6.gif',
    blue: 'characters/charGIF4.gif',
    purple: 'characters/charGIF.gif',
    cyan: 'characters/charGIF2.gif',
    brown: 'characters/charGIF5.gif'
  };

  const handleQuit = () => {
    navigate('/'); 
  };

  const handleColorSelect = (color) => {
    setCharacter(prev => ({ ...prev, color }));
  };

  const handleNameChange = (e) => {
    setCharacter(prev => ({ ...prev, name: e.target.value }));
  };

  return (
    <div className='mainContainer'>
      <div className="titleContainer">
        <button className="quitButton" onClick={handleQuit}>
          <div className="circle">X</div>
        </button>
        <h1>Character</h1> 
      </div>

      <div className="container">   
        <div className='colorContainer'>
          <h2>Color</h2>
          <div className="charMenu">
            <button className="menuButton" onClick={() => handleColorSelect('red')}>
              <div className="color red"></div>
            </button>
            <button className="menuButton" onClick={() => handleColorSelect('blue')}>
              <div className="color blue"></div>
            </button>
            <button className="menuButton" onClick={() => handleColorSelect('purple')}>
              <div className="color purple"></div>
            </button>
            <button className="menuButton" onClick={() => handleColorSelect('cyan')}>
              <div className="color cyan"></div>
            </button>
            <button className="menuButton" onClick={() => handleColorSelect('brown')}>
              <div className="color brown"></div>
            </button>
          </div>
        </div>     
    
        <div className="char">
          <img src={characterSkins[character.color]} className='character' alt={`Character ${character.color} skin`}/>
          <div className="charName">
            <input 
              type="text" 
              placeholder="Character Name" 
              value={character.name}
              onChange={handleNameChange}
            />
          </div>
        </div>
      </div>

      <button className="nextButton" onClick={() => navigate('/game')}>
          NEXT
      </button>
    </div>
  );
};

export default CustomizationPage;