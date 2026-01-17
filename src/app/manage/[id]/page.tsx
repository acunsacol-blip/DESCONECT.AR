import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Calendar from '@/components/admin/Calendar';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default async function ManagePropertyPage({ params }: { params: any }) {
    const { id } = await params;

    // Verify property exists
    const { data: property, error } = await supabaseAdmin
        .from('properties')
        .select('*, owners(name)')
        .eq('id', id)
        .single();

    if (error || !property) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand/10 text-brand rounded-full">
                        <ShieldCheck size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">Gestionar Disponibilidad</h1>
                <p className="text-slate-600 mb-6">{property.title}</p>

                <div className="bg-brand/5 p-4 rounded-xl border border-brand/10 mb-8 text-sm text-slate-700 text-left">
                    <p>Hola <strong>{property.owners?.name}</strong>,</p>
                    <p className="mt-2">Utiliza este calendario para marcar los días que tu propiedad está ocupada. Los cambios se reflejarán inmediatamente en la web.</p>
                </div>

                <div className="flex justify-center">
                    <Calendar propertyId={id} />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <Link href={`/properties/${id}`} className="text-sm text-brand hover:underline font-medium">
                        Ver publicación en la web &rarr;
                    </Link>
                </div>
            </div>
            <p className="mt-8 text-xs text-slate-400">Panel de Acceso Privado para Dueños | Desconect.ar</p>
        </div>
    );
}
