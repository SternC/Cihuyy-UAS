import React from 'react';
import { Link } from 'react-router-dom';
import './inventory.css'

const InventoryPage = () => {
  return (
    <div className='mainInventoryContainer'>
      <div className="titleContainer">
        <Link to="/"><button className="quitButton"><div className="circle">X</div></button></Link>
        <h1>Inventory</h1> 
      </div>

      <div className="inventoryContainer w-[1000px] max-h-[700px]">   
        <div className="typeContainer">
          <div className="typeMenu">
            <Link to="/inventory"><button className="typeButton"><img src='toolSymboll.png' className='Symbol'/></button></Link>
            <Link to="/inventoryfood"><button className="typeButton"><img src='foodSymbol.png' className='Symbol symbol'/></button></Link>
          </div>
        </div> 
            
            <div className="itemContainer">
                <button className="itemButton">
                    <img src='flashLight.png' className='item'/>
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

export default InventoryPage;