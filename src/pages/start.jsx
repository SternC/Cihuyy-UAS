import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './start.css';

const MenuComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const video = document.querySelector('.video-bg');
    if (video) {
      video.play().catch(error => {
        console.log('Video play failed:', error);
      });
    }
  }, []);

  return (
    <div className="startBody flex items-center flex-col lg:flex-row">
      <div className="menu">
        <div className="title">
          <h1>AMONG US</h1>
        </div>
        
        <div className="menuContainer lg:mr-[20px]">
          <div className="menu-frame">
            <button className="mirrorButton"
                onClick={() => navigate('/customChar')}>
              PLAY</button>
            <button className="mirrorButton">INVENTORY</button>
            <button className="credit">CREDITS</button>
          </div>
        </div>
      </div>
      
      <div className="videoContainer max-w-[460px] max-h-[263px] lg:max-w-[700px] lg:max-h-[400px]">
        <div className="videoFrame">
          <video autoPlay muted loop playsInline className="video-bg ">
            <source src="Among Us ScreenSave.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default MenuComponent;