export async function getTrips() {
    return [
        {
            id: 'demo-trip-1',
            name: 'Spiti Valley Circuit',
            status: 'published',
            show_on_all_trips: true,
            region: 'mountains',
            terrain: 'high-altitude',
            duration: 8,
            price: 24999,
            image_url: '/hero-campfire-spiti1.jpg',
            tagline: 'A journey through the middle land.'
        }
    ]
}

export async function getStays() {
    return [
        {
            id: 'dalhousie-estate',
            name: 'Dalhousie Estate',
            status: 'published',
            type: 'heritage',
            room_type: 'both',
            vibe: 'forest',
            location: 'Dalhousie, HP',
            price: 4000,
            image_url: '/hero1.png',
            tagline: 'Trade the noise for silence.'
        },
        {
            id: 'jibhi-canopy',
            name: 'Jibhi Canopy Cottages',
            status: 'published',
            type: 'cottage',
            room_type: 'both',
            vibe: 'forest',
            location: 'Jibhi, HP',
            price: 4500,
            image_url: '/offthetrail7.jpeg',
            tagline: 'Amongst the branches.'
        }
    ]
}
