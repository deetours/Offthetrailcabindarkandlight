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
            id: 'dalhousie',
            name: 'Dalhousie Estate',
            status: 'published',
            type: 'heritage',
            room_type: 'both',
            roomType: 'both',
            vibe: 'forest',
            location: 'Dalhousie, HP',
            price: 3200,
            image: '/images/offthetrail7.jpeg',
            image_url: '/images/offthetrail7.jpeg',
            tagline: 'Trade the noise for silence.',
            stayStory: 'Ten rooms along Bakrota Ridge. Trade the noise for silence.'
        },
        {
            id: 'jibhi-canopy',
            name: 'Jibhi Canopy Cottages',
            status: 'published',
            type: 'cottage',
            room_type: 'both',
            roomType: 'both',
            vibe: 'forest',
            location: 'Jibhi, HP',
            price: 4500,
            image: '/Jibhi.jpg',
            image_url: '/Jibhi.jpg',
            tagline: 'Amongst the branches.',
            stayStory: 'Duplex cottages and single rooms suspended in the forest canopy.'
        }
    ]
}
