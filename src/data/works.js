// Classical Tamil Literature & Works Registry
// Connecting Works -> Poets -> Geography -> Historical Context (Section 18)

export const LITERATURE_WORKS = [
  {
    id: 'silappadikaram',
    title: 'Silappadikaram (The Tale of an Anklet)',
    tamilTitle: 'சிலப்பதிகாரம்',
    poet: 'Ilango Adigal (இளங்கோ அடிகள்)',
    period: 'post_sangam',
    periodName: 'Post-Sangam (5th–6th Century CE)',
    genre: 'Major Epic (ஐம்பெருங்காப்பியம்)',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    summary: 'The earliest surviving Tamil epic narrating the tragic fate of merchant Kovalan and his faithful wife Kannagi. The storyline traverses three ancient Tamil kingdoms: beginning at the bustling Chola port of Poompuhar, climaxing with the wrongful execution and fiery wrath at the Pandyan capital of Madurai, and concluding in the Chera mountains where Cheran Chenguttuvan erects a shrine to Kannagi.',
    placesMentioned: ['poompuhar', 'madurai', 'sittanavasal', 'korkai'],
    excerpts: [
      {
        tamil: 'திங்களைப் போற்றுதும் திங்களைப் போற்றுதும்... ஞாயிறு போற்றுதும் ஞாயிறு போற்றுதும்... மாமழை போற்றுதும் மாமழை போற்றுதும்...',
        english: 'Praise the Moon! Praise the Sun! Praise the Great Rain that nourishes the earth with life!'
      }
    ],
    theme: 'Justice, Chastity, Universal Karma, and Maritime Geography',
    sources: ['cict-classical-tamil', 'project-madurai']
  },
  {
    id: 'tolkappiyam',
    title: 'Tolkappiyam',
    tamilTitle: 'தொல்காப்பியம்',
    poet: 'Tolkappiyar (தொல்காப்பியர்)',
    period: 'pre_sangam',
    periodName: 'Pre-Sangam / Earliest Classical (~4th–3rd Century BCE)',
    genre: 'Linguistic & Socio-Cultural Treatise',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    summary: 'The foundational grammatical, poetic, and socio-anthropological masterpiece of the Tamil language. Divided into three books—Ezhuttu (Phonology/Letters), Col (Morphology/Words), and Porul (Subject Matter, Poetics, and Tinais/Landscapes). It establishes the unique five-fold ecological landscape system (Ainthinai: Kurinji, Mullai, Marudham, Neydhal, Palai).',
    placesMentioned: ['madurai', 'keeladi', 'korkai'],
    excerpts: [
      {
        tamil: 'மாயோன் மேய காடுறை உலகமும், சேயோன் மேய மைவரை உலகமும், வேந்தன் மேய தீம்புனல் உலகமும், வருணன் மேய பெருமணல் உலகமும்...',
        english: 'The pastoral world presided over by Mayon, the mountainous realm guarded by Seyon, the agricultural plains cherished by Venthan, and the coastal shores of Varunan...'
      }
    ],
    theme: 'Linguistics, Five Ecological Landscapes (Ainthinai), and Classical Poetics',
    sources: ['cict-classical-tamil', 'sentamizh-corpus']
  },
  {
    id: 'tirukkural',
    title: 'Tirukkural',
    tamilTitle: 'திருக்குறள்',
    poet: 'Thiruvalluvar (திருவள்ளுவர்)',
    period: 'post_sangam',
    periodName: 'Classical Era (~4th–5th Century CE)',
    genre: 'Universal Ethical Treatise (பதினெண்கீழ்க்கணக்கு)',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    summary: 'Masterpiece of 1,330 rhyming couplets structured into three divisions: Aram (Dharma/Virtue), Porul (Artha/Wealth and Governance), and Inbam (Kama/Love). Revered worldwide for its universal, secular morality on human kindness, governance, hospitality, truthfulness, and agriculture.',
    placesMentioned: ['madurai', 'mamallapuram', 'kanyakumari', 'chennai'],
    excerpts: [
      {
        tamil: 'அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு.',
        english: 'As the letter "A" is the first of all alphabet letters, so is the primordial Divine the source of all the cosmos.'
      },
      {
        tamil: 'சுழன்றும்ஏர்ப் பின்னது உலகம் அதனால் உழந்தும் உழவே தலை.',
        english: 'Though the world rolls through varied vocations, it must follow behind the plow; therefore farming is the foremost of all pursuits.'
      }
    ],
    theme: 'Universal Ethics, Statecraft, Compassion, and Humanism',
    sources: ['cict-classical-tamil', 'project-madurai']
  },
  {
    id: 'purananuru',
    title: 'Purananuru (Four Hundred Songs of Valour)',
    tamilTitle: 'புறநானூறு',
    poet: 'Multiple Sangam Bards (Avvaiyar, Kapilar, Pisiranthaiyar, etc.)',
    period: 'sangam',
    periodName: 'Sangam Period (3rd BCE – 2nd CE)',
    genre: 'Heroic Anthology (எட்டுத்தொகை)',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    summary: 'A monumental anthology of 400 heroic poems that provides an unvarnished window into ancient Tamil society, kingship, military chivalry, philosophy, charity, and daily life. It contains famous verses by poets like Avvaiyar counseling kings against reckless war, and Kanniyan Pongundranar proclaiming universal human fraternity.',
    placesMentioned: ['madurai', 'keeladi', 'kodumanal', 'korkai', 'adichanallur'],
    excerpts: [
      {
        tamil: 'யாதும் ஊரே யாவரும் கேளிர்; தீதும் நன்றும் பிறர்தர வாரா...',
        english: 'Every city is our hometown; all human beings are our kin. Neither good nor evil comes from others; life is a raft traversing deep river rapids guided by cosmic reason.'
      }
    ],
    theme: 'Universal Kinship, Royal Munificence, Valour, and Grief',
    sources: ['cict-classical-tamil', 'sentamizh-corpus']
  },
  {
    id: 'pattinappalai',
    title: 'Pattinappalai',
    tamilTitle: 'பட்டினப்பாலை',
    poet: 'Kadiyalur Uruthirankannanar (கடியலூர் உருத்திரங்கண்ணனார்)',
    period: 'sangam',
    periodName: 'Sangam Period (1st–2nd Century CE)',
    genre: 'Long Poem (பத்துப்பாட்டு)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    summary: 'A 301-line poem eulogizing Karikala Chola while providing the world’s most vivid ancient maritime eyewitness account of the seaport city of Kaveripattinam (Poompuhar). It meticulously describes the arrival of swift horses imported by ship across the sea, mountains of black pepper bags arriving on carts, gems from the southern ocean, and gold from the northern mountains.',
    placesMentioned: ['poompuhar', 'uraiyur'],
    excerpts: [
      {
        tamil: 'நீரின் வந்த நிமிர்பரிப் புரவியும், காலின் வந்த கருங்கறி மூடையும், வடமலைப் பிறந்த மணியும் பொன்னும், குடமலைப் பிறந்த ஆரமும் அகிலும்...',
        english: 'Swift thoroughbred horses arrived over the bounding waves; carts groaned under heaps of black pepper; gems and gold born in the northern mountains; fragrant sandalwood from the western hills...'
      }
    ],
    theme: 'Maritime Trade, Chola Port Splendor, and Overseas Commerce',
    sources: ['cict-classical-tamil', 'project-madurai']
  },
  {
    id: 'manimekalai',
    title: 'Manimekalai',
    tamilTitle: 'மணிமேகலை',
    poet: 'Seethalai Sathanar (சீத்தலைச் சாத்தனார்)',
    period: 'post_sangam',
    periodName: 'Post-Sangam (6th Century CE)',
    genre: 'Major Buddhist Epic (ஐம்பெருங்காப்பியம்)',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    summary: 'Direct narrative sequel to Silappadikaram. Follows Manimekalai, daughter of Kovalan and Madhavi, who renounces luxury and worldly pleasures to become a Buddhist nun. Armed with the inexhaustible begging bowl (Amudha Surabhi), she travels across South India feeding the hungry, abolishing poverty, and debating philosophical schools in Kanchipuram.',
    placesMentioned: ['poompuhar', 'kanchipuram', 'madurai', 'nagapattinam'],
    excerpts: [
      {
        tamil: 'உண்டி கொடுத்தோர் உயிர் கொடுத்தோரே; மண்டிணி ஞாலத்து வாழ்வோர்க்கெல்லாம்...',
        english: 'Those who provide wholesome food to the hungry give life itself to all who dwell upon this vast earth!'
      }
    ],
    theme: 'Compassion, Eradication of Hunger, Buddhist Philosophy, and Logical Debate',
    sources: ['cict-classical-tamil', 'project-madurai']
  },
  {
    id: 'thiruvasagam',
    title: 'Thiruvasagam',
    tamilTitle: 'திருவாசகம்',
    poet: 'Manikkavacakar (மாணிக்கவாசகர்)',
    period: 'medieval',
    periodName: 'Early Medieval Saivite Era (9th Century CE)',
    genre: 'Mystical Bhakti Hymns (எட்டாம் திருமுறை)',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    summary: 'A sublime collection of 51 spiritual hymns composed by prime minister-turned-mystic Manikkavacakar. Revered in Tamil tradition with the proverb "He who is not melted by Thiruvasagam will melt at nothing" (திருவாசகத்திற்கு உருகார் ஒரு வாசகத்திற்கும் உருகார்). Pope translated it into English in 1900.',
    placesMentioned: ['chidambaram', 'madurai', 'tiruvannamalai'],
    excerpts: [
      {
        tamil: 'நமச்சிவாய வாஅழ்க நாதன்தாள் வாழ்க! இமைப்பொழுதும் என்நெஞ்சில் நீங்காதான் தாள்வாழ்க!',
        english: 'Long live the sacred Five Letters (Na-Ma-Ci-Va-Ya)! Long live the feet of the Lord! Long live the holy feet of Him who departs not from my heart even for the twinkling of an eye!'
      }
    ],
    theme: 'Unconditional Devotion, Transcendent Love, and Metaphysical Dissolution',
    sources: ['cict-classical-tamil', 'project-madurai']
  },
  {
    id: 'ponniyin-selvan',
    title: 'Ponniyin Selvan (The Son of the Kaveri)',
    tamilTitle: 'பொன்னியின் செல்வன்',
    poet: 'Kalki Krishnamurthy (கல்கி கிருஷ்ணமூர்த்தி)',
    period: 'later',
    periodName: 'Modern Classical Historical Novel (1950 – 1954 CE)',
    genre: 'Historical Epic Masterpiece',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    summary: 'The pinnacle of Tamil historical fiction, weaving real 10th-century Chola epigraphs into an epic tale following the youthful exploits of Arulmozhivarman (later Rajaraja Chola I), the spirited warrior-messenger Vandiyathevan, Princess Kundavai, and the enigmatic Nandhini.',
    placesMentioned: ['thanjavur', 'kumbakonam', 'gangaikonda-cholapuram', 'nagapattinam', 'mamallapuram'],
    excerpts: [
      {
        tamil: 'வீராணம் ஏரிக்கரையில் குதிரை மீது வந்த இளவரசன் வந்தியத்தேவன், பொன்னி நதியின் அலைகளைப் பார்த்து சிலிர்த்தான்...',
        english: 'Riding along the embankment of the grand Veera Narayana lake, the intrepid warrior Vandiyathevan gazed upon the golden waves of the sacred Kaveri with reverence...'
      }
    ],
    theme: 'Dynastic Intrigue, Imperial Chola Apex, and Chivalric Honour',
    sources: ['kalki-trust', 'project-madurai']
  }
];
