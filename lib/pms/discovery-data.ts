export interface MoodOption {
  label: string
  description: string
  icon: string
  emoji: string | null
  tag: string
  destinations: string[]
}

export const NORTHEAST_DESTINATIONS = [
  'Tawang',
  'Dirang',
  'Bomdila',
  'Meghalaya',
  'Sohra',
  'Dawki',
  'Shnongpdeng',
  'Nagaland',
  'Kohima',
  'Mon',
  'Longwa',
  'Ziro Valley',
  'Majuli',
  'Kaziranga',
  'Dzukou Valley',
] as const

export const NORTHEAST_STAY_TYPES = [
  'Mountain Homestay',
  'Boutique Hostel',
  'Workation Stay',
  'Village Stay',
  'Boutique Retreat',
  'Riverside Camp',
  'Cultural Homestay',
  'Roadside Basecamp',
] as const

export const NORTHEAST_TRIP_TYPES = [
  'Road Trip',
  'Cultural Journey',
  'Monastery Circuit',
  'Slow Travel Escape',
  'Group Departure',
  'Trek and Trail',
  'Festival Route',
  'Workation Circuit',
] as const

export const NORTHEAST_MOODS: MoodOption[] = [
  {
    label: 'Quiet Mountains',
    description: 'Highland stays and soft mountain mornings',
    icon: 'Mountain',
    emoji: null,
    tag: 'quiet-mountains',
    destinations: ['Tawang', 'Dirang', 'Bomdila'],
  },
  {
    label: 'Scenic Road Trip',
    description: 'Routes made for windows down and long bends',
    icon: 'Route',
    emoji: null,
    tag: 'scenic-road-trip',
    destinations: ['Tawang', 'Ziro Valley', 'Kaziranga'],
  },
  {
    label: 'Cultural Immersion',
    description: 'Closer to local stories, food, and rituals',
    icon: 'Landmark',
    emoji: null,
    tag: 'cultural-immersion',
    destinations: ['Nagaland', 'Majuli', 'Longwa'],
  },
  {
    label: 'Cloud Forests',
    description: 'Mist, cliffs, and rain-fed green routes',
    icon: 'CloudRain',
    emoji: null,
    tag: 'cloud-forests',
    destinations: ['Meghalaya', 'Sohra', 'Dawki'],
  },
  {
    label: 'Monastery Calm',
    description: 'Stillness, prayer flags, and quiet ridge towns',
    icon: 'Landmark',
    emoji: null,
    tag: 'monastery-calm',
    destinations: ['Tawang', 'Dirang', 'Bomdila'],
  },
  {
    label: 'River and Rain',
    description: 'Water-led stays, river towns, and damp air',
    icon: 'Waves',
    emoji: null,
    tag: 'river-and-rain',
    destinations: ['Dawki', 'Shnongpdeng', 'Majuli'],
  },
  {
    label: 'Social Stay',
    description: 'Shared tables, bonfires, and people-first rooms',
    icon: 'Users',
    emoji: null,
    tag: 'social-stay',
    destinations: ['Ziro Valley', 'Meghalaya', 'Nagaland'],
  },
  {
    label: 'Workation',
    description: 'Focused days with mountain air in the background',
    icon: 'Laptop',
    emoji: null,
    tag: 'workation',
    destinations: ['Ziro Valley', 'Dirang', 'Meghalaya'],
  },
  {
    label: 'Slow Travel',
    description: 'Longer stays and less itinerary pressure',
    icon: 'Clock3',
    emoji: null,
    tag: 'slow-travel',
    destinations: ['Tawang', 'Majuli', 'Ziro Valley'],
  },
  {
    label: 'Trek and Trail',
    description: 'Foot-led movement, ridgelines, and open air',
    icon: 'Footprints',
    emoji: null,
    tag: 'trek-and-trail',
    destinations: ['Dzukou Valley', 'Sohra', 'Tawang'],
  },
  {
    label: 'Festival Journey',
    description: 'Plan around cultural calendars and local energy',
    icon: 'CalendarHeart',
    emoji: null,
    tag: 'festival-journey',
    destinations: ['Nagaland', 'Ziro Valley', 'Majuli'],
  },
  {
    label: 'Offbeat Villages',
    description: 'Smaller places, quieter roads, and fewer crowds',
    icon: 'MapPinned',
    emoji: null,
    tag: 'offbeat-villages',
    destinations: ['Longwa', 'Dirang', 'Bomdila'],
  },
]

export const DISCOVERY_COPY = {
  headlines: [
    'Northeast stays and journeys, curated closer to the clouds.',
    'Find your stay, route, and rhythm across Northeast India.',
    'From Tawang homestays to Meghalaya road trips.',
  ],
  subheadlines: [
    'Stay closer to clouds, culture, and quiet roads across the Northeast.',
    'A calmer way to book mountain stays, road routes, and group departures.',
    'Curated stays and journeys across Northeast India, built around real places.',
  ],
  ctas: ['Start your Northeast search', 'Find stays and routes', 'Plan the quieter route'],
  placeholders: {
    stays: [
      'Try: workation stay in Ziro Valley',
      'Find mountain homestays in Tawang',
      'Search boutique stays in Meghalaya',
    ],
    trips: [
      'Search a Tawang road trip',
      'Find Meghalaya departures',
      'Try: Nagaland cultural journey',
    ],
    both: [
      'Search Tawang, Meghalaya, or an offbeat village stay',
      'Find a stay, route, or quieter mountain plan',
      'From monastery towns to river routes across the Northeast',
    ],
  },
  suggestions: [
    'Tawang mountain stays',
    'Meghalaya slow travel route',
    'Nagaland cultural journey',
    'Ziro Valley workation stay',
    'Dawki and Shnongpdeng river stay',
    'Dirang to Bomdila road route',
  ],
  emptyStates: [
    'No exact match yet. Try a nearby Northeast route or broader mood.',
    'Nothing matched this combination. Loosen the dates or switch the mood.',
    'We did not find that route yet. Try Tawang, Meghalaya, or Ziro Valley.',
  ],
}
