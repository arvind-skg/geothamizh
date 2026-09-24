/**
 * Geoதமிழ் Groq Heritage Intelligence Engine
 * 
 * Powered by Groq ultra-high-speed LLM inference.
 * Synthesizes deep historical, epigraphical, archaeological, and literary knowledge
 * grounded strictly in the verified Geoதமிழ் dataset.
 * 
 * Produces rich, museum-grade structured outputs with interactive Leaflet map anchors,
 * timeline pointers, primary evidence citations, and spatial biographical dossier links.
 */

import { checkQueryScope, getOutOfScopeResponse } from './heritageScopeGuard';

const GROQ_CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b'
];

/**
 * Builds compact RAG context from the client-side verified datasets
 */
function buildDatasetContext(places = [], people = []) {
  const topPlaces = places.slice(0, 24).map(p => 
    `• ${p.name} (${p.tamilName || ''}, id: "${p.id}", district: "${p.district || ''}", lat: ${p.lat}, lng: ${p.lng}): ${p.shortDescription || ''}`
  ).join('\n');

  const allPeople = people.map(p => 
    `• ${p.name} (${p.tamilName || ''}, id: "${p.id}", role: "${p.role || ''}"): ${p.bio || ''}`
  ).join('\n');

  return { topPlaces, allPeople };
}

/**
 * Executes high-speed RAG inference against Groq and parses museum-grade structured representation
 */
export async function queryGroqHeritage({
  query,
  lang = 'en',
  places = [],
  people = [],
  works = [],
  inscriptions = [],
  sourcesRegistry = {},
  apiKey = ''
}) {
  // 1. Fast Domain Scope Pre-Check (gracefully catches coding, STEM, off-topic requests)
  const scopeCheck = checkQueryScope(query);
  if (scopeCheck.isOutOfScope) {
    return getOutOfScopeResponse(lang, scopeCheck.category);
  }

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Groq API Key is not configured');
  }

  const { topPlaces, allPeople } = buildDatasetContext(places, people);

  const systemPrompt = `You are Geoதமிழ் AI Heritage Guide, an expert digital museum curator for Tamil history, epigraphy, archaeology, and classical literature.
Your mission is to provide authoritative, beautifully structured, and source-grounded answers.
Current Output Language: ${lang.toUpperCase()}

Verified Geoதமிழ் Dataset Context:
PLACES IN DATASET:
${topPlaces}

PEOPLE IN DATASET:
${allPeople}

CORE CURATORIAL RULES:
1. Grounding & Rigor: Strictly differentiate between:
   - Literary Tradition (Silappadikaram, Manimekalai, Sangam poetry)
   - Archaeological Evidence (Keeladi brick cities, Adichanallur urns, Mayiladumparai iron dating 2172 BCE, Kodumanal crucible steel)
   - Epigraphical Evidence (Mangulam Tamil-Brahmi, Uttiramerur democratic sabha, Brihadisvara temple plinth)
   Never present mythical or legendary claims as physical archaeological fact.
2. Multi-Entity Handling: If the user asks about multiple people (e.g. "Kannagi, Kovalan, and Ilango Adigal") or multiple places, YOU MUST include a dedicated entityCard for EACH person/place requested. Do not collapse multiple figures into one!
3. Language: Produce all user-facing strings (title, subtitle, extendedSummary, quotes, entity descriptions) in the selected language (${lang.toUpperCase()}: 'en' = English, 'ta' = Tamil தமிழ், 'hi' = Hindi हिन्दी).
4. Response Format: You MUST output strictly a single valid JSON object with NO markdown formatting, NO code blocks, and NO trailing text.
5. Domain Scope Boundary: You are strictly and exclusively the Geoதமிழ் AI Heritage Guide for Tamil civilization, Sangam literature, epigraphy, archaeology, and historical landscapes.
   If the user asks for computer programming code, software scripts, mathematical calculations, recipes, or off-topic general AI tasks, YOU MUST return:
   {
     "isOutOfScope": true,
     "title": "Heritage Guide Domain Focus",
     "bilingualTitle": "Heritage Domain Focus • மரபு வழிகாட்டி வரம்பு",
     "badge": "HERITAGE DOMAIN FOCUS",
     "subtitle": "Polite explanation in ${lang.toUpperCase()} that this guide is specialized solely in Tamil heritage, archaeology, and literature, and cannot provide code or off-topic answers.",
     "suggestedQuestions": [
       "What places are connected to Silappadikaram?",
       "What has archaeology revealed at Keeladi?",
       "Tell me about Brihadisvara Temple"
     ]
   }

JSON Schema:
{
  "title": "Short, punchy title (in ${lang === 'ta' ? 'Tamil' : 'English'})",
  "bilingualTitle": "Bilingual title (Tamil • English)",
  "badge": "HISTORICAL FIGURES | ARCHAEOLOGICAL REVOLUTION | EPIC TRADITION | TEMPLE HERITAGE | INSCRIPTIONS",
  "subtitle": "2-3 concise, informative sentences directly and intelligently answering the user query",
  "extendedSummary": "Detailed historical, archaeological, and literary analysis that users can expand via Read More",
  "quote": {
    "text": "Famous classical quote or Sangam verse if relevant (or null)",
    "attribution": "Source text / author"
  },
  "entityCards": [
    {
      "id": "slug id matching dataset (e.g. kannagi, kovalan, ilango-adigal, poompuhar, madurai, thanjavur, keeladi)",
      "name": "English Name",
      "tamilName": "Tamil Name",
      "role": "Role / Title",
      "description": "2 specific sentences explaining their role and historical significance",
      "evidenceTags": ["Literary", "Epigraphical", "Archaeological"],
      "matchedPersonId": "id from people list if person, else null",
      "matchedPlaceId": "id from places list if place, else null"
    }
  ],
  "journeyStops": [
    {
      "placeId": "id from places list (e.g. poompuhar, madurai, karur)",
      "name": "Stop Name",
      "tamilName": "Tamil Name",
      "role": "Role in route (e.g. Starting Port, Pandyan Capital, Chera Sanctuary)"
    }
  ],
  "evidence": [
    {
      "type": "literary | epigraphical | archaeological",
      "label": "Evidence Category Label",
      "text": "Specific citation of verse, inscription, or excavation stratum"
    }
  ],
  "sources": ["cict-classical-tamil", "asi-monuments", "dharma-epigraphy", "epigraphia-indica"],
  "suggestedQuestions": [
    "Engaging follow-up question 1?",
    "Engaging follow-up question 2?",
    "Engaging follow-up question 3?"
  ]
}`;

  let rawJson = null;
  let usedModel = GROQ_CANDIDATE_MODELS[0];

  for (const model of GROQ_CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          temperature: 0.2,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          rawJson = JSON.parse(content);
          usedModel = model;
          break;
        }
      } else {
        console.warn(`Groq model ${model} returned status ${res.status}`);
      }
    } catch (err) {
      console.warn(`Groq model ${model} attempt failed:`, err.message);
    }
  }

  if (!rawJson) {
    throw new Error('Groq failed to return valid JSON completion');
  }

  // -------------------------------------------------------------
  // Domain Scope Boundary Handling
  // -------------------------------------------------------------
  if (rawJson.isOutOfScope || (!rawJson.title && !rawJson.subtitle)) {
    const fallbackScope = getOutOfScopeResponse(lang, 'general_off_topic');
    return {
      type: 'out_of_scope',
      id: `groq-scope-${Date.now()}`,
      isOutOfScope: true,
      badge: rawJson.badge || 'HERITAGE DOMAIN FOCUS',
      title: rawJson.title || fallbackScope.title,
      bilingualTitle: rawJson.bilingualTitle || fallbackScope.bilingualTitle,
      subtitle: rawJson.subtitle || fallbackScope.subtitle,
      suggestedQuestions: (rawJson.suggestedQuestions && rawJson.suggestedQuestions.length > 0)
        ? rawJson.suggestedQuestions
        : fallbackScope.suggestedQuestions,
      actions: [],
      sources: [],
      evidence: [],
      isGroqGenerated: true,
      groqModel: usedModel
    };
  }
  const enrichedEntities = (rawJson.entityCards || []).map(entity => {
    // 1. Try matching with people dataset
    const personMatch = people.find(p => 
      p.id === entity.matchedPersonId || 
      p.id === entity.id ||
      p.name.toLowerCase() === entity.name?.toLowerCase() ||
      (p.tamilName && entity.tamilName && p.tamilName === entity.tamilName)
    );

    if (personMatch) {
      const associatedPlace = (personMatch.associatedPlaceIds || []).map(id => places.find(p => p.id === id)).filter(Boolean)[0];
      return {
        ...entity,
        id: personMatch.id,
        name: entity.name || personMatch.name,
        tamilName: entity.tamilName || personMatch.tamilName,
        role: entity.role || personMatch.role,
        image: personMatch.image,
        lat: associatedPlace?.lat || 10.7828,
        lng: associatedPlace?.lng || 79.1318,
        district: associatedPlace?.district || 'Tamilakam',
        personId: personMatch.id,
        evidenceTags: entity.evidenceTags || ['Literary', 'Historical Tradition']
      };
    }

    // 2. Try matching with places dataset
    const placeMatch = places.find(p => 
      p.id === entity.matchedPlaceId || 
      p.id === entity.id ||
      p.name.toLowerCase().includes(entity.name?.toLowerCase() || '---') ||
      (entity.name && p.name.toLowerCase().includes(entity.name.toLowerCase()))
    );

    if (placeMatch) {
      return {
        ...entity,
        id: placeMatch.id,
        name: entity.name || placeMatch.name,
        tamilName: entity.tamilName || placeMatch.tamilName,
        role: entity.role || (lang === 'ta' ? 'வரலாற்றுத் தலம்' : 'Historical Heritage Site'),
        image: placeMatch.image,
        lat: placeMatch.lat,
        lng: placeMatch.lng,
        district: placeMatch.district,
        placeId: placeMatch.id,
        evidenceTags: entity.evidenceTags || (placeMatch.categories?.includes('archaeology') ? ['Archaeological'] : ['Epigraphical', 'Literary'])
      };
    }

    // 3. Fallback coordinates and imagery if not directly in dataset
    return {
      ...entity,
      lat: entity.lat || 10.7828,
      lng: entity.lng || 79.1318,
      image: entity.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      evidenceTags: entity.evidenceTags || ['Historical Tradition']
    };
  });

  // Enrich Journey Section if stops exist
  let journeySection = null;
  if (rawJson.journeyStops && rawJson.journeyStops.length > 0) {
    const stopsWithCoords = rawJson.journeyStops.map(stop => {
      const placeMatch = places.find(p => p.id === stop.placeId || p.id === stop.id || p.name.toLowerCase().includes(stop.name?.toLowerCase() || '---'));
      return {
        id: placeMatch?.id || stop.placeId || stop.name?.toLowerCase().replace(/\s+/g, '-'),
        name: stop.name || placeMatch?.name,
        tamilName: stop.tamilName || placeMatch?.tamilName,
        role: stop.role || placeMatch?.district || '',
        lat: placeMatch?.lat || 10.7828,
        lng: placeMatch?.lng || 79.1318,
        image: placeMatch?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
      };
    });

    journeySection = {
      title: lang === 'ta' ? "வரலாற்றுப் பயணப் பாதை" : (lang === 'hi' ? "ऐतिहासिक यात्रा मार्ग" : "Historic Route & Journey"),
      bilingualTitle: lang === 'ta' ? "வரலாற்றுப் பாதை Historic Route" : "Historic Route வரலாற்றுப் பாதை",
      stops: stopsWithCoords
    };
  }

  // Construct Action Buttons
  const actions = [];

  // Map Journey action
  if (journeySection && journeySection.stops.length > 0) {
    actions.push({
      type: 'showJourney',
      title: lang === 'ta' ? 'பயணத்தை வரைபடத்தில் காண்க' : (lang === 'hi' ? 'यात्रा मार्ग मानचित्र पर देखें' : 'Show Route on Map'),
      subtitle: journeySection.stops.map(s => s.name).join(' → '),
      icon: 'map',
      payload: {
        routeId: 'ai-journey',
        stops: journeySection.stops
      }
    });
  }

  // People biographical archive action
  const matchedPersonIds = enrichedEntities.filter(e => e.personId).map(e => e.personId);
  if (matchedPersonIds.length > 0) {
    actions.push({
      type: 'openPeopleModal',
      title: lang === 'ta' ? 'முழு வரலாற்று ஆவணக் காப்பகம்' : 'Full Biographical Archive',
      subtitle: lang === 'ta' ? 'ஆளுமைகளை முழு காப்பகத்தில் காண்க' : 'Open Spatial Biographies in full archive',
      icon: 'users',
      payload: {
        peopleIds: matchedPersonIds,
        initialPersonId: matchedPersonIds[0]
      }
    });
  }

  // Timeline action
  actions.push({
    type: 'viewTimeline',
    title: lang === 'ta' ? 'காலவரிசையைக் காண்க' : (lang === 'hi' ? 'कालक्रम देखें' : 'View Timeline'),
    subtitle: lang === 'ta' ? 'வரலாற்றுக் காலவரிசையை ஆராய்க' : 'Explore period in temporal continuum',
    icon: 'clock',
    payload: { periodId: 'sangam', year: 100 }
  });

  // Format Sources
  const resolvedSources = (rawJson.sources || ['cict-classical-tamil', 'asi-monuments']).map(sId => {
    return sourcesRegistry[sId] || {
      id: sId,
      title: sId.replace(/-/g, ' ').toUpperCase(),
      institution: 'Verified Archaeological & Epigraphical Corpus',
      url: 'https://www.digitalarchives.cict.in/',
      confidence: 'confirmed'
    };
  });

  return {
    type: 'ai_groq_curated',
    id: `groq-${Date.now()}`,
    badge: rawJson.badge || 'AI HERITAGE GUIDE',
    title: rawJson.title,
    bilingualTitle: rawJson.bilingualTitle || rawJson.title,
    subtitle: rawJson.subtitle,
    extendedSummary: rawJson.extendedSummary,
    quote: rawJson.quote,
    journeySection,
    entityCardsSection: {
      title: lang === 'ta' ? "முக்கிய வரலாற்று ஆளுமைகள் & தலங்கள்" : (lang === 'hi' ? "प्रमुख व्यक्तित्व एवं स्थल" : "Key Historical Entities & Sites"),
      bilingualTitle: lang === 'ta' ? "வரலாற்றுப் பின்னணி Historical Context" : "Historical Context வரலாற்றுப் பின்னணி",
      entities: enrichedEntities
    },
    actions,
    evidence: rawJson.evidence || [],
    sources: resolvedSources,
    suggestedQuestions: rawJson.suggestedQuestions || [],
    isGroqGenerated: true,
    groqModel: usedModel
  };
}
