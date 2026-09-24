/**
 * Geoதமிழ் Heritage Domain Scope Guard
 * 
 * Accurately detects and handles off-topic / out-of-domain inquiries
 * (such as programming/coding requests, math calculations, and everyday off-topic trivia)
 * to keep the AI Heritage Guide authoritative, respectful, and strictly focused on Tamil heritage.
 */

// Patterns indicating software engineering, programming code, or computer science requests
const CODING_PATTERNS = [
  /\b(python|javascript|typescript|java|c\+\+|c#|golang|rust|php|ruby|swift|kotlin|html|css|sql|bash|powershell)\b/i,
  /\b(code|coding|program|script|function|algorithm|palindrome|leetcode|hackerrank|regex|fibonacci|recursion|debug|compiler|syntax)\b/i,
  /\b(loop|array|linked list|stack|queue|hashmap|json|api|framework|react|angular|vue|django|flask|node\.?js|npm|pip)\b/i,
  /\b(binary search|bubble sort|time complexity|big o|object oriented|class definition)\b/i
];

// Patterns for pure mathematics, STEM calculations, or homework
const MATH_STEM_PATTERNS = [
  /\b(derivative|integral|calculus|quadratic|equation|solve\s+for\s+[a-z]|solve\s+[\d\+\-\*\/\^\=x]+|math homework|trigonometry|algebra|geometry)\b/i,
  /^\s*[\d\s\+\-\*\/\^\(\)\=\.x]{3,}\s*$/ // e.g. "2 + 2", "50 * 12", "2x + 5 = 15"
];

// Patterns for general off-topic everyday non-heritage inquiries
const OFF_TOPIC_PATTERNS = [
  /\b(recipe|bake a cake|how to cook|ingredients for|diet plan)\b/i,
  /\b(bitcoin|crypto|cryptocurrency|stock market|forex|investing tips|shares price)\b/i,
  /\b(tell me a joke|write a poem about love|flirt with me|dating advice|horoscope)\b/i,
  /\b(weather today|weather in|flight tickets|hotel booking|current temperature)\b/i,
  /\b(write an essay on|homework help|capital of (france|germany|usa|uk|japan|canada|russia|china|australia))\b/i
];

// Tamil Heritage signals that give context
const HERITAGE_SIGNALS = [
  /\b(tamil|tamizh|sangam|chola|pandya|chera|pallava|keeladi|adichanallur|silappadikaram|manimekalai|thirukkural|inscriptions?|brahmi|kannagi|kovalan|rajaraja|madurai|thanjavur|poompuhar|muziris|korkai|kodumanal|mayiladumparai)\b/i,
  /[\u0B80-\u0BFF]/ // Tamil script unicode block
];

/**
 * Checks if a query is out-of-scope for the Tamil Heritage Guide
 */
export function checkQueryScope(query = '') {
  const q = (query || '').toLowerCase().trim();
  if (!q) return { isOutOfScope: false };

  const isCoding = CODING_PATTERNS.some(re => re.test(q));
  const isMath = MATH_STEM_PATTERNS.some(re => re.test(q));
  const isOffTopic = OFF_TOPIC_PATTERNS.some(re => re.test(q));

  if (!isCoding && !isMath && !isOffTopic) {
    return { isOutOfScope: false };
  }

  // If query explicitly asks to generate code/functions/algorithms, it is always out of scope
  const isExplicitProgramming = /\b(code|coding|function|script|palindrome|leetcode|program in|code in|write a code|give me code|write code)\b/i.test(q);
  if (isExplicitProgramming) {
    return { isOutOfScope: true, category: 'coding' };
  }

  // Check if heritage signals exist
  const hasHeritageSignal = HERITAGE_SIGNALS.some(re => re.test(q));
  if (hasHeritageSignal) {
    // Has heritage context, let Groq RAG evaluate nuance
    return { isOutOfScope: false };
  }

  return {
    isOutOfScope: true,
    category: isCoding ? 'coding' : (isMath ? 'math' : 'general_off_topic')
  };
}

/**
 * Returns a museum-grade out-of-scope guidance object
 */
export function getOutOfScopeResponse(lang = 'en', category = 'coding') {
  const isTamil = lang === 'ta';
  const isHindi = lang === 'hi';

  let specificNote = '';
  if (category === 'coding') {
    specificNote = isTamil 
      ? 'கணினி நிரலாக்கக் குறியீடுகள் (Programming Code) அல்லது மென்பொருள் உருவாக்கப் பணிகளுக்கு என்னால் உதவ இயலாது.'
      : (isHindi 
        ? 'मैं कंप्यूटर कोडिंग, प्रोग्रामिंग या सॉफ्टवेयर विकास में सहायता करने में असमर्थ हूँ।'
        : 'I cannot generate programming code, debug software, or assist with computer science tasks.');
  } else if (category === 'math') {
    specificNote = isTamil
      ? 'கணிதச் சமன்பாடுகள் அல்லது அறிவியல் கணக்கீடுகளுக்கு என்னால் விடையளிக்க இயலாது.'
      : (isHindi
        ? 'मैं गणितीय गणनाओं या विज्ञान के प्रश्नों का समाधान करने में असमर्थ हूँ।'
        : 'I cannot perform mathematical equations or general STEM computations.');
  } else {
    specificNote = isTamil
      ? 'வரலாறு சாராத அன்றாடப் பொது வினாக்களுக்கு என்னால் விடையளிக்க இயலாது.'
      : (isHindi
        ? 'मैं तमिल इतिहास से असंबद्ध सामान्य विषयों पर उत्तर देने में असमर्थ हूँ।'
        : 'I cannot answer general off-topic inquiries outside Tamil heritage.');
  }

  const title = isTamil 
    ? 'தமிழ் வரலாற்று வழிகாட்டி வரம்பு'
    : (isHindi ? 'तमिल विरासत गाइड का दायरा' : 'Heritage Guide Domain Focus');

  const bilingualTitle = isTamil
    ? 'மரபு வழிகாட்டி வரம்பு • Domain Scope'
    : (isHindi ? 'विरासत डोमेन दायरा • Domain Scope' : 'Heritage Domain Focus • மரபு வழிகாட்டி வரம்பு');

  const subtitle = isTamil
    ? `வணக்கம்! நான் Geoதமிழ் AI வரலாற்று வழிகாட்டி ஆவேன். எனது நோக்கம் 2,600+ ஆண்டுகால தமிழ் வரலாறு, சங்க இலக்கியங்கள், சோழர்/பாண்டியர் வரலாற்றுத் தலங்கள் மற்றும் கீழடி தொல்லியல் சான்றுகளை ஆராய்வதாகும். ${specificNote}`
    : (isHindi
      ? `नमस्ते! मैं जियोतमिल एआई विरासत गाइड हूँ। मेरा उद्देश्य 2,600 से अधिक वर्षों के तमिल इतिहास, संगम साहित्य, चोल/पाण्ड्य स्मारकों और पुरातात्विक साक्ष्यों का प्रामाणिक अन्वेषण कराना है। ${specificNote}`
      : `I am the Geoதமிழ் AI Heritage Guide, dedicated exclusively to exploring 2,600+ years of Tamil civilization, Sangam literature, ancient temple architecture, and archaeological excavations. ${specificNote}`);

  const suggestedQuestions = isTamil
    ? [
        'சிலப்பதிகாரத்துடன் தொடர்புடைய இடங்கள் எவை?',
        'கீழடி அகழாய்வு ஏன் முக்கியத்துவம் வாய்ந்தது?',
        'தஞ்சைப் பெரிய கோயிலின் சிறப்புகள் என்ன?',
        'சங்க காலத் துறைமுகங்கள் (பூம்புகார், முசிறி) பற்றி கூறு'
      ]
    : (isHindi
      ? [
          'सिलप्पादिकारम से जुड़े प्रमुख स्थल कौन से हैं?',
          'कीलड़ी पुरातात्विक उत्खनन क्यों ऐतिहासिक है?',
          'बृहदीश्वर मन्दिर का वास्तुशिल्प कैसा है?',
          'संगम काल के प्रमुख व्यापारिक बंदरगाह कौन से थे?'
        ]
      : [
          'What places are connected to Silappadikaram?',
          'What has archaeology revealed at Keeladi?',
          'Tell me about Brihadisvara Temple',
          'Tell me about Chola naval expeditions'
        ]);

  return {
    type: 'out_of_scope',
    id: `scope-${Date.now()}`,
    isOutOfScope: true,
    badge: isTamil ? 'மரபு வழிகாட்டி வரம்பு' : (isHindi ? 'डोमेन दायरा' : 'HERITAGE DOMAIN FOCUS'),
    title,
    bilingualTitle,
    subtitle,
    suggestedQuestions,
    // Do NOT include fake timeline or sources for out of scope answers
    actions: [],
    sources: [],
    evidence: []
  };
}
