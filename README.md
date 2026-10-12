# nadjakuszon.dk – ny hjemmeside

Ny version af hjemmesiden for Nadja Kuszon, holistisk sexolog & parterapeut.
Designet følger stilen fra den nuværende side: jordnære farver (guld, sand, terrakotta og salvie),
Gruppo til overskrifter og Quicksand til brødtekst, og den runde "Book tid"-knap.

Siden er ren HTML/CSS uden byggetrin – åbn `index.html` i en browser, eller kør fx:

```sh
python3 -m http.server
```

## Struktur

| Fil | Indhold |
| --- | --- |
| `index.html` | Forside |
| `tilbud.html` | Terapi, parterapi, vaginal-terapi, workshop, polterabend, tantra-yoga |
| `om-nadja.html` | Om Nadja, tilgang, uddannelser og medier |
| `anbefalinger.html` | Klientanbefalinger |
| `priser.html` | Priser, betaling og afbud |
| `kontakt.html` | Kontakt og åbningstider |
| `assets/css/style.css` | Al styling (farver defineres øverst som variabler) |
| `assets/js/main.js` | Mobilmenu og indtoning |
| `assets/img/` | Billeder fra den nuværende side, komprimeret til web |

Header og footer er ens på alle sider – husk at rette alle seks filer, hvis menuen ændres.
