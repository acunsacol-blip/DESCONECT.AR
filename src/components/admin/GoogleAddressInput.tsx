'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

export default function GoogleAddressInput({ name, placeholder, required = false }: { name: string, placeholder?: string, required?: boolean }) {
    const [address, setAddress] = useState('');
    const [mapSrc, setMapSrc] = useState('');

    const handleSearch = () => {
        if (!address) return;
        // Use Google Maps Embed "Search" mode (unofficial/legacy or iframe logic)
        // t=k means satellite view (k=satellite, m=map, h=hybrid, p=terrain)
        // z=15 is zoom level
        const encoded = encodeURIComponent(address);
        setMapSrc(`https://maps.google.com/maps?q=${encoded}&t=k&z=15&ie=UTF8&iwloc=&output=embed`);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                    name={name}
                    type="text"
                    required={required}
                    className="w-full pl-10 pr-12 py-2 rounded-lg border border-slate-200"
                    placeholder={placeholder || "Buscar en Google Maps..."}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={handleSearch} // Auto-update on blur
                    list="common-locations" // Simple browser-based suggestion placeholder
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-2 top-1.5 p-1 text-slate-400 hover:text-brand transition-colors"
                >
                    <Search size={18} />
                </button>

                {/* Datalist for simple suggestions without API Key */}
                <datalist id="common-locations">
                    <option value="Pinamar, Buenos Aires" />
                    <option value="Cariló, Buenos Aires" />
                    <option value="Villa Gesell, Buenos Aires" />
                    <option value="Mar de las Pampas, Buenos Aires" />
                    <option value="Mar del Plata, Buenos Aires" />
                    <option value="Costa Esmeralda, Buenos Aires" />
                </datalist>
            </div>

            {/* Map Preview */}
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                {mapSrc ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={mapSrc}
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="Map Preview"
                    ></iframe>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
                        <MapPin size={32} />
                        <span className="text-sm">Escribe una dirección para ver el mapa satelital</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-400 mt-1">* La vista satelital se actualizará al escribir.</p>
        </div>
    );
}
