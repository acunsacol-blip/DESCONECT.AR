'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { blockDate, unblockDate, getBlockedDates } from '@/app/admin/actions';

interface CalendarProps {
    propertyId: string;
    readOnly?: boolean;
}

export default function Calendar({ propertyId, readOnly = false }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBlockedDates();
    }, [propertyId]);

    const loadBlockedDates = async () => {
        try {
            const strings = await getBlockedDates(propertyId);
            setBlockedDates(strings || []);
        } catch (e) {
            console.error("Failed to load dates", e);
        }
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isBlocked = (day: number) => {
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = formatDate(dateToCheck);
        return blockedDates.includes(dateStr);
    };

    const toggleDate = async (day: number) => {
        if (loading || readOnly) return;
        setLoading(true);

        const dateToToggle = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = formatDate(dateToToggle);
        const blocked = isBlocked(day);

        try {
            let result: { data?: string[], error?: string };
            if (blocked) {
                result = await unblockDate(propertyId, dateStr);
            } else {
                result = await blockDate(propertyId, dateStr);
            }

            if (result.error) {
                alert(`Error: ${result.error}`);
            } else if (result.data) {
                setBlockedDates(result.data);
            }
        } catch (e: any) {
            console.error(e);
            alert(`Error de conexión: ${e.message || "Error desconocido"}`);
            await loadBlockedDates();
        } finally {
            setLoading(false);
        }
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={20} /></button>
                <span className="font-semibold capitalize text-slate-700">{monthName}</span>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={20} /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 mb-2">
                <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const blocked = isBlocked(day);
                    return (
                        <button
                            key={day}
                            onClick={() => toggleDate(day)}
                            disabled={loading || readOnly}
                            className={`
                        aspect-square flex items-center justify-center rounded-md text-sm transition-all
                        ${blocked
                                    ? 'bg-red-100 text-red-600' + (!readOnly ? ' hover:bg-red-200 cursor-pointer' : ' cursor-default')
                                    : 'text-slate-700' + (!readOnly ? ' hover:bg-brand/10 hover:text-brand cursor-pointer' : ' cursor-default')}
                        ${!blocked && loading ? 'opacity-50' : ''}
                    `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100"></div> {readOnly ? 'No disponible' : 'Bloqueado'}</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded border border-slate-200"></div> {readOnly ? 'Disponible' : 'Libre'}</div>
            </div>
        </div>
    );
}
