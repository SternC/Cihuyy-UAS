import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './start.css';

const MenuComponent = () => {
  useEffect(() => {
    const video = document.querySelector('.video-bg');
    if (video) video.play().catch(console.error);
  }, []);

  return (
    <div className="startBody flex items-center flex-col lg:flex-row">
      <div className="menu">
        <div className="title">
          <h1>AMONG US</h1>
        </div>
        
        <div className="menuContainer lg:mr-[20px]">
          <div className="menu-frame">
            <Link to="/customChar"><button className="mirrorButton">PLAY</button></Link>
            <Link to="/inventory"><button className="mirrorButton">INVENTORY</button></Link>            
            <Link to="/credit"><button className="credit">CREDITS</button></Link>
          </div>
        </div>
      </div>
      
      <div className="videoContainer">
        <div className="videoFrame">
          <video autoPlay muted loop playsInline className="video-bg">
            <source src="Among Us ScreenSave.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default MenuComponent;