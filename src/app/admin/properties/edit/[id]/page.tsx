import { supabaseAdmin } from '@/lib/supabase';
import { updateProperty } from '../../../actions';
import { MapPin, DollarSign, Youtube, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ImageUploadWrapper from '@/components/admin/ImageUploadWrapper';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: any }) {
    const { id } = await params;

    // Fetch property data
    const { data: property, error } = await supabaseAdmin
        .from('properties')
        .select('*, owners(name)')
        .eq('id', id)
        .single();

    if (error || !property) {
        redirect('/admin/properties');
    }

    // Fetch all active owners for the dropdown
    const { data: owners } = await supabaseAdmin
        .from('owners')
        .select('*')
        .eq('status', 'active');

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/properties" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Editar Propiedad</h1>
            </div>

            <div className="glass-panel p-6 rounded-xl">
                <form action={updateProperty.bind(null, id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Dueño</label>
                        <select name="owner_id" required defaultValue={property.owner_id} className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                            {owners?.map((owner: any) => (
                                <option key={owner.id} value={owner.id}>{owner.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                        <input name="title" type="text" required defaultValue={property.title} className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Casa moderna en el bosque..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Precio (Noche)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="price" type="number" required defaultValue={property.price} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="location" type="text" required defaultValue={property.location} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="Ej: Pinamar, Buenos Aires" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">YouTube ID</label>
                        <div className="relative">
                            <Youtube size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="youtube_id" type="text" defaultValue={property.youtube_id || ''} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="dQw4w9WgXcQ" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imágenes de la Propiedad</label>
                        <ImageUploadWrapper defaultValue={property.images || []} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <textarea name="description" defaultValue={property.description || ''} className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24" placeholder="Detalles de la propiedad..." />
                    </div>

                    <div className="md:col-span-2 flex gap-4 justify-end">
                        <Link href="/admin/properties" className="px-6 py-2 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 transition-colors">
                            Cancelar
                        </Link>
                        <button type="submit" className="glass-button px-6 py-2 rounded-lg font-medium">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
