import React from 'react';
import './character.css';
import { useNavigate } from 'react-router-dom';


const CustomizationPage = () => {
  const navigate = useNavigate();
  

  const handleQuit = () => {
    navigate('/'); 
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
            <button className="menuButton">
              <div className="color red"></div>
            </button>
            <button className="menuButton">
              <div className="color blue"></div>
            </button>
            <button className="menuButton">
              <div className="color purple"></div>
            </button>
            <button className="menuButton">
              <div className="color cyan"></div>
            </button>
            <button className="menuButton">
              <div className="color brown"></div>
            </button>
          </div>
        </div>     
    
        <div className="char">
          <img src='charGIF.gif' className='character'/>        
        </div>
      </div>

      <button className="nextButton" onClick={() => navigate('/game')}>
          NEXT
      </button>

    </div>
  );
};

export default CustomizationPage;