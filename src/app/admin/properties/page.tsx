import { supabaseAdmin } from '@/lib/supabase';
import { addProperty, deleteProperty, togglePropertyStatus } from '../actions';
import { Plus, Trash2, MapPin, DollarSign, Youtube, Image as ImageIcon, Eye, EyeOff, Link as LinkIcon } from 'lucide-react';
import CalendarWrapper from '@/components/admin/CalendarWrapper';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
    let owners = [];
    let properties = [];

    try {
        const { data: ownersData } = await supabaseAdmin.from('owners').select('*').eq('status', 'active');
        owners = ownersData || [];

        const { data: propertiesData } = await supabaseAdmin
            .from('properties')
            .select('*, owners(name)')
            .order('created_at', { ascending: false });
        properties = propertiesData || [];
    } catch (e) {
        const { MOCK_OWNERS, MOCK_PROPERTIES } = await import('@/lib/mockData');
        owners = MOCK_OWNERS;
        properties = MOCK_PROPERTIES;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Gestión de Propiedades</h1>

            {/* Add Property Form */}
            <div className="glass-panel p-6 rounded-xl mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-brand" />
                    Nueva Propiedad
                </h2>
                <form action={addProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Dueño</label>
                        <select name="owner_id" required className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white">
                            <option value="">Seleccionar Dueño...</option>
                            {owners?.map((owner: any) => (
                                <option key={owner.id} value={owner.id}>{owner.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                        <input name="title" type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Casa moderna en el bosque..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Precio (Noche)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="price" type="number" required className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="location" type="text" required className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="Ej: Pinamar, Buenos Aires" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">YouTube ID</label>
                        <div className="relative">
                            <Youtube size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="youtube_id" type="text" className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="dQw4w9WgXcQ" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imágenes (URLs separadas por coma)</label>
                        <div className="relative">
                            <ImageIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="images" type="text" className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200" placeholder="https://..., https://..." />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <textarea name="description" className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24" placeholder="Detalles de la propiedad..." />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="glass-button px-6 py-2 rounded-lg font-medium">Publicar Propiedad</button>
                    </div>
                </form>
            </div>

            {/* Properties List */}
            <div className="grid gap-6">
                {properties?.map((property: any) => (
                    <div key={property.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800">{property.title}</h3>
                                        <p className="text-sm text-brand font-medium mb-2">{property.owners?.name || 'Sin Dueño'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <form action={togglePropertyStatus.bind(null, property.id, property.is_published)}>
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${property.is_published ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                                title={property.is_published ? "Desactivar" : "Activar"}
                                            >
                                                {property.is_published ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </form>
                                        <form action={deleteProperty.bind(null, property.id)}>
                                            <button className="text-red-400 hover:text-red-600 p-2"><Trash2 size={20} /></button>
                                        </form>
                                    </div>
                                </div>

                                <p className="text-slate-600 mb-4 line-clamp-2">{property.description}</p>

                                <div className="flex gap-4 text-sm text-slate-500 mb-4">
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {property.location}</span>
                                    <span className="flex items-center gap-1"><DollarSign size={16} /> ${property.price}/noc</span>
                                </div>

                                {/* Image Preview List */}
                                {property.images && property.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {property.images.map((img: string, i: number) => (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img key={i} src={img} alt={`Preview ${i}`} className="w-16 h-16 object-cover rounded-md border border-slate-100" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Calendar & Owner Link */}
                            <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col items-center w-full md:w-auto">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bloquear Fechas</span>
                                <CalendarWrapper propertyId={property.id} />

                                <div className="mt-4 pt-4 border-t border-slate-100 w-full">
                                    <p className="text-xs text-slate-400 mb-2 font-medium text-center">Enlace para el Dueño:</p>
                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                                        <LinkIcon size={14} className="text-slate-400 shrink-0" />
                                        <input
                                            readOnly
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/manage/${property.id}`}
                                            className="text-xs text-slate-600 bg-transparent w-full outline-none truncate font-mono select-all"
                                            onClick={(e) => e.currentTarget.select()}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 text-center">Copiar y enviar al dueño</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {properties?.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No hay propiedades registradas.</p>
                )}
            </div>
        </div>
    );
}
