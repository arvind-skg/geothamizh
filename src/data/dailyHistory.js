// =========================================================================
// GeoThamizh "Today in Tamil History" Daily Heritage Capsule Dataset
// Loaded from daily_events.json spanning all 365 calendar days & 373 events
// =========================================================================

import rawDailyEvents from './daily_events.json';

const PLACE_MAP = {
  'place_thanjavur': { id: 'thanjavur', name: 'Thanjavur (தஞ்சாவூர்)' },
  'place_madurai': { id: 'madurai', name: 'Madurai (கூடல் மாநகர்)' },
  'place_chennai_madras': { id: 'chennai', name: 'Chennai / Madras (சென்னை)' },
  'place_karur': { id: 'karur', name: 'Karur (சங்க கால வஞ்சி)' },
  'place_poompuhar': { id: 'poompuhar', name: 'Poompuhar (காவேரிப்பூம்பட்டினம்)' },
  'place_korkai': { id: 'korkai', name: 'Korkai (கொற்கை முத்துத்துறை)' },
  'place_kumbakonam': { id: 'kumbakonam', name: 'Kumbakonam (கும்பகோணம்)' },
  'place_kanchipuram': { id: 'kanchipuram', name: 'Kanchipuram (காஞ்சிபுரம்)' },
  'place_chidambaram': { id: 'chidambaram', name: 'Chidambaram (தில்லை சிதம்பரம்)' },
  'place_tuticorin': { id: 'korkai', name: 'Thoothukudi / Korkai (தூத்துக்குடி)' },
  'place_gangaikonda_cholapuram': { id: 'gangaikonda-cholapuram', name: 'Gangaikonda Cholapuram (கங்கைகொண்ட சோழபுரம்)' },
  'place_keezhadi': { id: 'keeladi', name: 'Keeladi (கீழடி வைகை நாகரிகம்)' },
  'place_nagapattinam': { id: 'nagapattinam', name: 'Nagapattinam (நாகப்பட்டினம் துறைமுகம்)' },
  'place_uraniyur': { id: 'uraiyur', name: 'Uraiyur (உறையூர் சோழர் தலைநகர்)' },
  'place_mangulam': { id: 'mangulam', name: 'Mangulam (மாங்குளம் குகைகள்)' },
  'place_uttiramerur': { id: 'uttiramerur', name: 'Uttiramerur (உத்திரமேரூர் குடவோலை)' },
  'place_srirangam': { id: 'uraiyur', name: 'Srirangam (திருவரங்கம்)' },
  'place_mamallapuram': { id: 'mamallapuram', name: 'Mamallapuram (மாமல்லபுரம்)' },
  'place_rameswaram': { id: 'alagankulam', name: 'Rameswaram / Alagankulam (இராமேஸ்வரம்)' },
  'place_adichanallur': { id: 'adichanallur', name: 'Adichanallur (ஆதிச்சநல்லூர்)' },
  'place_attirampakkam': { id: 'chennai', name: 'Attirampakkam (அத்திரம்பாக்கம்)' }
};

const KINGDOM_MAP = {
  'kingdom_chola': 'Imperial Cholas • சோழப் பேரரசு',
  'kingdom_pandya': 'Pandya Dynasty • பாண்டிய நாடு',
  'kingdom_pallava': 'Pallava Empire • பல்லவர்',
  'kingdom_chera': 'Chera Dynasty • சேரர் வம்சம்',
  'kingdom_madurai_nayak': 'Madurai Nayakas • மதுரை நாயக்கர்',
  'kingdom_thanjavur_maratha': 'Thanjavur Marathas • தஞ்சை மராட்டியர்'
};

const PERIOD_MAP = {
  'ancient': 'Classical Sangam Era • சங்க காலம்',
  'early_medieval': 'Early Medieval Era • இடைக்காலம்',
  'medieval': 'Medieval Tamilakam • சோழர்/பாண்டியர் காலம்',
  'early_modern': 'Early Modern Era • நாயக்கர் காலம்',
  'modern': 'Modern Renaissance • விடுதலை இயக்கம் & நவீன காலம்',
  'contemporary': 'Contemporary Tamil Nadu • சமகால தமிழ்நாடு'
};

const PEOPLE_MAP = {
  'person_tiruvalluvar': 'Thiruvalluvar (திருவள்ளுவர்)',
  'person_velu_nachiyar': 'Rani Velu Nachiyar (வீரமங்கை வேலு நாச்சியார்)',
  'person_thirumalai_nayaka': 'King Tirumalai Nayak (திருமலை நாயக்கர்)',
  'person_avvaiyar_sangam': 'Avvaiyar (ஔவையார்)',
  'person_vo_chidambaram_pillai': 'V. O. Chidambaram Pillai (கப்பலோட்டிய தமிழன்)',
  'person_mahendravarman_1': 'Mahendravarman I Pallava (மகேந்திரவர்ம பல்லவன்)',
  'person_appar': 'Thirunavukkarasar / Appar (அப்பர் பெருமான்)',
  'person_uv_swaminatha_iyer': 'U. V. Swaminatha Iyer (தமிழ்த்தாத்தா)',
  'person_rajendra_1': 'Rajendra Chola I (முதலாம் இராஜேந்திர சோழன்)',
  'person_sambandar': 'Thirugnana Sambandar (திருஞானசம்பந்தர்)',
  'person_nedunjeliyan_2': 'Pandyan Neduncheziyan (பாண்டியன் நெடுஞ்செழியன்)',
  'person_rajaraja_1': 'Raja Raja Chola I (முதலாம் இராஜராஜ சோழன்)',
  'person_seethalai_sathanar': 'Seethalai Sathanar (சீத்தலைச் சாத்தனார்)',
  'person_neelambikai_ammaiyar': 'Neelambikai Ammaiyar (நீலாம்பிகை அம்மையார்)',
  'person_maraimalai_adigal': 'Maraimalai Adigal (மறைமலை அடிகள்)',
  'person_karikala_chola': 'Karikala Chola (கரிகால பெருவளத்தான்)',
  'person_katta_bomman': 'Veerapandiya Kattabomman (வீரபாண்டிய கட்டபொம்மன்)',
  'person_andal': 'Andal Nachiyar (சூடிக்கொடுத்த சுடர்க்கொடி)',
  'person_manikkavasagar': 'Manikkavacakar (மாணிக்கவாசகர்)'
};

function buildTamilHistoryDataset() {
  const dataset = [];
  const eventsObj = (rawDailyEvents && rawDailyEvents.events) || {};

  // Sort keys '01-01' to '12-31'
  const keys = Object.keys(eventsObj).sort();

  for (const key of keys) {
    const evts = eventsObj[key] || [];
    for (const evt of evts) {
      const m = evt.date?.month || parseInt(key.slice(0, 2), 10);
      const d = evt.date?.day || parseInt(key.slice(3, 5), 10);
      const y = evt.date?.year || 0;
      const yearStr = y > 0 ? `${y} CE` : `${Math.abs(y)} BCE`;

      let dynasty = '';
      if (evt.kingdoms && evt.kingdoms.length && KINGDOM_MAP[evt.kingdoms[0]]) {
        dynasty = KINGDOM_MAP[evt.kingdoms[0]];
      } else if (evt.period && PERIOD_MAP[evt.period]) {
        dynasty = PERIOD_MAP[evt.period];
      }

      let placeId = null;
      let location = 'Tamilakam (தமிழகம்)';
      if (evt.places && evt.places.length && PLACE_MAP[evt.places[0]]) {
        placeId = PLACE_MAP[evt.places[0]].id;
        location = PLACE_MAP[evt.places[0]].name;
      } else {
        const tagStr = (evt.tags || []).join(' ').toLowerCase();
        if (tagStr.includes('kanyakumari')) { placeId = 'kanyakumari'; location = 'Kanyakumari (கன்னியாகுமரி)'; }
        else if (tagStr.includes('tiruvannamalai')) { placeId = 'tiruvannamalai'; location = 'Tiruvannamalai (திருவண்ணாமலை)'; }
        else if (tagStr.includes('sittanavasal')) { placeId = 'sittanavasal'; location = 'Sittanavasal (சித்தன்னவாசல்)'; }
        else if (tagStr.includes('kodumanal')) { placeId = 'kodumanal'; location = 'Kodumanal (கொடுமணல்)'; }
        else if (tagStr.includes('chettinad')) { placeId = 'chettinad'; location = 'Chettinad (செட்டிநாடு)'; }
        else if (tagStr.includes('tirunelveli')) { placeId = 'tirunelveli'; location = 'Tirunelveli (திருநெல்வேலி)'; }
        else if (tagStr.includes('swamimalai')) { placeId = 'swamimalai'; location = 'Swamimalai (சுவாமிமலை)'; }
        else if (tagStr.includes('vembakottai')) { placeId = 'vembakottai'; location = 'Vembakottai (வேம்பக்கோட்டை)'; }
        else if (tagStr.includes('mayiladumparai')) { placeId = 'mayiladumparai'; location = 'Mayiladumparai (மயிலாடும்பாறை)'; }
        else if (tagStr.includes('thirumayam')) { placeId = 'thirumayam'; location = 'Thirumayam (திருமயம்)'; }
        else if (tagStr.includes('arikamedu')) { placeId = 'arikamedu'; location = 'Arikamedu (அரிக்கமேடு)'; }
        else if (tagStr.includes('madurai')) { placeId = 'madurai'; location = 'Madurai (கூடல் மாநகர்)'; }
        else if (tagStr.includes('thanjavur')) { placeId = 'thanjavur'; location = 'Thanjavur (தஞ்சாவூர்)'; }
        else if (tagStr.includes('chennai') || tagStr.includes('madras')) { placeId = 'chennai'; location = 'Chennai (சென்னை)'; }
      }

      let monarch = '';
      if (evt.people && evt.people.length && PEOPLE_MAP[evt.people[0]]) {
        monarch = PEOPLE_MAP[evt.people[0]];
      } else if (evt.people && evt.people[0]) {
        monarch = evt.people[0].replace('person_', '').replace(/_/g, ' ');
      } else {
        monarch = (evt.event_type || 'historical_milestone').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }

      dataset.push({
        id: evt.id || `evt_${m.toString().padStart(2, '0')}${d.toString().padStart(2, '0')}`,
        month: m,
        day: d,
        year: yearStr,
        rawYear: y,
        title: evt.title?.en || evt.title?.ta || 'Historical Anniversary',
        tamilTitle: evt.title?.ta || evt.title?.en || '',
        dynasty: dynasty || 'Tamil Heritage (தமிழ் மரபு)',
        monarch: monarch,
        location: location,
        placeId: placeId,
        significance: evt.significance?.en || evt.significance?.ta || '',
        narrative: evt.description?.en || evt.description?.ta || evt.significance?.en || '',
        verse: evt.description?.ta ? `“${evt.description.ta}”` : '',
        tags: evt.tags || [],
        sources: evt.sources || [],
        dateEvidence: evt.date_evidence || '',
        eventType: evt.event_type || ''
      });
    }
  }

  return dataset;
}

export const DAILY_TAMIL_HISTORY = buildTamilHistoryDataset();

// Helper to get today's capsule or closest historical event
export function getHistoryForDate(targetMonth, targetDay) {
  const exact = DAILY_TAMIL_HISTORY.find(
    item => item.month === targetMonth && item.day === targetDay
  );
  if (exact) return exact;

  // Fallback to first entry in that month if available
  const monthMatch = DAILY_TAMIL_HISTORY.find(item => item.month === targetMonth);
  if (monthMatch) return monthMatch;

  return DAILY_TAMIL_HISTORY[0];
}

// Helper to get all events for a specific date (when multiple events occurred)
export function getAllHistoryForDate(targetMonth, targetDay) {
  const matches = DAILY_TAMIL_HISTORY.filter(
    item => item.month === targetMonth && item.day === targetDay
  );
  return matches.length > 0 ? matches : [getHistoryForDate(targetMonth, targetDay)];
}

export const DAILY_HISTORY = DAILY_TAMIL_HISTORY;
