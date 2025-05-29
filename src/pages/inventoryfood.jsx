import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './inventory.css';
import { InventoryPopup } from './inventoryPopUp';

const InventoryFoodPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className='mainInventoryContainer'>
      <div className="titleContainer">
        <Link to="/">
          <button className="quitButton">
            <div className="circle">X</div>
          </button>
        </Link>
        <h1>Inventory</h1>
        
        <button 
          onClick={() => setShowPopup(true)}
          className="open-popup-btn"
        >
          Open Popup
        </button>
      </div>

      <InventoryPopup isOpened={showPopup} onClose={() => setShowPopup(false)}>
        <div className="inventoryContainer w-[1000px] max-h-[700px]">   
          <div className="typeContainer">
            <div className="typeMenu">
              <Link to="/inventory">
                <button className="typeButton">
                  <img src='toolSymboll.png' className='Symbol'/>
                </button>
              </Link>
              <Link to="/inventoryfood">
                <button className="typeButton">
                  <img src='foodSymbol.png' className='Symbol symbol'/>
                </button>
              </Link>
            </div>
          </div> 
          
          <div className="itemContainer">
            <button className="itemButton">
              <img src='apple.png' className='item'/>
            </button>
            {[...Array(19)].map((_, i) => (
              <button key={i} className="itemButton"></button>
            ))}
          </div>
        </div>
      </InventoryPopup>

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
      </div>
    </div>
  );
};

export default InventoryFoodPage;