export const OFFTHETRAIL_DATA = {
  stays: [
    {
      id: "dalhousie",
      location: "Dalhousie",
      name: "The Dalhousie Estate",
      description: "10 secluded mountain rooms. Classic architecture overlooking the pines.",
      image: "/images/offthetrail7.jpeg",
      rooms: [
        {
          id: "super-deluxe",
          name: "Super Deluxe Room",
          description: "Attached balcony with panoramic valley views.",
          price: "Price available on enquiry"
        },
        {
          id: "deluxe",
          name: "Deluxe Room",
          description: "Attached balcony facing the forest.",
          price: "Price available on enquiry"
        },
        {
          id: "standard",
          name: "Standard Room",
          description: "Comfortable room without balcony, with large windows.",
          price: "Price available on enquiry"
        }
      ]
    },
    {
      id: "jibhi",
      location: "Jibhi",
      name: "Jibhi Canopy Cottages",
      description: "Duplex cottages and single rooms suspended in the forest.",
      image: "/images/offthetrail2.jpeg", // Replacing missing /Jibhi.jpg with a known existing image from public/images
      rooms: [
        {
          id: "duplex",
          name: "Duplex Cottage or Duplex Room",
          description: "Spacious multi-level stay in the canopy.",
          price: "₹4,500 per night including all taxes"
        },
        {
          id: "single",
          name: "Single Room",
          description: "Cozy retreat for solo travelers.",
          price: "₹2,200 per night (tax treatment to be confirmed)"
        }
      ]
    }
  ],
  journeys: [
    {
      id: "sural-bhatori",
      destination: "Pangi Valley",
      name: "Sural Bhatori Expedition",
      description: "A curated trek through vast green valleys to high-altitude monasteries.",
      type: "Expedition",
      image: "/images/suralbhatori.jpeg",
    }
  ],
  cafe: {
    title: "The Café Experience",
    description: "Slow mountain mornings. Food, warm drinks, and a calm place between stays and adventures.",
    images: [
      "/images/offthetrail8.jpeg", // Using existing images as placeholders
      "/images/offthetrail9.jpeg"
    ]
  },
  whatsapp_number: "917629877144"
};
