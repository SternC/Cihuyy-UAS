import React from 'react';
import { useNavigate } from 'react-router-dom';
import './inventory.css'

const InventoryFoodPage = () => {
  const navigate = useNavigate();
  

  const handleQuit = () => {
    navigate('/'); 
  };

  

  return (
    <div className='mainInventoryContainer'>
      <div className="titleContainer">
        <button className="quitButton" onClick={handleQuit}>
          <div className="circle">X</div>
        </button>
        <h1>Inventory</h1> 
      </div>

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
        <div className="typeContainer">
          <div className="typeMenu">
            <button className="typeButton" onClick={() => navigate('/inventory')}>
              <img src='toolSymboll.png' className='Symbol'/>
            </button>
            <button className="typeButton" onClick={() => navigate('/inventoryfood')}>
                <img src='foodSymbol.png' className='Symbol symbol'/>
            </button>
            
          </div>
        </div> 
            
            <div className="itemContainer">
                <button className="itemButton">
                    <img src='apple.png' className='item'/>
                </button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
                <button className="itemButton"></button>
            </div> 
      </div>
        
    </div>
  );
};

export default InventoryFoodPage;