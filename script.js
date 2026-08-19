/* ============================================================
   EDIT THIS CONFIG — everything content-related lives here.
   ============================================================ */
const CONFIG = {
  sealInitials: "U & D",

  groom: {
    name: "Uma Maheswara Rao",
    parents: "Son of Sri Padala Manmada Rao & Smt. Padala Vimala",
    blurb: "Warm-hearted and easygoing, Uma brings quiet steadiness and a ready smile to everyone around him."
  },
  bride: {
    name: "Divya Teja",
    parents: "Daughter of Sri Tamiri Yama Rao & Smt. Tamiri Saraswathi",
    blurb: "Graceful and full of warmth, Divya lights up every gathering she's part of."
  },

  // ISO datetime, used for the countdown — targets the Sumuhurtham moment
  muhurthamISO: "2026-08-30T23:42:00",
  saveTheDateShort: "30.08.2026",
  venueCity: "Hyderabad, Telangana",

  location: {
    venueName: "NRC Gardens",
    address: "No. 6-23/2, Pragathi Nagar, Moosapet, Hyderabad",
    mapQuery: "NRC Gardens, Pragathi Nagar, Moosapet, Hyderabad"
  },

  welcomeNote: "Your presence is the greatest gift of all. We can't wait to celebrate this beautiful new beginning surrounded by the people who mean the most to us — welcome, and thank you for being here.",

  events: {
    haldi: {
      icon: "🌼",
      name: "Haldi",
      accent: "var(--marigold)",
      line: "Turmeric, giggles, and the first blessings of the day.",
      dateTimeLabel: "Saturday, 29 August 2026 · 10:00 AM onwards",
      icsStart: "20260829T100000",
      icsEnd: "20260829T130000"
    },
    sangeet: {
      icon: "🎶",
      name: "Sangeet",
      accent: "var(--teal)",
      line: "Grab your dancing shoes — the whole family's hitting the floor tonight.",
      // Assumed evening start since it follows Haldi the same day — edit if your actual time differs
      dateTimeLabel: "Saturday, 29 August 2026 · 6:00 PM onwards",
      icsStart: "20260829T180000",
      icsEnd: "20260829T220000"
    },
    muhurtham: {
      name: "Sumuhurtham",
      icsStart: "20260830T224200",
      icsEnd: "20260831T003000",
      venue: "NRC Gardens, Hyderabad"
    },
    reception: {
      name: "Reception",
      icsStart: "20260830T190000",
      icsEnd: "20260830T223000",
      venue: "NRC Gardens, Hyderabad"
    }
  }
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfigText();
  renderAmbientConfetti(16);
  renderDualEvents();
  renderLocation();
  setupEnvelope();
  setupScratchCard();
  setupCountdown();
  setupCalendarButtons();
  initLetterReveal();
  initScrollReveal();
});

/* ============================================================
   Apply simple config-driven text
   ============================================================ */
function applyConfigText() {
  const seal = document.getElementById("sealInitials");
  if (seal) seal.textContent = CONFIG.sealInitials;

  document.getElementById("groomName").textContent = CONFIG.groom.name;
  document.getElementById("groomParents").textContent = CONFIG.groom.parents;
  document.getElementById("groomBlurb").textContent = CONFIG.groom.blurb;
  document.getElementById("brideName").textContent = CONFIG.bride.name;
  document.getElementById("brideParents").textContent = CONFIG.bride.parents;
  document.getElementById("brideBlurb").textContent = CONFIG.bride.blurb;

  document.getElementById("scratchDate").textContent = CONFIG.saveTheDateShort;
  document.getElementById("scratchVenue").textContent = CONFIG.venueCity;

  document.getElementById("welcomeNote").textContent = CONFIG.welcomeNote;

  document.getElementById("closingGroom").textContent = CONFIG.groom.name;
  document.getElementById("closingParents").textContent = CONFIG.groom.parents;
}

/* ============================================================
   TEXT EFFECTS
   ============================================================ */
function initLetterReveal() {
  document.querySelectorAll(".letters").forEach((el) => {
    const text = el.textContent.trim();
    // Preserve any inner markup (like the "&" span) by only doing this
    // for plain-text nodes; the intro-names block keeps its own span.
    if (el.querySelector("span") && el.id === "introNames") {
      wrapLettersPreservingAmp(el);
    } else {
      el.setAttribute("aria-label", text);
      el.innerHTML = "";
      [...text].forEach((ch, i) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.animationDelay = (i * 0.045) + "s";
        span.setAttribute("aria-hidden", "true");
        el.appendChild(span);
      });
    }
  });
}

function wrapLettersPreservingAmp(el) {
  const fullText = el.textContent;
  el.setAttribute("aria-label", fullText);
  const original = el.innerHTML;
  // Split on the amp span, animate each side's letters, keep the amp intact
  const parts = original.split(/(<span class="intro-amp">.*?<\/span>)/);
  el.innerHTML = "";
  let globalIndex = 0;
  parts.forEach((part) => {
    if (part.startsWith('<span class="intro-amp">')) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = part;
      el.appendChild(wrapper.firstChild);
      globalIndex += 1;
    } else {
      [...part].forEach((ch) => {
        if (ch === "") return;
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.animationDelay = (globalIndex * 0.045) + "s";
        span.setAttribute("aria-hidden", "true");
        el.appendChild(span);
        globalIndex += 1;
      });
    }
  });
}

function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal, .letters").forEach((el) => io.observe(el));
}

/* ============================================================
   CONFETTI: rose petals, jasmine flowers, gold & green leaves
   ============================================================ */
const ROSE_COLORS = ["#c23a5c", "#e0466a", "#f2465e", "#a3313f"];
const LEAF_COLORS = ["#3f8f5c", "#5aa66d", "#d9a637", "#c96f1c"];

function rosePetalSVG(color) {
  return `<svg viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0 C18 6 18 18 10 26 C2 18 2 6 10 0 Z" fill="${color}" opacity="0.92"/>
    <path d="M10 3 C15 8 15 17 10 23" stroke="rgba(255,255,255,0.25)" stroke-width="1" fill="none"/>
  </svg>`;
}

function jasmineSVG() {
  return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <g fill="#fffdf8" stroke="#f0e6d2" stroke-width="0.6">
      <circle cx="10" cy="5" r="3.2"/>
      <circle cx="15" cy="10" r="3.2"/>
      <circle cx="10" cy="15" r="3.2"/>
      <circle cx="5" cy="10" r="3.2"/>
      <circle cx="10" cy="10" r="3.2"/>
    </g>
    <circle cx="10" cy="10" r="2" fill="#f2c94c"/>
  </svg>`;
}

function leafSVG(color) {
  return `<svg viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 0 C14 6 14 18 7 24 C0 18 0 6 7 0 Z" fill="${color}" opacity="0.9"/>
    <line x1="7" y1="2" x2="7" y2="22" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
  </svg>`;
}

function randomConfettiPiece() {
  const roll = Math.random();
  if (roll < 0.4) {
    return rosePetalSVG(ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)]);
  } else if (roll < 0.7) {
    return jasmineSVG();
  }
  return leafSVG(LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]);
}

function renderAmbientConfetti(count) {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece ambient";
    piece.innerHTML = randomConfettiPiece();

    const left = Math.random() * 100;
    const duration = 11 + Math.random() * 12;
    const delay = Math.random() * 14;
    const drift = (Math.random() * 90 - 45) + "px";
    const spin = (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 300) + "deg";
    const size = 11 + Math.random() * 13;

    piece.style.left = left + "%";
    piece.style.width = size + "px";
    piece.style.height = size + "px";
    piece.style.animationDuration = duration + "s";
    piece.style.animationDelay = delay + "s";
    piece.style.setProperty("--drift", drift);
    piece.style.setProperty("--spin", spin);
    layer.appendChild(piece);
  }
}

function spawnConfettiBurst(count = 28) {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece burst";
    piece.innerHTML = randomConfettiPiece();

    const startLeft = 38 + Math.random() * 24;
    const bx = (Math.random() * 300 - 150) + "px";
    const by = (240 + Math.random() * 260) + "px";
    const spin = (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 400) + "deg";
    const size = 11 + Math.random() * 15;

    piece.style.left = startLeft + "%";
    piece.style.top = "18%";
    piece.style.width = size + "px";
    piece.style.height = size + "px";
    piece.style.animationDelay = (Math.random() * 0.2) + "s";
    piece.style.setProperty("--bx", bx);
    piece.style.setProperty("--by", by);
    piece.style.setProperty("--spin", spin);
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 2300);
  }
}

/* ============================================================
   COVER SCREEN — tap to open
   ============================================================ */
function setupEnvelope() {
  const screen = document.getElementById("envelope-screen");
  const button = document.getElementById("tapButton");
  if (!screen || !button) return;

  const openCover = () => {
    if (screen.classList.contains("opening")) return;
    screen.classList.add("opening");
    spawnConfettiBurst(30);
    setTimeout(() => {
      screen.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 650);
  };

  document.body.style.overflow = "hidden";
  button.addEventListener("click", openCover);
  button.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openCover(); });
}

/* ============================================================
   HALDI & SANGEET CARDS
   ============================================================ */
function renderDualEvents() {
  const list = document.getElementById("dualEventList");
  if (!list) return;
  [CONFIG.events.haldi, CONFIG.events.sangeet].forEach((ev) => {
    const card = document.createElement("div");
    card.className = "mini-event-card reveal";
    card.style.setProperty("--card-accent", ev.accent);
    card.innerHTML = `
      <div class="mini-name">${ev.icon} ${ev.name}</div>
      <div class="mini-time">${ev.dateTimeLabel}</div>
      <div class="mini-line">&ldquo;${ev.line}&rdquo;</div>
      <button class="btn-cal" type="button">+ Add to calendar</button>
    `;
    card.querySelector(".btn-cal").addEventListener("click", () => downloadICS(ev.name, ev.icsStart, ev.icsEnd, CONFIG.location.venueName));
    list.appendChild(card);
  });
}

function setupCalendarButtons() {
  const muh = document.getElementById("btnAddMuhurtham");
  if (muh) muh.addEventListener("click", () =>
    downloadICS(CONFIG.events.muhurtham.name, CONFIG.events.muhurtham.icsStart, CONFIG.events.muhurtham.icsEnd, CONFIG.events.muhurtham.venue));

  const rec = document.getElementById("btnAddReception");
  if (rec) rec.addEventListener("click", () =>
    downloadICS(CONFIG.events.reception.name, CONFIG.events.reception.icsStart, CONFIG.events.reception.icsEnd, CONFIG.events.reception.venue));
}

function downloadICS(name, start, end, venue) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${CONFIG.groom.name} & ${CONFIG.bride.name} — ${name}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `LOCATION:${venue}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================================
   LOCATION / MAP
   ============================================================ */
function renderLocation() {
  const mapFrame = document.getElementById("mapFrame");
  const venue = document.getElementById("locationVenue");
  const address = document.getElementById("locationAddress");
  const directions = document.getElementById("directionsLink");
  if (!mapFrame) return;

  const q = encodeURIComponent(CONFIG.location.mapQuery);
  mapFrame.src = `https://www.google.com/maps?q=${q}&output=embed`;
  venue.textContent = CONFIG.location.venueName;
  address.textContent = CONFIG.location.address;
  directions.href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

/* ============================================================
   SCRATCH CARD
   ============================================================ */
function setupScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  const card = document.getElementById("scratchCard");
  const hint = document.getElementById("scratchHint");
  const resetBtn = document.getElementById("scratchReset");
  if (!canvas || !card) return;

  const ctx = canvas.getContext("2d");
  let isScratching = false;
  let revealed = false;

  function sizeCanvas() {
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    paintScratchLayer();
  }

  function paintScratchLayer() {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#f2d98b");
    grad.addColorStop(0.5, "#d9a637");
    grad.addColorStop(1, "#ab7c22");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 15px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ Scratch here ✦", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "400 11px Poppins, sans-serif";
    ctx.fillText("to reveal our date", canvas.width / 2, canvas.height / 2 + 14);

    revealed = false;
    hint.textContent = "Use your finger to scratch the card ✦";
    hint.classList.remove("done");
    canvas.style.display = "block";
    canvas.style.opacity = "1";
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkRevealPercent() {
    if (revealed) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    const step = 40;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * step) {
      total++;
      if (data[i] === 0) transparent++;
    }
    const pct = transparent / total;
    if (pct > 0.55) {
      revealed = true;
      canvas.style.transition = "opacity 0.5s ease";
      canvas.style.opacity = "0";
      setTimeout(() => { canvas.style.display = "none"; }, 500);
      hint.textContent = "Revealed ✦";
      hint.classList.add("done");
      spawnConfettiBurst(18);
    }
  }

  function startScratch(e) { isScratching = true; const { x, y } = getPos(e); scratchAt(x, y); }
  function moveScratch(e) { if (!isScratching) return; e.preventDefault(); const { x, y } = getPos(e); scratchAt(x, y); }
  function endScratch() { if (!isScratching) return; isScratching = false; checkRevealPercent(); }

  canvas.addEventListener("mousedown", startScratch);
  canvas.addEventListener("mousemove", moveScratch);
  window.addEventListener("mouseup", endScratch);
  canvas.addEventListener("touchstart", startScratch, { passive: true });
  canvas.addEventListener("touchmove", moveScratch, { passive: false });
  canvas.addEventListener("touchend", endScratch);

  resetBtn.addEventListener("click", () => {
    canvas.style.transition = "none";
    paintScratchLayer();
  });

  window.addEventListener("resize", sizeCanvas);
  setTimeout(sizeCanvas, 50);
}

/* ============================================================
   COUNTDOWN — targets the Sumuhurtham
   ============================================================ */
function setupCountdown() {
  const target = new Date(CONFIG.muhurthamISO).getTime();
  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMinutes = document.getElementById("cdMinutes");
  const elSeconds = document.getElementById("cdSeconds");
  if (!elDays) return;

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    elDays.textContent = String(days).padStart(2, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMinutes.textContent = String(minutes).padStart(2, "0");
    elSeconds.textContent = String(seconds).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}
