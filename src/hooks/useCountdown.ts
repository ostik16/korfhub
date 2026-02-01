import { useEffect, useState } from "react";

const useCountdown = (targetDate: number, timerRunning: boolean) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      setCountDown(distance);

      // Stop the timer if we reach zero
      if (distance < 0) {
        clearInterval(interval);
        setCountDown(0);
      }
    }, 100); // 50fps

    return () => clearInterval(interval);
  }, [countDownDate, timerRunning]);

  const [minutes, seconds] = getIndividualTimeElements(countDown);

  if (minutes == 0) {
    return Number(countDown / 1000)
      .toFixed(1)
      .padStart(2, "0");
  }

  return `${format(minutes)}:${format(seconds)}`;
};

const format = (num: number | undefined) => String(num).padStart(2, "0");

const getIndividualTimeElements = (countDown: number) => {
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [minutes, seconds];
};

export { useCountdown };
