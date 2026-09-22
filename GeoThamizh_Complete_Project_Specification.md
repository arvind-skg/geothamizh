# GeoThamizh --- Complete Project Specification

> **Tagline:** ROOTED IN TIME. ALIVE IN STORIES.
>
> **Core idea:** An AI-powered cultural and historical exploration
> platform for Tamil Nadu that connects **place, time, people,
> literature, inscriptions, culture and evidence** through an
> interactive map.

------------------------------------------------------------------------

## 1. Project Overview

**GeoThamizh** is a location-aware, AI-assisted heritage platform
designed to help anyone explore Tamil Nadu's living and historical
heritage.

The product has two complementary map experiences:

1.  **Real Map --- Explore Today**
    -   Uses the user's current/manual location.
    -   Shows nearby heritage, monuments, culture, food, people,
        literature, events and other points of interest.
    -   Designed primarily for tourists, students and general visitors.
2.  **Historical Map --- Explore the Past**
    -   A separate section where users intentionally switch from the
        present-day map to historical exploration.
    -   Users select a historical period and explore how places,
        political regions, old names, routes, people and events were
        connected in the past.
    -   The key interaction is **"What was here?"**

The selected visitor language is global across the application. If a
user chooses German, for example, the application's explanations and AI
responses are presented in German, while the corresponding **Tamil layer
remains available/shown as the Tamil cultural reference**. The language
setting does not determine which map experience is used.

------------------------------------------------------------------------

# 2. Problem Statement

Tamil heritage is distributed across:

-   Classical literature
-   Inscriptions
-   Archaeological records
-   Historical research
-   Ancient and modern place names
-   People and dynasties
-   Temples and monuments
-   Artifacts
-   Trade routes
-   Food and living traditions
-   Museums and archives
-   Digital repositories

These resources are often disconnected.

A user may know a place such as Madurai, but understanding its broader
significance can require jumping between maps, tourism websites,
archives, literature resources and historical references.

GeoThamizh aims to provide a unified **place + time + relationship +
evidence** discovery experience.

------------------------------------------------------------------------

# 3. Product Vision

> **Make Tamil heritage explorable through place, time and stories ---
> for anyone, in their language, while keeping Tamil at the cultural
> center.**

GeoThamizh should feel like a combination of:

-   Interactive historical atlas
-   Digital museum
-   Cultural travel companion
-   Knowledge graph
-   AI heritage guide

The **map is the hero**, while the AI helps users understand the
relationships behind what they discover.

------------------------------------------------------------------------

# 4. Target Users

## 4.1 Tourists

A visitor arrives in Madurai and asks:

-   What is near me?
-   What historical places can I visit?
-   What is this temple?
-   Why is this place important?
-   What food is associated with this region?
-   Can I listen to the story?
-   What else can I see nearby?

## 4.2 Non-Tamil Visitors

Visitors can select:

-   English
-   German
-   French
-   Japanese
-   Other supported languages

The main explanation follows the selected language, while Tamil
names/original Tamil content remain part of the experience.

## 4.3 Students

Students can explore:

-   Historical periods
-   Kings and dynasties
-   Literature
-   Poets
-   Inscriptions
-   Ancient cities
-   Trade routes
-   Historical events

## 4.4 Researchers

Researchers can use:

-   Source-linked entities
-   Historical names
-   Geographic relationships
-   Inscriptions
-   Literature relationships
-   Knowledge graph exploration
-   Provenance and evidence

## 4.5 Educators

Teachers can use GeoThamizh for:

-   Classroom exploration
-   Historical storytelling
-   Literature-place connections
-   Visual learning
-   Timeline-based learning

## 4.6 General Public

Anyone can discover Tamil culture without needing prior historical
knowledge.

------------------------------------------------------------------------

# 5. Core Product Structure

``` text
                         GEOTHAMIZH
                              |
              +---------------+---------------+
              |                               |
         REAL MAP                       HISTORICAL MAP
      "Explore Today"                  "Explore the Past"
              |                               |
       Current location                  Select period
       Nearby heritage                  Historical places
       Monuments                        Old names
       Culture                           Kingdoms/regions
       Food                              Trade routes
       People                            Literature
       Events                            People
       Stories                           Events
              |                               |
              +---------------+---------------+
                              |
                         KNOWLEDGE GRAPH
                              |
                          AI GUIDE
                              |
              +---------------+---------------+
              |               |               |
          Language           Voice          Evidence
```

------------------------------------------------------------------------

# 6. Navigation / Main Sections

Recommended primary navigation:

-   **Explore**
-   **Historical Map**
-   **Stories**
-   **People**
-   **Works**
-   **About**

Additional global controls:

-   Search
-   Language selector
-   Current location
-   AI Guide
-   Voice/listen controls

------------------------------------------------------------------------

# 7. Real Map --- Explore Today

## Purpose

The Real Map is the main location-based visitor experience.

The user sees the current geographic environment and discovers heritage
and cultural information around them.

## Main flow

``` text
Open GeoThamizh
      ↓
Allow location / choose location manually
      ↓
Real Map
      ↓
Nearby heritage & culture
      ↓
Select a place
      ↓
Short story
      ↓
Explore details
      ↓
Listen / Watch / Ask AI
```

## Features

### 7.1 Current Location

-   Browser/device geolocation where permission is granted
-   Manual location fallback
-   Demo locations for prototype
-   "You are here" marker

### 7.2 Nearby Discovery

Show important nearby items:

-   Temples
-   Monuments
-   Archaeological sites
-   Museums
-   Literary places
-   Inscriptions
-   Historical cities
-   Cultural locations
-   Food
-   Crafts
-   Performing arts
-   Festivals/events
-   People associated with the location

### 7.3 Category Filters

Suggested categories:

-   Near Me
-   Heritage
-   Temples
-   Monuments
-   Literary Places
-   Inscriptions
-   Ancient Cities
-   People
-   Literature
-   Culture
-   Food
-   Crafts
-   Events
-   Trade Routes

### 7.4 Place Cards

Each place can show:

-   Name
-   Tamil name
-   Distance
-   Short description
-   Category
-   Historical period
-   Key significance
-   Image
-   Source indicator

### 7.5 Place Detail Page

Example:

**Meenakshi Amman Temple**

Sections:

-   What is it?
-   Why is it important?
-   Historical background
-   Cultural significance
-   Related people
-   Related literature
-   Related inscriptions
-   Related events
-   Nearby heritage
-   Images
-   YouTube/video links
-   Sources
-   Listen to Story
-   Ask AI

------------------------------------------------------------------------

# 8. Historical Map --- Explore the Past

This is a **separate section**, not a second language mode and not a
replacement for the Real Map.

## Purpose

Allow users to intentionally explore how a place and its surrounding
region can be understood across historical periods.

## Main flow

``` text
Historical Map
      ↓
Choose historical period
      ↓
Map changes to historical context
      ↓
Explore places / regions / routes
      ↓
Select a location
      ↓
"What was here?"
      ↓
People + literature + events + evidence
```

## Historical Period Selector

Prototype periods:

-   Pre-Sangam
-   Sangam
-   Post-Sangam
-   Medieval
-   Later Periods

More granular periods can be added later.

## Historical Map Layers

### Historical places

-   Ancient cities
-   Settlements
-   Ports
-   Temples
-   Archaeological sites
-   Literary locations

### Historical names

Display:

> Modern name → historical/alternate name

where the evidence supports the relationship.

### Political regions

Show approximate historical political spheres/territories for selected
periods.

Potential entities:

-   Chera
-   Chola
-   Pandya
-   Pallava
-   Nayaka
-   Other historically relevant polities

**Important:** boundaries must not be presented as precise modern GIS
borders when historical evidence does not justify that precision.

### Trade routes

Visualize:

-   Ports
-   Inland routes
-   Maritime connections
-   Trade-related places

### Historical people

Show people associated with:

-   Places
-   Dynasties
-   Literature
-   Events
-   Inscriptions

### Historical events

Potential examples:

-   Battles
-   Coronations
-   Construction events
-   Migrations
-   Trade events
-   Religious developments

Only include events when supported by sources.

------------------------------------------------------------------------

# 9. Signature Feature --- "What Was Here?"

This should be one of GeoThamizh's strongest features.

Example:

``` text
Current location:
Madurai

Open Historical Map
        ↓
Select: Sangam Period
        ↓
"What was here?"
        ↓
Ancient Madurai
Historical name(s)
Associated polity
Literature
People
Events
Archaeological / epigraphic evidence
```

This creates the central **time-travel experience**.

------------------------------------------------------------------------

# 10. Then vs Now

For selected locations, allow users to compare:

**NOW**

versus

**THEN**

Possible information:

-   Current name
-   Historical name
-   Current location
-   Historical settlement
-   Historical political context
-   Associated people
-   Literature
-   Events
-   Heritage evidence

This can be implemented as a simple comparison panel rather than
requiring a perfect historical reconstruction.

------------------------------------------------------------------------

# 11. AI Heritage Guide

The AI is a **source-grounded guide**, not the source of historical
truth.

## Capabilities

Users can ask:

-   What is Meenakshi Temple?
-   Why is Madurai important?
-   Who was associated with this place?
-   What happened here during the Sangam period?
-   What was this place called historically?
-   What literature is connected to this location?
-   What inscriptions are associated with this site?
-   What can I visit nearby?
-   What food is culturally associated with this region?
-   What changed between two periods?
-   Explain this in simple language.
-   Tell me the story in 60 seconds.

## Ask the Map

A particularly useful interaction:

> "Show me ancient ports near Madurai."

The AI should ideally return:

-   Answer
-   Relevant places
-   Map highlights
-   Sources

Another example:

> "What places near me are connected to Sangam literature?"

The system retrieves relevant entities and highlights them on the map.

## AI architecture

``` text
User Question
     ↓
Intent / Entity Detection
     ↓
Retrieval
     ↓
GeoThamizh Database
 + Knowledge Graph
 + Curated Sources
     ↓
Context Construction
     ↓
LLM
     ↓
Answer
 + Sources
 + Map entities
 + Confidence / uncertainty
```

------------------------------------------------------------------------

# 12. Knowledge Graph

The knowledge graph is one of the technical foundations of GeoThamizh.

## Main entities

``` text
Person
Place
Literature
Inscription
Artifact
Event
Kingdom / Polity
Period
Food
Culture
Craft
Festival
Monument
```

## Important relationships

Examples:

``` text
Person
 ├── born_in → Place
 ├── associated_with → Place
 ├── authored → Literature
 └── lived_during → Period

Literature
 ├── mentions → Place
 ├── authored_by → Person
 ├── associated_with → Period
 └── references → Event

Inscription
 ├── found_at → Place
 ├── dated_to → Period
 ├── mentions → Person
 └── associated_with → Polity

Place
 ├── located_in → Region
 ├── has_historical_name → Name
 ├── existed_during → Period
 └── associated_with → Event

Event
 ├── occurred_at → Place
 ├── involved → Person
 └── occurred_during → Period
```

------------------------------------------------------------------------

# 13. Evidence / Provenance Layer

Every important historical claim should have provenance.

Each record should ideally store:

-   Source
-   Source URL/reference
-   Institution/creator
-   License
-   Date/period
-   Evidence type
-   Confidence
-   Notes
-   Attribution requirements

## Confidence categories

Possible labels:

-   **High confidence**
-   **Moderate confidence**
-   **Approximate**
-   **Traditional / literary association**
-   **Uncertain**

The exact labels should be defined in the application's data policy.

## Historical boundary rule

Never make an uncertain historical boundary look like an exact modern
administrative boundary.

Example:

> **Chola political sphere --- approximate reconstruction**

rather than:

> **Exact Chola Empire boundary**

------------------------------------------------------------------------

# 14. Multilingual System

Language is a global application setting.

The user selects a preferred language once and the same language remains
active across:

-   Real Map
-   Historical Map
-   Stories
-   People
-   Works
-   AI
-   Place pages
-   Voice narration

## Tamil layer

Tamil remains a core cultural layer.

Example:

### German

**Meenakshi Amman Temple**

German explanation.

### Tamil

**மீனாட்சி அம்மன் கோயில்**

Tamil explanation/original Tamil terminology where available.

The same principle applies to:

-   French
-   Japanese
-   English
-   Other supported languages

## Important design principle

Do not treat Tamil merely as a translated language.

Tamil should preserve:

-   Original names
-   Classical Tamil terms
-   Literary references
-   Original script
-   Cultural terminology

------------------------------------------------------------------------

# 15. Voice Heritage Guide

## "Listen to this Story"

Each major place can have a short narration:

**30--60 seconds**

Example structure:

1.  What is this place?
2.  Why is it important?
3.  What historical/cultural connection does it have?
4.  What should the visitor notice?

## Additional voice features

-   Text-to-speech
-   Tamil pronunciation
-   Selected-language narration
-   Play/pause
-   Playback speed
-   Short story mode

Voice should use verified content rather than allowing the LLM to invent
historical details.

------------------------------------------------------------------------

# 16. Stories

A dedicated storytelling section can contain curated journeys.

Examples:

-   A Day in Ancient Madurai
-   Following Sangam Literature
-   Ancient Tamil Ports
-   Chola Heritage Trail
-   Temples and Architecture
-   Tamil-Brahmi Inscriptions
-   Poets and the Places They Described

Stories can connect:

``` text
Place → Person → Literature → Event → Next Place
```

This can later become a guided story mode.

------------------------------------------------------------------------

# 17. People Explorer

Users can browse:

-   Kings
-   Poets
-   Scholars
-   Saints
-   Donors
-   Merchants
-   Historical personalities

Each person page can show:

-   Name
-   Tamil name
-   Period
-   Associated places
-   Works
-   Events
-   Dynasty/polity
-   Related inscriptions
-   Sources

The key design principle is **spatial exploration**:

> Person → Place → Work → Event

------------------------------------------------------------------------

# 18. Literature / Works Explorer

Users can explore:

-   Classical Tamil works
-   Sangam literature
-   Authors
-   Poems
-   Places mentioned
-   Themes
-   People mentioned
-   Historical period

Example:

``` text
Literary Work
      ↓
Poet
      ↓
Place mentioned
      ↓
Map
      ↓
Historical context
```

------------------------------------------------------------------------

# 19. Inscription Explorer

Each inscription record can include:

-   Inscription name/identifier
-   Location
-   Date/period
-   Script
-   Language
-   Image where legally reusable
-   Transcription
-   Transliteration
-   Translation
-   People mentioned
-   Polity/ruler
-   Source

## Optional future feature

Inscription image recognition/OCR.

This is **not required for the core MVP**.

------------------------------------------------------------------------

# 20. Artifact Explorer

Possible categories:

-   Pottery
-   Coins
-   Sculptures
-   Weapons
-   Ornaments
-   Tools
-   Seals
-   Excavation findings

Each artifact can connect to:

-   Site
-   Period
-   Region
-   Museum
-   Historical context
-   Source
-   Image

------------------------------------------------------------------------

# 21. Food and Living Culture

Food should be treated as **cultural context**, not merely restaurant
discovery.

A food record can contain:

-   Tamil name
-   Common name
-   Region
-   Description
-   Cultural association
-   Historical context where documented
-   Where it can be experienced
-   Image
-   Sources

Avoid unsupported claims such as:

> "This dish definitely originated here"

unless a reliable source establishes it.

------------------------------------------------------------------------

# 22. Crafts, Arts and Traditions

Add living heritage categories:

-   Handicrafts
-   Textiles
-   Sculpture
-   Metalwork
-   Folk arts
-   Classical arts
-   Dance
-   Music
-   Traditional practices

These can be linked to locations and communities where supported by
reliable sources.

------------------------------------------------------------------------

# 23. Festivals and Events

The Real Map can show relevant cultural events.

Each event can include:

-   Name
-   Tamil name
-   Location
-   Time/date if applicable
-   Description
-   Cultural significance
-   Source
-   Official event page where available

Historical events can be handled separately in the Historical Map.

------------------------------------------------------------------------

# 24. Media

Place pages can contain:

-   Photographs
-   Maps
-   Historical illustrations
-   Inscription images
-   Artifact images
-   YouTube videos
-   Official websites
-   Museum/archive links

Every externally sourced image should store its license and attribution
information.

------------------------------------------------------------------------

# 25. Search

Global search should support:

-   Person
-   Place
-   Historical name
-   Literature
-   Kingdom/polity
-   Inscription
-   Artifact
-   Event
-   Food
-   Culture

Search examples:

> Madurai

> மMadurai

> Poompuhar

> Korkai

> Avvaiyar

> Sangam literature

> Tamil Brahmi

Search should return entities and allow users to focus the map on the
selected result.

------------------------------------------------------------------------

# 26. Zoom-Based Discovery

The map can progressively reveal information.

## Zoomed out

Show:

-   Major regions
-   Major historical polities
-   Ancient cities
-   Rivers
-   Ports
-   Major trade routes

## Regional zoom

Show:

-   Temples
-   Ports
-   Settlements
-   Inscriptions
-   Heritage sites

## Detailed zoom

Show:

-   Artifacts
-   Manuscripts
-   People
-   Literature
-   Events

This prevents the map from becoming visually overloaded.

------------------------------------------------------------------------

# 27. Visual Design

The UI should follow the visual language of the reference design:

-   Antique atlas
-   Museum
-   Historical manuscript
-   Warm parchment
-   Dark green/brown
-   Muted gold
-   Hand-inked geography
-   Classical Tamil visual motifs
-   Vintage map typography

Avoid making the product look like a generic Google Maps clone.

## Map principle

> **The map is the hero.**

Cards and panels should support exploration rather than dominate the
interface.

------------------------------------------------------------------------

# 28. Suggested Home Page

Hero:

> **EXPLORE TAMIL NADU**\
> Every place has a story. Every story lives in Tamil.

Primary CTA:

> **Begin Exploring**

Secondary CTA:

> **Open Historical Map**

A strong alternative CTA:

> **DISCOVER WHAT'S AROUND YOU**

------------------------------------------------------------------------

# 29. Recommended UX

## Real Map

``` text
Explore
  ↓
Location
  ↓
Nearby
  ↓
Place
  ↓
Story
  ↓
Connections
  ↓
Listen / Watch / Ask AI
```

## Historical Map

``` text
Historical Map
  ↓
Choose period
  ↓
Map layers
  ↓
Historical place
  ↓
"What was here?"
  ↓
People / Literature / Events / Evidence
```

------------------------------------------------------------------------

# 30. Core Datasets and Sources

The project should prioritize sources based on:

1.  Open licensing
2.  Institutional credibility
3.  Provenance
4.  Reusability
5.  Geographic relevance
6.  Structured data availability

------------------------------------------------------------------------

## 30.1 Wikidata

**Use for:**

-   People
-   Places
-   Historical entities
-   Alternative names
-   Dates
-   Relationships
-   Dynasties/polities
-   Works
-   Occupations
-   Linked entities

**License:** CC0 for Wikidata's structured data.

**Role:** Main knowledge-graph backbone.

**Website:** https://www.wikidata.org/

**Important:** Cache/extract relevant records rather than depending on
live SPARQL queries for every user request.

------------------------------------------------------------------------

## 30.2 PeriodO

**Use for:**

-   Historical period definitions
-   Period names
-   Start/end estimates
-   Regional periodization
-   Scholarly definitions

**License:** Public-domain dataset.

**Role:** Historical period layer.

**Website:** https://perio.do/

------------------------------------------------------------------------

## 30.3 Pleiades

**Use for:**

-   Ancient places
-   Ancient place names
-   Coordinates
-   Historical geographic entities

**License:** CC BY 3.0.

**Role:** Ancient geography reference.

**Website:** https://pleiades.stoa.org/

------------------------------------------------------------------------

## 30.4 OpenStreetMap

**Use for Real Map:**

-   Roads
-   Current places
-   Temples
-   Museums
-   Landmarks
-   Current geographic context

**License:** ODbL.

**Role:** Current geographic foundation.

**Important:** Attribution is required. OSM data is free, but public OSM
tile servers have their own usage policies. For production, use an
appropriate tile provider or host suitable tiles.

**Website:** https://www.openstreetmap.org/

------------------------------------------------------------------------

## 30.5 OpenHistoricalMap

**Use for:**

-   Historical geographic features
-   Historical map reference
-   Historical locations and features

**General data license:** CC0 except where otherwise noted.

**Role:** Supporting historical map layer.

**Website:** https://www.openhistoricalmap.org/

**Important:** It should complement, not replace, GeoThamizh's curated
historical data.

------------------------------------------------------------------------

## 30.6 DHARMA --- South Indian / Tamil Epigraphy

**Use for:**

-   Inscriptions
-   Transcriptions
-   Transliterations
-   Translations
-   Dates
-   Findspots
-   Historical context

**License:** Edited XML resources include CC BY 4.0 material.

**Role:** Major inscription/evidence source.

**Website:** https://erc-dharma.github.io/

------------------------------------------------------------------------

## 30.7 Sentamizh Corpus

**Use for:**

-   Classical Tamil text
-   NLP
-   Named-entity recognition
-   People/place extraction
-   Literary relationship extraction
-   Topic analysis
-   Computational study

**License:** Apache 2.0 for the repository/dataset as specified by the
project.

**Role:** Computational Classical Tamil literature layer.

**Website:** https://github.com/indic-corpora/sentamizh-corpus

**Important:** Preserve source/provenance information because the corpus
contains material derived from multiple underlying sources and
annotation coverage can vary.

------------------------------------------------------------------------

## 30.8 Project Madurai

**Use for:**

-   Classical Tamil electronic texts
-   Public-domain Tamil literary material
-   Literary references

**Role:** Literature/reference source.

**Website:** https://projectmadurai.org/

**Important:** "Free to access" does not automatically mean every item
has identical reuse terms. Check the rights/source information for
individual material before redistributing it.

------------------------------------------------------------------------

## 30.9 Tamil Brahmi Stone Inscription Dataset

**Use for optional:**

-   Tamil Brahmi inscription images
-   OCR/vision experiments
-   Ancient script recognition

**License:** CC BY 4.0 according to the dataset listing.

**Role:** Optional computer-vision dataset.

**Important:** Not required for the core GeoThamizh experience unless
OCR is implemented.

------------------------------------------------------------------------

## 30.10 8th-Century Tamil Inscription Dataset

**Use for optional:**

-   Character/image classification
-   Historical Tamil inscription recognition experiments

**Approximate content:** \~1,800 images across 28 classes as described
in the project research.

**License:** Apache 2.0 according to its Kaggle listing.

**Role:** Optional OCR/vision experiment.

**Important:** Do not make OCR a core MVP requirement.

------------------------------------------------------------------------

## 30.11 Natural Earth

**Use for:**

-   Country/region boundaries
-   Coastlines
-   Rivers
-   Geographic context
-   Map backgrounds

**License:** Public domain.

**Role:** Clean base geography for custom historical-map styling.

**Website:** https://www.naturalearthdata.com/

------------------------------------------------------------------------

## 30.12 GeoNames

**Use for:**

-   Place names
-   Coordinates
-   Alternate names
-   Geographic lookup

**License:** CC BY.

**Role:** Supporting geographic name service.

**Website:** https://www.geonames.org/

------------------------------------------------------------------------

## 30.13 World Historical Gazetteer

**Use for:**

-   Historical places
-   Historical place-name discovery
-   Cross-checking historical geography

**Role:** Research/reference layer.

**Important licensing warning:** WHG aggregates data from multiple
sources with different licenses, and its aggregated database has its own
licensing terms. Do not assume that every upstream record can be reused
identically.

**Website:** https://whgazetteer.org/

------------------------------------------------------------------------

## 30.14 Wikimedia Commons

**Use for:**

-   Temple images
-   Sculpture images
-   Artifact images
-   Inscription images
-   Historical photographs
-   Heritage-site photographs

**Role:** Media source.

**Important:** Check the license of each individual file and preserve
attribution.

**Website:** https://commons.wikimedia.org/

------------------------------------------------------------------------

# 31. Data Source Priority

Recommended hierarchy:

``` text
Tier 1 — Primary / Institutional
----------------------------------
Archaeological sources
Epigraphic sources
Academic publications
Institutional archives
CICT
Tamil Nadu archaeology resources
DHARMA

Tier 2 — Structured Open Knowledge
----------------------------------
Wikidata
PeriodO
Pleiades
OpenHistoricalMap
OpenStreetMap
GeoNames

Tier 3 — Literary / Digital Collections
----------------------------------
Sentamizh Corpus
Project Madurai
Other explicitly licensed corpora

Tier 4 — Discovery / Supplementary
----------------------------------
Wikimedia Commons
WHG
Wikipedia
General web sources
```

Wikipedia should primarily be treated as a discovery aid rather than the
core evidence layer.

------------------------------------------------------------------------

# 32. CICT and Institutional Tamil Heritage Resources

The **Central Institute of Classical Tamil (CICT)** is an important
institutional source for Classical Tamil research and digital heritage.

Its digital archive infrastructure includes:

-   Palm-leaf manuscript resources
-   Classical Tamil texts
-   OCR/computational paleography resources
-   Searchable lexical resources
-   Timelines
-   Curated journeys

Website:

https://www.cict.in/

Digital archive:

https://www.digitalarchives.cict.in/

These sources should be used for research, verification and links where
their licensing/usage terms permit.

GeoThamizh should **connect users to authoritative repositories rather
than pretending to replace them**.

------------------------------------------------------------------------

# 33. Data Categories

Recommended internal data model:

``` text
/data

  places
  people
  literature
  inscriptions
  artifacts
  events
  food
  culture
  festivals
  crafts

  periods
  historical_places
  historical_boundaries
  trade_routes

  relationships
  sources
  media
```

------------------------------------------------------------------------

# 34. Example Place Schema

``` json
{
  "id": "madurai",
  "name": "Madurai",
  "tamil_name": "மதுரை",
  "latitude": 9.9252,
  "longitude": 78.1198,
  "categories": ["historical_city", "heritage"],
  "historical_names": [],
  "periods": [],
  "people": [],
  "literature": [],
  "inscriptions": [],
  "events": [],
  "sources": []
}
```

Coordinates and historical relationships must be verified before
production use.

------------------------------------------------------------------------

# 35. Example Historical Place Schema

``` json
{
  "id": "historical-madurai",
  "modern_place_id": "madurai",
  "historical_names": [],
  "periods": [],
  "associated_polities": [],
  "people": [],
  "literature": [],
  "events": [],
  "confidence": "moderate",
  "sources": []
}
```

------------------------------------------------------------------------

# 36. Example Historical Boundary Schema

``` json
{
  "id": "chola-sphere-example",
  "period": "imperial_chola",
  "name": "Chola political sphere",
  "geometry": {},
  "confidence": "approximate",
  "notes": "Historical reconstruction; not an exact modern administrative boundary.",
  "sources": []
}
```

------------------------------------------------------------------------

# 37. Example Source Schema

``` json
{
  "id": "source-001",
  "title": "Source title",
  "institution": "Institution",
  "url": "https://example.org",
  "license": "CC BY 4.0",
  "accessed": "YYYY-MM-DD",
  "evidence_type": "epigraphic",
  "notes": ""
}
```

------------------------------------------------------------------------

# 38. Example Relationship Schema

``` json
{
  "source": "person-001",
  "relationship": "associated_with",
  "target": "place-001",
  "period": "sangam",
  "confidence": "high",
  "sources": ["source-001"]
}
```

------------------------------------------------------------------------

# 39. Data Quality Rules

GeoThamizh should follow strict historical-data rules.

### Rule 1 --- No invented facts

The AI must not fill missing historical information with guesses.

### Rule 2 --- No fake quotations

Never generate a quotation and attribute it to a historical text.

### Rule 3 --- Preserve uncertainty

If dates or boundaries are uncertain, display that uncertainty.

### Rule 4 --- Source important claims

Historical claims should have a source.

### Rule 5 --- Separate evidence types

Distinguish:

-   Archaeological evidence
-   Epigraphic evidence
-   Literary evidence
-   Scholarly interpretation
-   Traditional/legendary association

### Rule 6 --- Track licenses

Every external dataset/media source should have licensing metadata.

### Rule 7 --- Avoid false precision

Historical geography should not look more precise than the evidence
allows.

------------------------------------------------------------------------

# 40. Recommended Technical Architecture

## Hackathon MVP

``` text
Frontend
---------
React
Vite
TypeScript
Leaflet / MapLibre
Tailwind CSS

Backend
-------
Node.js
Express

Data
----
Local JSON
GeoJSON
PostgreSQL / optional
Neo4j / optional for graph demo

AI
--
LLM API
RAG
Embeddings

Deployment
----------
Vercel / Render
```

## Scalable version

``` text
React / Next.js
       |
API Gateway
       |
Node / FastAPI services
       |
+------+------------------+
|                         |
PostgreSQL/PostGIS     Neo4j
|                         |
Current geography      Relationships
Historical geography   Knowledge graph
       |
Vector Database
       |
RAG
       |
LLM
```

------------------------------------------------------------------------

# 41. Recommended MVP Architecture

Do not over-engineer the first version.

For the hackathon:

``` text
React
  ↓
MapLibre / Leaflet
  ↓
Curated JSON + GeoJSON
  ↓
Simple API
  ↓
RAG retrieval
  ↓
LLM
```

Use Neo4j only if the graph is genuinely needed for the demonstrated
relationships.

A small, high-quality dataset is better than a huge unreliable database.

------------------------------------------------------------------------

# 42. Recommended MVP Dataset Size

For a strong demo:

### Real Map

-   25--40 places
-   10--20 food/culture entries
-   10--20 people
-   10--20 literature connections
-   10--15 inscriptions
-   5--10 events

### Historical Map

-   5 major periods
-   20--50 historical places
-   5--8 carefully sourced political/territorial layers
-   5--10 trade-route segments
-   20--30 people/literature relationships

This is enough to demonstrate the system without sacrificing data
quality.

------------------------------------------------------------------------

# 43. Example Demo Journey

## Scenario

A German-speaking tourist arrives in Madurai.

### Step 1

Open GeoThamizh.

### Step 2

Select:

**Deutsch**

Tamil remains available as the cultural/original-language layer.

### Step 3

Enable location.

The Real Map shows:

-   Meenakshi Temple
-   Palace
-   Nearby heritage
-   Food/culture
-   Literary connections

### Step 4

Tap Meenakshi Temple.

See:

-   German explanation
-   Tamil name/content
-   Images
-   Historical context
-   Listen
-   YouTube
-   Sources

### Step 5

Ask AI:

> "Why is this place important?"

### Step 6

AI answers using retrieved sources.

### Step 7

User opens:

**Historical Map**

### Step 8

Select:

**Sangam Period**

### Step 9

The map switches to the historical context.

### Step 10

Tap Madurai.

Show:

> **What was here?**

Then reveal:

-   Historical context
-   Old names
-   Associated polity
-   People
-   Literature
-   Events
-   Evidence

This is the ideal end-to-end demo.

------------------------------------------------------------------------

# 44. Strongest Differentiators

## 1. Real Map + Historical Map

The present and past are deliberately separated into two map
experiences.

## 2. "What Was Here?"

A location can be explored across historical time.

## 3. Place-first knowledge graph

Instead of reading isolated articles:

> Place → Person → Literature → Inscription → Event → Period

## 4. Source-grounded AI

AI answers are tied to evidence.

## 5. Tamil cultural layer

Tamil is not merely another translation option.

## 6. Multilingual accessibility

A non-Tamil visitor can understand the heritage while still seeing the
Tamil cultural/original layer.

## 7. Voice storytelling

Heritage can be experienced through short narrated stories.

## 8. Living heritage

Food, crafts, arts, festivals and traditions connect historical heritage
to present-day culture.

------------------------------------------------------------------------

# 45. What Should NOT Be a Core MVP Feature

Avoid spending the main development time on:

-   AR/VR
-   Full 3D reconstruction
-   Blockchain
-   Social networking
-   Complete Tamil Nadu historical reconstruction
-   OCR for every inscription
-   All Classical Tamil literature
-   Every temple
-   Every historical boundary
-   20+ languages
-   Fully automated historical GIS reconstruction

These can be future extensions.

------------------------------------------------------------------------

# 46. Future Features

## Story Mode

Curated historical journeys.

## Heritage Walks

Generate a route connecting nearby sites.

## Smart Itineraries

> "I have 3 hours in Madurai and like ancient Tamil history."

Generate a source-grounded heritage route.

## Audio Guide

Automatic multi-language heritage narration.

## Advanced OCR

Read/recognize historical Tamil inscriptions.

## Image Search

Search heritage through visual similarity.

## Temporal Comparison

Compare the same place across multiple periods.

## More Indian Languages

Expand beyond the initial language set.

## Offline Heritage Packs

Download a city/region for offline exploration.

## Research Mode

More detailed citations, source records and graph relationships.

------------------------------------------------------------------------

# 47. Key Risks and Mitigation

  Risk                              Mitigation
  --------------------------------- ---------------------------------------
  Historical hallucination          RAG + curated evidence
  Incorrect dates                   Source + uncertainty
  False boundaries                  Approximate labels + sources
  Copyright/licensing issues        Store license/attribution metadata
  Too much data                     Curated MVP
  Map clutter                       Zoom-based layers
  AI translation errors             Verified base descriptions
  Overdependence on external APIs   Local cache + curated data
  Poor historical coverage          Clearly define prototype scope
  Generic AI chatbot                Make AI map-aware and source-grounded

------------------------------------------------------------------------

# 48. Important Licensing Principles

"Free" does not always mean "free to redistribute without conditions."

For every external dataset:

1.  Record the license.
2.  Preserve attribution.
3.  Keep source URL.
4.  Check whether commercial reuse is permitted.
5.  Check whether derivatives are permitted.
6.  Check whether attribution is required.
7.  Do not assume aggregated datasets inherit one license.
8.  Check individual media licenses.

Particularly important:

-   OSM → ODbL + attribution
-   Pleiades → CC BY 3.0 + attribution
-   DHARMA resources → relevant CC BY 4.0 resources + attribution
-   Wikidata structured data → CC0
-   PeriodO → public domain
-   Natural Earth → public domain
-   OpenHistoricalMap → generally CC0, with exceptions/notes
-   Wikimedia Commons → per-file licensing
-   WHG → mixed upstream licensing / database terms
-   Project Madurai → check individual material/rights information

------------------------------------------------------------------------

# 49. Dataset Decision Summary

## Essential

-   Wikidata
-   OpenStreetMap
-   PeriodO
-   Pleiades
-   DHARMA
-   Curated GeoThamizh historical data
-   Curated historical GeoJSON
-   Sources/provenance database
-   Natural Earth

## Strongly useful

-   OpenHistoricalMap
-   Sentamizh Corpus
-   Project Madurai
-   GeoNames
-   Wikimedia Commons

## Optional

-   Tamil Brahmi Stone Inscription Dataset
-   8th-century Tamil inscription dataset
-   WHG

The inscription image/OCR datasets are **not necessary** unless OCR
becomes a feature.

------------------------------------------------------------------------

# 50. Final Product Definition

> **GeoThamizh is an AI-powered cultural and historical map that helps
> anyone explore Tamil Nadu through place and time --- discovering
> nearby heritage, stories, people, literature, food, traditions and
> historical events in their preferred language, while a separate
> historical map lets users travel through different periods and
> understand what existed at a place in the past.**

------------------------------------------------------------------------

# 51. One-Line Pitch

> **GeoThamizh turns Tamil Nadu into a living map of places, people,
> stories and history --- letting you explore what is around you today
> and discover what was there before.**

------------------------------------------------------------------------

# 52. Judge-Friendly Core Story

``` text
WHERE AM I?
      ↓
WHAT'S AROUND ME?
      ↓
WHAT IS THIS PLACE?
      ↓
WHY DOES IT MATTER?
      ↓
WHO AND WHAT IS CONNECTED TO IT?
      ↓
OPEN HISTORICAL MAP
      ↓
WHAT WAS HERE?
      ↓
EXPLORE THE STORY
      ↓
ASK AI
      ↓
VERIFY THE SOURCES
```

------------------------------------------------------------------------

# 53. Final Architecture in One View

``` text
                         GEOTHAMIZH
                              |
          +-------------------+-------------------+
          |                                       |
      REAL MAP                              HISTORICAL MAP
    Explore Today                           Explore the Past
          |                                       |
  Location / Nearby                        Period Selector
  Heritage / Culture                        Historical Layers
  Food / Events                             Old Names
  People / Literature                       Polities
          |                                 Trade Routes
          |                                 People / Events
          |                                       |
          +-------------------+-------------------+
                              |
                     TIME-AWARE KNOWLEDGE
                           GRAPH
                              |
                 +------------+------------+
                 |            |            |
              PEOPLE       PLACES       WORKS
                 |            |            |
            INSCRIPTIONS   EVENTS       ARTIFACTS
                 |            |            |
                 +------------+------------+
                              |
                        SOURCE LAYER
                              |
                 Provenance / License /
                 Evidence / Confidence
                              |
                         AI GUIDE
                              |
          +-------------------+-------------------+
          |                   |                   |
     MULTILINGUAL           VOICE             MAP ACTIONS
          |                   |                   |
   Selected Language      Narration         Highlight places
   + Tamil Layer          Pronunciation     Answer "Ask Map"
```

------------------------------------------------------------------------

# 54. Recommended Development Order

## Phase 1 --- Foundation

-   UI
-   Navigation
-   Real Map
-   Historical Map section
-   Language selector
-   Search

## Phase 2 --- Data

-   Places
-   Periods
-   People
-   Literature
-   Inscriptions
-   Sources
-   Historical GeoJSON

## Phase 3 --- Core interactions

-   Location
-   Nearby discovery
-   Place details
-   Historical period switching
-   "What Was Here?"
-   Then vs Now

## Phase 4 --- AI

-   RAG
-   AI Heritage Guide
-   Source citations
-   Ask the Map
-   Map-aware responses

## Phase 5 --- Media

-   Images
-   YouTube
-   Voice narration

## Phase 6 --- Cultural depth

-   Food
-   Crafts
-   Festivals
-   Living traditions

## Phase 7 --- Polish

-   Antique visual design
-   Animations
-   Map transitions
-   Loading states
-   Responsive design
-   Accessibility
-   Attribution

------------------------------------------------------------------------

# 55. Success Criteria

A successful prototype should demonstrate:

-   [ ] User can open the Real Map.
-   [ ] User can use/select a location.
-   [ ] Nearby heritage appears.
-   [ ] User can click a place.
-   [ ] Place story appears.
-   [ ] Sources are visible.
-   [ ] User can listen to the story.
-   [ ] User can access video/media.
-   [ ] User can ask the AI.
-   [ ] User can change language.
-   [ ] Tamil layer remains part of the experience.
-   [ ] User can open Historical Map.
-   [ ] User can select a historical period.
-   [ ] Historical layers change.
-   [ ] Historical place names appear where supported.
-   [ ] Approximate historical boundaries are clearly labelled.
-   [ ] "What Was Here?" works for selected locations.
-   [ ] Historical relationships can be explored.
-   [ ] AI answers are grounded in retrieved information.
-   [ ] Sources/provenance are preserved.
-   [ ] Dataset licenses/attribution are tracked.

------------------------------------------------------------------------

# 56. Core Message

GeoThamizh should not be presented as:

> "An AI chatbot about Tamil history."

It should be presented as:

> **"A time-aware geo-semantic exploration platform for Tamil
> heritage."**

The AI is the guide.

The knowledge graph is the connection layer.

The evidence layer builds trust.

The **Real Map** answers:

> **"What can I discover around me?"**

The **Historical Map** answers:

> **"What was here in the past?"**

And GeoThamizh connects both through:

> **Place + Time + People + Literature + Culture + Evidence.**
