'use server';

import { supabaseAdmin } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function uploadFile(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Diagnostic check for service key
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key';
    if (!hasServiceKey) {
        throw new Error('Configuración incompleta: Falta la SUPABASE_SERVICE_ROLE_KEY en las variables de entorno para permitir subidas.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `property-images/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
        .from('properties')
        .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('properties')
        .getPublicUrl(filePath);

    return publicUrl;
}

// OWNERS ACTIONS
export async function addOwner(formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    const { error } = await supabaseAdmin
        .from('owners')
        .insert([{ name, phone, address, status: 'active' }]);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/owners');
}

export async function toggleOwnerStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    const { error } = await supabaseAdmin
        .from('owners')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/owners');
}

export async function deleteOwner(id: string) {
    const { error } = await supabaseAdmin
        .from('owners')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/owners');
}

// PROPERTIES ACTIONS
export async function addProperty(formData: FormData) {
    const owner_id = formData.get('owner_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const location = formData.get('location') as string;
    const youtube_id = formData.get('youtube_id') as string;

    const imagesStr = formData.get('images') as string;
    const images = imagesStr ? imagesStr.split(',').map(s => s.trim()) : [];

    const { error } = await supabaseAdmin
        .from('properties')
        .insert([{
            owner_id,
            title,
            description,
            price: parseFloat(price),
            location,
            youtube_id,
            images
        }]);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/properties');
}

export async function updateProperty(id: string, formData: FormData) {
    const owner_id = formData.get('owner_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const location = formData.get('location') as string;
    const youtube_id = formData.get('youtube_id') as string;

    const imagesStr = formData.get('images') as string;
    const images = imagesStr ? imagesStr.split(',').map(s => s.trim()) : [];

    const { error } = await supabaseAdmin
        .from('properties')
        .update({
            owner_id,
            title,
            description,
            price: parseFloat(price),
            location,
            youtube_id,
            images
        })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/properties');
    redirect('/admin/properties');
}

export async function deleteProperty(id: string) {
    const { error } = await supabaseAdmin
        .from('properties')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/properties');
}

export async function togglePropertyStatus(id: string, currentStatus: boolean) {
    const { error } = await supabaseAdmin
        .from('properties')
        .update({ is_published: !currentStatus })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/properties');
}

// BLOCKED DATES ACTIONS
export async function blockDate(propertyId: string, dateStr: string) {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return { error: 'Falta la llave de servicio (SUPABASE_SERVICE_ROLE_KEY) en la configuración de Vercel.' };
        }

        const { error } = await supabaseAdmin
            .from('blocked_dates')
            .insert([{ property_id: propertyId, blocked_date: dateStr }]);

        if (error) {
            if (error.code === '23505') {
                const data = await getBlockedDates(propertyId);
                return { data };
            }
            return { error: `Error de base de datos (${error.code}): ${error.message}` };
        }

        const data = await getBlockedDates(propertyId);
        return { data };
    } catch (e: any) {
        return { error: `Excepción en el servidor: ${e.message || 'Error desconocido'}` };
    }
}

export async function unblockDate(propertyId: string, dateStr: string) {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return { error: 'Falta la llave de servicio (SUPABASE_SERVICE_ROLE_KEY) en la configuración de Vercel.' };
        }

        const { error } = await supabaseAdmin
            .from('blocked_dates')
            .delete()
            .eq('property_id', propertyId)
            .eq('blocked_date', dateStr);

        if (error) {
            return { error: `Error de base de datos: ${error.message}` };
        }

        const data = await getBlockedDates(propertyId);
        return { data };
    } catch (e: any) {
        return { error: `Excepción en el servidor: ${e.message || 'Error desconocido'}` };
    }
}

export async function getBlockedDates(propertyId: string) {
    const { data, error } = await supabaseAdmin
        .from('blocked_dates')
        .select('blocked_date')
        .eq('property_id', propertyId);

    if (error) throw new Error(error.message);

    // Return strings YYYY-MM-DD for simpler serialization
    return (data || []).map(d => d.blocked_date);
}
