import React, { useState, useEffect } from "react";

const TimerComponent = ({ initialSeconds = 60 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds === 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <div className="game-timer">
      {seconds > 0
        ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
            seconds % 60
          ).padStart(2, "0")}`
        : "00:00"}
    </div>
  );
};

export default TimerComponent;
