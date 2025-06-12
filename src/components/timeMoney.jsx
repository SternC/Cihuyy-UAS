// components/TimeMoney.jsx
import React from 'react';
import { useGame } from '../contexts/GameContext';

const TimeMoney = () => {
  const { time, money } = useGame();

  // Format uang dengan separator ribuan
  const formattedMoney = new Intl.NumberFormat('id-ID').format(money);

  return (
    <div className="timeMoney">
      <div className="timeContainer">
        <span className="timeText">Time: {time}</span>
      </div>
      <div className="moneyContainer">
        <span className="moneyText">Money: {formattedMoney}</span>
      </div>
    </div>
  );
};

export default TimeMoney;