'use client';

import { MessageCircle } from 'lucide-react';
import { useWhatsApp } from '@/hooks/useWhatsApp';

export default function WhatsAppButton() {
    const phoneNumber = useWhatsApp();

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
