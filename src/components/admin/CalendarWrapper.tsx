'use client';

import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('./Calendar'), {
    ssr: false,
    loading: () => <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 w-full max-w-sm h-64 flex items-center justify-center text-slate-400">Cargando calendario...</div>
});

export default function CalendarWrapper({ propertyId, readOnly = false }: { propertyId: string, readOnly?: boolean }) {
    return <Calendar propertyId={propertyId} readOnly={readOnly} />;
}
