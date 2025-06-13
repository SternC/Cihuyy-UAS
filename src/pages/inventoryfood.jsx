import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './inventory.css';
import InventoryFoodPopup from '../pages/inventoryFoodPopUp.jsx';

const InventoryFood = () => {
  const [isOpened, setIsOpened] = useState(true); 

  return (
    <div className="mainInventoryContainer">
      <div className="titleContainer">
        <Link to="/">
          <button className="quitButton">
            <div className="circle">X</div>
          </button>
        </Link>
        <h1>Food Inventory</h1>
      </div>

      <InventoryFoodPopup 
        isOpened={isOpened} 
        onClose={() => setIsOpened(false)}
        onSwitchToTools={() => {
          // Navigate back to tools inventory
          window.location.href = '/inventory';
        }}
      />

      <div className="inventoryContainer w-[1000px] max-h-[700px]">
        <div className="typeContainer">
          <div className="typeMenu">
            <button 
              className="typeButton"
              onClick={() => {
                // Navigate to tools inventory
                window.location.href = '/inventory';
              }}
            >
              <img src="toolSymboll.png" className="Symbol" alt="Tools" />
            </button>
            <button className="typeButton active">
              <img src="foodSymbol.png" className="Symbol symbol" alt="Food" />
            </button>
          </div>
        </div>

        <div className="itemContainer">
          <button className="itemButton">
            <img src="foodItem.png" className="item" alt="Food Item" />
          </button>
          {[...Array(19)].map((_, i) => (
            <button key={i} className="itemButton"></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryFood;