import { useCountdown } from "@/hooks/useCountdown";
import React from "react";

type Props = {
  startTimestamp: number;
  durationInSeconds: number;
  timerRunning: boolean;
};

const TimerDisplay = ({
  startTimestamp,
  durationInSeconds,
  timerRunning,
}: Props) => {
  // 1. Calculate the Target End Time
  // formula: start time + (duration * 1000ms)
  const targetDate = startTimestamp + durationInSeconds * 1000;

  // 2. Use the hook
  const time = useCountdown(targetDate, timerRunning);

  return (
    <div className="countdown-container">
      <div className="time-box">
        <span>{time}</span>
      </div>
    </div>
  );
};

export default TimerDisplay;
