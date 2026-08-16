export type RoomType = {
  id: string
  name: string
  description: string
  price: number
  available: number
  numbers: string
}

export type LandingPageConfig = {
  id: string
  name: string
  tagline: string
  heroImage: string
  storyImage?: string
  ownerWhatsapp: string
  narrative: string[]
  rooms: RoomType[]
  amenities: {
    title: string
    description: string
  }[]
  mapUrl: string
  chipText: string
  faq: {
    question: string
    answer: string
  }[]
}

export const dalhousieConfig: LandingPageConfig = {
  id: "dalhousie-estate",
  name: "Dalhousie Estate",
  tagline: "Trade the noise for silence. Pine air, colonial stone, and slow mornings on the ridge.",
  heroImage: "/images/offthetrail7.jpeg",
  storyImage: "/images/offthetrail5.jpeg",
  ownerWhatsapp: "+919816315898",
  narrative: [
    "Dalhousie Estate isn't just a property; it's a return to form. Built with colonial stone and resting quietly against the ridgeline, it is designed for those who want to trade the noise of the city for the silence of the pines.",
    "Here, the mornings are slow. The mist rolls through the valleys before breakfast, and the evenings smell like woodsmoke and old forests. It is crafted for souls who appreciate the luxury of doing absolutely nothing, surrounded by everything that matters."
  ],
  rooms: [
    {
      id: "super_deluxe",
      name: "Super Deluxe",
      description: "Wake up to the ridge from your own balcony.",
      price: 4800,
      available: 4,
      numbers: "01–04"
    },
    {
      id: "deluxe",
      name: "Deluxe",
      description: "Attached balcony, sweeping valley views.",
      price: 4000,
      available: 2,
      numbers: "05–06"
    },
    {
      id: "standard",
      name: "Standard",
      description: "Window views, warm colonial interiors.",
      price: 3200,
      available: 4,
      numbers: "07–10"
    }
  ],
  amenities: [
    { title: "Colonial Stone", description: "Built in 1918, restored for modern comfort." },
    { title: "Pine Air", description: "Surrounded by a dense, private pine forest." },
    { title: "In-house Kitchen", description: "Fresh local meals prepared daily." },
    { title: "Ridge Views", description: "Uninterrupted valley panoramas." }
  ],
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13568.178326093405!2d75.9626359!3d32.5358052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391c89f5bc36e783%3A0xc34a169b12d5b62b!2sDalhousie%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  chipText: "10 Rooms · Dalhousie, HP · Est. Retreat",
  faq: [
    {
      question: "Check-in & Check-out",
      answer: "Check-in is at 2:00 PM, and check-out is at 11:00 AM. If you need a late check-out, please let us know during booking and we will accommodate if the estate is free."
    },
    {
      question: "Food & Dining",
      answer: "Breakfast is included with all rooms. We have an in-house kitchen that prepares fresh, local Himachali meals and standard continental fare for lunch and dinner upon request."
    },
    {
      question: "Pet Policy",
      answer: "We welcome well-behaved pets. Please inform us in advance so we can prepare accordingly. A small cleaning fee may apply."
    },
    {
      question: "Cancellation Policy",
      answer: "Full refund if cancelled 7 days prior to check-in. 50% refund if cancelled within 7 days. No-shows will be charged the full amount."
    }
  ]
}

// Stub for future Jibhi config
export const jibhiConfig: LandingPageConfig = {
  id: "jibhi-canopy-cottages",
  name: "Jibhi Canopy Cottages",
  tagline: "High above the Tirthan, where the canopy meets the sky.",
  heroImage: "/images/offthetrail7.jpeg", // Replace later
  storyImage: "/images/offthetrail5.jpeg", // Replace later
  ownerWhatsapp: "+919816315898",
  narrative: [
    "A retreat built into the pine canopy. Waking up here means eye-level views of the mist moving through the branches, far removed from the valley floor.",
    "Coming soon to Jibhi."
  ],
  rooms: [
    {
      id: "duplex",
      name: "Duplex Cottage (Duplex Room)",
      description: "Spacious multi-level stay in the canopy.",
      price: 4500,
      available: 0,
      numbers: ""
    },
    {
      id: "single",
      name: "Single Room",
      description: "Cozy retreat for solo travelers.",
      price: 2200,
      available: 0,
      numbers: ""
    }
  ],
  amenities: [
    { title: "Canopy Level", description: "Built high in the trees, eye-level with the mist." },
    { title: "Tirthan River", description: "Short trek down to the pristine waters." },
    { title: "Stargazing Deck", description: "Unobstructed views of the night sky." }
  ],
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13636.550186716075!2d77.348123!3d31.636605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3905a5a1f1073843%3A0xb35b44ec82bb2b45!2sJibhi%2C%20Himachal%20Pradesh%20175123!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  chipText: "2 Rooms · Jibhi, HP · Canopy Stay",
  faq: []
}
