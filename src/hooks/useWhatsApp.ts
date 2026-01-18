'use client';

import { useState, useEffect } from 'react';

const DAY_NUMBER = '541122551514';
const NIGHT_NUMBER = '542257552241';

export function useWhatsApp() {
    const [phoneNumber, setPhoneNumber] = useState(DAY_NUMBER);

    useEffect(() => {
        const calculateNumber = () => {
            // Get current time in Argentina (GMT-3)
            const now = new Date();
            const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
            const currentHour = argentinaTime.getHours();

            // 09:00 to 21:00 -> Day Number
            // 21:01 to 08:59 -> Night Number
            if (currentHour >= 9 && currentHour < 21) {
                setPhoneNumber(DAY_NUMBER);
            } else {
                setPhoneNumber(NIGHT_NUMBER);
            }
        };

        calculateNumber();
        const interval = setInterval(calculateNumber, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return phoneNumber;
}
