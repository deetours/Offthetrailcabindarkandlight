import { createSupabaseServerClient } from './supabase/server'

export async function getTrips() {
    try {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('status', 'published')
            .not('name', 'is', null)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching trips:', error)
            return []
        }
        return (data || []).filter((trip: any) => trip.show_on_all_trips !== false)
    } catch (error) {
        console.error('Error fetching trips:', error)
        return []
    }
}

export async function getStays() {
    try {
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase
            .from('stays')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching stays:', error)
            return []
        }
        return data || []
    } catch (error) {
        console.error('Error fetching stays:', error)
        return []
    }
}
