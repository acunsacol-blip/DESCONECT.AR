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
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBlockedDates();
    }, [propertyId]);

    const loadBlockedDates = async () => {
        try {
            const dates = await getBlockedDates(propertyId);
            setBlockedDates(dates);
        } catch (e) {
            console.error("Failed to load dates", e);
        }
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
        return blockedDates.some(d =>
            d.getDate() === dateToCheck.getDate() &&
            d.getMonth() === dateToCheck.getMonth() &&
            d.getFullYear() === dateToCheck.getFullYear()
        );
    };

    const toggleDate = async (day: number) => {
        if (loading || readOnly) return;
        setLoading(true);

        const dateToToggle = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const blocked = isBlocked(day);

        try {
            if (blocked) {
                await unblockDate(propertyId, dateToToggle);
                setBlockedDates(prev => prev.filter(d => d.getTime() !== dateToToggle.getTime()));
                await loadBlockedDates();
            } else {
                await blockDate(propertyId, dateToToggle);
                setBlockedDates(prev => [...prev, dateToToggle]);
                await loadBlockedDates();
            }
        } catch (e) {
            console.error(e);
            alert("Error updating date");
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
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100"></div> Bloqueado</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded border border-slate-200"></div> Libre</div>
            </div>
        </div>
    );
}
