import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './inventoryfood'
import './inventory.css';
import InventoryPopup from '../pages/inventoryPopUp.jsx"';

const InventoryPage = () => {
  const [isOpened, setIsOpened] = useState(false); // if you're using popup

  return (
    <div className='mainInventoryContainer'>
      <div className="titleContainer">
        <Link to="/"><button className="quitButton"><div className="circle">X</div></button></Link>
        <h1>Inventory</h1> 
      </div>

      <InventoryPopup isOpened={isOpened} onClose={() => setIsOpened(false)} />

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
        <div className="typeContainer">
          <div className="typeMenu">
            <Link to="/inventory">
              <button className="typeButton">
                <img src='toolSymboll.png' className='Symbol'/>
              </button>
            </Link>
            <Link to="/inventoryfood">
              <button className="typeButton" >
                <img src='foodSymbol.png' className='Symbol symbol'/>
              </button>
            </Link>
          </div>
        </div> 
            
        <div className="itemContainer">
          <button className="itemButton">
            <img src='flashLight.png' className='item'/>
          </button>
          {[...Array(19)].map((_, i) => (
            <button key={i} className="itemButton"></button>
          ))}
        </div> 
      </div>
    </div>
  );
};

export default InventoryPage;
