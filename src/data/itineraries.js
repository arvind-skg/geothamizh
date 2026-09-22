// =========================================================================
// GeoThamizh Curated 1-Day Heritage Itineraries
// Expert circuits with driving routes, schedule timings, and culinary stops
// =========================================================================

export const HERITAGE_ITINERARIES = [
  {
    id: 'great-living-chola-temples',
    title: 'The Great Living Chola Temples Circuit',
    tamilTitle: 'மாபெரும் சோழர் பெருங்கோயில்கள் ஒரு நாள் சுற்றுலா',
    duration: '1 Day (8 – 9 Hours)',
    totalDistanceKm: 110,
    idealBaseCity: 'Thanjavur / Kumbakonam',
    description: 'Traverse the UNESCO World Heritage triumvirate built across three centuries of imperial Chola apex: the monumental Thanjavur Big Temple, Gangaikonda Cholapuram, and the delicate stone carvings of Darasuram.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        order: 1,
        time: '07:30 AM – 10:00 AM',
        placeId: 'thanjavur',
        name: 'Brihadisvara Temple (தஞ்சைப் பெரிய கோயில்)',
        sub: 'Consecrated 1010 CE by Raja Raja Chola I',
        lat: 10.7828,
        lng: 79.1318,
        highlights: [
          '80-tonne monolithic granite Kumbam (dome capstone)',
          'Extensive Tamil inscription charters on temple plinth',
          'Magnificent 11th-century Chola fresco paintings in inner ambulatory'
        ],
        tip: 'Visit in early morning light when the golden granite captures the sunrise.'
      },
      {
        order: 2,
        time: '11:00 AM – 12:30 PM',
        placeId: 'darasuram',
        name: 'Airavatesvara Temple, Darasuram (தாராசுரம்)',
        sub: 'Built c. 1160 CE by Rajaraja Chola II',
        lat: 10.9575,
        lng: 79.3563,
        highlights: [
          'Carved chariot mandapam with stone galloping horses and wheels',
          'Musical steps (Saranga Padithurai) producing 7 musical swaras',
          'Miniature relief panels depicting all 63 Saivite Nayanmars'
        ],
        tip: 'Inspect the pillars under the Rajagopuram for delicate stone lace filigree.'
      },
      {
        order: 3,
        time: '12:45 PM – 02:00 PM',
        isCulinaryStop: true,
        name: 'Kumbakonam Heritage Lunch & Degree Coffee',
        sub: 'Traditional Kaveri Delta Feast',
        lat: 10.9602,
        lng: 79.3845,
        highlights: [
          'Authentic banana-leaf Kaveri vegetarian feast with Vadai & Mor Kuzhambu',
          'World-famous Kumbakonam Degree Coffee brewed with pure cow milk and brass dabarah-tumbler'
        ],
        tip: 'Stop near Mahamaham tank for fresh filter coffee.'
      },
      {
        order: 4,
        time: '03:15 PM – 05:30 PM',
        placeId: 'gangaikonda-cholapuram',
        name: 'Gangaikonda Cholapuram (கங்கைகொண்ட சோழபுரம்)',
        sub: 'Built c. 1035 CE by Rajendra Chola I',
        lat: 11.2061,
        lng: 79.4561,
        highlights: [
          'Feminine, undulating curvilinear vimana contrasting Thanjavur Big Temple',
          'Gigantic monolithic Navagraha slab and bronze Chandesa Anugraha Murti',
          'Remains of Cholagangam (Ponneri) royal reservoir'
        ],
        tip: 'Stay until late afternoon to catch the soft shadows cast by the vimana.'
      }
    ]
  },
  {
    id: 'ancient-vaigai-civilization-trail',
    title: 'Ancient Vaigai Civilization & Sangam Trail',
    tamilTitle: 'வைகை நதி நாகரிகம் மற்றும் சங்க காலத் தடம்',
    duration: '1 Day (7 Hours)',
    totalDistanceKm: 65,
    idealBaseCity: 'Madurai',
    description: 'Explore two millennia of continuous urban civilization along the sacred Vaigai river: from the lotus city of Madurai to the groundbreaking 6th-century BCE excavations at Keeladi.',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        order: 1,
        time: '07:00 AM – 09:30 AM',
        placeId: 'madurai',
        name: 'Meenakshi Sundareswarar Temple (மதுரை மீனாட்சி)',
        sub: 'Ancient Sangam Koodal & Nayaka Architectural Crown',
        lat: 9.9195,
        lng: 78.1193,
        highlights: [
          'Golden Lotus Tank (Potramarai Kulam) where Tamil poets tested verse',
          'Thousand Pillar Hall (Aayiram Kaal Mandapam) with musical pillars',
          'Concentric street layout reflecting Sangam city design described in Silappadikaram'
        ],
        tip: 'Smell the fresh Madurai Malli (jasmine) flower bazaar outside East Gate.'
      },
      {
        order: 2,
        time: '10:00 AM – 10:45 AM',
        isCulinaryStop: true,
        name: 'Madurai Famous Jigarthanda Refreshment',
        sub: 'Historic Cool Beverage of the Royal Madurai Nayakas',
        lat: 9.9180,
        lng: 78.1220,
        highlights: [
          'Traditional concoction of Almond gum (Badam Pisin), reduced basundi milk, and Nannari syrup',
          'Served ice cold in brass tumblers at South Masi Street'
        ],
        tip: 'Ask for the Special Jigarthanda with an extra scoop of creamy basundi.'
      },
      {
        order: 3,
        time: '11:15 AM – 01:30 PM',
        placeId: 'keeladi',
        name: 'Keeladi Archaeological Site & Museum (கீழடி)',
        sub: 'Sangam Era Urban Settlement (c. 6th century BCE – 2nd century CE)',
        lat: 9.8625,
        lng: 78.1906,
        highlights: [
          'Pottery inscribed with Tamil-Brahmi personal names (Aathan, Uthiran)',
          'Carnelian gem beads, gold ornaments, and ivory dice',
          'Brick drainage channels, terracotta ring wells, and weaving spindle whorls'
        ],
        tip: 'Visit the world-class Keeladi Site Museum to view the artifacts in person.'
      },
      {
        order: 4,
        time: '03:00 PM – 05:00 PM',
        placeId: 'mangulam',
        name: 'Mangulam Rock-Cut Jain Caves (மாங்குளம் கல்வெட்டுகள்)',
        sub: 'Oldest Tamil-Brahmi Inscriptions in India (c. 3rd – 2nd c. BCE)',
        lat: 10.0150,
        lng: 78.2430,
        highlights: [
          'Stone drip-ledge inscriptions explicitly naming Pandyan King Neduncheziyan',
          'Rock-cut beds of early ascetics overlooking the fertile plains',
          'Pristine panoramic vista of the surrounding granite boulder terrain'
        ],
        tip: 'Wear good walking shoes for the gentle 15-minute hillside trail.'
      }
    ]
  },
  {
    id: 'pallava-maritime-monuments-trail',
    title: 'Pallava Maritime & Rock-Cut Sanctuary Trail',
    tamilTitle: 'பல்லவர் கடற்கரை மற்றும் குடைவரைக் கோயில்கள் தடம்',
    duration: '1 Day (8 Hours)',
    totalDistanceKm: 75,
    idealBaseCity: 'Chennai / Kanchipuram',
    description: 'Experience the genesis of south Indian Dravidian stone temple architecture created by Mahendravarman I, Narasimhavarman I (Mamalla), and Rajasimha along the Bay of Bengal.',
    heroImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    stops: [
      {
        order: 1,
        time: '08:00 AM – 10:30 AM',
        placeId: 'mamallapuram',
        name: 'Shore Temple & Pancha Rathas (மாமல்லபுரம்)',
        sub: '7th–8th c. CE UNESCO Marvels facing oceanic waves',
        lat: 12.6160,
        lng: 80.1925,
        highlights: [
          'Arjuna’s Penance (Descent of the Ganges) open-air bas relief',
          'Monolithic monolithic rock-cut rathas chiseled from single diorite boulders',
          'Twin-shrine structural Shore Temple enduring oceanic salt spray'
        ],
        tip: 'Catch the sunrise reflecting against the Shore Temple stones.'
      },
      {
        order: 2,
        time: '11:00 AM – 12:30 PM',
        placeId: 'saluvankuppam',
        name: 'Tiger Cave & Submerged Murugan Shrine',
        sub: '7th c. CE Open Air Theatrical Pavilion',
        lat: 12.6650,
        lng: 80.2230,
        highlights: [
          'Yali head sculptures framing royal pavilion',
          'Remains of 2000-year-old Sangam brick temple discovered after 2004 tsunami'
        ],
        tip: 'Shaded casuarina grove makes for an idyllic coastal walk.'
      },
      {
        order: 3,
        time: '02:00 PM – 04:30 PM',
        placeId: 'kanchipuram',
        name: 'Kailasanathar Temple, Kanchipuram (காஞ்சி கைலாசநாதர்)',
        sub: 'Masterpiece of Rajasimha Pallava (c. 700 CE)',
        lat: 12.8420,
        lng: 79.6900,
        highlights: [
          '58 miniature sub-shrines surrounding the circumambulatory cloister',
          'Traces of ancient natural mineral plaster frescoes',
          'Calligraphic Pallava-Grantha inscriptions praising King Rajasimha'
        ],
        tip: 'World famous Kanchipuram mulberry silk weavers can be visited in the adjacent lanes.'
      }
    ]
  }
];

export const CURATED_ITINERARIES = HERITAGE_ITINERARIES;
