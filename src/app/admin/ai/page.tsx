'use client';

import { ExternalLink, Sparkles } from 'lucide-react';

export default function AIPage() {
    const aiUrl = "https://g.co/gemini/share/7501408224d8";

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="text-brand" />
                        Asistente AI (Eddy)
                    </h1>
                    <p className="text-slate-500">Utiliza a Eddy para generar descripciones, títulos o ideas para tus propiedades.</p>
                </div>
                <a
                    href={aiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                    <ExternalLink size={16} />
                    Abrir en pestaña nueva
                </a>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                {/* 
                    NOTE: Some Google links block embedding via 'X-Frame-Options: SAMEORIGIN'.
                    If the iframe below appears blank or says 'refused to connect', 
                    the user must use the 'Abrir en pestaña nueva' button.
                */}
                <iframe
                    src={aiUrl}
                    className="w-full h-full border-none"
                    title="Asistente AI Eddy"
                    allow="clipboard-write"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 -z-10">
                    <div className="text-center p-8">
                        <Sparkles size={48} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400">Cargando asistente...</p>
                        <p className="text-xs text-slate-400 mt-2">Si no carga, usa el botón de "Abrir en pestaña nueva".</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
