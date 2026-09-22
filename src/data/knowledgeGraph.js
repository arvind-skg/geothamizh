// Master Knowledge Graph Registry
// Conforms to Section 12 & 53 (Place + Time + People + Literature + Inscription + Event)

export const KNOWLEDGE_GRAPH = {
  nodes: [
    // People
    { id: 'neduncheziyan', label: 'Pandyan Neduncheziyan', tamilLabel: 'பாண்டியன் நெடுஞ்செழியன்', type: 'person', role: 'Sangam King', period: 'sangam' },
    { id: 'rajaraja-chola', label: 'Rajaraja Chola I', tamilLabel: 'முதலாம் இராஜராஜ சோழன்', type: 'person', role: 'Imperial Emperor', period: 'medieval' },
    { id: 'rajendra-chola-i', label: 'Rajendra Chola I', tamilLabel: 'முதலாம் இராஜேந்திர சோழன்', type: 'person', role: 'Imperial Emperor', period: 'medieval' },
    { id: 'mahendravarman-i', label: 'Mahendravarman I', tamilLabel: 'முதலாம் மகேந்திரவர்மன்', type: 'person', role: 'Pallava King & Playwright', period: 'medieval' },
    { id: 'ilango-adigal', label: 'Ilango Adigal', tamilLabel: 'இளங்கோ அடிகள்', type: 'person', role: 'Poet-Prince & Author of Silappadikaram', period: 'post_sangam' },
    { id: 'avvaiyar', label: 'Avvaiyar', tamilLabel: 'ஔவையார்', type: 'person', role: 'Classical Tamil Poetess', period: 'sangam' },
    { id: 'thiruvalluvar', label: 'Thiruvalluvar', tamilLabel: 'திருவள்ளுவர்', type: 'person', role: 'Philosopher & Author of Thirukkural', period: 'post_sangam' },
    { id: 'tirumalai-nayak', label: 'Tirumalai Nayak', tamilLabel: 'திருமலை நாயக்கர்', type: 'person', role: 'Nayak Ruler of Madurai', period: 'later' },
    { id: 'kannagi', label: 'Kannagi', tamilLabel: 'கண்ணகி', type: 'person', role: 'Legendary Heroine of Silappadikaram', period: 'post_sangam' },

    // Places
    { id: 'madurai', label: 'Madurai', tamilLabel: 'மதுரை', type: 'place', category: 'City & Capital' },
    { id: 'thanjavur', label: 'Thanjavur', tamilLabel: 'தஞ்சாவூர்', type: 'place', category: 'Imperial Capital' },
    { id: 'gangaikonda-cholapuram', label: 'Gangaikonda Cholapuram', tamilLabel: 'கங்கைகொண்ட சோழபுரம்', type: 'place', category: 'Naval Empire Capital' },
    { id: 'mamallapuram', label: 'Mamallapuram', tamilLabel: 'மாமல்லபுரம்', type: 'place', category: 'Maritime Port' },
    { id: 'poompuhar', label: 'Poompuhar', tamilLabel: 'பூம்புகார்', type: 'place', category: 'Ancient Seaport' },
    { id: 'korkai', label: 'Korkai', tamilLabel: 'கொற்கை', type: 'place', category: 'Pearl Port' },
    { id: 'keeladi', label: 'Keeladi', tamilLabel: 'கீழடி', type: 'place', category: 'Urban Excavation' },
    { id: 'kanchipuram', label: 'Kanchipuram', tamilLabel: 'காஞ்சிபுரம்', type: 'place', category: 'Scholarly Capital' },
    { id: 'sittanavasal', label: 'Sittanavasal', tamilLabel: 'சித்தன்னவாசல்', type: 'place', category: 'Jain Cave Sanctuary' },
    { id: 'kodumanal', label: 'Kodumanal', tamilLabel: 'கொடுமணல்', type: 'place', category: 'Iron & Gem Center' },

    // Literature
    { id: 'silappadikaram', label: 'Silappadikaram', tamilLabel: 'சிலப்பதிகாரம்', type: 'literature', genre: 'Great Twin Epic' },
    { id: 'thirukkural', label: 'Thirukkural', tamilLabel: 'திருக்குறள்', type: 'literature', genre: 'Ethical Masterwork' },
    { id: 'mathuraikkanci', label: 'Mathuraikkanci', tamilLabel: 'மதுரைக்காஞ்சி', type: 'literature', genre: 'Sangam Anthology (Pattupattu)' },
    { id: 'pattinappaalai', label: 'Pattinappaalai', tamilLabel: 'பட்டினப்பாலை', type: 'literature', genre: 'Sangam Poem on Puhar' },
    { id: 'purananuru', label: 'Purananuru', tamilLabel: 'புறநானூறு', type: 'literature', genre: 'Heroic Poetry (Ettuthokai)' },

    // Inscriptions
    { id: 'mangulam-inscription', label: 'Mangulam Tamil-Brahmi Inscriptions', tamilLabel: 'மாங்குளம் தமிழிக் கல்வெட்டு', type: 'inscription', script: 'Tamil-Brahmi (3rd c. BCE)' },
    { id: 'thanjavur-rajaraja-inscription', label: 'Brihadisvara Royal Chola Charters', tamilLabel: 'தஞ்சைப் பெரிய கோயில் கல்வெட்டுகள்', type: 'inscription', script: 'Tamil & Grantha (1010 CE)' },
    { id: 'keeladi-potsherd-epigraphs', label: 'Keeladi Inscribed Potsherds', tamilLabel: 'கீழடி தமிழி கீறல் மண்பாண்டங்கள்', type: 'inscription', script: 'Early Tamil-Brahmi (6th c. BCE)' }
  ],
  edges: [
    { source: 'neduncheziyan', target: 'madurai', relation: 'ruled_from', label: 'Ruled From' },
    { source: 'neduncheziyan', target: 'mangulam-inscription', relation: 'named_in', label: 'Named In' },
    { source: 'neduncheziyan', target: 'korkai', relation: 'governed_port', label: 'Governed Port' },
    { source: 'ilango-adigal', target: 'silappadikaram', relation: 'authored', label: 'Authored' },
    { source: 'silappadikaram', target: 'poompuhar', relation: 'begins_at', label: 'Begins At' },
    { source: 'silappadikaram', target: 'madurai', relation: 'climaxes_at', label: 'Climaxes At' },
    { source: 'kannagi', target: 'madurai', relation: 'confronted_court_at', label: 'Confronted Court' },
    { source: 'rajaraja-chola', target: 'thanjavur', relation: 'built_capital', label: 'Constructed Big Temple' },
    { source: 'rajaraja-chola', target: 'thanjavur-rajaraja-inscription', relation: 'commissioned', label: 'Commissioned' },
    { source: 'rajendra-chola-i', target: 'gangaikonda-cholapuram', relation: 'founded', label: 'Founded City' },
    { source: 'mahendravarman-i', target: 'mamallapuram', relation: 'carved_caves_at', label: 'Carved Caves' },
    { source: 'mahendravarman-i', target: 'kanchipuram', relation: 'ruled_from', label: 'Ruled From' },
    { source: 'thiruvalluvar', target: 'thirukkural', relation: 'authored', label: 'Authored' },
    { source: 'keeladi', target: 'keeladi-potsherd-epigraphs', relation: 'yielded', label: 'Excavation Yield' },
    { source: 'keeladi', target: 'madurai', relation: 'satellite_of', label: 'Ancient Satellite' },
    { source: 'tirumalai-nayak', target: 'madurai', relation: 'expanded_palace', label: 'Built Palace' },
    { source: 'kodumanal', target: 'purananuru', relation: 'celebrated_in', label: 'Mentioned In' },
    { source: 'poompuhar', target: 'pattinappaalai', relation: 'celebrated_in', label: 'Described In' },
    { source: 'sittanavasal', target: 'ilango-adigal', relation: 'spiritual_era', label: 'Jain Heritage Era' }
  ]
};
