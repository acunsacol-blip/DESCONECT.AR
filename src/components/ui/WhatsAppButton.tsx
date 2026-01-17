'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const [phoneNumber, setPhoneNumber] = useState('541122551514'); // Default day number

    useEffect(() => {
        const calculateNumber = () => {
            // Get current time in Argentina (GMT-3)
            // We can use toLocaleString with timeZone
            const now = new Date();
            const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
            const currentHour = argentinaTime.getHours();

            // 09:00 to 21:00 -> +541122551514
            // 21:01 to 08:59 -> +542257552241

            if (currentHour >= 9 && currentHour < 21) {
                setPhoneNumber('541122551514');
            } else {
                setPhoneNumber('542257552241');
            }
        };

        calculateNumber();
        const interval = setInterval(calculateNumber, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-2 animate-bounce-slow"
        >
            <MessageCircle size={28} />
            <span className="font-semibold hidden md:inline">Consultar ahora</span>
        </a>
    );
}
