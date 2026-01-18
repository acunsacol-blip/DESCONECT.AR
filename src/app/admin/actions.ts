'use server';

import { supabaseAdmin } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';

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
export async function blockDate(propertyId: string, date: Date) {
    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];

    const { error } = await supabaseAdmin
        .from('blocked_dates')
        .insert([{ property_id: propertyId, blocked_date: dateStr }]);

    if (error) {
        if (error.code === '23505') return; // Duplicate, ignore
        throw new Error(error.message);
    }
    revalidatePath('/admin/properties');
}

export async function unblockDate(propertyId: string, date: Date) {
    const dateStr = date.toISOString().split('T')[0];

    const { error } = await supabaseAdmin
        .from('blocked_dates')
        .delete()
        .eq('property_id', propertyId)
        .eq('blocked_date', dateStr);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/properties');
}

export async function getBlockedDates(propertyId: string) {
    const { data, error } = await supabaseAdmin
        .from('blocked_dates')
        .select('blocked_date')
        .eq('property_id', propertyId);

    if (error) throw new Error(error.message);
    return data.map(d => new Date(d.blocked_date));
}
