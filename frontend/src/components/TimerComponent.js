import React, { useState, useEffect } from "react";

const TimerComponent = ({ initialSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds === 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

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
