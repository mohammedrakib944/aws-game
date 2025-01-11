import { useState, useEffect } from "react";

const Timer = ({ start, onTimeUp }) => {
  const [seconds, setSeconds] = useState(100);

  useEffect(() => {
    if (start && seconds > 0) {
      const timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (seconds === 0) {
      onTimeUp();
    }
  }, [start, seconds, onTimeUp]);

  return (
    <h1 className="text-xl font-semibold">
      Timer: <span className="text-blue-600 text-2xl font-bold">{seconds}</span>
    </h1>
  );
};

export default Timer;
