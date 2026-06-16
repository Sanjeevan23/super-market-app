import { useState, useEffect, useRef, useCallback } from "react";

export const useCountdownTimer = (durationSeconds: number) => {
    const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clear = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const start = useCallback(() => {
        clear();
        setSecondsLeft(durationSeconds);
        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clear();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [durationSeconds]);

    useEffect(() => {
        start();
        return clear;
    }, [start]);

    const formatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

    return { secondsLeft, formatted, isExpired: secondsLeft === 0, restart: start };
};
