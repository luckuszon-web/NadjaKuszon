# Viderestillinger (redirects)

Den gamle side (TYPO3 på nadjakuszon.dk) havde 49 URL'er. Alle er gennemgået herunder.

- **Kilde:** [`src/_data/redirects.json`](src/_data/redirects.json). Herfra genereres både `_redirects` (rigtige 301'ere hos Netlify/Cloudflare Pages) og midlertidige viderestillingssider til GitHub Pages-previewet.
- **Test:** `npm run build && npm run check`. Tjekket kører alle gamle URL'er, med og uden afsluttende skråstreg, mod `_redirects` og bekræfter, at hver enten svarer 200 eller giver én 301 direkte til en side, der svarer 200 (ingen kæder, ingen 404).
- **GitHub Pages kan ikke lave 301.** På previewet bruges en `<meta refresh>`-side med `canonical`. Rigtige 301'ere virker først, når siden flyttes til en host, der læser `_redirects` (se "Ved flytning til domænet" nederst).

## Aktive viderestillinger (301)

| Gammel URL | Ny URL | Begrundelse |
|---|---|---|
| `/tilbud/` | `/astrologisk-terapi/` | Ydelsesoversigten erstattes af den nye ydelsesside |
| `/tilbud/terapi/` | `/om-nadja/` | Sexologisk terapi er nu kun baggrund |
| `/tilbud/parterapi/` | `/om-nadja/` | Parterapi er nu kun baggrund |
| `/tilbud/smerteriunderlivet/` | `/om-nadja/` | Vaginal-terapi er nu kun baggrund |
| `/tilbud/tantrayoga/` | `/inspiration-viden/kategori/tantra-bevidsthed/` | Indholdet er viden om tantra |
| `/tilbud/workshoppolterabend/` | `/foredrag-og-events/` | Samme indhold i ny form |
| `/anbefalinger/` | `/astrologisk-terapi/` | Anbefalingerne står nu ved ydelserne |
| `/priser/` | `/astrologisk-terapi/` | Priserne står nu på ydelsessiden |

Hver regel findes både med og uden afsluttende skråstreg (fx `/priser` og `/priser/`), så der aldrig opstår en kæde.

## Uændrede URL'er (svarer 200)

| URL | Bemærkning |
|---|---|
| `/` | Ny forside |
| `/om-nadja/` | Nyt indhold |
| `/kontakt/` | Nyt indhold, menunavn "Kontakt / Book tid" |
| `/inspiration-viden/` | Menunavn ændret til "Viden & inspiration" |
| `/inspiration-viden/<artikel>/` | **Alle 37 artikler beholder deres URL** |

## Nye URL'er

`/astrologisk-terapi/` · `/foredrag-og-events/` · `/inspiration-viden/kategori/krop-kaerlighed-relationer/` · `/inspiration-viden/kategori/tantra-bevidsthed/`

`/inspiration-viden/kategori/astrologi/` oprettes automatisk, så snart der findes en artikel med `category: "astrologi"`.

## Afventer godkendelse (ikke aktive)

Disse viderestillinger aktiveres først, hvis forslaget om at fjerne eller sammenlægge artiklen godkendes (se `PLAN-ASTROLOGI.md`, afsnit 5, og `TODO.md`). Til den tid flyttes linjen fra `afventer` til `aktive` i `redirects.json`, og artiklen slettes eller sammenlægges.

| Artikel | → Viderestilles til | Forslag |
|---|---|---|
| `/inspiration-viden/jeg-taler-ikke-om-mad/` | `/inspiration-viden/kategori/krop-kaerlighed-relationer/` | Fjern: kun én sætning |
| `/inspiration-viden/lyst/` | `/inspiration-viden/bevidst-lyst/` | Sammenlæg |
| `/inspiration-viden/erotisk-fantasi-slip-kontrollen/` | `/inspiration-viden/fantasier-graenser/` | Sammenlæg |
| `/inspiration-viden/din-hjerne-er-dit-mest-kraftfulde-erotiske-organ/` | `/inspiration-viden/lyst-starter-i-hjernen-men-foeles-i-kroppen/` | Sammenlæg |
| `/inspiration-viden/vaginisme-vulvodyni/` | `/inspiration-viden/kategori/krop-kaerlighed-relationer/` | Fjern: reklame for gammel ydelse |
| `/inspiration-viden/fra-date-til-kaereste/` | `/inspiration-viden/haengeparti/` | Fjern: kønsstereotyp |
| `/inspiration-viden/det-et-onsdag/` | `/inspiration-viden/forventninger/` | Fjern: dateret og ramt af spam |

## Ved flytning til domænet

1. Byg med `npm run build`. Output ligger i `_site/` og indeholder `_redirects`.
2. Host på Netlify eller Cloudflare Pages (begge læser `_redirects` og laver rigtige 301'ere).
3. Sæt `https://nadjakuszon.dk` som primært domæne, og lad hosten viderestille `http://` og `www.nadjakuszon.dk` dertil med 301. I dag svarer alle fire varianter 200 på den gamle server.
4. Kør tjekket igen mod det rigtige domæne, fx `curl -sI https://nadjakuszon.dk/priser/`, som skal give `301` med `location: /astrologisk-terapi/`.
5. Indsend `https://nadjakuszon.dk/sitemap.xml` i Google Search Console.
