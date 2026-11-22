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

Hver regel findes både med og uden afsluttende skråstreg (fx `/anbefalinger` og `/anbefalinger/`), så der aldrig opstår en kæde.

## Uændrede URL'er (svarer 200)

| URL | Bemærkning |
|---|---|
| `/` | Ny forside |
| `/om-nadja/` | Nyt indhold |
| `/kontakt/` | Nyt indhold, menunavn "Kontakt / Book tid" |
| `/priser/` | Egen side igen med de nye priser (menupunktet "Priser") |
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

## Ved flytning til domænet (GitHub Pages)

Siden bliver på GitHub Pages. GitHub Pages kan ikke lave rigtige 301'ere, så de gamle URL'er får viderestillingssider (`<meta refresh>` + `canonical`), som Google behandler som en permanent flytning.

1. **I repoet:** Kør `npm run build:domain` og commit/push `docs/`. Det bygger siden til `https://nadjakuszon.dk/` (uden `/NadjaKuszon/`, synlig for søgemaskiner) og lægger en `CNAME`-fil i `docs/`. Gør det først på flyttedagen, for derefter peger previewet på domænet.
2. **På GitHub:** Under *Settings → Pages → Custom domain* skrives `nadjakuszon.dk` og trykkes Save.
3. **Hos Gigahost (DNS):**
   - Ret A-recorden for `nadjakuszon.dk` fra `178.72.21.224` til GitHubs fire adresser: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` og `185.199.111.153` (fire A-records).
   - Valgfrit (IPv6): fire AAAA-records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153` og `2606:50c0:8003::153`.
   - Slet wildcard-CNAME'en `*.nadjakuszon.dk`. GitHub fraråder wildcards, fordi de kan misbruges til at overtage underdomæner.
   - Opret en CNAME `www.nadjakuszon.dk` → `luckuszon-web.github.io`.
   - **Rør ikke** MX-, TXT- og SRV-records. De hører til mailen hos Gigahost.
4. **HTTPS:** Når GitHub har godkendt domænet (minutter til et døgn), sættes flueben i *Enforce HTTPS*.
5. **Test:** `https://nadjakuszon.dk`, `www.`, `http://` og fx `/anbefalinger/` skal alle ende på den nye side.
6. **Efter en uge:** Bed TypoConsult om at lukke den gamle side, og fjern evt. `ip4:178.72.21.224` fra SPF-recorden.

*Alternativ:* Flyttes siden senere til Netlify eller Cloudflare Pages, bruges `npm run build` (output i `_site/`) i stedet. Dér laver `_redirects` rigtige 301'ere.
