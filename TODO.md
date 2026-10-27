# Åbne punkter

Alt, der mangler input fra Nadja eller en beslutning, er samlet her. I koden står de som `TODO(Nadja): …`. Sektioner, der mangler indhold, er **skjult** på siden, så ingen pladsholdere er synlige.

## ⚠️ Haster: spam på den nuværende hjemmeside

Artiklen `nadjakuszon.dk/inspiration-viden/det-et-onsdag/` på den **live** TYPO3-side indeholder et skjult afsnit med casino-links (casinoqueenvegas.dk, roosterbet.no). Det tyder på, at TYPO3 eller en admin-konto er kompromitteret.

- [ ] Hvem har adgang til TYPO3 (TypoConsult?)? Fjern afsnittet, skift alle adgangskoder, og opdatér eller luk installationen.

Spammen er fjernet fra den nye side og fra Word-arkivet i `tekstarkiv/`.

## Spørgsmål til Nadja

| # | Spørgsmål | Hvor i koden | Status nu |
|---|---|---|---|
| 1 | Hvad er svaret, hvis kunden ikke kender sit fødselstidspunkt? | `src/_data/faq.json` | Spørgsmålet er skjult i FAQ'en |
| 2 | Er de 90 minutter selve sessionen, eller indgår forberedelsen i de 90 minutter? | `src/astrologisk-terapi.njk` | Viser "90 minutter · 1.490 kr. · Forberedelse er inkluderet i prisen" |
| 3 | Er hun momsregistreret? Priser til private skal vises inkl. moms. *(Den gamle prisside skrev "Alle priser er inkl. moms".)* | `src/_data/services.json` | Priserne vises uden momsnote |
| 4 | Hvad er afbudsreglerne? *(Den gamle side havde to modstridende regler: 48 timer/500 kr. på Priser og 24 timer/fuld pris på Kontakt.)* | `src/_data/faq.json`, `src/kontakt.njk` | Skjult |
| 5 | Bookingsystem: der er intet i dag. Booking sker via sms, telefon og mail, så der er intet eksternt system at rydde op i. Ønskes et online bookingsystem? | `src/kontakt.njk` | Knapperne fører til kontaktsiden |
| 6 | Må de valgte anbefalinger bruges? Se nedenfor. Findes der anbefalinger fra horoskoptydninger? | `src/_data/anbefalinger.json` | Tre anbefalinger vises ordret |
| 7 | Foredrag & events: pris, varighed, antal deltagere og geografi. *(Fra den gamle side vises nu: polterabend 1,5 time, 3.500 kr., typisk 8–12 deltagere, Sjælland, transport tillægges.)* Gælder det også de nye formater (astrologisk polterabend, minitydninger, foredrag, kvindecirkler)? | `src/foredrag-og-events.njk` | Kun polterabend-oplysningerne vises |
| 8 | Godkend formuleringen: "Nej. Astrologisk terapi er en samtale om selvindsigt og personlig udvikling. Den erstatter ikke behandling hos psykolog, psykiater eller læge. Hvis du har det svært psykisk, anbefaler jeg, at du også søger hjælp dér." | `src/_data/faq.json` | Vises |
| 9 | ~~Navnet på astrologiuddannelsen~~ | `src/om-nadja.njk` | ✅ Besvaret: Astrologiens Fundament hos Astrologisk Institut (2026 – nu) |
| 10 | **Astrologi-artikler:** Der findes ingen i dag, så kategorien "Astrologi" er skjult. Kan Nadja skrive 2–3 artikler? Siden opretter kategorien automatisk, når den første artikel får `category: "astrologi"`. | `src/inspiration-viden/artikler/` | Kategorien er skjult |
| 11 | **Personlig historie på Om Nadja:** Teksten fra den gamle side (to skilsmisser, tre børn, "livets barske realiteter i en ung alder") er genbrugt og skrevet om til første person. Må den stå der? | `src/om-nadja.njk` | Vises |
| 12 | **Hero-portræt:** Lige nu bruges `nadja-smil.jpg`, beskåret som `nadja-portraet.jpg`. Er der et nyere eller bedre portræt? | `src/assets/img/` | – |
| 13 | **Sociale medier:** Er Facebook-siden og LinkedIn stadig aktuelle? Er der en Instagram-profil? | `src/_data/site.json` | Facebook og LinkedIn vises i footeren |
| 14 | **Åbningstider:** De gamle åbningstider er ikke vist. Skal der stå tider for online sessioner? | `src/kontakt.njk` | Ikke vist |
| 15 | **Adresse:** Den gamle footer linkede til Søndre Jernbanevej 4E, Hillerød. Den nye side skriver kun "Online via Zoom". Skal en adresse stå? | `src/_data/site.json` | Ikke vist |
| 16 | **Statistik:** Den gamle Google Analytics-kode virker ikke længere. Ønskes ny statistik? I så fald anbefales en cookiefri løsning (fx Plausible), så der ikke skal være cookiebanner. | – | Ingen statistik |

## Anbefalinger, der ikke bruges

Ifølge reglerne bruges kun ordrette citater, og anbefalinger, der udelukkende handler om de gamle ydelser, vises ikke på forsiden eller ydelsessiden. Nadja kan tage stilling til dem:

| Afsender | Handler om | Status |
|---|---|---|
| **J, 28** | Vaginisme og vaginale tryk | Ikke brugt |
| **Nina, 25** | Smerter i underlivet og seksualitet | Ikke brugt |
| **Malou, 25**, fuld version ("En gave for livet") | Vulvodyni og vaginisme gennem 7 år | Kun det korte uddrag, som den gamle side brugte som topcitat, vises |
| **Mille, 27**, sidste afsnit | "… selvom det kan synes lidt skræmmende at starte hos en sexolog …" | Kun de tre første afsnit vises |

Brugt nu (ordret, kræver godkendelse): Mille, 27 (tre afsnit), Malou, 25 (uddrag) og en anonym klient.

## Blogindlæg: afventer beslutning

Forslagene står i `PLAN-ASTROLOGI.md`, afsnit 5. Indtil de er godkendt, er **alle 37 artikler bevaret** med uændrede URL'er.

- [ ] **Sammenlæg:** lyst → bevidst-lyst · erotisk-fantasi-slip-kontrollen → fantasier-graenser · din-hjerne-er-dit-mest-kraftfulde-erotiske-organ → lyst-starter-i-hjernen-men-foeles-i-kroppen
- [ ] **Fjern med 301:** jeg-taler-ikke-om-mad · vaginisme-vulvodyni · fra-date-til-kaereste · det-et-onsdag
- [ ] **Små rettelser:** stavefejl i titlerne "Hvad er en sund **reation**?" og "Fra Date til **kæretse**". "$£x"/"s£ksuelle" i utroskab. Tastefejl i graenseloes
- [ ] **Ny artikel "Hvad er tantra?"** med vidensdelen af den gamle side `/tilbud/tantrayoga/`
- [ ] **"Intuitiv Bevægelse Øvelse"** findes kun som intro på den gamle side (kortet linkede forkert). Har Nadja den fulde tekst?

Allerede gjort, fordi specifikationen kræver det:

- Spam fjernet fra det-et-onsdag.
- Opfordringerne til vaginal-terapi fjernet fra vaginisme-vulvodyni ("Vaginal-terapi kan være en løsning!", afsnittet om behandlingen og underskriften "Sexolog, vaginal-terapeut & parterapeut").
- Sætningen "En sexolog kan også komme med mange inspirationer." fjernet fra lyst.

## Billeder

- **Artikelbilleder er ikke flyttet med.** Flere er nøgenbilleder, tegninger eller tredjepartsfotos (fx et med Nike-varemærke), som ikke passer til den nye retning, og rettighederne er uklare. Artikelkortene bruger i stedet sidens cirkelmotiv. Skal nogle med?
- **Fotografkredit:** Ifølge den gamle side er de fleste billeder taget af Nicoline Aagesen og Nadia Von Rikka. Skal de krediteres?

## Teknik og flytning til domænet

- **Preview på GitHub Pages:** Under *Settings → Pages* sættes *Source* til "Deploy from a branch", branch `astrologi-ombygning` og mappen `/docs`. Adressen bliver `https://luckuszon-web.github.io/NadjaKuszon/`. Previewet er `noindex`, og `robots.txt` blokerer søgemaskiner.
- **`docs/` skal genbygges** med `npm run build:pages`, før der committes ændringer, ellers viser previewet den gamle version.
- **Ved flytning:** Se "Ved flytning til domænet" i `REDIRECTS.md` (Netlify/Cloudflare Pages, DNS, http/www → https).
- **Domæne og DNS:** Hvem styrer domænet (registrar/DNS)? Kører der e-mail på domænet? (I dag bruges en Gmail-adresse.)
