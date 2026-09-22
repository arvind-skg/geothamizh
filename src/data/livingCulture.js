// Living Culture, Food, Crafts & Festivals Registry
// Conforms to Section 21 (Food), Section 22 (Crafts), and Section 23 (Festivals)

export const LIVING_CULTURE = {
  food: [
    {
      id: 'madurai-jigarthanda',
      name: 'Madurai Famous Jigarthanda',
      tamilName: 'மதுரை புகழ்பெற்ற ஜிகர்தண்டா',
      region: 'Madurai',
      placeId: 'madurai',
      category: 'beverage_dessert',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      description: 'A cooling royal concoction crafted with almond gum (badam pisin), nannari sarsaparilla syrup, reduced caramelized milk (basundi), and rich hand-churned ice cream.',
      culturalContext: 'Introduced into the culinary fabric of Madurai during the Nayaka and Mughal-affiliated trading periods, named "Jigar-thanda" (Cooler of the Heart), evolving into an indispensable cultural staple of the city.',
      sources: ['wikidata-heritage']
    },
    {
      id: 'chettinad-cuisine',
      name: 'Chettinad Pepper Curry & Sun-Dried Spices',
      tamilName: 'செட்டிநாட்டு மிளகு மசாலா & ஆச்சி சமையல்',
      region: 'Chettinad (Karaikudi)',
      placeId: 'chettinad',
      category: 'culinary_tradition',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      description: 'World-renowned culinary tradition utilizing freshly dry-roasted and stone-ground star anise, kalpasi (black stone flower), marathi mokku, dried red chillies, and freshly cracked Tellicherry black peppercorns.',
      culturalContext: 'Developed by the seafaring Nattukottai Chettiar trading families who incorporated rare spices gathered along Southeast Asian spice routes into traditional Tamil clay-pot cooking.',
      sources: ['wikidata-heritage']
    },
    {
      id: 'kanchipuram-idli',
      name: 'Kanchipuram Temple Idli (Kovil Idli)',
      tamilName: 'காஞ்சிபுரம் கோயில் இட்லி',
      region: 'Kanchipuram',
      placeId: 'kanchipuram',
      category: 'temple_prasadam',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      description: 'A cylindrical, fragrant steamed rice cake seasoned with coarse cumin, black peppercorns, crushed dried ginger (sukku), curry leaves, pure ghee, and steamed traditionally in woven Bauhinia leaf (mandharai ilai) baskets.',
      culturalContext: 'Offered as sacred prasadam at the historic Varadharaja Perumal Temple for centuries, recorded in temple culinary records from the medieval Nayaka period.',
      sources: ['asi-monuments']
    },
    {
      id: 'tirunelveli-halwa',
      name: 'Tirunelveli Wheat Halwa',
      tamilName: 'திருநெல்வேலி கோதுமை அல்வா',
      region: 'Tirunelveli',
      placeId: 'korkai', // nearest region
      category: 'sweet_heritage',
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80',
      description: 'Lustrous, melt-in-the-mouth golden amber fudge made exclusively from fermented wheat milk extract, unrefined cane sugar or palm jaggery, and generous ladles of pure cow ghee, slowly stirred over wood fires.',
      culturalContext: 'The mineral-rich sweetness of the pristine Tamirabarani river water is traditionally attributed to giving this halwa its distinct velvety texture and aroma.',
      sources: ['wikidata-heritage']
    }
  ],
  crafts: [
    {
      id: 'swamimalai-bronze-icons',
      name: 'Swamimalai Lost-Wax Bronze Sculpting',
      tamilName: 'சுவாமிமலை மெழுகு வார்ப்பு வெண்கலச் சிற்பக்கலை',
      region: 'Swamimalai / Thanjavur',
      placeId: 'swamimalai',
      giTagged: true,
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      description: 'The ancient art of casting solid bronze deities using beeswax prototypes and alluvial Kaveri clay molds. Handed down across thirty generations of master sthapathis.',
      culturalSignificance: 'Formulated under the Chola royal ateliers for iconic Nataraja and Parvati utsava murthis (processional deities), strictly following the ancient canonical proportions of the Shilpa Shastras.',
      sources: ['asi-monuments']
    },
    {
      id: 'thanjavur-paintings',
      name: 'Thanjavur Gold-Foil Paintings (Thanjavur Oviyam)',
      tamilName: 'தஞ்சாவூர் தங்கத் தகடு ஓவியங்கள்',
      region: 'Thanjavur',
      placeId: 'thanjavur',
      giTagged: true,
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
      description: 'Classical South Indian painting style characterized by dense compositions, glowing 22-carat gold leaf embossing, inset semi-precious Jaipur stones, and depictions of deities with serene almond-shaped eyes.',
      culturalSignificance: 'Evolved under the royal patronage of the Thanjavur Maratha court in the 17th–18th centuries on wood boards treated with Arabic gum and limestone paste.',
      sources: ['asi-monuments']
    },
    {
      id: 'kanchipuram-silk-weaving',
      name: 'Kanchipuram Silk Sarees (Pattu)',
      tamilName: 'காஞ்சிபுரம் பட்டுத் தறி நெசவு',
      region: 'Kanchipuram',
      placeId: 'kanchipuram',
      giTagged: true,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
      description: 'Handwoven from pure mulberry silk interlaced with three-ply silver wire wrapped in 24k gold zari, using the interlocking korvai technique where border and body are woven separately and joined seamlessly.',
      culturalSignificance: 'Traditional motifs drawn directly from temple stone carvings: temple spires (gopuram), sacred swans (annapakshi), peacocks (mayil), and flying horses (yali).',
      sources: ['wikidata-heritage']
    },
    {
      id: 'mamallapuram-stone-carving',
      name: 'Mamallapuram Granite Stone Carving',
      tamilName: 'மாமல்லபுரம் கருங்கல் சிற்பக்கலை',
      region: 'Mamallapuram',
      placeId: 'mamallapuram',
      giTagged: true,
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
      description: 'Traditional chiseling of crystalline granite boulders using hardened steel hammers and points, creating lifelike temple pillars, monumental guardian dwarfs, and sacred icons.',
      culturalSignificance: 'Inherited directly from the 7th-century Pallava court sculptors who transformed the rocky shoreline of Mahabalipuram into an open-air academy of Dravidian stone architecture.',
      sources: ['asi-monuments']
    }
  ],
  festivals: [
    {
      id: 'chithirai-festival',
      name: 'Madurai Chithirai Thiruvizha',
      tamilName: 'மதுரை சித்திரைத் திருவிழா',
      region: 'Madurai',
      placeId: 'madurai',
      month: 'Chithirai (April–May)',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      description: 'A month-long spectacle uniting the celestial wedding (Thirukkalyanam) of Meenakshi and Sundareswarar with Lord Alagar\'s dramatic entry into the Vaigai river riding a golden horse.',
      significance: 'Historic celebration re-engineered by Nayaka King Tirumalai Nayak in the 17th century to unify two previously separate Saivite and Vaishnavite festivals into one community gathering.',
      sources: ['asi-monuments']
    },
    {
      id: 'pongal-harvest-festival',
      name: 'Pongal (Tamizhar Thirunaal)',
      tamilName: 'பொங்கல் திருநாள் (உழவர் திருநாள்)',
      region: 'All Tamil Nadu',
      placeId: 'madurai',
      month: 'Thai 1 (Mid-January)',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: 'Four-day thanksgiving festival celebrating the Sun (Surya), rain, earth, and working cattle. Freshly harvested rice is boiled in clay pots with milk and jaggery until it joyously overflows.',
      significance: 'Celebrated continuously since the Sangam era, described in Sangam poetry as the Thai Neeradal festival commemorating agricultural abundance and cosmic balance.',
      sources: ['cict-classical-tamil']
    },
    {
      id: 'natyanjali-dance-festival',
      name: 'Chidambaram Natyanjali Dance Offering',
      tamilName: 'சிதம்பரம் நாட்டியாஞ்சலி திருவிழா',
      region: 'Chidambaram',
      placeId: 'chidambaram',
      month: 'Maha Shivaratri (February–March)',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
      description: 'An annual five-day festival where hundreds of classical Bharatanatyam, Kuchipudi, and Mohiniyattam dancers perform under the floodlit golden gopurams of the Nataraja Temple.',
      significance: 'Artists offer their dance as worship directly to Lord Nataraja, the supreme patron of classical Indian rhythm, movement, and cosmic vibration.',
      sources: ['asi-monuments']
    }
  ]
};
