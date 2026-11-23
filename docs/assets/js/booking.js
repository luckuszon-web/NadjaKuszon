// Trin-for-trin booking på kontaktsiden. Indlæses kun dér.
// Trinene ligger som <section class="bk-step" data-step="…"> i src/_includes/partials/booking.njk.
(() => {
  const box = document.getElementById("booking");
  if (!box) return;

  const form = box.querySelector(".bk-form");
  const progress = box.querySelector(".bk-progress");
  const progressLabel = box.querySelector(".bk-progress-label");
  const progressFill = box.querySelector(".bk-bar-fill");
  const steps = Object.fromEntries([...box.querySelectorAll(".bk-step")].map((s) => [s.dataset.step, s]));
  const phone = box.dataset.phone;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // De to spor. Fremdriften tælles inden for det spor, man er på.
  const JA = ["session", "kender", "dato", "tid", "sted", "fokus", "kontakt"];
  const NEJ = ["session", "kender", "aar"];

  const answers = { session: "", sessionDetail: "", kender: "", aar: "", dato: "", tid: "", sted: "", fokus: "", navn: "", telefon: "", email: "" };
  const history = [];
  let current = "session";

  form.hidden = false;
  progress.hidden = false;

  // ---------- Visning ----------

  function updateProgress(name) {
    const track = answers.kender === "nej" ? NEJ : JA;
    const i = track.indexOf(name);
    let label;
    let pct;
    if (i >= 0) {
      label = `Spørgsmål ${i + 1} af ${track.length}`;
      pct = ((i + 1) / track.length) * 100;
    } else if (name === "nej") {
      label = "Find dit fødselstidspunkt";
      pct = 100;
    } else if (name === "tak") {
      label = "Din booking er sendt";
      pct = 100;
    } else {
      label = "Din booking blev ikke sendt";
      pct = 100;
    }
    progressLabel.textContent = label;
    progressFill.style.width = `${pct}%`;
  }

  function show(name, { focus = true, remember = true } = {}) {
    if (remember && current && current !== name) history.push(current);
    for (const [key, el] of Object.entries(steps)) el.hidden = key !== name;
    current = name;
    updateProgress(name);
    if (focus) {
      const q = steps[name].querySelector(".bk-question");
      q.focus({ preventScroll: true });
      const top = box.getBoundingClientRect().top + window.scrollY - 96;
      if (box.getBoundingClientRect().top < 80) window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  function back() {
    const prev = history.pop();
    if (prev) show(prev, { remember: false });
  }

  // ---------- Validering ----------

  function setError(input, message) {
    const err = document.getElementById(`${input.id}-fejl`);
    if (!err) return;
    err.textContent = message || "";
    err.hidden = !message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  const thisYear = new Date().getFullYear();
  const validators = {
    aar(v) {
      if (!/^\d{4}$/.test(v)) return "Skriv dit fødselsår med 4 cifre, fx 1985.";
      const y = Number(v);
      if (y < 1900 || y > thisYear) return `Året skal være mellem 1900 og ${thisYear}.`;
      return "";
    },
    dato(v) {
      if (!v) return "Vælg din fødselsdato.";
      const d = new Date(`${v}T00:00:00`);
      if (Number.isNaN(d.getTime()) || d.getFullYear() < 1900) return "Datoen ser ikke rigtig ud.";
      if (d > new Date()) return "Datoen kan ikke ligge i fremtiden.";
      return "";
    },
    tid(v) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) return "Skriv tidspunktet som tt:mm, fx 14:35.";
      return "";
    },
    sted(v) {
      if (v.trim().length < 2) return "Skriv by og land, fx Odense, Danmark.";
      return "";
    },
    navn(v) {
      if (!v.trim()) return "Skriv dit navn.";
      return "";
    },
    telefon(v) {
      if (v.replace(/\D/g, "").length < 8) return "Skriv et telefonnummer med mindst 8 cifre.";
      return "";
    },
    email(v) {
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "E-mailadressen ser ikke rigtig ud.";
      return "";
    },
  };

  function check(name) {
    const input = form.elements[name];
    const value = input.value.trim();
    const message = validators[name] ? validators[name](value) : "";
    setError(input, message);
    if (!message) answers[name] = value;
    return !message;
  }

  // ---------- Fra et trin til det næste ----------

  const NEXT = { aar: "nej", dato: "tid", tid: "sted", sted: "fokus", fokus: "kontakt" };

  function next() {
    if (current === "aar") {
      if (!check("aar")) return form.elements.aar.focus();
      prepareSources(Number(answers.aar));
      return show("nej");
    }
    if (current === "fokus") {
      answers.fokus = form.elements.fokus.value.trim();
      return show("kontakt");
    }
    if (current in NEXT) {
      if (!check(current)) return form.elements[current].focus();
      show(NEXT[current]);
    }
  }

  function choose(button) {
    const field = button.dataset.field;
    for (const b of button.parentElement.querySelectorAll(".bk-option")) {
      b.setAttribute("aria-pressed", String(b === button));
    }
    answers[field] = button.dataset.value;
    if (field === "session") answers.sessionDetail = button.dataset.detail;
    const target = field === "session" ? "kender" : button.dataset.value === "ja" ? "dato" : "aar";
    // Kort pause, så man når at se sit valg – ingen pause ved reduceret bevægelse
    setTimeout(() => show(target), reduceMotion ? 0 : 250);
  }

  // Viser de rigtige steder at finde fødselstidspunktet ud fra fødselsåret.
  // 2001 viser både Sundhedsdatastyrelsen og CPR, fordi skæringen er i marts.
  function prepareSources(year) {
    for (const li of steps.nej.querySelectorAll("[data-fra]")) {
      li.hidden = !(year >= Number(li.dataset.fra) && year <= Number(li.dataset.til));
    }
    for (const p of steps.nej.querySelectorAll("[data-tabt]")) {
      p.hidden = Number(p.dataset.tabt) !== year;
    }
  }

  // ---------- Resumé og afsendelse ----------

  function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    return y ? `${d}.${m}.${y}` : "";
  }

  function rows() {
    return [
      ["Session", `${answers.session} (${answers.sessionDetail})`],
      ["Fødselsdato", formatDate(answers.dato)],
      ["Fødselstidspunkt", answers.tid],
      ["Fødested", answers.sted],
      ["Fokus", answers.fokus || "–"],
      ["Navn", answers.navn],
      ["Telefon", answers.telefon],
      ["E-mail", answers.email || "–"],
    ];
  }

  function fillSummaries() {
    for (const dl of box.querySelectorAll(".bk-summary")) {
      dl.replaceChildren(
        ...rows().flatMap(([k, v]) => {
          const dt = document.createElement("dt");
          dt.textContent = k;
          const dd = document.createElement("dd");
          dd.textContent = v;
          return [dt, dd];
        })
      );
    }
  }

  async function submit() {
    const ok = ["navn", "telefon", "email"].map(check);
    const firstBad = ["navn", "telefon", "email"][ok.indexOf(false)];
    if (firstBad) return form.elements[firstBad].focus();

    const button = form.querySelector(".bk-submit");
    button.disabled = true;
    button.textContent = "Sender …";

    const payload = {
      _subject: `Ny booking: ${answers.session} – ${answers.navn}`,
      _gotcha: form.elements._gotcha.value,
      Session: `${answers.session} (${answers.sessionDetail})`,
      Fødselsdato: formatDate(answers.dato),
      Fødselstidspunkt: answers.tid,
      Fødested: answers.sted,
      Fokus: answers.fokus || "–",
      Navn: answers.navn,
      Telefon: answers.telefon,
    };
    // Formspree bruger feltet "email" som svar-adresse og kræver, at det er gyldigt – udelades, hvis tomt
    if (answers.email) payload.email = answers.email;

    let sent = false;
    try {
      const res = await fetch(box.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      // Formspree svarer {"ok": true} ved succes og {"errors": [...]} ved fejl
      sent = res.ok && data.ok !== false && !data.errors;
    } catch {
      sent = false;
    }

    button.disabled = false;
    button.textContent = "Send min booking";
    fillSummaries();
    if (sent) {
      steps.tak.querySelector(".bk-fornavn").textContent = answers.navn.split(/\s+/)[0];
      history.length = 0;
      show("tak", { remember: false });
    } else {
      show("fejl");
    }
  }

  // ---------- Hændelser ----------

  box.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t || !box.contains(t)) return;
    if (t.classList.contains("bk-option")) choose(t);
    else if (t.classList.contains("bk-back")) back();
    else if (t.classList.contains("bk-next")) next();
    else if (t.classList.contains("bk-skip")) {
      form.elements.fokus.value = "";
      answers.fokus = "";
      show("kontakt");
    } else if (t.classList.contains("bk-has-info")) {
      answers.kender = "ja";
      for (const b of steps.kender.querySelectorAll(".bk-option")) b.setAttribute("aria-pressed", String(b.dataset.value === "ja"));
      show("dato");
    } else if (t.classList.contains("bk-retry")) {
      show("kontakt", { remember: false });
    }
  });

  // Enter i et felt går videre – på sidste trin sendes bookingen
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (current === "kontakt") submit();
    else next();
  });

  // Enter i et tekstfelt (ikke i fokus-feltet, hvor Enter giver ny linje)
  form.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
    e.preventDefault();
    if (current === "kontakt") submit();
    else next();
  });

  // Fjern fejlbesked, så snart man retter feltet
  form.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true") setError(e.target, "");
  });

  // Datofeltet må ikke vælge en dato i fremtiden
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  form.elements.dato.max = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  show("session", { focus: false, remember: false });
})();
