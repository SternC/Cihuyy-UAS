import React from "react";
import "./quitModule.css";

const QuitModule = ({ onConfirm, onCancel }) => {
  return (
    <div className="quit-module-overlay">
      <div className="quit-module-content">
        <h3>Are you sure you want to quit?</h3>
        <p>All progress will be reset.</p> {/* Updated message */}
        <div className="quit-module-buttons">
          <button className="quit-module-confirm" onClick={onConfirm}>
            Yes, Quit
          </button>
          <button className="quit-module-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitModule;