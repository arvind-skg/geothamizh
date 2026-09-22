// Historical & Present Timeline Periods Registry
// Conforms to Section 8, 30.2 & Unified Timeline Slider Architecture

export const TIMELINE_PERIODS = [
  {
    id: 'today',
    name: 'Today (Present Day)',
    tamilName: 'இன்றைய தமிழகம் (நிகழ்காலம்)',
    timeSpan: 'Present (2026)',
    description: 'Explore contemporary Tamil Nadu: living cultural traditions, active heritage monuments, world-famous cuisine, traditional crafts, and your current location.',
    polities: ['State of Tamil Nadu', 'Republic of India'],
    keySites: ['All Monuments', 'Living Food Hubs', 'Artisan Guilds'],
    confidence: 'high',
    sources: ['asi-monuments', 'wikidata-heritage']
  },
  {
    id: 'later',
    name: 'Nayaka & Later Periods',
    tamilName: 'நாயக்கர் & பிற்காலம்',
    timeSpan: 'c. 1300 CE – 1800 CE',
    description: 'Flourishing of pillared mandapams, gopurams reaching skyward, royal palaces, civic tanks, and cultural synthesis under the Madurai and Thanjavur Nayakas, Marathas, and Ramnad Sethupathis.',
    polities: ['Madurai Nayakas', 'Thanjavur Nayakas', 'Thanjavur Marathas', 'Sethupathis of Ramnad'],
    keySites: ['Madurai Meenakshi Complex', 'Tirumalai Nayak Palace', 'Rameswaram', 'Srirangam', 'Thiruvannamalai'],
    confidence: 'high',
    sources: ['asi-monuments', 'wikidata-heritage']
  },
  {
    id: 'medieval',
    name: 'Imperial & Medieval Era',
    tamilName: 'இடைக்காலம் (பல்லவர், சோழர் & பிற்கால பாண்டியர்)',
    timeSpan: 'c. 600 CE – 1300 CE',
    description: 'The zenith of Dravidian temple architecture, maritime naval expeditions across the Bay of Bengal to Srivijaya, rock-cut monoliths of Mamallapuram, and the grand stone monuments of Thanjavur and Gangaikonda Cholapuram.',
    polities: ['Imperial Chola Empire', 'Pallava Dynasty', 'Later Pandya Empire'],
    keySites: ['Thanjavur', 'Gangaikonda Cholapuram', 'Mamallapuram', 'Kanchipuram', 'Chidambaram', 'Darashuram'],
    confidence: 'high',
    sources: ['epigraphia-indica', 'asi-monuments', 'dharma-epigraphy']
  },
  {
    id: 'post_sangam',
    name: 'Post-Sangam & Kalabhra Era',
    tamilName: 'சங்க மருவிய காலம் & களப்பிரர் காலம்',
    timeSpan: 'c. 300 CE – 600 CE',
    description: 'Transition epoch marked by the profound moral ethics of the Pathinenkilkanakku (including Thirukkural) and the great twin epics Silappadikaram and Manimekalai. Strong flourishing of Jain and Buddhist monastic centers.',
    polities: ['Kalabhras', 'Early Pallavas', 'Kadambas'],
    keySites: ['Kaveripattinam', 'Sittanavasal', 'Kanchipuram', 'Madurai'],
    confidence: 'moderate',
    sources: ['project-madurai', 'dharma-epigraphy']
  },
  {
    id: 'sangam',
    name: 'Sangam Era (Classical Golden Age)',
    tamilName: 'சங்க காலம் (முத்தமிழ் சங்கம்)',
    timeSpan: 'c. 300 BCE – 300 CE',
    description: 'The classical era of Tamil poetry and maritime prowess ruled by the Muvendar (Chera, Chola, Pandya) alongside heroic Velir chieftains. Epoch of vibrant Indo-Roman trade and the Tamil literary academies (Sangams) of Madurai.',
    polities: ['Pandya Kingdom', 'Chola Kingdom', 'Chera Kingdom', 'Velir Chieftains'],
    keySites: ['Madurai', 'Poompuhar (Kaveripattinam)', 'Korkai', 'Muziris', 'Uraiyur', 'Karur (Vanchi)'],
    confidence: 'high',
    sources: ['cict-classical-tamil', 'sentamizh-corpus', 'pleiades-ancient-geo']
  },
  {
    id: 'pre_sangam',
    name: 'Pre-Sangam & Early Iron Age',
    tamilName: 'சங்க காலத்திற்கு முந்தைய காலம்',
    timeSpan: 'Before 300 BCE (~1000 BCE – 300 BCE)',
    description: 'The era of megalithic urn burials, early urban settlements in the Vaigai and Porunai river valleys, black-and-red ware pottery, and early Tamil-Brahmi script emergence.',
    polities: ['Early Chieftaincies', 'Velir Clans'],
    keySites: ['Keeladi', 'Adichanallur', 'Porunthal', 'Kodumanal', 'Mangulam'],
    confidence: 'high',
    sources: ['tn-archaeology', 'asi-monuments']
  }
];

export const PERIODS = TIMELINE_PERIODS.filter(p => p.id !== 'today');
