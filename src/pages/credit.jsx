import React, { useEffect } from 'react';
import './start.css';
import { Link } from 'react-router-dom';
import './credit.css'

export default function Credit() {
  useEffect(() => {
    const video = document.querySelector('.video-bg');
    if (video) {
      video.play().catch(error => {
        console.log('Video play failed:', error);
      });
    }
  }, []);

  return (
    <div className="creditBody flex items-center flex-col lg:flex-row">
      <div className="menu">
        <div className="title">
          <h1>AMONG US</h1>
        </div>
        
        <div className="menuContainer lg:mr-[20px]">
          <div className="menu-frame">
            <Link to="/customChar"><button className="mirrorButton">PLAY</button></Link>
            <button className="mirrorButton">INVENTORY</button>
            <Link to="/"><button className="credit">BACK</button></Link>
          </div>
        </div>
      </div>
      
        <div className="videoContainer max-w-[460px] max-h-[263px] lg:max-w-[700px] lg:max-h-[400px]">
            <div className="videoFrame relative w-full h-full">
                <video autoPlay muted loop playsInline className="video-bg w-full h-full object-cover">
                        <source src="/Among Us ScreenSave.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4 z-10 bg-white/30">
                    <h2 className="text-2xl font-bold mb-4">Credits</h2>
                    <p>Created by: Cihuyy</p>
                    <p>Stern-00000136391</p>
                    <p>Willy-00000115707</p>
                    <p>Ceryne-00000135652</p>                    
                    <p>Dylon-00000115708</p>
                </div>
            </div>
        </div>
    </div>
  );
}