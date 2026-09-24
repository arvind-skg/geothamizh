/**
 * Geoதமிழ் Heritage Knowledge & Grounding Schema Engine
 * 
 * Translates user inquiries into rich, source-grounded structured representations.
 * Strictly separates evidence into:
 * - Literary Tradition (இலக்கியச் சான்று)
 * - Archaeological Evidence (தொல்லியல் சான்று)
 * - Epigraphical Evidence (கல்வெட்டுச் சான்று)
 * - Historical Tradition / Interpretation (வரலாற்று மரபு)
 * 
 * Supports English (en), Tamil (ta), and Hindi (hi).
 */

import { checkQueryScope, getOutOfScopeResponse } from './heritageScopeGuard';

export function resolveHeritageQuery({
  query,
  lang = 'en',
  places = [],
  people = [],
  works = [],
  inscriptions = [],
  sourcesRegistry = {}
}) {
  const q = (query || '').toLowerCase().trim();

  // Fast Domain Scope Pre-Check
  const scopeCheck = checkQueryScope(query);
  if (scopeCheck.isOutOfScope) {
    return getOutOfScopeResponse(lang, scopeCheck.category);
  }

  // 0. SPECIFIC HISTORICAL FIGURE: ILANGO ADIGAL (ONLY if NOT asking about multiple figures)
  const isMultiFigureQuery = 
    (q.includes('kannagi') && q.includes('kovalan')) ||
    (q.includes('kannagi') && q.includes('ilango')) ||
    (q.includes('kovalan') && q.includes('ilango')) ||
    q.includes('people') || 
    q.includes('figures') || 
    q.includes('characters') || 
    q.includes('மாந்தர்கள்') || 
    q.includes('ஆளுமைகள்');

  if (
    !isMultiFigureQuery && (
      q.includes('ilango') ||
      q.includes('இளங்கோ') ||
      q.includes('elango')
    )
  ) {
    const ilangoPerson = people.find(p => p.id === 'ilango-adigal') || {
      id: 'ilango-adigal',
      name: 'Ilango Adigal',
      tamilName: 'இளங்கோ அடிகள்',
      hindiName: 'इलांगो अडिगल',
      role: lang === 'ta' ? 'சேர இளவல் & சிலப்பதிகார ஆசிரியர்' : 'Chera Ascetic Poet & Author of Silappadikaram',
      bio: lang === 'ta' 
        ? 'சேர மன்னன் செங்குட்டுவனின் தம்பி. அரச பதவியைத் துறந்து குணவாயில் கோட்டத்தில் சமணத் துறவியாக வாழ்ந்து சிலப்பதிகாரத்தை இயற்றியவர்.'
        : 'Chera prince who renounced royal succession to embrace ascetic life at Gunavayil Kottam, authoring the masterwork Silappadikaram.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Ilango_Adigal_statue.jpg/480px-Ilango_Adigal_statue.jpg'
    };

    return {
      type: 'person_focus',
      id: 'ilango-adigal',
      badge: 'CLASSICAL POET & ASCETIC',
      title: lang === 'ta' ? 'இளங்கோ அடிகள்' : (lang === 'hi' ? 'इलांगो अडिगल' : 'Ilango Adigal'),
      bilingualTitle: lang === 'ta' ? 'இளங்கோ அடிகள் • Ilango Adigal' : (lang === 'hi' ? 'इलांगो अडिगल • Ilango Adigal' : 'Ilango Adigal இளங்கோ அடிகள்'),
      subtitle: lang === 'ta'
        ? 'சேர மன்னன் செங்குட்டுவனின் தம்பி. இளவரசுப் பட்டத்தைத் துறந்து குணவாயில் கோட்டத்தில் சமணத் துறவியாக வாழ்ந்து, தமிழின் முதற்காப்பியமான சிலப்பதிகாரத்தை அருளிச் செய்த பெருந்தகை (கி.பி. 2-5-ஆம் நூற்றாண்டு).'
        : (lang === 'hi'
          ? 'चेर राजवंश के संन्यासी राजकुमार और राजा चेरन सेनगुट्टुवन के अनुज। गुणवायिल कोट्टम में रहकर उन्होंने तमिल के प्रथम महाकाव्य "शिलप्पादिकारम" की रचना की।'
          : 'Chera ascetic prince and younger brother of King Cheran Chenguttuvan. Renouncing royal succession to live at Gunavayil Kottam, he composed Silappadikaram, the cornerstone epic of classical Tamil literature.'),
      extendedSummary: lang === 'ta'
        ? 'சிலப்பதிகாரப் பதிகத்தின்படி, சேர அரியணை இளையவரான இளங்கோவுக்கே உரியது என்று சோதிடர் கணித்தபோது, அண்ணன் செங்குட்டுவனுடனான அரச பிளவைத் தவிர்க்க உடனே துறவறம் பூண்டார். சேர நாட்டின் குணவாயில் கோட்டத்தில் தங்கி, சீத்தலைச் சாத்தனார் உரைத்த கண்ணகியின் துயரக் கதையைக் கேட்டு, மூவேந்தர்களின் மாண்பையும் மக்களின் வாழ்வையும் இணைக்கும் ஒப்பற்ற காவியமாகச் சிலப்பதிகாரத்தைப் படைத்தார்.'
        : 'According to the Pathikam (prologue) of Silappadikaram, when an astrologer foretold that the younger prince Ilango would inherit the Chera throne instead of his elder brother Chenguttuvan, Ilango renounced worldly royal status to prevent succession rivalry. He took vows as an ascetic at Gunavayil Kottam near the Chera capital and, hearing the tragedy of Kovalan and Kannagi from poet Seethalai Sathanar, composed the thirty cantos of Silappadikaram.',
      quote: {
        text: lang === 'ta'
          ? '“அரசியல் பிழைத்தோர்க்கு அறங்கூற்றாவதூஉம், உரைசால் பத்தினியை உயர்ந்தோர் ஏத்தலும், ஊழ்வினை உருத்துவந்து ஊட்டும் என்பதூஉம்...”'
          : (lang === 'hi'
            ? '“न्याय से विचलित राजा के लिए धर्म ही काल बन जाता है; सती साध्वी को श्रेष्ठ जन पूजते हैं; और प्रारब्ध अवश्य फलीभूत होता है।”'
            : '“Righteousness becomes death to kings who swerve from justice; the chaste lady is venerated by the noble; and destiny inexorably seeks out its due.”'),
        attribution: lang === 'ta' ? '— இளங்கோ அடிகள், சிலப்பதிகாரம் பதிகம்' : '— Ilango Adigal, Silappadikaram Prologue'
      },
      entityCardsSection: {
        title: lang === 'ta' ? "ஆளுமையின் வரலாற்றுப் பின்னணி" : (lang === 'hi' ? "ऐतिहासिक और साहित्यिक संदर्भ" : "Biographical & Literary Context"),
        bilingualTitle: lang === 'ta' ? "ஆளுமைப் பின்னணி Personality Context" : "Biographical Context ஆளுமைப் பின்னணி",
        entities: [
          {
            id: 'ilango-adigal',
            name: 'Ilango Adigal',
            tamilName: 'இளங்கோ அடிகள்',
            hindiName: 'इलांगो अडिगल',
            role: lang === 'ta' ? 'சேர இளவல் & காப்பிய ஆசிரியர்' : 'Chera Ascetic Poet & Author',
            description: lang === 'ta'
              ? 'சிலப்பதிகாரத்தை இயற்றிய சேர இளவல். அரசுரிமையைத் துறந்து சமண முனிவராக வாழ்ந்தவர்.'
              : 'Chera prince who renounced royal throne to author the first indigenous Tamil epic Silappadikaram.',
            evidenceTags: ['Literary', 'Historical Tradition'],
            lat: 10.9601,
            lng: 78.0766,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Ilango_Adigal_statue.jpg/480px-Ilango_Adigal_statue.jpg'
          },
          {
            id: 'cheran-chenguttuvan',
            name: 'Cheran Chenguttuvan',
            tamilName: 'சேரன் செங்குட்டுவன்',
            hindiName: 'चेरन सेनगुट्टुवन',
            role: lang === 'ta' ? 'சேரப் பேரரசன் (இளங்கோவின் அண்ணன்)' : 'Chera Emperor & Elder Brother',
            description: lang === 'ta'
              ? 'இமயத்திலிருந்து கல் கொண்டுவந்து கண்ணகிக்கு பத்தினிக் கோட்டம் அமைத்த பெருவேந்தன்.'
              : 'Chera monarch who established the Kannagi memorial temple in the Western Ghats as recorded in Vanchi Kandam.',
            evidenceTags: ['Literary', 'Epigraphical'],
            lat: 10.9575,
            lng: 78.0833,
            image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'kannagi',
            name: 'Kannagi',
            tamilName: 'கண்ணகி',
            hindiName: 'कन्नगी',
            role: lang === 'ta' ? 'காப்பியத் தலைவி & நீதிப் பெண்மணி' : 'Heroine of Moral Justice',
            description: lang === 'ta'
              ? 'இளங்கோ அடிகள் தன் காவியத்தின் முதன்மை நாயகியாகப் போற்றிய அறச்சீற்றத்தின் திருவுருவம்.'
              : 'Immortalized by Ilango Adigal as the central figure of unyielding truth and cosmic justice.',
            evidenceTags: ['Literary', 'Historical Tradition'],
            lat: 9.9195,
            lng: 78.1193,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      actions: [
        {
          type: 'openPeopleModal',
          title: lang === 'ta' ? 'முழு வரலாற்று ஆவணக் காப்பகம்' : 'Full Biographical Archive',
          subtitle: lang === 'ta' ? 'இளங்கோ அடிகளின் விவரங்களை காப்பகத்தில் காண்க' : 'View Ilango Adigal in Spatial Biographies',
          icon: 'users',
          payload: { peopleIds: ['ilango-adigal', 'kannagi', 'kovalan'], initialPersonId: 'ilango-adigal' }
        },
        {
          type: 'exploreTopic',
          title: lang === 'ta' ? 'சிலப்பதிகார இடங்கள்' : 'Silappadikaram Places',
          subtitle: lang === 'ta' ? 'பூம்புகார் • மதுரை • வஞ்சி' : 'Puhar • Madurai • Vanji',
          icon: 'compass',
          query: 'What places are connected to Silappadikaram?'
        },
        {
          type: 'showJourney',
          title: lang === 'ta' ? 'கண்ணகியின் பயணப் பாதை' : 'Kannagi Journey Route',
          subtitle: lang === 'ta' ? 'பூம்புகார் முதல் வஞ்சி வரை வரைபடத்தில் காண்க' : 'Trace route across Tamilakam on map',
          icon: 'map',
          payload: {
            routeId: 'kannagi-journey',
            stops: [
              { name: 'Puhar', lat: 11.1444, lng: 79.8550 },
              { name: 'Madurai', lat: 9.9195, lng: 78.1193 },
              { name: 'Vanji', lat: 10.9601, lng: 78.0766 }
            ]
          }
        }
      ],
      evidence: [
        {
          type: 'literary',
          label: lang === 'ta' ? 'இலக்கியச் சான்று' : 'Literary Evidence',
          text: lang === 'ta'
            ? 'சிலப்பதிகாரம் பதிகம், வஞ்சிக் காண்டம் மற்றும் பதிற்றுப்பத்து ஐந்தாம் பத்து ஆகியவை இளங்கோ அடிகளின் அரச பரம்பரையையும் செங்குட்டுவனின் வடபுலப் பயணத்தையும் விவரிக்கின்றன.'
            : 'Silappadikaram Pathikam (Prologue), Vanchi Kandam, and Pathitruppathu (Decade 5) attest to the Chera lineage of Udiyan Cheral and Imayavaramban Neduncheralathan.'
        },
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'கல்வெட்டுச் சான்று' : 'Epigraphical Evidence',
          text: lang === 'ta'
            ? 'புகழூர் (கரூர்) சமணர் படுக்கை தமிழ்-பிராமி கல்வெட்டுகளில் (கி.மு. 2–1-ஆம் நூற்றாண்டு) சேர மன்னர்களின் மூன்று தலைமுறைகளின் மரபுப் பெயர்கள் வெட்டப்பட்டுள்ளன.'
            : 'Pugalur (Karur) Tamil-Brahmi rock-cut bed inscriptions record three generations of Chera rulers contemporary with classical post-Sangam literature.'
        }
      ],
      sources: [
        {
          id: 'cict-classical-tamil',
          title: 'CICT Classical Tamil Literature Corpus',
          institution: 'Central Institute of Classical Tamil, Govt. of India',
          url: 'https://www.digitalarchives.cict.in/',
          confidence: 'confirmed'
        },
        {
          id: 'dharma-epigraphy',
          title: 'DHARMA Epigraphical Database',
          institution: 'EFEO & European Research Council',
          url: 'https://erc-dharma.github.io/',
          confidence: 'confirmed'
        }
      ],
      suggestedQuestions: [
        lang === 'ta' ? "சிலப்பதிகார இடங்கள் எவை?" : "What places are connected to Silappadikaram?",
        lang === 'ta' ? "கண்ணகியின் சிலம்பு வழக்கு என்ன?" : "What was Kannagi's trial in Madurai?",
        lang === 'ta' ? "சிலப்பதிகாரத்தின் மூன்று நீதிகள் யாவை?" : "What are the three cardinal truths of Silappadikaram?"
      ]
    };
  }

  // 1A. SILAPPADIKARAM KEY FIGURES (Kannagi, Kovalan, Ilango Adigal)
  const isPeopleQuery = 
    q.includes('people') || 
    q.includes('person') || 
    q.includes('figures') || 
    q.includes('characters') || 
    q.includes('ஆளுமைகள்') || 
    q.includes('மாந்தர்கள்') ||
    q.includes('who is') ||
    q.includes('who was') ||
    q.includes('tell me about') ||
    q.includes('about') ||
    q.includes('பற்றி') ||
    q.includes('யார்');

  if (
    isPeopleQuery && (
      q.includes('silappadikaram') || 
      q.includes('சிலப்பதிகாரம்') || 
      q.includes('kannagi') || 
      q.includes('கண்ணகி') || 
      q.includes('kovalan') || 
      q.includes('கோவலன்')
    )
  ) {
    return {
      type: 'epic_people',
      id: 'silappadikaram-people',
      badge: 'HISTORICAL FIGURES',
      title: lang === 'ta' ? 'சிலப்பதிகாரக் கதைமாந்தர்கள்' : (lang === 'hi' ? 'शिलप्पादिकारम के प्रमुख पात्र' : 'Key Figures of Silappadikaram'),
      bilingualTitle: lang === 'ta' ? 'கதைமாந்தர்கள் • Key Figures of Silappadikaram' : (lang === 'hi' ? 'प्रमुख पात्र • Key Figures of Silappadikaram' : 'Key Figures of Silappadikaram கதைமாந்தர்கள்'),
      subtitle: lang === 'ta'
        ? 'இளங்கோ அடிகள் அருளிய காப்பியத்தின் முதன்மை ஆளுமைகள். கோவலன், கண்ணகி மற்றும் இளங்கோ அடிகளின் வாழ்வியலும் வரலாற்றுப் பின்னணியும்.'
        : (lang === 'hi'
          ? 'इलांगो अडिगल द्वारा रचित महाकाव्य के प्रमुख व्यक्तित्व: कोवलन, कन्नगी और स्वयं रचयिता का ऐतिहासिक और साहित्यिक संदर्भ।'
          : 'The central personalities of the classical epic: author-ascetic Ilango Adigal, the steadfast heroine Kannagi, and Kovalan.'),
      quote: {
        text: lang === 'ta'
          ? '“உரைசால் பத்தினியை உயர்ந்தோர் ஏத்தலும், ஊழ்வினை உருத்துவந்து ஊட்டும் என்பதூஉம்...”'
          : (lang === 'hi'
            ? '“सतीत्व की गरिमा जिसे श्रेष्ठ जन नमन करते हैं, और प्रारब्ध जो अवश्य फलीभूत होता है।”'
            : '“A devoted wife celebrated by the virtuous, and the unyielding arc of destiny.”'),
        attribution: lang === 'ta' ? '— சிலப்பதிகாரம் பதிகம்' : '— Silappadikaram Prologue'
      },
      entityCardsSection: {
        title: lang === 'ta' ? "முதன்மை ஆளுமைகள்" : (lang === 'hi' ? "प्रमुख व्यक्तित्व" : "Central Historical Personalities"),
        bilingualTitle: lang === 'ta' ? "முதன்மை ஆளுமைகள் Central Figures" : "Central Personalities முதன்மை ஆளுமைகள்",
        entities: [
          {
            id: 'ilango-adigal',
            name: 'Ilango Adigal',
            tamilName: 'இளங்கோ அடிகள்',
            hindiName: 'इलांगो अडिगल',
            role: lang === 'ta' ? 'சேர இளவல் & காப்பிய ஆசிரியர்' : 'Chera Ascetic Poet & Author',
            description: lang === 'ta'
              ? 'சேர மன்னன் செங்குட்டுவனின் தம்பி. அரச பதவியைத் துறந்து குணவாயில் கோட்டத்தில் சமணத் துறவியாக வாழ்ந்து சிலப்பதிகாரத்தை இயற்றியவர்.'
              : 'Chera prince who renounced royal succession to embrace ascetic life at Gunavayil Kottam, authoring the masterwork Silappadikaram.',
            evidenceTags: ['Literary', 'Historical Tradition'],
            lat: 10.9601,
            lng: 78.0766,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Ilango_Adigal_statue.jpg/480px-Ilango_Adigal_statue.jpg'
          },
          {
            id: 'kannagi',
            name: 'Kannagi',
            tamilName: 'கண்ணகி',
            hindiName: 'कन्नगी',
            role: lang === 'ta' ? 'நீதித் தலைவி & காப்பிய நாயகி' : 'Heroine of Moral Justice',
            description: lang === 'ta'
              ? 'கற்பின் மாண்பும் அறச்சீற்றமும் கொண்ட காப்பியத் தலைவி. பாண்டியன் நெடுஞ்செழியன் அவையில் தன் சிலம்பை உடைத்து நீதியை நிலைநாட்டியவள்.'
              : 'Central heroine of unmatched resilience who proved Kovalan’s innocence in open court before Pandyan King Neduncheziyan.',
            evidenceTags: ['Literary', 'Epigraphical', 'Historical Tradition'],
            lat: 9.9195,
            lng: 78.1193,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'kovalan',
            name: 'Kovalan',
            tamilName: 'கோவலன்',
            hindiName: 'कोवलन',
            role: lang === 'ta' ? 'பூம்புகார் பெருவணிகன்' : 'Merchant of Puhar',
            description: lang === 'ta'
              ? 'பூம்புகாரின் மாநாய்கன் குலத்து வணிகன். மாதவியின் கலைநயத்தில் மயங்கிப் பின் கண்ணகியுடன் மதுரை சென்று தன் சிலம்பை விற்க முயன்று உயிர்துறந்தவன்.'
              : 'Son of affluent merchant Maanaakkan of Puhar whose misjudged execution in Madurai initiated the epic climax.',
            evidenceTags: ['Literary', 'Historical Tradition'],
            lat: 11.1444,
            lng: 79.8550,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      actions: [
        {
          type: 'showJourney',
          title: lang === 'ta' ? 'பயணத்தை வரைபடத்தில் காண்க' : 'Show Journey on Map',
          subtitle: lang === 'ta' ? 'கண்ணகியின் பாதையை வரைபடத்தில் காண்க' : "Visualize Kannagi's route across Tamilakam",
          icon: 'map',
          payload: {
            routeId: 'kannagi-journey',
            stops: [
              { name: 'Puhar', lat: 11.1444, lng: 79.8550 },
              { name: 'Madurai', lat: 9.9195, lng: 78.1193 },
              { name: 'Vanji', lat: 10.9601, lng: 78.0766 }
            ]
          }
        },
        {
          type: 'exploreTopic',
          title: lang === 'ta' ? 'சிலப்பதிகார இடங்கள்' : 'Silappadikaram Places',
          subtitle: lang === 'ta' ? 'பூம்புகார் • மதுரை • வஞ்சி' : 'Puhar • Madurai • Vanji',
          icon: 'compass',
          query: 'What places are connected to Silappadikaram?'
        },
        {
          type: 'openPeopleModal',
          title: lang === 'ta' ? 'முழு வரலாற்று ஆவணக் காப்பகம்' : 'Full Biographical Archive',
          subtitle: lang === 'ta' ? 'தமிழக ஆளுமைகள் காப்பகத்தில் காண்க' : 'Open Spatial Biographies in full archive',
          icon: 'users',
          payload: { peopleIds: ['ilango-adigal', 'kannagi', 'kovalan'], initialPersonId: 'ilango-adigal' }
        }
      ],
      evidence: [
        {
          type: 'literary',
          label: lang === 'ta' ? 'இலக்கியச் சான்று' : 'Literary Evidence',
          text: lang === 'ta'
            ? 'சிலப்பதிகாரம் பதிகம் மற்றும் வழக்குரை காதை இளங்கோ அடிகளின் சேர அரச மரபையும், கண்ணகியின் அறச்சீற்றத்தையும் நேரடியாகப் பதிவு செய்கின்றன.'
            : 'The epic poem Silappadikaram (Pathikam and Vazhakkurai Kaathai) structures the personal journeys and royal genealogies of the Chera, Chola, and Pandya courts.'
        },
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'கல்வெட்டுச் சான்று' : 'Epigraphical Evidence',
          text: lang === 'ta'
            ? 'மாங்குளம் தமிழ்-பிராமி கல்வெட்டுகளில் (கி.மு. 2-ஆம் நூற்றாண்டு) காப்பியத்தில் வரும் பாண்டிய மன்னன் நெடுஞ்செழியனின் பெயர் பொறிக்கப்பட்டுள்ளது.'
            : 'Mangulam Tamil-Brahmi rock inscriptions securely attest to Pandyan rulers contemporary to early Sangam accounts.'
        }
      ],
      sources: [
        {
          id: 'cict-classical-tamil',
          title: 'CICT Classical Tamil Literature Corpus',
          institution: 'Central Institute of Classical Tamil, Govt. of India',
          url: 'https://www.digitalarchives.cict.in/',
          confidence: 'confirmed'
        },
        {
          id: 'dharma-epigraphy',
          title: 'DHARMA Epigraphical Database',
          institution: 'EFEO & European Research Council',
          url: 'https://erc-dharma.github.io/',
          confidence: 'confirmed'
        }
      ],
      suggestedQuestions: [
        lang === 'ta' ? "இளங்கோ அடிகள் யார்?" : "Who was Ilango Adigal?",
        lang === 'ta' ? "சிலப்பதிகார இடங்கள் எவை?" : "What places are connected to Silappadikaram?",
        lang === 'ta' ? "கண்ணகியின் சிலம்பு வழக்கு என்ன?" : "What was Kannagi's trial in Madurai?"
      ]
    };
  }

  // 1B. SILAPPADIKARAM & KANNAGI'S JOURNEY (Places)
  if (
    q.includes('silappadikaram') || 
    q.includes('சிலப்பதிகாரம்') || 
    q.includes('silapathikaram') || 
    q.includes('kannagi') || 
    q.includes('கண்ணகி') || 
    q.includes('kovalan') ||
    q.includes('கோவலன்') ||
    (q.includes('places') && q.includes('epic'))
  ) {
    const puhar = places.find(p => p.id === 'poompuhar') || {
      id: 'poompuhar',
      name: 'Puhar (Kaveripattinam)',
      tamilName: 'பூம்புகார் (காவேரிப்பட்டினம்)',
      hindiName: 'पूम्पुहार (कावेरीपट्टिनम)',
      lat: 11.1444,
      lng: 79.8550
    };
    const madurai = places.find(p => p.id === 'madurai') || {
      id: 'madurai',
      name: 'Madurai',
      tamilName: 'மதுரை',
      hindiName: 'मदुरै',
      lat: 9.9195,
      lng: 78.1193
    };
    const vanji = places.find(p => p.id === 'karur' || p.id === 'vanji') || {
      id: 'vanji',
      name: 'Vanji (Karur region?)',
      tamilName: 'வஞ்சி (கரூர் பகுதி?)',
      hindiName: 'வंजी (करूर क्षेत्र)',
      lat: 10.9601,
      lng: 78.0766
    };

    return {
      type: 'epic_journey',
      id: 'silappadikaram',
      badge: 'BETA',
      title: lang === 'ta' ? 'சிலப்பதிகாரம்' : (lang === 'hi' ? 'शिलप्पादिकारम' : 'Silappadikaram'),
      bilingualTitle: lang === 'ta' ? 'சிலப்பதிகாரம் • Silappadikaram' : (lang === 'hi' ? 'शिलप्पादिकारम • Silappadikaram' : 'சிலப்பதிகாரம் Silappadikaram'),
      subtitle: lang === 'ta'
        ? 'இளங்கோ அடிகள் அருளிய ஐம்பெருங்காப்பியங்களுள் முதன்மையானது (கி.பி. 2-5-ஆம் நூற்றாண்டு). கோவலன்-கண்ணகியின் வாழ்வு வழியே மூவேந்தர்களின் பெரும் நகரங்களை இணைக்கும் காவியப் பயணம்.'
        : (lang === 'hi'
          ? 'इलांगो अडिगल द्वारा रचित प्रमुख तमिल महाकाव्य (लगभग दूसरी-पाँचवीं शताब्दी ईस्वी), जो तीन महान तमिल राजधानियों में कन्नगी और कोवलन की ऐतिहासिक यात्रा का वर्णन करता है।'
          : 'A major Tamil epic (c. 2nd–5th century CE) traditionally attributed to Ilango Adigal, describing the journey of Kannagi and Kovalan across the three great Tamil kingdoms.'),
      quote: {
        text: lang === 'ta' 
          ? '“அரசியல் பிழைத்தோர்க்கு அறங்கூற்றாவதூஉம், உரைசால் பத்தினியை உயர்ந்தோர் ஏத்தலும்...”'
          : (lang === 'hi' 
            ? '“एक नूपुर जिसने एक संपूर्ण साम्राज्य की नियति बदल दी।”' 
            : '“An anklet changed the course of a kingdom.”'),
        attribution: lang === 'ta' ? '— சிலப்பதிகாரம் பதிகம்' : '— Silappadikaram'
      },
      journeySection: {
        title: lang === 'ta' ? "கண்ணகியின் பயணம்" : (lang === 'hi' ? "कन्नगी की यात्रा" : "Kannagi's Journey"),
        bilingualTitle: lang === 'ta' ? "கண்ணகியின் பயணம் Kannagi's Journey" : (lang === 'hi' ? "कन्नगी की यात्रा • Kannagi's Journey" : "Kannagi's Journey கண்ணகியின் பயணம்"),
        stops: [
          {
            id: 'poompuhar',
            name: 'Puhar',
            tamilName: 'பூம்புகார்',
            hindiName: 'पूम्पुहार',
            role: lang === 'ta' ? 'சோழர் துறைமுக நகரம்' : (lang === 'hi' ? 'चोल बन्दरगाह नगर' : 'Chola port city'),
            lat: puhar.lat || 11.1444,
            lng: puhar.lng || 79.8550,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'madurai',
            name: 'Madurai',
            tamilName: 'மதுரை',
            hindiName: 'मदुरै',
            role: lang === 'ta' ? 'பாண்டியர் தலைநகரம்' : (lang === 'hi' ? 'पाण्ड्य राजधानी' : 'Pandya capital'),
            lat: madurai.lat || 9.9195,
            lng: madurai.lng || 78.1193,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'vanji',
            name: 'Vanji',
            tamilName: 'வஞ்சி',
            hindiName: 'வंजी',
            role: lang === 'ta' ? 'சேரர் வரலாற்று நகரம்' : (lang === 'hi' ? 'चेर ऐतिहासिक नगर' : 'Chera associated city'),
            lat: vanji.lat || 10.9601,
            lng: vanji.lng || 78.0766,
            image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      entityCardsSection: {
        title: lang === 'ta' ? "முக்கியமான இடங்கள்" : (lang === 'hi' ? "महाकाव्य के प्रमुख स्थल" : "Key Places in the Epic"),
        bilingualTitle: lang === 'ta' ? "முக்கியமான இடங்கள் Key Places in the Epic" : (lang === 'hi' ? "प्रमुख स्थल • Key Places in the Epic" : "Key Places in the Epic முக்கியமான இடங்கள்"),
        entities: [
          {
            id: 'poompuhar',
            name: 'Puhar (Kaveripattinam)',
            tamilName: 'பூம்புகார் (காவேரிப்பட்டினம்)',
            hindiName: 'पूम्पुहार (कावेरीपट्टिनम)',
            description: lang === 'ta'
              ? 'கோவலன் மற்றும் கண்ணகியின் பிறப்பிடம். காவிரி கடலோடு கலக்கும் சர்வதேச சோழர் துறைமுகம்.'
              : (lang === 'hi'
                ? 'कन्नगी और कोवलन की जन्मस्थली। कावेरी के मुहाने पर स्थित समृद्ध प्राचीन चोल बन्दरगाह नगर।'
                : 'Birthplace of Kannagi and Kovalan. A flourishing Chola international seaport at the mouth of the Kaveri.'),
            evidenceTags: ['Literary', 'Archaeological'],
            lat: puhar.lat || 11.1444,
            lng: puhar.lng || 79.8550,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'madurai',
            name: 'Madurai',
            tamilName: 'மதுரை',
            hindiName: 'मदुरै',
            description: lang === 'ta'
              ? 'சிலப்பதிகார வழக்கறு காதை நிகழும் பாண்டியர் தலைநகரம். சிலம்பு வழக்கினால் நீதி நிலைநாட்டப்பட்ட தலம்.'
              : (lang === 'hi'
                ? 'पाण्ड्य राजधानी जहाँ कोवलन का मुकदमा और ऐतिहासिक न्याय का प्रसंग घटित हुआ।'
                : 'Pandya capital where the central judicial episode and trial of the sacred anklet takes place.'),
            evidenceTags: ['Literary', 'Epigraphical'],
            lat: madurai.lat || 9.9195,
            lng: madurai.lng || 78.1193,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'vanji',
            name: 'Vanji (Karur region?)',
            tamilName: 'வஞ்சி (கரூர் பகுதி?)',
            hindiName: 'वंजी (करूर क्षेत्र?)',
            description: lang === 'ta'
              ? 'சேர மன்னன் சேரன் செங்குட்டுவன் கண்ணகிக்கு பத்தினிக் கோட்டம் அமைத்ததாகக் கூறப்படும் சேரப் பகுதி.'
              : (lang === 'hi'
                ? 'चेर साम्राज्य से सम्बन्धित क्षेत्र जहाँ चेर राजा सेनगुट्टुवन द्वारा कन्नगी स्मृति मन्दिर की स्थापना का उल्लेख है।'
                : 'Associated with the Chera kingdom in the latter portion of the epic where King Chenguttuvan honors Kannagi.'),
            evidenceTags: ['Literary', 'Historical Tradition'],
            lat: vanji.lat || 10.9601,
            lng: vanji.lng || 78.0766,
            image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      actions: [
        {
          type: 'showJourney',
          title: lang === 'ta' ? 'பயணத்தை வரைபடத்தில் காண்க' : (lang === 'hi' ? 'यात्रा मार्ग मानचित्र पर देखें' : 'Show Journey on Map'),
          subtitle: lang === 'ta' ? 'கண்ணகியின் பாதையை வரைபடத்தில் காண்க' : (lang === 'hi' ? 'तमिलकम में कन्नगी का मार्ग देखें' : "Visualize Kannagi's route across Tamilakam"),
          icon: 'map',
          payload: {
            routeId: 'kannagi-journey',
            stops: [
              { name: 'Puhar', lat: 11.1444, lng: 79.8550 },
              { name: 'Madurai', lat: 9.9195, lng: 78.1193 },
              { name: 'Vanji', lat: 10.9601, lng: 78.0766 }
            ]
          }
        },
        {
          type: 'viewTimeline',
          title: lang === 'ta' ? 'காலவரிசையைக் காண்க' : (lang === 'hi' ? 'कालक्रम देखें' : 'View Timeline'),
          subtitle: lang === 'ta' ? 'வரலாற்றுக் காலத்தை ஆராய்க (கி.பி. 0–300)' : (lang === 'hi' ? 'ऐतिहासिक काल (0–300 ईस्वी)' : 'Explore historical period (c. 0–300 CE)'),
          icon: 'clock',
          payload: { periodId: 'post_sangam', year: 250 }
        },
        {
          type: 'relatedPeople',
          title: lang === 'ta' ? 'தொடர்புடைய ஆளுமைகள்' : (lang === 'hi' ? 'सम्बन्धित व्यक्तित्व' : 'Related People'),
          subtitle: lang === 'ta' ? 'கண்ணகி • கோவலன் • இளங்கோ அடிகள்' : (lang === 'hi' ? 'कन्नगी • कोवलन • इलांगो अडिगल' : 'Kannagi • Kovalan • Ilango Adigal'),
          icon: 'users',
          payload: { peopleIds: ['ilango-adigal', 'kannagi', 'kovalan'] }
        }
      ],
      evidence: [
        {
          type: 'literary',
          label: lang === 'ta' ? 'இலக்கியச் சான்று' : (lang === 'hi' ? 'साहित्यिक साक्ष्य' : 'Literary Evidence'),
          text: lang === 'ta'
            ? 'சிலப்பதிகாரம் (புகார்க் காண்டம், மதுரைக் காண்டம், வஞ்சிக் காண்டம்) மூவேந்தர் தலைநகரங்களின் அரசியல், புவியியல் மற்றும் துறைமுக வாழ்வியலை துல்லியமாக விவரிக்கிறது.'
            : (lang === 'hi'
              ? 'शिलप्पादिकारम के तीन काण्ड (पुहार, मदुरै, वंजी) प्राचीन तमिल राजधानियों, बंदरगाहों और सामाजिक जीवन का विस्तृत काव्य विवरण प्रस्तुत करते हैं।'
              : 'Silappadikaram directly structures its narrative across Puhar Kandam (Chola), Madurai Kandam (Pandya), and Vanji Kandam (Chera).')
        },
        {
          type: 'archaeological',
          label: lang === 'ta' ? 'தொல்லியல் சான்று' : (lang === 'hi' ? 'पुरातात्विक साक्ष्य' : 'Archaeological Evidence'),
          text: lang === 'ta'
            ? 'பூம்புகார் கீழையூர் கப்பல்துறை அகழாய்வுகள், உறை கிணறுகள் மற்றும் ரோமானிய மட்பாண்டங்கள் இதன் சர்வதேச துறைமுக அந்தஸ்தை உறுதிப்படுத்துகின்றன. ஆனால் காப்பிய மாந்தர்களின் தனிப்பட்ட வாழ்க்கை வரலாற்றை தொல்லியல் நேரடியாக உறுதிப்படுத்த இயலாது; இது இலக்கிய மரபாகக் கருதப்படுகிறது.'
            : (lang === 'hi'
              ? 'पूम्पुहार में कीझैयूर ईंटों की गोदी और रोमन एम्फोरा इसके अंतर्राष्ट्रीय बंदरगाह होने की पुष्टि करते हैं। यद्यपि साहित्यिक पात्रों की ऐतिहासिकता साहित्यिक परंपरा का हिस्सा है।'
              : 'Excavations at Poompuhar (Kizhayur brick dockyard, ring wells, Roman amphorae) verify a bustling Sangam-era port. However, specific personal narratives of epic characters represent literary tradition rather than direct stratigraphic evidence.')
        },
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'கல்வெட்டுச் சான்று' : (lang === 'hi' ? 'शिलालेख साक्ष्य' : 'Epigraphical Evidence'),
          text: lang === 'ta'
            ? 'மாங்குளம் தமிழ்-பிராமி கல்வெட்டுகள் (கி.மு. 2-ஆம் நூற்றாண்டு) காப்பியத்தில் குறிப்பிடப்படும் பாண்டிய நெடுஞ்செழியன் கால ஆட்சி மற்றும் கொடைகளை உறுதி செய்கின்றன.'
            : (lang === 'hi'
              ? 'मांगुलम तमिल-ब्राह्मी शिलालेख (दूसरी शताब्दी ईसा पूर्व) महाकाव्य में उल्लिखित पाण्ड्य राजा नेडुंजेझियन के शासन व अनुदानों को प्रमाणित करते हैं।'
              : 'Mangulam Tamil-Brahmi rock inscriptions (2nd c. BCE) confirm early Pandyan royal names such as Neduncheziyan contemporary to Sangam records.')
        }
      ],
      sources: [
        {
          id: 'cict-classical-tamil',
          title: 'CICT Classical Tamil Literature Corpus',
          institution: 'Central Institute of Classical Tamil, Govt. of India',
          url: 'https://www.digitalarchives.cict.in/',
          confidence: 'confirmed'
        },
        {
          id: 'tn-archaeology',
          title: 'Tamil Nadu State Department of Archaeology Excavation Reports',
          institution: 'Department of Archaeology, Government of Tamil Nadu',
          url: 'https://www.tnarch.gov.in/',
          confidence: 'confirmed'
        },
        {
          id: 'dharma-epigraphy',
          title: 'DHARMA Epigraphical Database',
          institution: 'EFEO & European Research Council',
          url: 'https://erc-dharma.github.io/',
          confidence: 'confirmed'
        }
      ],
      suggestedQuestions: [
        lang === 'ta' ? "கண்ணகியின் பயணம் எங்கு தொடங்குகிறது?" : (lang === 'hi' ? "कन्नगी की यात्रा कहाँ से आरम्भ होती है?" : "Where does Kannagi's journey take place?"),
        lang === 'ta' ? "சிலப்பதிகாரம் பண்டைய மதுரையைப் பற்றி என்ன கூறுகிறது?" : (lang === 'hi' ? "शिलप्पादिकारम प्राचीन मदुरै के बारे में क्या बताता है?" : "What does Silappadikaram tell us about ancient Madurai?"),
        lang === 'ta' ? "பூம்புகாரின் தொல்லியல் ஆதாரங்கள் யாவை?" : (lang === 'hi' ? "पूम्पुहार के पुरातात्विक साक्ष्य क्या हैं?" : "Show archaeological evidence for Puhar"),
        lang === 'ta' ? "இளங்கோ அடிகள் யார்?" : (lang === 'hi' ? "इलांगो अडिगल कौन थे?" : "Who was Ilango Adigal?")
      ]
    };
  }

  // 2. HINDU TEMPLE ARCHITECTURE & SACRED SITES (Brihadisvara, Shore Temple, Meenakshi, Kailasanathar, etc.)
  if (
    q.includes('temple') || 
    q.includes('கோயில்') || 
    q.includes('மନ୍ଦிர') || 
    q.includes('मंदिर') ||
    q.includes('thanjavur') || 
    q.includes('தஞ்சாவூர்') || 
    q.includes('तंजावुर') ||
    q.includes('brihadisvara') || 
    q.includes('பெருவுடையார்') || 
    q.includes('mamallapuram') || 
    q.includes('மாமல்லபுரம்') || 
    q.includes('shore temple') || 
    q.includes('chola') || 
    q.includes('pallava') || 
    q.includes('rajaraja') ||
    q.includes('hindu') ||
    q.includes('hinduism') ||
    q.includes('devaram') ||
    q.includes('architecture')
  ) {
    const thanjavur = places.find(p => p.id === 'thanjavur') || {
      id: 'thanjavur',
      name: 'Thanjavur Brihadisvara Temple',
      tamilName: 'தஞ்சாவூர் பெரிய கோயில் (பெருவுடையார்)',
      hindiName: 'तंजावुर बृहदीश्वर मन्दिर',
      lat: 10.7828,
      lng: 79.1318
    };
    const gangai = places.find(p => p.id === 'gangaikonda-cholapuram') || {
      id: 'gangaikonda-cholapuram',
      name: 'Gangaikonda Cholapuram',
      tamilName: 'கங்கைகொண்ட சோழபுரம்',
      hindiName: 'गंगैकोण्ड चोलपुरम',
      lat: 11.2056,
      lng: 79.4526
    };
    const shore = places.find(p => p.id === 'mamallapuram' || p.id === 'temple-tamp-001') || {
      id: 'mamallapuram',
      name: 'Shore Temple, Mamallapuram',
      tamilName: 'மாமல்லபுரம் கடற்கரைக் கோயில்',
      hindiName: 'तटीय मन्दिर (शोर टेम्पल), मामल्लपुरम',
      lat: 12.6167,
      lng: 80.1994
    };

    return {
      type: 'sacred_architecture',
      id: 'brihadisvara-complex',
      badge: 'UNESCO HERITAGE',
      title: lang === 'ta' ? 'தஞ்சாவூர் பெருவுடையார் கோயில்' : (lang === 'hi' ? 'बृहदीश्वर मन्दिर (तंजावुर)' : 'Brihadisvara Temple (Thanjavur)'),
      bilingualTitle: lang === 'ta' ? 'தஞ்சாவூர் பெரிய கோயில் • Brihadisvara Temple' : (lang === 'hi' ? 'तंजावुर बृहदीश्वर मन्दिर • Brihadisvara Temple' : 'தஞ்சாவூர் Brihadisvara Temple'),
      subtitle: lang === 'ta'
        ? 'முதலாம் இராஜராஜ சோழனால் கி.பி. 1010-ல் அமைக்கப்பட்ட திராவிடக் கட்டிடக்கலையின் மகுடம். முழுவதும் கருங்கல்லால் ஆன 216 அடி உயர விமானம் கொண்ட உலகப் பாரம்பரியச் சின்னம்.'
        : (lang === 'hi'
          ? 'सम्राट राजराज चोल प्रथम द्वारा 1010 ईस्वी में निर्मित द्रविड़ स्थापत्य कला का शिखर। सम्पूर्ण ग्रेनाइट से निर्मित 216 फीट ऊँचा विमान एवं यूनेस्को विश्व धरोहर स्थल।'
          : 'The pinnacle of Dravidian granite sacred architecture completed in 1010 CE by Emperor Rajaraja Chola I, featuring a 216-foot vimana plinth covered in administrative inscriptions.'),
      quote: {
        text: lang === 'ta'
          ? '“ஸ்வஸ்திஸ்ரீ திருவாளர் வளர இருநில மடந்தையும்... நாம் குடுத்தவும் நம் அக்கன் குடுத்தவும் நம் பெண்டுகள் குடுத்தவும் கல்லில் வெட்டுக...”'
          : (lang === 'hi'
            ? '“हमारे, हमारी ज्येष्ठ भगिनी, और हमारी रानियों द्वारा दिए गए सभी उपहार इस पवित्र पाषाण पर उत्कीर्ण किए जाएँ।”'
            : '“Let our gifts, those of our elder sister, and our queens be engraved on this sacred stone plinth.”'),
        attribution: lang === 'ta' ? '— தஞ்சைக் கல்வெட்டு வரி 1' : '— Rajaraja Chola I Inscription (1010 CE)'
      },
      entityCardsSection: {
        title: lang === 'ta' ? "மாபெரும் சோழர் கோயில்கள்" : (lang === 'hi' ? "महान चोल मन्दिर" : "Great Living Chola & Pallava Temples"),
        bilingualTitle: lang === 'ta' ? "மாபெரும் கோயில்கள் Sacred Hindu Temples" : (lang === 'hi' ? "पवित्र मन्दिर • Sacred Hindu Temples" : "Sacred Hindu Temples மாபெரும் கோயில்கள்"),
        entities: [
          {
            id: 'thanjavur',
            name: 'Brihadisvara Temple, Thanjavur',
            tamilName: 'தஞ்சாவூர் பெரிய கோயில்',
            hindiName: 'तंजावुर बृहदीश्वर मन्दिर',
            description: lang === 'ta'
              ? 'இராஜராஜ சோழனின் பிரம்மாண்ட திருப்பணி. 100-க்கும் மேற்பட்ட நிருவாகக் கல்வெட்டுகள், 400 ஆடல் மகளிரின் பெயர்கள் கொண்ட வரலாற்று ஆவணம்.'
              : (lang === 'hi'
                ? 'राजराज चोल का महान निर्माण। 100 से अधिक प्रशासनिक शिलालेख और 400 नर्तकियों के नामों से युक्त ऐतिहासिक धरोहर।'
                : 'Built by Rajaraja Chola I. Its stone basement plinth records administrative officers, musicians, and 400 temple dancers.'),
            evidenceTags: ['Epigraphical', 'Archaeological'],
            lat: thanjavur.lat || 10.7828,
            lng: thanjavur.lng || 79.1318,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'gangaikonda-cholapuram',
            name: 'Gangaikonda Cholapuram',
            tamilName: 'கங்கைகொண்ட சோழபுரம்',
            hindiName: 'गंगैकोण्ड चोलपुरम',
            description: lang === 'ta'
              ? 'இராஜேந்திர சோழன் கங்கை வரை வென்று அமைத்த புதிய தலைநகரத்தின் பிரம்மாண்ட சிவன் கோயில்.'
              : (lang === 'hi'
                ? 'राजेन्द्र चोल द्वारा गंगा विजय के उपलक्ष्य में निर्मित नवीन राजधानी का विशाल शिव मन्दिर।'
                : 'Built by Rajendra Chola I after his expedition to the Ganges; feminine curvature vimana counterpart to Thanjavur.'),
            evidenceTags: ['Epigraphical', 'Archaeological'],
            lat: gangai.lat || 11.2056,
            lng: gangai.lng || 79.4526,
            image: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'mamallapuram',
            name: 'Shore Temple, Mamallapuram',
            tamilName: 'மாமல்லபுரம் கடற்கரைக் கோயில்',
            hindiName: 'तटीय मन्दिर, मामल्लपुरम',
            description: lang === 'ta'
              ? 'பல்லவ அரசன் நரசிம்மவர்மன் (இரண்டாம் இராஜசிம்மன்) காலத்தில் அமைக்கப்பட்ட முற்காலக் கருங்கல் கோயில் (கி.பி. 700–728).'
              : (lang === 'hi'
                ? 'पल्लव नरेश नरसिंहवर्मन द्वितीय (राजसिंह) द्वारा निर्मित प्रारंभिक पाषाण मन्दिर संकुल (700–728 ईस्वी)।'
                : 'Pallava structural granite complex built under Narasimhavarman II (Rajasimha) overlooking the Bay of Bengal.'),
            evidenceTags: ['Archaeological', 'Epigraphical'],
            lat: shore.lat || 12.6167,
            lng: shore.lng || 80.1994,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      actions: [
        {
          type: 'showJourney',
          title: lang === 'ta' ? 'கோயில் சுற்றை வரைபடத்தில் காண்க' : (lang === 'hi' ? 'मन्दिर परिपथ मानचित्र पर देखें' : 'Show Temple Circuit on Map'),
          subtitle: lang === 'ta' ? 'தஞ்சாவூர் • கங்கை கொண்ட சோழபுரம் • மாமல்லபுரம்' : (lang === 'hi' ? 'तंजावुर • गंगैकोण्ड चोलपुरम • मामल्लपुरम' : 'Thanjavur • Gangaikonda Cholapuram • Mamallapuram'),
          icon: 'map',
          payload: {
            routeId: 'temple-circuit',
            stops: [
              { name: 'Thanjavur', lat: 10.7828, lng: 79.1318 },
              { name: 'Gangaikonda Cholapuram', lat: 11.2056, lng: 79.4526 },
              { name: 'Mamallapuram', lat: 12.6167, lng: 80.1994 }
            ]
          }
        },
        {
          type: 'viewTimeline',
          title: lang === 'ta' ? 'காலவரிசையைக் காண்க (கி.பி. 1000)' : (lang === 'hi' ? 'कालक्रम देखें (1000 ईस्वी)' : 'View Timeline (1000 CE)'),
          subtitle: lang === 'ta' ? 'சோழப் பேரரசு உச்சக் காலம்' : (lang === 'hi' ? 'मध्यकालीन चोल साम्राज्य का चरमोत्कर्ष' : 'Medieval Chola Golden Age'),
          icon: 'clock',
          payload: { periodId: 'medieval', year: 1010 }
        },
        {
          type: 'relatedPeople',
          title: lang === 'ta' ? 'தொடர்புடைய மன்னர்கள்' : (lang === 'hi' ? 'सम्बन्धित सम्राट' : 'Related Monarchs'),
          subtitle: lang === 'ta' ? 'முதலாம் இராஜராஜன் • இராஜேந்திரன்' : (lang === 'hi' ? 'राजराज चोल • राजेन्द्र चोल' : 'Rajaraja Chola I • Rajendra Chola I'),
          icon: 'users',
          payload: { peopleIds: ['rajaraja-chola', 'rajendra-chola'] }
        }
      ],
      evidence: [
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'கல்வெட்டுச் சான்று' : (lang === 'hi' ? 'शिलालेख साक्ष्य' : 'Epigraphical Evidence'),
          text: lang === 'ta'
            ? 'தஞ்சாவூர் தென்புற சுவரில் பொறிக்கப்பட்டுள்ள நூற்றுக்கணக்கான கல்வெட்டுகள் கோயில் கட்டுமானம், நிதி ஒதுக்கீடுகள் மற்றும் நிருவாக அமைப்பை உறுதிப்படுத்துகின்றன.'
            : (lang === 'hi'
              ? 'बृहदीश्वर मन्दिर के दक्षिणी भित्ति पर उत्कीर्ण अभिलेख मन्दिर निर्माण वर्ष (1010 ईस्वी) एवं राजराज चोल के प्रशासनिक आदेशों को प्रमाणित करते हैं।'
              : 'The South Wall Inscriptions of Brihadisvara preserve the exact consecration chronology (1010 CE), copper endowment records, and village land measurements.')
        },
        {
          type: 'archaeological',
          label: lang === 'ta' ? 'தொல்லியல் & கட்டிடக்கலை' : (lang === 'hi' ? 'पुरातात्विक व स्थापत्य साक्ष्य' : 'Archaeological & Architectural Analysis'),
          text: lang === 'ta'
            ? 'இந்தியத் தொல்லியல் துறை (ASI) ஆய்வுகள் முழுவதும் கருங்கற்களால் பிணைக்கப்பட்ட (interlocking granite) கட்டுமானத் தொழில்நுட்பத்தை விளக்குகின்றன.'
            : (lang === 'hi'
              ? 'भारतीय पुरातत्व सर्वेक्षण (ASI) के अनुसार यह सम्पूर्ण मन्दिर बिना गारे के परस्पर जुड़े ग्रेनाइट पाषाणों (इंटरलाकिंग) से निर्मित एक अद्वितीय इंजीनियरिंग चमत्कार है।'
              : 'ASI stratigraphic and architectural surveys confirm monolithic interlocking dry-stone masonry with zero binding mortar in the upper hollow vimana tower.')
        }
      ],
      sources: [
        {
          id: 'asi-monuments',
          title: 'Archaeological Survey of India (ASI) Monument Inventory',
          institution: 'Archaeological Survey of India, Govt. of India',
          url: 'https://asi.nic.in/',
          confidence: 'confirmed'
        },
        {
          id: 'dharma-epigraphy',
          title: 'DHARMA Epigraphical Database (South Indian Inscriptions)',
          institution: 'EFEO & European Research Council',
          url: 'https://erc-dharma.github.io/',
          confidence: 'confirmed'
        }
      ],
      suggestedQuestions: [
        lang === 'ta' ? "தஞ்சை பெரிய கோயிலைக் கட்டியது யார்?" : (lang === 'hi' ? "बृहदीश्वर मन्दिर का निर्माण किसने करवाया था?" : "Tell me about Brihadisvara Temple"),
        lang === 'ta' ? "தஞ்சாவூருடன் தொடர்புடைய சோழ மன்னர்கள் யாவர்?" : (lang === 'hi' ? "तंजावुर से जुड़े चोल शासक कौन हैं?" : "Which Chola rulers are connected to Thanjavur?"),
        lang === 'ta' ? "தஞ்சாவூர் கோயிலின் கல்வெட்டுகள் என்ன சொல்கின்றன?" : (lang === 'hi' ? "तंजावुर के शिलालेखों में क्या दर्ज है?" : "What inscriptions survive here?"),
        lang === 'ta' ? "பல்லவர் மற்றும் சோழர் கோயில்களுக்கு உள்ள வேறுபாடு என்ன?" : (lang === 'hi' ? "पल्लव और चोल मन्दिरों में क्या अंतर है?" : "How did Chola architecture evolve from Pallava styles?")
      ]
    };
  }

  // 3. KEELADI & ARCHAEOLOGICAL EXCAVATIONS
  if (
    q.includes('keeladi') || 
    q.includes('கீழடி') || 
    q.includes('कीझड़ी') ||
    q.includes('adichanallur') || 
    q.includes('ஆதிச்சநல்லூர்') || 
    q.includes('archaeology') || 
    q.includes('excavation') || 
    q.includes('carbon') || 
    q.includes('brahmi')
  ) {
    const keeladi = places.find(p => p.id === 'keeladi') || {
      id: 'keeladi',
      name: 'Keeladi (Keezhadi)',
      tamilName: 'கீழடி',
      hindiName: 'कीझड़ी',
      lat: 9.8624,
      lng: 78.1884
    };
    const adicha = places.find(p => p.id === 'adichanallur') || {
      id: 'adichanallur',
      name: 'Adichanallur',
      tamilName: 'ஆதிச்சநல்லூர்',
      hindiName: 'आदिचनल्लूर',
      lat: 8.6300,
      lng: 77.8800
    };
    const kodu = places.find(p => p.id === 'kodumanal') || {
      id: 'kodumanal',
      name: 'Kodumanal',
      tamilName: 'கொடுமணல்',
      hindiName: 'कोडूमनाल',
      lat: 11.1111,
      lng: 77.4988
    };

    return {
      type: 'archaeological_discovery',
      id: 'keeladi-excavations',
      badge: 'ARCHAEOLOGY',
      title: lang === 'ta' ? 'கீழடி அகழாய்வு' : (lang === 'hi' ? 'कीझड़ी पुरातात्विक उत्खनन' : 'Keeladi Excavation Site'),
      bilingualTitle: lang === 'ta' ? 'கீழடி அகழாய்வு • Keeladi Excavation' : (lang === 'hi' ? 'कीझड़ी पुरातात्विक स्थल • Keeladi Excavation' : 'கீழடி Keeladi Excavation Site'),
      subtitle: lang === 'ta'
        ? 'வைகை நதிக்கரையில் அமைந்துள்ள 6-ஆம் நூற்றாண்டு (கி.மு. 580) நகர நாகரிகம். தமிழ்-பிராமி எழுத்தறிவும் தொழில்சார் வளமும் கொண்ட தொன்மை நாகரிகச் சான்று.'
        : (lang === 'hi'
          ? 'वैगई नदी घाटी में स्थित 6ठी शताब्दी ईसा पूर्व (580 ईसा पूर्व) का प्राचीन नगरीय स्थल। जनसामान्य में तमिल-ब्राह्मी साक्षरता का वैज्ञानिक प्रमाण।'
          : 'A major urban settlement on the Vaigai river basin securely carbon-dated to 580 BCE, proving widespread Tamil-Brahmi literacy contemporary to classical Greece.'),
      quote: {
        text: lang === 'ta'
          ? '“ஆதிச்சநல்லூர் ஈமத்தாழிகள் (கி.மு. 905–696) மற்றும் கீழடி மண்பாண்டக் கீறல்கள் சங்க காலத்தின் எழுத்தறிவையும் தொன்மையையும் பறைசாற்றுகின்றன.”'
          : (lang === 'hi'
            ? '“कार्बन डेटिंग ने प्रमाणित किया है कि वैगई घाटी में 580 ईसा पूर्व एक उन्नत नगरीय साक्षर सभ्यता फल-फूल रही थी।”'
            : '“AMS Carbon dating confirms urban civilization on the Vaigai basin as early as the 6th century BCE.”'),
        attribution: lang === 'ta' ? '— தமிழ்நாடு தொல்லியல் துறை அறிக்கை' : '— Tamil Nadu Archaeology Report (2019)'
      },
      entityCardsSection: {
        title: lang === 'ta' ? "முக்கிய அகழாய்வுத் தளங்கள்" : (lang === 'hi' ? "प्रमुख पुरातात्विक स्थल" : "Key Archaeological Sites"),
        bilingualTitle: lang === 'ta' ? "முக்கிய அகழாய்வுகள் Major Archaeological Sites" : (lang === 'hi' ? "प्रमुख उत्खनन स्थल • Archaeological Sites" : "Key Archaeological Sites முக்கிய அகழாய்வுகள்"),
        entities: [
          {
            id: 'keeladi',
            name: 'Keeladi',
            tamilName: 'கீழடி',
            hindiName: 'कीझड़ी',
            description: lang === 'ta'
              ? 'சுடுமண் செங்கல் சுவர்கள், நெசவுத் தறிகள், எடைக் கற்கள் மற்றும் தமிழ்-பிராமி பெயர் பொறித்த மண்பாண்டங்கள் கண்டறியப்பட்ட தளம்.'
              : (lang === 'hi'
                ? 'ईंटों की दीवारें, मनके, बुनाई उपकरण और तमिल-ब्राह्मी में नाम लिखे 1,000+ मृद्भांड।'
                : 'Stratified urban site yielding brick structures, weaving spindles, and potsherds inscribed with Tamil-Brahmi personal names.'),
            evidenceTags: ['Archaeological', 'Epigraphical'],
            lat: keeladi.lat || 9.8624,
            lng: keeladi.lng || 78.1884,
            image: 'https://images.unsplash.com/photo-1599827552599-eeddd5973dd8?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'adichanallur',
            name: 'Adichanallur',
            tamilName: 'ஆதிச்சநல்லூர்',
            hindiName: 'आदिचनल्लूर',
            description: lang === 'ta'
              ? 'தாமிரபரணி ஆற்றுப்படுகையில் உள்ள பிரம்மாண்ட இரும்புக்கால ஈமத்தாழி இடுகாடு (கி.மு. 905–696).'
              : (lang === 'hi'
                ? 'ताम्रपर्णी नदी घाटी में स्थित विशाल लौह-युगीन महापाषाणिक शवाधान स्थल।'
                : 'Extensive Iron Age urn burial site along the Tamirabarani river basin dating to 905–696 BCE.'),
            evidenceTags: ['Archaeological'],
            lat: adicha.lat || 8.6300,
            lng: adicha.lng || 77.8800,
            image: 'https://images.unsplash.com/photo-1599827552599-eeddd5973dd8?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'kodumanal',
            name: 'Kodumanal',
            tamilName: 'கொடுமணல்',
            hindiName: 'कोडूमनाल',
            description: lang === 'ta'
              ? 'நொய்யல் ஆற்றுப்படுகையில் அமைந்திருந்த சங்க கால ரத்தினக் கல் மற்றும் இரும்பு உருக்கு தொழிற்கூட மையம்.'
              : (lang === 'hi'
                ? 'संगम काल का प्रमुख रत्न-तराशी और लौह-प्रगलन औद्योगिक केन्द्र।'
                : 'Sangam-period gemstone cutting and iron smelting trade hub mentioned in classical poetry as Kodumanam.'),
            evidenceTags: ['Archaeological', 'Literary'],
            lat: kodu.lat || 11.1111,
            lng: kodu.lng || 77.4988,
            image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      actions: [
        {
          type: 'showJourney',
          title: lang === 'ta' ? 'அகழாய்வுத் தளங்களை வரைபடத்தில் காண்க' : (lang === 'hi' ? 'उत्खनन स्थल मानचित्र पर देखें' : 'Show Sites on Map'),
          subtitle: lang === 'ta' ? 'கீழடி • ஆதிச்சநல்லூர் • கொடுமணல்' : (lang === 'hi' ? 'कीझड़ी • आदिचनल्लूर • कोडूमनाल' : 'Keeladi • Adichanallur • Kodumanal'),
          icon: 'map',
          payload: {
            routeId: 'arch-circuit',
            stops: [
              { name: 'Kodumanal', lat: 11.1111, lng: 77.4988 },
              { name: 'Keeladi', lat: 9.8624, lng: 78.1884 },
              { name: 'Adichanallur', lat: 8.6300, lng: 77.8800 }
            ]
          }
        },
        {
          type: 'viewTimeline',
          title: lang === 'ta' ? 'காலவரிசையைக் காண்க (கி.மு. 600)' : (lang === 'hi' ? 'कालक्रम देखें (600 ईसा पूर्व)' : 'View Timeline (600 BCE)'),
          subtitle: lang === 'ta' ? 'இரும்புக்காலம் மற்றும் முன்-சங்க காலம்' : (lang === 'hi' ? 'प्रारंभिक लौह युग एवं पूर्व-संगम काल' : 'Iron Age & Pre-Sangam Era'),
          icon: 'clock',
          payload: { periodId: 'pre_sangam', year: -580 }
        }
      ],
      evidence: [
        {
          type: 'archaeological',
          label: lang === 'ta' ? 'தொல்லியல் சான்று (AMS கார்பன் கணிப்பு)' : (lang === 'hi' ? 'पुरातात्विक साक्ष्य (एएमएस कार्बन डेटिंग)' : 'Archaeological Evidence (AMS Carbon Dating)'),
          text: lang === 'ta'
            ? 'அமெரிக்காவின் பீட்டா அனலிடிக் ஆய்வகத்தில் மேற்கொள்ளப்பட்ட கார்பன் கணிப்பு (AMS) கீழடி அகழாய்வுப் பொருட்களை கி.மு. 580 என உறுதி செய்துள்ளது.'
            : (lang === 'hi'
              ? 'बीटा एनालिटिक लैब (USA) में त्वरित मास स्पेक्ट्रोमेट्री (AMS) द्वारा कार्बन-14 विश्लेषण से कीझड़ी की तिथि 580 ईसा पूर्व प्रमाणित हुई।'
              : 'Accelerator Mass Spectrometry (AMS) datings at Beta Analytic (USA) securely established the layer at 580 BCE.')
        },
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'கல்வெட்டியல் சான்று (மண்பாண்டக் கீறல்கள்)' : (lang === 'hi' ? 'अभिलेखीय साक्ष्य (मृद्भांड लिपि)' : 'Epigraphical Evidence (Potsherd Graffiti)'),
          text: lang === 'ta'
            ? 'ஆதன், குவிரன்-ஆதன் போன்ற தமிழ்ப் பெயர்கள் பொறிக்கப்பட்ட மண்பாண்ட ஓடுகள் சங்க கால மக்களின் பரவலான எழுத்தறிவுக்குச் சான்றாக அமைகின்றன.'
            : (lang === 'hi'
              ? 'मृद्भांडों पर "आथन" व "कुविरन-आथन" जैसे तमिल-ब्राह्मी नाम साधारण जनता की साक्षरता को दर्शाते हैं।'
              : 'Over 1,000 potsherds bearing Tamil-Brahmi personal names establish high civilian literacy levels.')
        }
      ],
      sources: [
        {
          id: 'tn-archaeology',
          title: 'Keeladi: An Urban Settlement of Sangam Age in the Banks of River Vaigai',
          institution: 'Department of Archaeology, Government of Tamil Nadu',
          url: 'https://www.tnarch.gov.in/',
          confidence: 'confirmed'
        },
        {
          id: 'cict-classical-tamil',
          title: 'CICT Epigraphy & Inscriptions Database',
          institution: 'Central Institute of Classical Tamil, Govt. of India',
          url: 'https://www.digitalarchives.cict.in/',
          confidence: 'confirmed'
        }
      ],
      suggestedQuestions: [
        lang === 'ta' ? "கீழடி அகழாய்வில் கண்டறியப்பட்ட முக்கியப் பொருட்கள் எவை?" : (lang === 'hi' ? "कीझड़ी में क्या महत्वपूर्ण अवशेष मिले हैं?" : "What has archaeology revealed at Keeladi?"),
        lang === 'ta' ? "கீழடி எவ்வாறு சங்க கால இலக்கியத்தோடு இணைகிறது?" : (lang === 'hi' ? "कीझड़ी का संगम साहित्य से क्या सम्बन्ध है?" : "How does Keeladi relate to Sangam-era society?"),
        lang === 'ta' ? "ஆதிச்சநல்லூர் அகழாய்வின் முக்கியத்துவம் என்ன?" : (lang === 'hi' ? "आदिचनल्लूर का ऐतिहासिक महत्व क्या है?" : "What makes Adichanallur significant?"),
        lang === 'ta' ? "கொடுமணலில் என்ன தொழில்கள் நடைபெற்றன?" : (lang === 'hi' ? "कोडूमनाल में कौन से उद्योग होते थे?" : "Show industries found at Kodumanal")
      ]
    };
  }

  // 4. GENERAL ENTITY SEARCH (Places, People, Inscriptions from verified dataset)
  const matchedPlace = places.find(p => 
    q.includes(p.name?.toLowerCase()) || 
    (p.tamilName && q.includes(p.tamilName)) ||
    (p.id && q.includes(p.id)) ||
    (p.district && q.includes(p.district.toLowerCase()))
  );

  const matchedPerson = people.find(p => 
    q.includes(p.name?.toLowerCase()) || 
    (p.tamilName && q.includes(p.tamilName)) ||
    (p.id && q.includes(p.id))
  );

  const matchedWork = works.find(w => 
    q.includes(w.title?.toLowerCase()) || 
    (w.tamilTitle && q.includes(w.tamilTitle)) ||
    (w.id && q.includes(w.id))
  );

  if (matchedPlace) {
    const displayName = lang === 'ta' ? (matchedPlace.tamilName || matchedPlace.name) : (lang === 'hi' ? (matchedPlace.hindiName || matchedPlace.name) : matchedPlace.name);
    const bilingual = `${matchedPlace.tamilName || ''} • ${matchedPlace.name}`;
    const desc = lang === 'ta' ? (matchedPlace.whyItMatters || matchedPlace.shortDescription) : (matchedPlace.whyItMatters || matchedPlace.shortDescription);

    return {
      type: 'place_focus',
      id: matchedPlace.id,
      badge: 'HERITAGE SITE',
      title: displayName,
      bilingualTitle: bilingual,
      subtitle: desc,
      entityCardsSection: {
        title: lang === 'ta' ? "இடத்தின் விவரங்கள்" : (lang === 'hi' ? "स्थल विवरण" : "Place Details"),
        entities: [
          {
            id: matchedPlace.id,
            name: matchedPlace.name,
            tamilName: matchedPlace.tamilName,
            hindiName: matchedPlace.hindiName,
            description: desc,
            evidenceTags: matchedPlace.categories?.includes('archaeology') ? ['Archaeological'] : ['Epigraphical', 'Historical Tradition'],
            lat: matchedPlace.lat,
            lng: matchedPlace.lng,
            image: matchedPlace.image
          }
        ]
      },
      actions: [
        {
          type: 'focusPlace',
          title: lang === 'ta' ? 'வரைபடத்தில் காண்க' : (lang === 'hi' ? 'मानचित्र पर देखें' : 'View on Map'),
          subtitle: `${matchedPlace.name} (${matchedPlace.district || 'Tamil Nadu'})`,
          icon: 'pin',
          payload: { place: matchedPlace }
        }
      ],
      evidence: [
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'வரலாற்றுப் பின்னணி' : (lang === 'hi' ? 'ऐतिहासिक पृष्ठभूमि' : 'Historical Context'),
          text: matchedPlace.fullStory || matchedPlace.shortDescription
        }
      ],
      sources: (matchedPlace.sources || ['asi-monuments']).map(sId => sourcesRegistry[sId] || { id: sId, title: sId, institution: 'Verified Dataset Source' }),
      suggestedQuestions: [
        lang === 'ta' ? `${matchedPlace.name} பற்றி விரிவாகக் கூறு` : `Tell me more about ${matchedPlace.name}`,
        lang === 'ta' ? "இங்குள்ள கல்வெட்டுகள் யாவை?" : "What inscriptions survive here?",
        lang === 'ta' ? "இதன் வரலாற்று பின்னணி என்ன?" : "What is the historical significance of this site?"
      ]
    };
  }

  if (matchedPerson) {
    const displayName = lang === 'ta' ? (matchedPerson.tamilName || matchedPerson.name) : matchedPerson.name;
    const bilingual = `${matchedPerson.tamilName || ''} • ${matchedPerson.name}`;
    const desc = matchedPerson.bio;
    const associatedPlaces = (matchedPerson.associatedPlaceIds || []).map(id => places.find(p => p.id === id)).filter(Boolean);

    return {
      type: 'person_focus',
      id: matchedPerson.id,
      badge: 'HISTORICAL FIGURE',
      title: displayName,
      bilingualTitle: bilingual,
      subtitle: desc,
      entityCardsSection: {
        title: lang === 'ta' ? "ஆளுமையின் விவரங்கள்" : "Personality Dossier",
        entities: [
          {
            id: matchedPerson.id,
            name: matchedPerson.name,
            tamilName: matchedPerson.tamilName,
            role: matchedPerson.role,
            description: desc,
            evidenceTags: ['Literary', 'Historical Tradition'],
            lat: associatedPlaces[0]?.lat || 10.7828,
            lng: associatedPlaces[0]?.lng || 79.1318,
            image: matchedPerson.image
          }
        ]
      },
      actions: [
        ...(associatedPlaces[0] ? [{
          type: 'focusPlace',
          title: lang === 'ta' ? `${associatedPlaces[0].name} வரைபடத்தில் காண்க` : `View ${associatedPlaces[0].name} on Map`,
          subtitle: associatedPlaces[0].district || 'Tamil Nadu',
          icon: 'pin',
          payload: { place: associatedPlaces[0] }
        }] : []),
        {
          type: 'openPeopleModal',
          title: lang === 'ta' ? 'முழு வரலாற்று ஆவணக் காப்பகம்' : 'Full Biographical Archive',
          subtitle: lang === 'ta' ? 'தமிழக ஆளுமைகள் காப்பகத்தில் காண்க' : 'Open in Spatial Biographies archive',
          icon: 'users',
          payload: { peopleIds: [matchedPerson.id], initialPersonId: matchedPerson.id }
        }
      ],
      evidence: [
        {
          type: 'literary',
          label: lang === 'ta' ? 'இலக்கியம் & பணிகள்' : 'Works & Authorship',
          text: (matchedPerson.works || []).join(', ') || 'Attested in classical Tamil literary corpora.'
        },
        {
          type: 'epigraphical',
          label: lang === 'ta' ? 'கல்வெட்டுச் சான்றுகள்' : 'Epigraphical Attestations',
          text: (matchedPerson.inscriptions || []).join(', ') || 'Mentioned in regional stone epigraphs.'
        }
      ],
      sources: (matchedPerson.sources || ['cict-classical-tamil']).map(sId => sourcesRegistry[sId] || { id: sId, title: sId, institution: 'Verified Source' }),
      suggestedQuestions: [
        lang === 'ta' ? `${matchedPerson.name} இயற்றிய நூல்கள் யாவை?` : `What works are attributed to ${matchedPerson.name}?`,
        lang === 'ta' ? "இவருடன் தொடர்புடைய இடங்கள் எவை?" : `What places are associated with ${matchedPerson.name}?`
      ]
    };
  }

  // Fallback: Welcome & Capability Guide
  return {
    type: 'general_welcome',
    id: 'heritage-guide-welcome',
    badge: 'GUIDE',
    title: lang === 'ta' ? 'AI மரபு வழிகாட்டி' : (lang === 'hi' ? 'एआई हेरिटেজ गाइड' : 'AI Heritage Guide'),
    bilingualTitle: lang === 'ta' ? 'வணக்கம்! Welcome to Geoதமிழ்' : (lang === 'hi' ? 'नमस्ते! Welcome to Geoதமிழ்' : 'வணக்கம்! Welcome to Geoதமிழ்'),
    subtitle: lang === 'ta'
      ? '2,600+ ஆண்டுகால தமிழக வரலாறு, சோழர்/பல்லவர் திருக்கோயில்கள், சங்க இலக்கியங்கள் மற்றும் கீழடி/ஆதிச்சநல்லூர் தொல்லியல் சான்றுகளை ஆதாரங்களுடன் ஆராயுங்கள்.'
      : (lang === 'hi'
        ? '2,600 से अधिक वर्षों के तमिल इतिहास, चोल/पल्लव मन्दिरों, संगम साहित्य और पुरातात्विक साक्ष्यों का प्रामाणिक अन्वेषण करें।'
        : 'Explore over 2,600 years of Tamil civilization, great living temples, Sangam literature, and archaeological excavations strictly grounded in curated sources.'),
    actions: [
      {
        type: 'exploreTopic',
        title: lang === 'ta' ? 'சிலப்பதிகார இடங்கள்' : (lang === 'hi' ? 'शिलप्पादिकारम के स्थल' : 'Silappadikaram Places'),
        subtitle: lang === 'ta' ? 'பூம்புகார் • மதுரை • வஞ்சி' : 'Puhar • Madurai • Vanji',
        icon: 'map',
        query: 'What places are connected to Silappadikaram?'
      },
      {
        type: 'exploreTopic',
        title: lang === 'ta' ? 'தஞ்சைப் பெரிய கோயில்' : (lang === 'hi' ? 'बृहदीश्वर मन्दिर' : 'Brihadisvara Temple'),
        subtitle: lang === 'ta' ? 'சோழர் கட்டிடக்கலை மற்றும் கல்வெட்டுகள்' : 'Chola Architecture & Inscriptions',
        icon: 'temple',
        query: 'Tell me about Brihadisvara Temple'
      },
      {
        type: 'exploreTopic',
        title: lang === 'ta' ? 'கீழடி அகழாய்வு' : (lang === 'hi' ? 'कीझड़ी उत्खनन' : 'Keeladi Excavations'),
        subtitle: lang === 'ta' ? 'கி.மு. 580 வைகை நதி நாகரிகம்' : '580 BCE Vaigai River Civilization',
        icon: 'layers',
        query: 'What has archaeology revealed at Keeladi?'
      }
    ],
    suggestedQuestions: [
      lang === 'ta' ? "சிலப்பதிகாரத்துடன் தொடர்புடைய இடங்கள் எவை?" : (lang === 'hi' ? "शिलप्पादिकारम से जुड़े स्थल कौन से हैं?" : "What places are connected to Silappadikaram?"),
      lang === 'ta' ? "தஞ்சைப் பெரிய கோயிலின் சிறப்புகள் என்ன?" : (lang === 'hi' ? "बृहदीश्वर मन्दिर का महत्व क्या है?" : "Tell me about Brihadisvara Temple"),
      lang === 'ta' ? "கீழடி அகழாய்வு ஏன் முக்கியத்துவம் வாய்ந்தது?" : (lang === 'hi' ? "कीझड़ी पुरातात्विक स्थल क्यों महत्वपूर्ण है?" : "What has archaeology revealed at Keeladi?"),
      lang === 'ta' ? "சோழர்களின் கடற்படைப் பயணம் பற்றி சொல்" : (lang === 'hi' ? "चोलों के नौसैनिक अभियानों के बारे में बताइए" : "Tell me about Chola naval expeditions")
    ]
  };
}
