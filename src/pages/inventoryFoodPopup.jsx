import React from 'react';
import { Link } from 'react-router-dom';
import './inventory.css';

export const InventoryFoodPopup = ({ isOpened, onClose, onSwitchToTools }) => {
  if (!isOpened) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="typeContainer">
          <div className="typeMenu">
            <button className="typeButton" onClick={onSwitchToTools}>
              <img src='toolSymboll.png' className='Symbol' alt="Tools"/>
            </button>
            <button className="typeButton active">
              <img src='foodSymbol.png' className='Symbol' alt="Food"/>
            </button>
          </div>
        </div>
            
        <div className="itemContainer">
          <button className="itemButton">
            <img src='foodItem.png' className='item' alt="Food Item"/>
          </button>
          {[...Array(19)].map((_, i) => (
            <button key={i} className="itemButton"></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryFoodPopup;