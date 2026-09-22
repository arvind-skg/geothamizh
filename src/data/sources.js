// Provenance & Source Evidence Registry
// Conforms to GeoThamizh Data Quality Rules & Section 37 Source Schema

export const SOURCES = {
  'dharma-epigraphy': {
    id: 'dharma-epigraphy',
    title: 'DHARMA (The Domitian Agency and Its Historical Roles in Maritime Asia) Epigraphical Database',
    institution: 'European Research Council & École française d\'Extrême-Orient (EFEO)',
    url: 'https://erc-dharma.github.io/',
    license: 'CC BY 4.0',
    evidenceType: 'epigraphic',
    confidence: 'high',
    notes: 'Critical scholarly editions, transliterations, and translations of South Indian and Tamil inscriptions.'
  },
  'tn-archaeology': {
    id: 'tn-archaeology',
    title: 'Tamil Nadu State Department of Archaeology Excavation Reports (Keeladi, Korkai, Kodumanal)',
    institution: 'Department of Archaeology, Government of Tamil Nadu',
    url: 'https://www.tnarch.gov.in/',
    license: 'Government Open Data / Public Domain Citations',
    evidenceType: 'archaeological',
    confidence: 'high',
    notes: 'Stratigraphic excavation reports, AMS carbon dating results, and structural findings.'
  },
  'asi-monuments': {
    id: 'asi-monuments',
    title: 'Archaeological Survey of India (ASI) Monument Inventory',
    institution: 'Archaeological Survey of India, Ministry of Culture, Govt. of India',
    url: 'https://asi.nic.in/',
    license: 'Government Information / Research Use',
    evidenceType: 'archaeological',
    confidence: 'high',
    notes: 'Architectural surveys, conservation records, and national monument documentation.'
  },
  'cict-classical-tamil': {
    id: 'cict-classical-tamil',
    title: 'Central Institute of Classical Tamil (CICT) Digital Archives',
    institution: 'Central Institute of Classical Tamil, Ministry of Education, Govt. of India',
    url: 'https://www.digitalarchives.cict.in/',
    license: 'Institutional Academic Repository',
    evidenceType: 'literary',
    confidence: 'high',
    notes: 'Critical editions of Sangam corpus (Ettuthokai, Pattupattu) and Palm-leaf manuscript archives.'
  },
  'sentamizh-corpus': {
    id: 'sentamizh-corpus',
    title: 'Sentamizh Classical Tamil Computational Corpus',
    institution: 'Indic Corpora Research Group',
    url: 'https://github.com/indic-corpora/sentamizh-corpus',
    license: 'Apache 2.0',
    evidenceType: 'computational_literary',
    confidence: 'high',
    notes: 'Tokenized, annotated Sangam & Post-Sangam literature for Named Entity Recognition of toponyms and personalities.'
  },
  'project-madurai': {
    id: 'project-madurai',
    title: 'Project Madurai Digital Tamil Library',
    institution: 'International Project Madurai Initiative',
    url: 'https://projectmadurai.org/',
    license: 'Open Access Non-Commercial Distribution',
    evidenceType: 'literary',
    confidence: 'high',
    notes: 'Preserved e-texts of Tamil literature including Silappadikaram, Manimekalai, and Purananuru.'
  },
  'pleiades-ancient-geo': {
    id: 'pleiades-ancient-geo',
    title: 'Pleiades Gazetteer of Ancient Places',
    institution: 'Institute for the Study of the Ancient World (NYU) & Stoa Consortium',
    url: 'https://pleiades.stoa.org/',
    license: 'CC BY 3.0',
    evidenceType: 'historical_geography',
    confidence: 'high',
    notes: 'Ancient Greco-Roman and Indian ocean geographic gazetteer referencing Muziris, Korkai, and Sopatma.'
  },
  'wikidata-heritage': {
    id: 'wikidata-heritage',
    title: 'Wikidata Cultural Heritage Knowledge Graph',
    institution: 'Wikimedia Foundation',
    url: 'https://www.wikidata.org/',
    license: 'CC0 1.0 Universal',
    evidenceType: 'structured_data',
    confidence: 'moderate',
    notes: 'Structured multilingual entity identifiers, coordinate anchors, and historical polity linkages.'
  },
  'epigraphia-indica': {
    id: 'epigraphia-indica',
    title: 'Epigraphia Indica & South Indian Inscriptions (Vols. I-XXXII)',
    institution: 'Archaeological Survey of India',
    url: 'https://asi.nic.in/epigraphical-publications/',
    license: 'Public Domain',
    evidenceType: 'epigraphic',
    confidence: 'high',
    notes: 'Primary published epigraphic records documenting Pallava, Chola, and Pandya royal charters.'
  }
};
