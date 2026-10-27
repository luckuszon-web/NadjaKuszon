# nadjakuszon.dk – astrologisk terapi

Hjemmesiden for Nadja Kuszon: astrologisk terapi og dybdegående horoskoptydning. Bygget med [Eleventy](https://www.11ty.dev/) som en statisk side.

## Kom i gang

```sh
npm install
npm start            # udviklingsserver på http://localhost:8080
npm run build        # produktion → _site/ (inkl. _redirects og sitemap.xml)
npm run check        # tjekker _site mod acceptkriterierne (kør efter build)
npm run build:pages  # GitHub Pages-preview → docs/ (noindex, sti /NadjaKuszon/)
```

## Struktur

| Sti | Indhold |
|---|---|
| `src/index.njk` | Forside |
| `src/astrologisk-terapi.njk` | Ydelsessiden med priser, anbefalinger og FAQ |
| `src/foredrag-og-events.njk` | Foredrag & events |
| `src/om-nadja.njk` | Om Nadja (tilgang, historie, uddannelser) |
| `src/kontakt.njk` | Kontakt / Book tid |
| `src/inspiration-viden/` | Viden & inspiration: oversigt, kategorisider og `artikler/*.md` |
| `src/_data/` | Fælles data: `site.json` (kontakt, menu), `services.json` (ydelser og priser), `faq.json`, `anbefalinger.json`, `categories.json`, `redirects.json` |
| `src/_includes/` | Layout (`layouts/`), genbrugelige dele (`partials/`) og JSON-LD (`schema/`) |
| `src/assets/` | CSS, JS og billeder |
| `scripts/check.mjs` | Automatisk tjek: titler, H1, menu, links, JSON-LD, pladsholdere, gamle ydelser og alle gamle URL'er |
| `docs/` | Bygget preview til GitHub Pages (genereres, redigér ikke direkte) |
| `tekstarkiv/` | Word-arkiv med alle tekster fra den gamle side |

## Sådan redigerer du

- **Priser og ydelser:** `src/_data/services.json`. Priserne står også i teksten på `src/astrologisk-terapi.njk` og i meta-beskrivelsen.
- **Ny artikel:** Opret `src/inspiration-viden/artikler/<slug>.md` med `title`, `description`, `category` (`astrologi`, `krop-kaerlighed-relationer` eller `tantra-bevidsthed`), `order` og `permalink: "/inspiration-viden/<slug>/"`. Kategorien "Astrologi" vises automatisk, når den første artikel findes.
- **FAQ:** `src/_data/faq.json`. Spørgsmål med tomt `svar` er skjult.
- **Viderestillinger:** `src/_data/redirects.json` (se `REDIRECTS.md`).

## Design

Farver er CSS-variabler øverst i `src/assets/css/style.css`. Guld (`--gold`) bruges kun til streger og cirkler, aldrig til tekst, fordi kontrasten er for lav. Knapper er mosgrønne med creme tekst (kontrast 4,9:1). Overskrifter er sat med Cormorant Garamond og brødtekst med Quicksand i 18 px.

Se også `PLAN-ASTROLOGI.md` (fase 1), `REDIRECTS.md` og `TODO.md`.
