import React from 'react';
import { Link } from 'react-router-dom';
import './inventory.css';

const InventoryFoodPage = () => {
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

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
        <div className="typeContainer">
          <div className="typeMenu">
            <Link to="/inventory">
              <button className="typeButton">
                <img src='toolSymboll.png' className='Symbol' alt="Tools"/>
              </button>
            </Link>
            <Link to="/inventoryfood">
              <button className="typeButton">
                <img src='foodSymbol.png' className='Symbol symbol' alt="Food"/>
              </button>
            </Link>
          </div>
        </div> 
        
        <div className="itemContainer">
          <button className="itemButton">
            <img src='apple.png' className='item' alt="Apple"/>
          </button>
          {[...Array(19)].map((_, i) => (
            <button key={i} className="itemButton"></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryFoodPage;
