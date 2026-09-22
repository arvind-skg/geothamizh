// =========================================================================
// GeoThamizh Maritime Trade & Naval Routes
// Features Rajendra Chola's Srivijaya Expedition & Greco-Roman Monsoon Route
// =========================================================================

export const MARITIME_ROUTES = [
  {
    id: 'chola-srivijaya-expedition',
    name: "Rajendra Chola's Naval Expedition to Srivijaya",
    tamilName: 'இராசேந்திர சோழனின் கடற்படைப் படையெடுப்பு',
    period: 'c. 1025 CE',
    eraId: 'medieval',
    commodities: ['Camphor', 'Spices', 'Tin', 'Silk', 'Ivory'],
    color: '#d4952b',
    description: 'The monumental overseas naval campaign of the Imperial Cholas across the Bay of Bengal, subduing the maritime kingdom of Srivijaya and securing the Malacca Straits trade route.',
    flagship: 'Imperial Chola Royal Dhow (கலங்கள்)',
    stops: [
      { name: 'Nagapattinam Port (நாகப்பட்டினம்)', coords: [10.7656, 79.8424], role: 'Imperial Chola Naval Headquarters & Emarkation Port' },
      { name: 'Andaman & Nicobar (மாநக்கவாரம்)', coords: [9.15, 92.80], role: 'Mid-Ocean Freshwater Replenishment Anchorage' },
      { name: 'Kadaram / Kedah (கடாரம்)', coords: [5.60, 100.40], role: 'Strategic Malayan Peninsula Foothold (Bujang Valley)' },
      { name: 'Malacca Strait (மலாக்கா நீரிணை)', coords: [2.20, 102.25], role: 'Global Chokepoint of East-West Oceanic Commerce' },
      { name: 'Srivijaya Capital / Palembang (ஸ்ரீவிஜயம்)', coords: [-2.99, 104.75], role: 'Capital of Maharaja Sangrama-Vijayottungavarman' }
    ],
    pathCoordinates: [
      [10.7656, 79.8424],
      [10.50, 83.00],
      [10.00, 87.50],
      [9.15, 92.80],
      [7.80, 96.20],
      [6.40, 98.80],
      [5.60, 100.40],
      [3.80, 101.50],
      [2.20, 102.25],
      [1.25, 103.80],
      [-0.80, 104.40],
      [-2.99, 104.75]
    ]
  },
  {
    id: 'greco-roman-monsoon-route',
    name: 'Greco-Roman Maritime Silk & Pepper Route',
    tamilName: 'யவன-உரோமானிய மிளகு வர்த்தகப் பெருவழி',
    period: 'c. 100 BCE – 300 CE',
    eraId: 'sangam',
    commodities: ['Black Gold (Malabar Pepper)', 'Beryl Gems', 'Pearls', 'Roman Gold Aurei Coins', 'Mediterranean Wine & Amphorae'],
    color: '#8f1d1d',
    description: 'Documented in the Periplus of the Erythraean Sea and Pliny the Elder: Roman merchants sailed with the southwest Hippalus monsoon winds directly to Muziris, Korkai, and Arikamedu.',
    flagship: 'Roman Merchant Grain-Freighter (Corbita)',
    stops: [
      { name: 'Alexandria / Berenike (செங்கடல்)', coords: [14.50, 52.00], role: 'Roman Red Sea Outpost to Egypt & Rome' },
      { name: 'Muziris / Pattanam (முசிறி)', coords: [10.15, 76.20], role: 'Primary Chera Pepper Depot & Roman Temple of Augustus' },
      { name: 'Korkai (கொற்கை)', coords: [8.63, 78.05], role: 'Pandya Royal Pearl Fishery Harbor' },
      { name: 'Arikamedu / Poduke (அரிக்கமேடு)', coords: [11.90, 79.82], role: 'Indo-Roman Bead Manufacturing & Ceramic Port' }
    ],
    pathCoordinates: [
      [13.50, 68.00],
      [12.00, 72.00],
      [10.15, 76.20],
      [8.08, 77.55],
      [8.63, 78.05],
      [9.50, 79.20],
      [10.80, 79.90],
      [11.90, 79.82]
    ]
  },
  {
    id: 'palk-bay-pearl-fisheries-route',
    name: 'Pandya-Lanka Sacred Pearl & Gem Channel',
    tamilName: 'பாண்டிய-ஈழ முத்து மற்றும் மணிகள் வழித்தடம்',
    period: 'c. 500 BCE – 1400 CE',
    eraId: 'sangam',
    commodities: ['Natural Gulf of Mannar Pearls', 'Chank Shells', 'Ceylonese Sapphires'],
    color: '#38bdf8',
    description: 'Ancient marine route through the Palk Strait connecting the pearl banks of Korkai and Alagankulam with Mantai and Anuradhapura.',
    flagship: 'Pandyan Twin-Fish Catamaran Flotilla',
    stops: [
      { name: 'Korkai Pearl Port', coords: [8.63, 78.05], role: 'Early Pandyan Port mentioned by Ptolemy' },
      { name: 'Alagankulam Estuary', coords: [9.35, 78.98], role: 'Vaigai River Marine Outlet' },
      { name: 'Mantai / Mahatittha', coords: [8.96, 79.91], role: 'Sri Lankan Port of Anuradhapura' }
    ],
    pathCoordinates: [
      [8.63, 78.05],
      [9.00, 78.50],
      [9.35, 78.98],
      [9.15, 79.50],
      [8.96, 79.91]
    ]
  }
];
