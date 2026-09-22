// Ancient Trade Routes & Maritime Networks
// Conforms to Section 8, 30.3 Pleiades & Periplus of the Erythraean Sea Records

export const TRADE_ROUTES = [
  {
    id: 'maritime-spice-route',
    name: 'Indo-Roman Maritime Spice & Gem Corridor',
    tamilName: 'கிரேக்க-ரோமானிய கடல் வணிகப் பாதை',
    periodId: 'sangam',
    type: 'maritime',
    color: '#08979c',
    dashArray: '8, 8',
    description: 'Ancient sea route documented in the Periplus of the Erythraean Sea and Ptolemy\'s Geography. Roman galleys traded gold coins and amphorae wine for Tamil black pepper, beryl gemstones, and fine pearls.',
    ports: ['Muziris', 'Korkai', 'Alagankulam', 'Poompuhar', 'Arikamedu'],
    sources: ['pleiades-ancient-geo', 'tn-archaeology'],
    // Sequential coordinates [lat, lng]
    path: [
      [10.15, 76.18], // Muziris / Kodungallur
      [8.08, 77.55],  // Cape Comorin
      [8.63, 78.17],  // Korkai (Pearl port)
      [9.35, 78.98],  // Alagankulam (Vaigai mouth)
      [11.15, 79.85], // Poompuhar / Kaveripattinam
      [11.90, 79.82], // Arikamedu (Poduke)
      [12.61, 80.19]  // Mamallapuram
    ]
  },
  {
    id: 'inland-kongu-highway',
    name: 'Inland Kongu Trade Highway (Dakshinapatha Branch)',
    tamilName: 'கொங்கு உள்நாட்டு வணிகப் பெருவழி',
    periodId: 'sangam',
    type: 'inland',
    color: '#d48806',
    dashArray: '5, 5',
    description: 'Inland transport artery connecting the Malabar sea-route through the Palakkad Gap eastward via Kodumanal gemstone workshops, Karur mint, Uraiyur textile bazaars to the Kaveri delta.',
    ports: ['Muziris', 'Kodumanal', 'Karur (Vanchi)', 'Uraiyur', 'Poompuhar'],
    sources: ['tn-archaeology', 'cict-classical-tamil'],
    path: [
      [10.15, 76.18], // Muziris
      [10.78, 76.65], // Palakkad Gap pass
      [11.11, 77.45], // Kodumanal
      [10.95, 78.08], // Karur
      [10.82, 78.69], // Uraiyur / Tiruchirappalli
      [10.79, 79.13], // Thanjavur
      [11.15, 79.85]  // Poompuhar
    ]
  },
  {
    id: 'pearl-fishery-coast',
    name: 'Gulf of Mannar Pearl Fishery Network',
    tamilName: 'முத்துக் குளிப்பு கடற்கரை நெறி',
    periodId: 'sangam',
    type: 'maritime',
    color: '#13c2c2',
    dashArray: '6, 6',
    description: 'Pandyan coastal pearl trading network renowned in Sangam poetry and Greek texts as the source of the most lustrous pearls in the ancient world.',
    ports: ['Korkai', 'Kayalpatnam', 'Tuticorin', 'Alagankulam', 'Rameswaram'],
    sources: ['tn-archaeology', 'cict-classical-tamil'],
    path: [
      [8.48, 78.05],
      [8.63, 78.17], // Korkai
      [8.80, 78.15], // Tuticorin
      [9.15, 78.58],
      [9.28, 79.10], // Rameswaram
      [9.35, 78.98]  // Alagankulam
    ]
  },
  {
    id: 'chola-maritime-expedition-route',
    name: 'Imperial Chola Maritime Oceanic Highway (Rajendra I Srivijaya Campaign)',
    tamilName: 'சோழப் பெருங்கடல் வணிக & கடற்படைப் பாதை',
    periodId: 'medieval',
    type: 'maritime',
    color: '#b8860b',
    dashArray: '10, 6',
    description: 'Naval commercial and military sea-corridor charted by Rajaraja Chola and Rajendra Chola I connecting Nagapattinam and Mamallapuram across the Bay of Bengal to the Kedah kingdom and Srivijaya (Sumatra/Malaya).',
    ports: ['Nagapattinam', 'Poompuhar', 'Mamallapuram', 'Bay of Bengal to Strait of Malacca'],
    sources: ['epigraphia-indica', 'asi-monuments'],
    path: [
      [10.76, 79.84], // Nagapattinam
      [11.15, 79.85], // Poompuhar
      [12.61, 80.19], // Mamallapuram
      [13.10, 80.30], // Chennai coast
      [12.00, 83.50], // Headed to Malacca
      [10.50, 86.00]
    ]
  }
];
