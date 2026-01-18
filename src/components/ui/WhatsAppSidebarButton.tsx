'use client';

import { useWhatsApp } from '@/hooks/useWhatsApp';

export default function WhatsAppSidebarButton() {
    const phoneNumber = useWhatsApp();

    return (
        <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center glass-button py-4 rounded-xl font-bold text-lg"
        >
            Reservar Ahora (WhatsApp)
        </a>
    );
}
