import { supabaseAdmin } from '@/lib/supabase';
import { addOwner, toggleOwnerStatus, deleteOwner } from '../actions';
import { UserPlus, UserX, UserCheck, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OwnersPage() {
    let owners = [];
    try {
        const { data, error } = await supabaseAdmin.from('owners').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        owners = data || [];
    } catch (e) {
        const { MOCK_OWNERS } = await import('@/lib/mockData');
        owners = MOCK_OWNERS;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Gestión de Dueños</h1>

            {/* Add Owner Form */}
            <div className="glass-panel p-6 rounded-xl mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserPlus size={20} className="text-brand" />
                    Nuevo Dueño
                </h2>
                <form action={addOwner} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre y Apellido</label>
                        <input name="name" type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Juan Pérez" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                        <input name="address" type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="Av. Libertador 1234" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                        <input name="phone" type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200" placeholder="+54 9 11..." />
                    </div>
                    <button type="submit" className="glass-button px-6 py-2 rounded-lg font-medium md:col-span-3 lg:col-span-1 lg:col-start-auto">Agregar</button>
                </form>
            </div>

            {/* Owners List */}
            <div className="grid gap-4">
                {owners?.map((owner: any) => (
                    <div key={owner.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg text-slate-800">{owner.name}</h3>
                            <div className="text-sm text-slate-500 mt-1">
                                <p className="flex items-center gap-1">📞 {owner.phone}</p>
                                {owner.address && <p className="flex items-center gap-1">📍 {owner.address}</p>}
                            </div>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {owner.status === 'active' ? 'Activo' : 'Suspendido'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <form action={toggleOwnerStatus.bind(null, owner.id, owner.status)}>
                                <button type="submit" className={`p-2 rounded-lg transition-colors ${owner.status === 'active'
                                    ? 'text-yellow-600 hover:bg-yellow-50'
                                    : 'text-green-600 hover:bg-green-50'
                                    }`} title={owner.status === 'active' ? 'Suspender' : 'Activar'}>
                                    {owner.status === 'active' ? <UserX size={20} /> : <UserCheck size={20} />}
                                </button>
                            </form>

                            <form action={deleteOwner.bind(null, owner.id)}>
                                <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar">
                                    <Trash2 size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                {owners?.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No hay dueños registrados.</p>
                )}
            </div>
        </div>
    );
}
