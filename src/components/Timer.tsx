import { useState, useEffect, useCallback, useRef } from "react";

interface TimerProps {
  isRunning: boolean;
  onTimeUp: () => void;
  duration: number; // in seconds
}

export function Timer({ isRunning, onTimeUp, duration }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 10);
  const lastUpdateTimeRef = useRef(0);
  const requestRef = useRef<number>();
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const animate = useCallback((time: number) => {
    if (!isRunningRef.current) return;

    if (lastUpdateTimeRef.current === 0) {
      lastUpdateTimeRef.current = time;
    }

    const deltaTime = time - lastUpdateTimeRef.current;

    if (deltaTime >= 100) {
      // Update every 100ms
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
      lastUpdateTimeRef.current = time;
    }

    if (isRunningRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [onTimeUp]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      lastUpdateTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, timeLeft, animate]);

  const seconds = Math.floor(timeLeft / 10);
  const tenths = timeLeft % 10;

  return (
    <div className="text-2xl font-bold">
      {seconds}.{tenths}
    </div>
  );
}
