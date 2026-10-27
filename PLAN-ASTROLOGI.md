# Fase 1 – Undersøgelse og plan: astrologisk ombygning

*Udarbejdet 27. oktober 2026. Intet er slettet, flyttet eller omdøbt endnu – dette dokument venter på godkendelse.*

Domænet i opgaven stod som `[INDSÆT DOMÆNE]`. Jeg har gået ud fra **nadjakuszon.dk** – ret mig, hvis det er forkert.

---

## 1. Teknologi, build, deploy og redirects

Der er i dag **to** sider, og det er vigtigt at holde dem adskilt:

| | Den live side (nadjakuszon.dk) | Den nye side i dette repo |
|---|---|---|
| Teknologi | **TYPO3 CMS** (udviklet af TypoConsult, copyright-note fra 2016) på en Apache-server | **Statisk HTML/CSS/JS** uden framework |
| Build | Redigeres i TYPO3's admin | Intet build-trin. Header og footer er kopieret ind i hver HTML-fil. Skabelonscriptet, jeg genererede filerne med, ligger **ikke** i repoet |
| Deploy | Ligger hos den nuværende webhost | GitHub Pages fra branchen `claude/affectionate-mendel-22zyhj` (kun preview: `luckuszon-web.github.io/NadjaKuszon/`). Domænet peger stadig på TYPO3 |
| Routing | Mapper med skråstreg: `/om-nadja/`. Uden skråstreg giver serveren 301 til versionen med skråstreg | Flade filer: `/om-nadja.html` |
| Redirects | Apache/TYPO3. Der findes ingen egne viderestillinger ud over skråstregen | **Ingen**. GitHub Pages kan ikke lave rigtige 301-viderestillinger |
| Sitemap | **Findes ikke** (`/sitemap.xml` giver 404). `robots.txt` tillader alt | Findes ikke |
| Andet | `http://` og `www.` svarer begge med 200 uden at viderestille, så de samme sider findes på fire adresser. Google Analytics `UA-75791681-1` er Universal Analytics, som Google lukkede i 2023, så den måler intet | – |

### ⚠️ Sikkerhedsfund på den live side

Artiklen `/inspiration-viden/det-et-onsdag/` indeholder **indsat spam**: et afsnit skjult med `position:absolute; top:-9999px` og links til `casinoqueenvegas.dk` og `roosterbet.no`. Ingen andre sider er ramt (jeg har scannet alle 49). Det tyder på, at TYPO3-installationen eller en admin-konto er kompromitteret.

**Anbefaling, uafhængigt af ombygningen:** Bed den, der har adgang til TYPO3 (evt. TypoConsult), om at fjerne afsnittet med det samme, skifte adgangskoder og opdatere eller lukke installationen. Spam-links skader både sikkerhed og Google-placering.

Spamteksten er også kommet med i Word-arkivet (`tekstarkiv/`). Den fjerner jeg i fase 2.

### Mit forslag til teknisk løsning (kræver din godkendelse)

Acceptkriteriet kræver **rigtige 301-viderestillinger** og **uændrede blog-URL'er med skråstreg** (`/inspiration-viden/at-give-slip/`). Det kan den nuværende repo-opsætning ikke klare. Jeg foreslår:

1. **Static site generator: Eleventy (11ty).** Én fælles skabelon til header, menu og footer. Blogindlæg som Markdown-filer med kategori i frontmatter. Hver side får sin egen `permalink`, så alle gamle artikel-URL'er bevares præcist. `sitemap.xml` genereres automatisk. Bygges med `npm run build` til en statisk `_site/`-mappe. Det er stadig en statisk side, bare med en skabelon.
2. **Hosting: Netlify eller Cloudflare Pages** (begge gratis til denne størrelse). Begge understøtter en `_redirects`-fil med rigtige 301'ere, og domænet kan pege direkte derhen. Jeg anbefaler **Netlify**, fordi `_redirects` og preview-links pr. branch er enklest dér.
   - Alternativet er at blive på GitHub Pages med `<meta refresh>`-sider. Det er **ikke** en 301 og opfylder ikke acceptkriteriet.
3. **URL-stil: mapper med afsluttende skråstreg**, fx `/astrologisk-terapi/`, så det matcher de eksisterende blog-URL'er. Versionen uden skråstreg viderestilles direkte (ingen kæder).
4. **Kanonisk domæne:** `https://nadjakuszon.dk/`. `http://` og `www.` får 301 dertil hos den nye host.

---

## 2. a) Sideoversigt (den live side)

Den live side har **ingen sitemap.xml**, og Wayback Machine var ikke tilgængelig herfra. Oversigten bygger derfor på en fuld crawl af alle interne links fra forsiden. Det giver **12 hovedsider + 37 blogindlæg = 49 URL'er**, og alle svarer 200. TYPO3's `index.php?id=…`-adresser er lukket (404), så der er ingen skjulte sider at finde den vej.

Derudover findes ét blogkort uden egen side: **"Intuitiv Bevægelse Øvelse"**. Kortet på oversigtssiden linker fejlagtigt til `/inspiration-viden/fra-date-til-kaereste/`, og kun introteksten findes.

### Hovedsider og ydelsessider

| # | Gammel URL | Titel (H1) | Emne |
|---|---|---|---|
| 1 | `/` | Holistisk Sexolog & Parterapeut Nadja Kuszon -Terapi med indføling. | Forside: præsentation, OBS om lukket klinik, teasere til alle ydelser |
| 2 | `/tilbud/` | Tilbud: - Sexologisk Terapi - Parterapi - Vaginal-terapi - Polterabend | Oversigt over sexologisk terapi, parterapi, vaginal-terapi, workshop, polterabend |
| 3 | `/om-nadja/` | Sexolog & Parterapeut Nadja Kuszon | Baggrund, uddannelser (CV), tilgang, medier og samarbejder |
| 4 | `/anbefalinger/` | Anbefalinger | 5 klientanbefalinger (vaginisme, vulvodyni, smerter i underlivet) |
| 5 | `/inspiration-viden/` | Samarbejde med Bt.dk -Ekspert og sexolog på "sex med bt" | Blogoversigt + B.T.-artikler, samarbejder, medieomtale |
| 6 | `/priser/` | Priser: | Prisliste for de gamle ydelser, betaling, afbud, etisk ramme |
| 7 | `/kontakt/` | Tidsbestilling: | Kontakt, åbningstider, afbud, samarbejder |
| 8 | `/tilbud/workshoppolterabend/` | Workshop / Polterabend /Fødselsdag /Veninde aften | Yoni-workshop og polterabend (pris, varighed, indhold) |
| 9 | `/tilbud/terapi/` | Sexologisk terapi Individuelt | Sexologisk terapi individuelt |
| 10 | `/tilbud/parterapi/` | Holistisk Terapi for Par | Parterapi |
| 11 | `/tilbud/tantrayoga/` | Tantra-Yoga | Hvad er tantra, tantra-yoga, meditation (lang vidensartikel) |
| 12 | `/tilbud/smerteriunderlivet/` | Vaginisme & Vulvodyni - Smerter i underlivet | Vaginal-terapi mod vaginisme/vulvodyni + uddrag af anbefalinger |

### Blogindlæg (Inspiration / viden)

| # | URL | Titel (H1) | Ord | Foreslået kategori |
|---|---|---|---|---|
| 1 | `/inspiration-viden/at-give-slip/` | At give slip | 294 | Krop, kærlighed & relationer |
| 2 | `/inspiration-viden/kaerlighed-og-selvopgivelse/` | Men hvor går grænsen mellem kærlighed og selvopgivelse? | 411 | Krop, kærlighed & relationer |
| 3 | `/inspiration-viden/lyst-starter-i-hjernen-men-foeles-i-kroppen/` | Lyst starter i hjernen -men føles i kroppen | 396 | Krop, kærlighed & relationer |
| 4 | `/inspiration-viden/trauma-kaerlighed/` | Vejen fra traume til bevidst kærlighed | 621 | Krop, kærlighed & relationer |
| 5 | `/inspiration-viden/naar-kroppen-siger-nej/` | Lystens forsvinden -Når kroppen siger nej | 223 | Krop, kærlighed & relationer |
| 6 | `/inspiration-viden/din-hjerne-er-dit-mest-kraftfulde-erotiske-organ/` | Din hjerne er dit mest kraftfulde erotiske organ | 279 | Krop, kærlighed & relationer |
| 7 | `/inspiration-viden/hvordan-opdager-vi-moenstre/` | Hvordan opdager vi mønstre? | 225 | Krop, kærlighed & relationer |
| 8 | `/inspiration-viden/selvvaerd/` | Selvværd Kontra selvtillid | 253 | Krop, kærlighed & relationer |
| 9 | `/inspiration-viden/kaerestesorg-kontra-doedsfald/` | Kærestesorg Kontra dødsfald | 1009 | Krop, kærlighed & relationer |
| 10 | `/inspiration-viden/jeg-taler-ikke-om-mad/` | God mad tager tid, der skal kæles og forberedes. | 18 | Krop, kærlighed & relationer |
| 11 | `/inspiration-viden/konflikt-lyst/` | Kommunikation, konflikter og lyst -når ord (eller manglen på dem) skab | 271 | Krop, kærlighed & relationer |
| 12 | `/inspiration-viden/lystforskelle-i-parforhold/` | Lystforskelle i parforhold - helt normalt, men ofte misforstået! | 303 | Krop, kærlighed & relationer |
| 13 | `/inspiration-viden/lystens-mange-lag/` | Lystens mange lag -Det handler ikke kun om sex | 568 | Tantra & bevidsthed |
| 14 | `/inspiration-viden/jalousi/` | Sund vs. usund jalousi | 197 | Krop, kærlighed & relationer |
| 15 | `/inspiration-viden/forventninger/` | Forventninger! | 519 | Krop, kærlighed & relationer |
| 16 | `/inspiration-viden/naar-lyst-bliver-liv/` | Seksuel energi som kreativ kraft -Når lyst bliver liv | 363 | Tantra & bevidsthed |
| 17 | `/inspiration-viden/lever-du-ud-fra-frygt/` | Lever du ud fra frygt? | 303 | Tantra & bevidsthed |
| 18 | `/inspiration-viden/graenseloes/` | Grænseudvidende fremfor Grænseoverskridende | 410 | Tantra & bevidsthed |
| 19 | `/inspiration-viden/haengeparti/` | Når relationen bliver et hængeparti | 608 | Krop, kærlighed & relationer |
| 20 | `/inspiration-viden/lyst/` | Lyst | 386 | Krop, kærlighed & relationer |
| 21 | `/inspiration-viden/utroskab/` | Fysisk vs. følelsesmæssig utroskab? | 190 | Krop, kærlighed & relationer |
| 22 | `/inspiration-viden/hvor-skal-vi-begynde/` | Hvor skal vi begynde? | 203 | Krop, kærlighed & relationer |
| 23 | `/inspiration-viden/fantasier-graenser/` | Fantasier -de delte, de skjulte og dem, vi aldrig udleve | 425 | Krop, kærlighed & relationer |
| 24 | `/inspiration-viden/hvad-er-en-sund-relation/` | Hvad er en sund reation? | 193 | Krop, kærlighed & relationer |
| 25 | `/inspiration-viden/et-holdt-hjerte/` | Et holdt hjerte, nøglen til nærhed og lyst. | 352 | Krop, kærlighed & relationer |
| 26 | `/inspiration-viden/lystens-sprog/` | Lystens sprog -Kommunikation i soveværelset | 236 | Krop, kærlighed & relationer |
| 27 | `/inspiration-viden/kropsscanning-fordyb-din-sanselighed/` | Kropsscanning -fordyb din sanselighed | 174 | Tantra & bevidsthed |
| 28 | `/inspiration-viden/fra-date-til-kaereste/` | Fra Date til kæretse | 644 | Krop, kærlighed & relationer |
| 29 | `/inspiration-viden/vaginisme-vulvodyni/` | Vaginisme & Vulvodyni, Smerter i underlivet under sex! | 1059 | Krop, kærlighed & relationer |
| 30 | `/inspiration-viden/adgang-til-nydelse/` | Du har adgang til mere nydelse, end du tror! | 390 | Krop, kærlighed & relationer |
| 31 | `/inspiration-viden/lyst-tryghed-spaeniing/` | “Vi ønsker tryghed, men længes efter spænding.” | 598 | Krop, kærlighed & relationer |
| 32 | `/inspiration-viden/6-maader-at-skabe-hverdags-erotik/` | 6 Måder at Skabe Hverdags-Erotik | 277 | Krop, kærlighed & relationer |
| 33 | `/inspiration-viden/lyst-gennem-livet/` | Lyst gennem livet | 327 | Krop, kærlighed & relationer |
| 34 | `/inspiration-viden/seksuel-lyst-vs-emotionel-tiltraekning/` | Seksuel lyst vs. Emotionel tiltrækning | 243 | Krop, kærlighed & relationer |
| 35 | `/inspiration-viden/erotisk-fantasi-slip-kontrollen/` | Erotisk fantasi -slip kontrollen og leg med tankerne | 167 | Krop, kærlighed & relationer |
| 36 | `/inspiration-viden/det-et-onsdag/` | DET ER ONSDAG GRETE... | 906 | Krop, kærlighed & relationer |
| 37 | `/inspiration-viden/bevidst-lyst/` | Bevidst Lyst | 689 | Krop, kærlighed & relationer |


---

## 3. Eksisterende anbefalinger, billeder, farver, fonte og booking

### Anbefalinger (alle fra `/anbefalinger/`, ordret)

| Afsender | Handler om | Egnet til forside / Astrologisk terapi? |
|---|---|---|
| **Mille, 27** | Nadja som person: *"Nadja er et af de mest hjertevarme personer, jeg har mødt … har altid et råd parat til at håndtere alle livets aspekter, store som små. Hun er yderst professionel og oprigtigt interesseret i at hjælpe med dit problem!"* | **Ja, bedste kandidat.** Handler om hende som menneske, ikke om en bestemt behandling. Sidste afsnit nævner dog "at starte hos en sexolog", så kun de første afsnit bør bruges |
| **Malou, 25** ("En gave for livet") | Vulvodyni og vaginisme gennem 7 år. Ét afsnit handler om Nadja som person: *"Nadja er et helt igennem behageligt, hjertevarmt og positivt menneske … Hun er ualmindeligt lyttende og opmærksom på den enkelte klients behov …"* | **Kun dette uddrag** (den gamle side brugte det allerede som topcitat). Resten handler udelukkende om vaginal-terapi |
| **Anonym klient** | *"Så kan jeg kun takke dig fordi du er så fantastisk sej. jeg havde aldrig klaret det her uden din hjælp! De varmeste anbefalinger herfra"* | Mulig, men kort og uden kontekst |
| **J, 28** | Vaginisme, vaginale tryk, samleje | **Nej.** Handler udelukkende om en gammel ydelse → `TODO.md` |
| **Nina, 25** | Smerter i underlivet og seksualitet | **Nej.** Handler udelukkende om en gammel ydelse → `TODO.md` |

**Ingen af anbefalingerne nævner astrologi.** Forslag: Mille + Malou-uddraget + den anonyme på forsiden og Astrologisk terapi, hvis Nadja godkender. Spørg også, om hun har (eller kan indhente) anbefalinger fra horoskoptydninger.

*Bemærk:* I den nuværende repo-version har jeg rettet stavefejl og omformuleret i anbefalingerne. Det er i strid med reglen "ordret", så i fase 2 hentes de igen direkte fra den gamle side.

### Billeder

- **I repoet** (`assets/img/`, komprimeret): fire portrætter af Nadja (`nadja-hat.jpg`, `nadja-smil.jpg`, `nadja-om.jpg`, plus det fra app-ikonet) og stemningsbilleder (bladskygger, lys i vinduer, blomster, relief). De fleste er taget af Nicoline Aagesen og Nadia Von Rikka ifølge den gamle side. Bladskygge- og lysbillederne passer godt til den jordnære retning.
- **På den gamle side, ikke hentet endnu:** ét billede til de fleste artikler (25 af 37). Billedet til "jeg-taler-ikke-om-mad" ligner et tredjepartsfoto med varemærke (Nike) og bør ikke genbruges. Rettighederne til artikelbillederne bør bekræftes.
- **Hero-portræt i cirkel:** `nadja-hat.jpg` eller `nadja-smil.jpg` egner sig bedst (ansigtet er centreret).

### Farver og kontrast

Den gamle palet er guld `#C69F74`, tekst `#474747`, salvie `#9C9A89` (footer) og creme/sand. Opgavens palet passer godt som en mørkere, mere eksklusiv videreførelse. Kontrast efter WCAG:

| Kombination | Kontrast | AA (4,5:1)? |
|---|---|---|
| Tekst `#2E2620` på creme `#F4EEE3` | 12,9 | ✅ |
| Mosgrøn `#5E6B4E` på creme (links) | 4,9 | ✅ (lige akkurat, så mørkere mos til små tekster) |
| Creme på mosgrøn (knapper) | 4,9 | ✅ |
| Guld `#A88B55` på creme | 2,8 | ❌, derfor **kun dekoration** som foreskrevet |
| *Gammel:* hvid på salvie-footer | 2,8 | ❌, footeren skal laves om |
| *Gammel:* guld `#C69F74` på creme | 2,1 | ❌ |

### Fonte

Overskrifter i dag: **Gruppo**, en tynd, bred sans-serif. Brødtekst: **Quicksand**. Gruppo er ikke en serif og bliver svær at læse i små størrelser, så den passer ikke til den nye retning. Forslag: **Cormorant Garamond** (elegant serif) til overskrifter og **Quicksand** som før til brødtekst i 18 px. Begge hentes fra Google Fonts. Alternativt kan brødteksten skifte til en mere neutral skrift som **Mulish**, hvis Quicksand føles for "rund".

### Booking

**Der er intet bookingsystem.** Både den gamle og den nye side booker via **sms/opkald på 21 21 88 94** og e-mail (`nadjakuszon@gmail.com`). "Book tid"-knappen linker bare til kontaktsiden. Der er altså intet eksternt system at rydde op i. Bookingknapperne i den nye version peger på `/kontakt/`, og kontaktsiden får sms-, telefon- og mail-knapper. Hvis Nadja vil have online booking (fx Planway, SimplyBook eller Calendly), er det en senere beslutning.

---

## 4. b) Forslag til redirect-tabel

Alle viderestillinger er **301**, peger direkte på målet (ingen kæder) og dækker både versionen med og uden skråstreg.

### Hovedsider

| Gammel URL | Ny URL | Begrundelse |
|---|---|---|
| `/` | `/` | Uændret |
| `/tilbud/` | `/astrologisk-terapi/` | Ydelsesoversigten erstattes af den nye ydelsesside |
| `/tilbud/terapi/` | `/om-nadja/` | Sexologisk terapi er nu kun baggrund |
| `/tilbud/parterapi/` | `/om-nadja/` | Parterapi er nu kun baggrund |
| `/tilbud/smerteriunderlivet/` | `/om-nadja/` | Vaginal-terapi er nu kun baggrund |
| `/tilbud/tantrayoga/` | `/inspiration-viden/kategori/tantra-bevidsthed/` | Indholdet er primært viden om tantra. *Alternativ (se 5c):* gør teksten til en artikel på `/inspiration-viden/hvad-er-tantra/` og viderestil dertil |
| `/tilbud/workshoppolterabend/` | `/foredrag-og-events/` | Samme indhold i ny form |
| `/om-nadja/` | `/om-nadja/` | Uændret |
| `/anbefalinger/` | `/astrologisk-terapi/` | Anbefalingerne flytter herhen |
| `/priser/` | `/astrologisk-terapi/` | Priserne står nu her |
| `/kontakt/` | `/kontakt/` | Uændret |
| `/inspiration-viden/` | `/inspiration-viden/` | Uændret URL, nyt menunavn: "Viden & inspiration" |
| `http://…`, `www.nadjakuszon.dk/…` | `https://nadjakuszon.dk/…` | Én kanonisk adresse (i dag svarer alle fire varianter 200) |

### Nye URL'er

`/astrologisk-terapi/`, `/foredrag-og-events/`, `/inspiration-viden/kategori/astrologi/`, `/inspiration-viden/kategori/krop-kaerlighed-relationer/`, `/inspiration-viden/kategori/tantra-bevidsthed/`. Ingen af dem kolliderer med eksisterende artikel-slugs.

### Blogindlæg

Alle 37 artikler **beholder deres URL**. Kun hvis du godkender sammenlægninger eller fjernelser i 5c, kommer disse viderestillinger til:

| Fjernet/sammenlagt artikel | → Viderestilles til |
|---|---|
| `/inspiration-viden/jeg-taler-ikke-om-mad/` | `/inspiration-viden/kategori/krop-kaerlighed-relationer/` |
| `/inspiration-viden/lyst/` | `/inspiration-viden/bevidst-lyst/` |
| `/inspiration-viden/erotisk-fantasi-slip-kontrollen/` | `/inspiration-viden/fantasier-graenser/` |
| `/inspiration-viden/din-hjerne-er-dit-mest-kraftfulde-erotiske-organ/` | `/inspiration-viden/lyst-starter-i-hjernen-men-foeles-i-kroppen/` |
| `/inspiration-viden/vaginisme-vulvodyni/` | `/inspiration-viden/kategori/krop-kaerlighed-relationer/` |
| `/inspiration-viden/fra-date-til-kaereste/` | `/inspiration-viden/haengeparti/` |
| `/inspiration-viden/det-et-onsdag/` | `/inspiration-viden/forventninger/` |

*Preview-adresserne på GitHub Pages (`…github.io/NadjaKuszon/*.html`) har aldrig været offentlige på domænet og får ingen viderestilling. Pages kan slås fra, når den nye host er sat op.*

---

## 5. c) Forslag til blogindlæggene

**Hovedproblem:** Der findes **ingen artikler om astrologi** i dag. Kategorien "Astrologi", som skal stå øverst, vil være tom ved lancering. Jeg må ikke selv skrive artikler i Nadjas navn. Forslag: Kategorien skjules, indtil Nadja har leveret 2–3 artikler, eller lanceringen venter på dem → `TODO.md`.

### Beholdes uændret (kun ny kategori, CTA-boks i bunden og evt. korrektur af åbenlyse tastefejl)

**Krop, kærlighed & relationer (25):** at-give-slip · kaerlighed-og-selvopgivelse · lyst-starter-i-hjernen-men-foeles-i-kroppen · trauma-kaerlighed · naar-kroppen-siger-nej · hvordan-opdager-vi-moenstre · selvvaerd · kaerestesorg-kontra-doedsfald · konflikt-lyst · lystforskelle-i-parforhold · jalousi · forventninger · haengeparti · hvor-skal-vi-begynde · fantasier-graenser · hvad-er-en-sund-relation · et-holdt-hjerte · lystens-sprog · adgang-til-nydelse · lyst-tryghed-spaeniing · 6-maader-at-skabe-hverdags-erotik · lyst-gennem-livet · seksuel-lyst-vs-emotionel-tiltraekning · bevidst-lyst · utroskab

**Tantra & bevidsthed (5):** lystens-mange-lag · naar-lyst-bliver-liv · lever-du-ud-fra-frygt · graenseloes · kropsscanning-fordyb-din-sanselighed

*Stærkest og mest i tråd med den nye profil:* **haengeparti** (tilknytning, nervesystem), **trauma-kaerlighed**, **hvordan-opdager-vi-moenstre** og **kaerlighed-og-selvopgivelse**. De handler om mønstre og forsvarsmekanismer, som er præcis de temaer, astrologisk terapi arbejder med. De bør fremhæves øverst i deres kategori.

### Små rettelser (titel/sprog, URL beholdes)

| Artikel | Problem | Forslag |
|---|---|---|
| hvad-er-en-sund-relation | Titlen staves "Hvad er en sund **reation**?" | Ret til "relation" |
| utroskab | Skriver "$£x" og "s£ksuelle" | Skriv ordene normalt |
| graenseloes | Mange tastefejl og løse "."-linjer som afstand | Let korrektur |
| lyst | Sætningen "En sexolog kan også komme med mange inspirationer" | Fjern sætningen (eller sammenlæg, se nedenfor) |
| jalousi | "tag fat i en terapeut" | **Behold.** Det er en generel henvisning, ikke en opfordring til at booke Nadja |

Ud over "vaginisme-vulvodyni" (nedenfor) har ingen artikler egentlige opfordringer til at bestille de gamle ydelser.

### Sammenlægges (overlap)

| Sammenlæg | Ind i | Begrundelse |
|---|---|---|
| **lyst** (386 ord) | **bevidst-lyst** (689) | Begge handler om responsiv lyst og "fantasibog". bevidst-lyst er mere udfoldet |
| **erotisk-fantasi-slip-kontrollen** (167) | **fantasier-graenser** (425) | Samme emne. Den korte er en øvelse, der kan blive et afsnit |
| **din-hjerne-er-dit-mest-kraftfulde-erotiske-organ** (279) | **lyst-starter-i-hjernen-men-foeles-i-kroppen** (396) | Samme pointe: lyst starter i hjernen |

### Fjernes (med 301, se tabellen ovenfor)

| Artikel | Begrundelse |
|---|---|
| **jeg-taler-ikke-om-mad** | Kun én sætning (18 ord) og et billede, der sandsynligvis er tredjeparts |
| **vaginisme-vulvodyni** | Reelt en reklame for vaginal-terapi ("Vaginal-terapi kan være en løsning!"). Beskriver Nadja som "kommende parterapeut" og har sundhedsfaglige påstande. Uden reklamedelen er der ikke meget tilbage |
| **fra-date-til-kaereste** | Kønsstereotype generaliseringer, der ikke matcher den nye professionelle profil ("En af mandens formål her i livet er nemlig sex", "undgå du at blive et hul for mandens lyster"). Titlen staves "kæretse". **haengeparti** dækker emnet langt bedre |
| **det-et-onsdag** | Indeholder spam (se afsnit 1), er meget personlig og dateret og sprogligt svag. Alternativ: behold den, men fjern spammen og læs korrektur |

### Nyt indhold (forslag, kræver godkendelse)

- **"Hvad er tantra?"** Den lange vidensdel af den gamle ydelsesside `/tilbud/tantrayoga/` er god tekst til kategorien Tantra & bevidsthed. Den kan blive en artikel på `/inspiration-viden/hvad-er-tantra/`, hvor ydelsesdelen udelades.
- **"Intuitiv Bevægelse Øvelse"** findes kun som intro. Hvis Nadja har den fulde tekst, kan den oprettes. Ellers udelades den.

**Optælling, hvis alt godkendes:** 37 − 3 sammenlagte − 4 fjernede = **30 artikler** (+ evt. "Hvad er tantra?").

---

## 6. d) Kræver Nadjas input (samles i `TODO.md` i fase 3)

**Fra opgaven:**
1. Hvad er svaret, hvis kunden ikke kender sit fødselstidspunkt?
2. Er de 90 minutter selve sessionen, eller indgår forberedelsen i dem?
3. Er hun momsregistreret? *(Den gamle prisside skriver "Alle priser er inkl. moms", så det tyder på ja.)*
4. Afbudsregler? *(Den gamle side har to modstridende regler: 48 timer/500 kr. på Priser og 24 timer/fuld pris på Kontakt.)*
5. Bookingsystem: der er intet, booking sker via sms/telefon/mail. Ønsker hun et?
6. Hvilke anbefalinger må bruges? (Se afsnit 3. Ingen nævner astrologi.)
7. Foredrag & events: pris, varighed, antal deltagere, geografi. *(Den gamle side har: polterabend 1,5 time, 3.500 kr., typisk 8–12 deltagere, "Jeg kommer ud til jer på Sjælland", transport tillægges; yoni-workshop 2,5 timer, 550 kr./person, min. 8 personer. Gælder de også for de nye formater som astrologisk polterabend?)*
8. Godkendelse af formuleringen om, at astrologisk terapi ikke erstatter psykolog- eller lægebehandling.
9. Valgfrit: navnet på astrologiuddannelsen.

**Nye spørgsmål fra undersøgelsen:**

10. **Astrologi-artikler:** Der findes ingen. Kan Nadja skrive 2–3 inden lancering, eller skal kategorien skjules indtil da?
11. **Spam på den live side:** Hvem har adgang til TYPO3 (TypoConsult?), så spammen kan fjernes og adgangskoderne skiftes nu?
12. **Domæne og DNS:** Hvem styrer domænet (registrar og DNS), så det kan pege på den nye host? Køres der e-mail på domænet, som ikke må forstyrres? (I dag bruges en Gmail-adresse.)
13. **Hero-portræt:** Hvilket foto skal i cirklen? Er der nyere portrætter?
14. **Billedrettigheder:** Må artikelbillederne genbruges? Skal fotograferne krediteres?
15. **Personlig historie på Om Nadja:** Den gamle tekst nævner to skilsmisser, tre børn og "livets barske realiteter i en ung alder". Skal det med? (Formuleringen "de sidste 13 år" omskrives under alle omstændigheder til "siden 2013".)
16. **Sociale medier:** Er Facebook-siden og LinkedIn stadig aktuelle? Er der en Instagram-profil?
17. **Statistik:** Den gamle Google Analytics-kode virker ikke længere. Ønskes ny statistik? I så fald anbefales en cookiefri løsning (fx Plausible), så siden ikke behøver et cookiebanner.
18. **Adresse:** Footeren på den gamle side linker til Søndre Jernbanevej 4E, Hillerød på Google Maps. Skal en adresse stå på siden, eller kun "Online via Zoom"?
19. **Tantra-tekst og "Intuitiv Bevægelse":** Se afsnit 5. Skal de bruges?

---

## 7. Hvad jeg skal bruge fra dig for at starte fase 2

1. **Godkend den tekniske løsning:** Eleventy + Netlify (eller Cloudflare Pages) og URL'er med skråstreg.
2. **Godkend redirect-tabellen** (afsnit 4).
3. **Godkend blogforslagene** (afsnit 5): behold, ret, sammenlæg, fjern, ny "Hvad er tantra?". Du kan også godkende dele af dem.
4. **Bekræft domænet** (nadjakuszon.dk).

Spørgsmålene i afsnit 6 blokerer ikke fase 2. Manglende svar markeres som `TODO(Nadja)` i koden, og de berørte sektioner skjules, indtil svaret findes.
