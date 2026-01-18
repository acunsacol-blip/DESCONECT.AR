import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import ImageCarousel from '@/components/ui/ImageCarousel';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
    let properties = [];

    try {
        // CRITICAL RULE: Filter properties where owner.status === 'active'
        // Supabase join query filter
        const { data, error } = await supabase
            .from('properties')
            .select('*, owners!inner(*)') // !inner enforces the filter on the joined table
            .eq('owners.status', 'active')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error || !data) throw error;
        properties = data;
    } catch (e) {
        // Fallback for demo mode without Supabase connection
        const { MOCK_PROPERTIES } = await import('@/lib/mockData');
        properties = MOCK_PROPERTIES;
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand/20 z-10"></div>
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-light rounded-full blur-[100px] opacity-20"></div>

                <div className="relative z-20 text-center text-white px-4 flex flex-col items-center">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8 group">
                        <img src="/logo.png?v=2" alt="Logo" className="h-24 md:h-32 w-auto hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Desconect.ar</h1>
                    </div>
                    <p className="text-xl md:text-2xl font-light text-slate-100 max-w-2xl mx-auto">
                        Tu refugio digital. Encuentra la paz en propiedades seleccionadas.
                    </p>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-slate-800 mb-12 border-l-4 border-brand pl-4">Destinos Disponibles</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties?.map((property: any) => (
                        <Link prefetch={false} href={`/properties/${property.id}`} key={property.id} className="group cursor-pointer">
                            <div className="glass-panel p-3 rounded-2xl h-full transition-transform duration-300 group-hover:-translate-y-2">
                                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                                    <ImageCarousel
                                        images={property.images}
                                        className="h-full rounded-none"
                                        autoPlayInterval={1000}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm z-10">
                                        ${property.price}/noche
                                    </div>
                                </div>

                                <div className="px-2 pb-2">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-brand transition-colors">{property.title}</h3>
                                    <div className="flex items-center text-slate-500 text-sm mb-4">
                                        <MapPin size={16} className="mr-1" />
                                        {property.location}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-slate-400 text-sm">Ver detalles</span>
                                        <div className="bg-slate-100 p-2 rounded-full group-hover:bg-brand group-hover:text-white transition-colors">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {properties?.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="mb-4">No hay propiedades disponibles en este momento.</p>
                    </div>
                )}
            </div>

            <WhatsAppButton />
        </div>
    );
}
