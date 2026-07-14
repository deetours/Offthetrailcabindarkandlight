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
          description: "4 rooms available. Attached balcony with panoramic views.",
          price: "₹4,800 per night (including breakfast)"
        },
        {
          id: "deluxe",
          name: "Deluxe Room",
          description: "2 rooms available. Attached balcony.",
          price: "₹4,000 per night (including breakfast)"
        },
        {
          id: "standard",
          name: "Standard Room",
          description: "4 rooms available. Window room without balcony.",
          price: "₹3,200 per night (including breakfast)"
        }
      ]
    },
    {
      id: "jibhi",
      location: "Jibhi",
      name: "Jibhi Canopy Cottages",
      description: "Duplex cottages and single rooms suspended in the forest.",
      image: "/images/offthetrail2.jpeg",
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
  activities: [
    {
      id: "jibhi-zipline",
      location: "jibhi",
      title: "ZIP line at Jibhi",
      heroImage: "/stays/bir-1.jpg", // Placeholder until images are provided
      difficulty: "Challenging",
      duration: "2 Hours",
      season: "Closed from 1st Jul to 15th Sep",
      price: 750,
      description: "At Jibhi Adventure, we believe in delivering experiences that cut through the ordinary and glide straight into the extraordinary.",
      content: {
        introduction: "At Jibhi Adventure, we believe in delivering experiences that cut through the ordinary and glide straight into the extraordinary.",
        highlights: "Our signature 300-metre valley-to-valley zip line—the only one of its kind in the entire region—launches right from our headquarters and sweeps you across the Pushpabhadra River in a breathtaking arc of pure adrenaline. It's a seamless blend of gravity, engineering, and the wild charm of the Himalayas.",
        experience: "Zip lining is a simple yet electrifying pursuit: you're harnessed securely, clipped to a high-tension steel cable, and invited to surrender to gravity's gentle command. As you push off from the launch point, you drift above the valley, feeling the wind carve new stories around you—fast, free, and unforgettable.",
        safety: [
          { title: "Top-tier equipment", text: "Every participant is fitted with certified harnesses and helmets engineered for robust performance." },
          { title: "Expert guidance", text: "No previous experience? Perfect. Our trained instructors manage the technicals while you focus on the thrill." },
          { title: "Eligibility", text: "For safety considerations, children below 12 years of age are not permitted." }
        ],
        howItWorks: [
          "A pulley runs on a securely mounted, inclined steel cable.",
          "You're clipped in with a full-body harness, checked and rechecked by our instructors.",
          "Gravity does the rest—carrying you smoothly from the higher platform to the lower point across the valley.",
          "A specialized braking system, operated and supervised by our team, ensures a controlled, confident finish."
        ],
        timeNote: "Time taken for the activity 20 minutes for a group of 5 members."
      },
      inclusions: [
        "Safety Gear (Helmet, Harness)",
        "Instructor Guidance"
      ],
      exclusions: [
        "Transportation to the launch site",
        "Personal expenses"
      ],
      faqs: [
        { question: "Do I need previous experience?", answer: "No previous experience is required. Our instructors handle all the technical details." },
        { question: "Is there a weight limit?", answer: "Yes, for safety reasons, participants must be between 30kg and 100kg." }
      ],
      gallery: [
        "/stays/bir-2.jpg",
        "/stays/bir-3.jpg",
        "/stays/bir-4.jpg"
      ]
    },
    {
      id: "jibhi-paragliding",
      location: "jibhi",
      title: "Paragliding at Jibhi",
      heroImage: "/stays/bir-1.jpg", // Placeholder until images are provided
      difficulty: "Challenging",
      duration: "2 Hours",
      season: "Closed from 1st Jul to 15th Sep",
      price: 3500,
      description: "The exhilarating feeling of gliding silently over the mountains can be experienced on a two-seater Paraglider flight, even without prior knowledge.",
      content: {
        introduction: "The exhilarating feeling of gliding silently over the mountains can be experienced on a two-seater Paraglider flight, even without prior knowledge. Experience the joy rides and feel the wings that you have. Jibhi Adventure will fulfill your dreams of flying at Jibhi.",
        highlights: "The adventure of a lifetime. Tandem Paragliding is the best way to experience the thrill of free flight in the Western Himalayas for the first time. Whether you are an aspiring pilot interested in learning to speed fly, paraglide or just want to fly like a bird, a tandem paragliding flight is the way to get in the air.",
        experience: "This is free flight, not parasailing like you would see at the beach when on vacation. Anyone over 10 and less than 80 kg can fly. After conducting various test flights for the last four years, the site at Jibhi is certified for the commercial tandem flights by the concerned authorities.",
        safety: [
          { title: "Certified Site", text: "After conducting various test flights for the last four years, the site at Jibhi is certified for commercial tandem flights by the concerned authorities." },
          { title: "Eligibility", text: "For safety considerations, anyone over 10 years of age and less than 80 kg can fly." },
          { title: "Free Flight", text: "This is authentic free flight in the Western Himalayas, not basic beach parasailing." }
        ],
        howItWorks: [
          "Arrive at the Parking area.",
          "Take off point: Tandi Village (5 minutes walk to the takeoff site from the Parking).",
          "Enjoy the tandem flight over the breathtaking Jibhi Valley.",
          "Landing: Jibhi Village (10 minutes walk from the Landing to the Parking)."
        ],
        timeNote: "Flight duration varies based on wind conditions."
      },
      inclusions: [
        "Tandem Paraglider Flight",
        "Professional Pilot",
        "Safety Gear"
      ],
      exclusions: [
        "Transportation to the parking site",
        "Video and photography (usually available for extra cost)"
      ],
      faqs: [
        { question: "Is there an age or weight limit?", answer: "Yes, participants must be over 10 years of age and weigh less than 80 kg." },
        { question: "Do I need previous experience?", answer: "No prior knowledge is required. You will be flying tandem with a professional pilot." }
      ],
      gallery: [
        "/stays/bir-2.jpg",
        "/stays/bir-3.jpg",
        "/stays/bir-4.jpg"
      ]
    },
    {
      id: "jibhi-bird-watching",
      location: "jibhi",
      title: "Bird Watching",
      heroImage: "/stays/bir-1.jpg", // Placeholder
      difficulty: "Easy",
      duration: "3 Hours",
      season: "Mar - Jun, Aug-Sep",
      price: 1200,
      description: "The point of bird watching is not the actual seeing of the birds, but the cultivation of patience.",
      content: {
        introduction: "The point of bird watching is not the actual seeing of the birds, but the cultivation of patience.",
        highlights: "Jibhi offers a very diverse base for birding enthusiasts. Habitats varying from water bodies, dense forests to open alpine meadows where you can easily spot 25-30 different species of native and migratory birds.",
        experience: "Of course, each time we set out, there's a certain amount of expectation we'll see something, maybe even a species we've never seen before, and that it will fill us with light. But even if we don't see anything remarkable – and sometimes that happens – we come home filled with light anyway.",
        safety: [
          { title: "Native & Migratory Birds", text: "Spot common birds like yellow boiled magpie, tree pie, brown dipper, red start, tits, finches, fork tail, bulbul, dove, pigeon, drongos, Jungle fowls, Crested Kingfisher, Blue Whistling Thrush, White-crested Kaleej, and Himalayan Griffon vulture." },
          { title: "No Experience Required", text: "This is a seasonal activity suitable for all. No prior bird watching experience is needed." }
        ],
        howItWorks: [
          "Meet at the office for a brief introduction and tour instructions.",
          "Gear up and get ready for the trail.",
          "Follow your guide through some of the most amazing bird life and scenic landscapes in the surroundings of the Jibhi/Tirthan area."
        ],
        timeNote: "Tour lasts for approximately 3 hours."
      },
      inclusions: [
        "Expert Birding Guide",
        "Basic Binoculars"
      ],
      exclusions: [
        "Personal expenses",
        "Transportation to the meeting point"
      ],
      faqs: [
        { question: "Do I need to bring my own binoculars?", answer: "We recommend bringing your own for the best experience, though we may have some basic pairs available." },
        { question: "Is this activity physically demanding?", answer: "No, this is an easy 3-hour walk through scenic landscapes, suitable for most fitness levels." }
      ],
      gallery: [
        "/stays/bir-2.jpg",
        "/stays/bir-3.jpg",
        "/stays/bir-4.jpg"
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
      "/images/offthetrail8.jpeg",
      "/images/offthetrail9.jpeg"
    ]
  },
  whatsapp_number: "917629877144"
};
