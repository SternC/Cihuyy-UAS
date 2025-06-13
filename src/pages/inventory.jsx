import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './inventory.css';
import InventoryPopup from '../pages/inventoryPopup.jsx';
import InventoryFoodPopup from '../pages/inventoryFoodPopUp.jsx';

const InventoryPage = () => {
  const [activePopup, setActivePopup] = useState(null); // 'tools', 'food', or null

  const openInventory = (type) => {
    setActivePopup(type);
  };

  const closeInventory = () => {
    setActivePopup(null);
  };

  return (
    <div className='mainInventoryContainer'>
      <div className="titleContainer">
        <Link to="/">
          <button className="quitButton">
            <div className="circle">X</div>
          </button>
        </Link>
        <h1>Inventory</h1> 
      </div>

      {activePopup === 'tools' && (
        <InventoryPopup 
          isOpened={true}
          onClose={closeInventory}
          onSwitchToFood={() => openInventory('food')}
        />
      )}
      
      {activePopup === 'food' && (
        <InventoryFoodPopup 
          isOpened={true}
          onClose={closeInventory}
          onSwitchToTools={() => openInventory('tools')}
        />
      )}

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
        <div className="typeContainer">
          <div className="typeMenu">
            <button 
              className={`typeButton ${activePopup === 'tools' ? 'active' : ''}`}
              onClick={() => openInventory('tools')}
            >
              <img src='toolSymboll.png' className='Symbol' alt="Tools"/>
            </button>
            <button 
              className={`typeButton ${activePopup === 'food' ? 'active' : ''}`}
              onClick={() => openInventory('food')}
            >
              <img src='foodSymbol.png' className='Symbol symbol' alt="Food"/>
            </button>
          </div>
        </div> 
            
        <div className="itemContainer">
          {activePopup === 'tools' ? (
            <>
              <button className="itemButton">
                <img src='flashLight.png' className='item' alt="Flashlight"/>
              </button>
              {[...Array(19)].map((_, i) => (
                <button key={`tool-${i}`} className="itemButton"></button>
              ))}
            </>
          ) : (
            <>
              <button className="itemButton">
                <img src='foodItem.png' className='item' alt="Food Item"/>
              </button>
              {[...Array(19)].map((_, i) => (
                <button key={`food-${i}`} className="itemButton"></button>
              ))}
            </>
          )}
        </div> 
      </div>
    </div>
  );
};

export default InventoryPage;