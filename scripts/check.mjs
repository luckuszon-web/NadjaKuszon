// Tjekker den byggede side (_site) mod acceptkriterierne.
// Kør: npm run build && npm run check
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const SITE = path.resolve("_site");
const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const files = walk(SITE);
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const urlOf = (f) => "/" + path.relative(SITE, f).replace(/index\.html$/, "").replace(/\\/g, "/");
const pages = htmlFiles.map((f) => ({ file: f, url: urlOf(f), html: fs.readFileSync(f, "utf8") }));

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
const textOf = (s) => strip(s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");

// 1. Titel, beskrivelse, H1, menu, footer
const titles = new Map();
const descs = new Map();
for (const p of pages) {
  if (p.url === "/404.html") continue;
  const title = p.html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = p.html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const h1 = (strip(p.html).match(/<h1[\s>]/g) || []).length;
  const nav = p.html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  const navItems = (nav.match(/<li>/g) || []).length;
  if (!title) fail(`${p.url}: mangler <title>`);
  if (!desc) fail(`${p.url}: mangler meta-beskrivelse`);
  if (h1 !== 1) fail(`${p.url}: ${h1} H1'er (skal være 1)`);
  if (navItems !== 6) fail(`${p.url}: menuen har ${navItems} punkter (skal være 6)`);
  if (!p.html.includes("Soul Life v/ Nadja Kuszon · CVR 36341386")) fail(`${p.url}: footer mangler Soul Life-linjen`);
  if (titles.has(title)) fail(`Dublet-titel: "${title}" på ${p.url} og ${titles.get(title)}`);
  titles.set(title, p.url);
  if (descs.has(desc)) fail(`Dublet-beskrivelse på ${p.url} og ${descs.get(desc)}`);
  descs.set(desc, p.url);
  const len = desc?.replace(/&amp;/g, "&").length ?? 0;
  if (!p.url.startsWith("/inspiration-viden/") || p.url === "/inspiration-viden/") {
    if (len < 140 || len > 160) notes.push(`${p.url}: meta-beskrivelse er ${len} tegn`);
  }
}

// 2. Interne links og ankre
const exists = (u) => {
  const clean = decodeURI(u.split("#")[0].split("?")[0]);
  if (clean === "") return true;
  const f = path.join(SITE, clean);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, "index.html")));
};
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const p of pages) {
  for (const [, u] of strip(p.html).matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!exists(u)) { fail(`${p.url}: brudt link ${u}`); continue; }
    const hash = u.split("#")[1];
    if (hash) {
      const target = u.split("#")[0] || p.url;
      const t = pages.find((x) => x.url === target);
      if (t && !idsOf(t.html).has(hash)) fail(`${p.url}: anker findes ikke: ${u}`);
    }
  }
}

// 3. JSON-LD
const types = new Set();
for (const p of pages) {
  for (const [, json] of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      const items = data["@graph"] ?? [data];
      for (const it of items) {
        types.add(it["@type"]);
        if (it["@type"] === "Service" && !(it.offers?.price && it.offers?.priceCurrency)) fail(`${p.url}: Service uden pris`);
        if (it["@type"] === "FAQPage" && !it.mainEntity?.length) fail(`${p.url}: tom FAQPage`);
      }
    } catch (e) {
      fail(`${p.url}: ugyldig JSON-LD (${e.message})`);
    }
  }
}
for (const t of ["Person", "Service", "FAQPage"]) if (!types.has(t)) fail(`JSON-LD mangler typen ${t}`);

// 4. Ingen synlige pladsholdere
for (const p of pages) {
  const t = textOf(p.html);
  if (/TODO|\[INDSÆT DOMÆNE|lorem ipsum/.test(t)) fail(`${p.url}: synlig pladsholder/TODO`);
}

// 5. Gamle ydelser: må kun nævnes som baggrund (Om Nadja, kort på Astrologisk terapi, blog, events)
const OLD = /sexolog|parterapi|vaginal|tarot|clairvoyance/i;
const BACKGROUND_OK = (u) => u.startsWith("/om-nadja/") || u.startsWith("/inspiration-viden/") || u === "/astrologisk-terapi/" || u === "/foredrag-og-events/" || u === "/" ;
for (const p of pages) {
  const t = textOf(p.html.replace(/<head>[\s\S]*?<\/head>/, ""));
  const hits = [...t.matchAll(new RegExp(`.{0,60}(${OLD.source}).{0,60}`, "gi"))].map((m) => m[0].trim());
  if (hits.length && !BACKGROUND_OK(p.url)) fail(`${p.url}: nævner gamle ydelser: ${hits[0]}`);
  // Bookingknapper må kun pege på kontakt og aldrig nævne gamle ydelser
  for (const [, label] of p.html.matchAll(/class="btn[^"]*"[^>]*>([^<]*)</g)) {
    if (OLD.test(label)) fail(`${p.url}: knap nævner gammel ydelse: ${label}`);
  }
}

// 6. Guld må ikke bruges til tekst
const css = fs.readFileSync(path.join(SITE, "assets/css/style.css"), "utf8");
for (const m of css.matchAll(/(^|[;{\s])color:\s*var\(--gold[^)]*\)/g)) fail(`CSS bruger guld som tekstfarve: ${m[0].trim()}`);

// 7. Viderestillinger: simulér _redirects som Netlify og test alle gamle URL'er
const rules = fs.readFileSync(path.join(SITE, "_redirects"), "utf8").split("\n")
  .filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.trim().split(/\s+/));
const OLD_URLS = JSON.parse(fs.readFileSync(path.resolve("scripts/gamle-urls.json"), "utf8"));
const server = http.createServer((req, res) => {
  const rule = rules.find(([from]) => from === req.url);
  if (rule) { res.writeHead(Number(rule[2]), { Location: rule[1] }); return res.end(); }
  if (exists(req.url) && req.url.endsWith("/")) { res.writeHead(200); return res.end(); }
  if (!req.url.endsWith("/") && exists(req.url + "/")) { res.writeHead(301, { Location: req.url + "/" }); return res.end(); }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const get = (u) => new Promise((r) => http.get({ port, path: u }, (res) => { res.resume(); r({ status: res.statusCode, location: res.headers.location }); }));
let tested = 0;
for (const old of OLD_URLS) {
  for (const variant of [old, old.replace(/\/$/, "") || "/"]) {
    const a = await get(variant);
    tested++;
    if (a.status === 200) continue;
    if (a.status !== 301) { fail(`Gammel URL ${variant} gav ${a.status}`); continue; }
    const b = await get(a.location);
    if (b.status !== 200) fail(`Gammel URL ${variant} → ${a.location} gav ${b.status} (kæde eller 404)`);
  }
}
server.close();

console.log(`Sider: ${pages.length} · Gamle URL'er testet: ${tested} · JSON-LD-typer: ${[...types].join(", ")}`);
for (const n of notes) console.log("note: " + n);
if (problems.length) {
  console.log(`\n${problems.length} problem(er):`);
  for (const p of problems) console.log(" ✗ " + p);
  process.exit(1);
}
console.log("✓ Alle tjek bestået");
