import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { MapPin, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import ImageCarousel from '@/components/ui/ImageCarousel';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Link from 'next/link';
import WhatsAppSidebarButton from '@/components/ui/WhatsAppSidebarButton';
import Calendar from '@/components/admin/Calendar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PropertyPage({ params }: { params: any }) {
    const { id } = await params;

    let property = null;

    try {
        const { data, error } = await supabase
            .from('properties')
            .select('*, owners!inner(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        property = data;
    } catch (e) {
        const { MOCK_PROPERTIES } = await import('@/lib/mockData');
        property = MOCK_PROPERTIES.find(p => p.id === id);
    }

    if (!property || property.owners.status !== 'active') {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Nav placeholder */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-bold text-brand">Desconect.ar</Link>
            </nav>

            <div className="max-w-7xl mx-auto px-4 pt-4">
                <ImageCarousel images={property.images} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">{property.title}</h1>
                        <div className="flex gap-4 text-slate-600 mb-8 border-b border-slate-200 pb-8">
                            <span className="flex items-center gap-1"><MapPin size={20} /> {property.location}</span>
                            {/* We could add generic stats here like "wifi", "pool" if we had them in DB */}
                        </div>

                        <div className="prose prose-slate max-w-none mb-12">
                            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Sobre este lugar</h2>
                            <p className="whitespace-pre-line text-lg text-slate-600 leading-relaxed">
                                {property.description}
                            </p>
                        </div>

                        {/* YouTube Video container */}
                        {property.youtube_id && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-semibold mb-4 text-slate-800">Video Tour</h2>
                                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube-nocookie.com/embed/${property.youtube_id}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Map Location */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Ubicación</h2>
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight={0}
                                    marginWidth={0}
                                    title="Ubicación Satelital"
                                ></iframe>
                            </div>
                            <p className="mt-2 text-slate-500 flex items-center gap-2"><MapPin size={16} /> {property.location}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-2xl sticky top-8">
                            <div className="flex items-baseline justify-between mb-8">
                                <span className="text-3xl font-bold text-slate-900">${property.price}</span>
                                <span className="text-slate-500">por noche</span>
                            </div>

                            <div className="bg-brand/5 p-4 rounded-xl border border-brand/10 mb-6">
                                <div className="flex gap-3 text-slate-700">
                                    <CalendarIcon className="text-brand shrink-0" />
                                    <p className="text-sm">
                                        Para consultar disponibilidad y reservas, contacta directamente con nosotros vía WhatsApp.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block text-center">Disponibilidad Actual</span>
                                <div className="flex justify-center">
                                    {/* Read-only calendar */}
                                    <div className="scale-90 origin-top">
                                        <Calendar propertyId={property.id} readOnly={true} />
                                    </div>
                                </div>
                            </div>

                            <WhatsAppSidebarButton />
                        </div>
                    </div>
                </div>
            </div>

            <WhatsAppButton />
        </div>
    );
}
