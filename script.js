/* ============================================================
   EDIT THIS CONFIG — all content lives here.
   ============================================================ */
const CONFIG = {
  groom: {
    name: "Uma Maheswara Rao",
    parents: "Son of Sri Padala Manmada Rao & Smt. Padala Vimala",
    blurb: "Warm-hearted and easygoing, with a ready smile for everyone."
  },
  bride: {
    name: "Divya Teja",
    parents: "Daughter of Sri Tamiri Yama Rao & Smt. Tamiri Saraswathi",
    blurb: "Graceful and full of warmth, she lights up every gathering."
  },

  // Countdown target — the Sumuhurtham moment
  muhurthamISO: "2026-08-30T23:42:00",
  saveTheDate: "30 . 08 . 2026",
  venueShort: "NRC Gardens, Hyderabad",

  location: {
    venueName: "NRC Gardens",
    address: "No. 6-23/2, Pragathi Nagar, Moosapet, Hyderabad",
    mapQuery: "NRC Gardens, Pragathi Nagar, Moosapet, Hyderabad"
  },

  welcomeNote: "Your presence is the greatest gift of all. We can't wait to celebrate this beautiful new beginning surrounded by the people who mean the most to us — welcome, and thank you for being here."
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfigText();
  renderLocation();
  setupTapButton();
  setupScratchCard();
  setupCountdown();
  initLetterReveal();
  initScrollReveal();
  // NOTE: no ambient confetti at start — it only begins after the
  // date is scratched. See unlockContent().
});

function applyConfigText() {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  set("groomName", CONFIG.groom.name);
  set("groomParents", CONFIG.groom.parents);
  set("groomBlurb", CONFIG.groom.blurb);
  set("brideName", CONFIG.bride.name);
  set("brideParents", CONFIG.bride.parents);
  set("brideBlurb", CONFIG.bride.blurb);
  set("scratchDate", CONFIG.saveTheDate);
  set("scratchVenue", CONFIG.venueShort);
  set("welcomeNote", CONFIG.welcomeNote);
  set("closingGroom", CONFIG.groom.name);
  set("closingParents", CONFIG.groom.parents);
}

/* ============================================================
   TEXT EFFECTS
   ============================================================ */
function initLetterReveal() {
  document.querySelectorAll(".letters").forEach((el) => {
    if (el.querySelector(".amp")) {
      wrapLettersPreservingAmp(el);
    } else {
      const text = el.textContent.trim();
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
  el.setAttribute("aria-label", el.textContent);
  const parts = el.innerHTML.split(/(<span class="amp">.*?<\/span>)/);
  el.innerHTML = "";
  let i = 0;
  parts.forEach((part) => {
    if (part.startsWith('<span class="amp">')) {
      const wrap = document.createElement("div");
      wrap.innerHTML = part;
      el.appendChild(wrap.firstChild);
      i += 1;
    } else {
      [...part].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.animationDelay = (i * 0.045) + "s";
        span.setAttribute("aria-hidden", "true");
        el.appendChild(span);
        i += 1;
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
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal, .letters").forEach((el) => io.observe(el));
}

/* ============================================================
   CONFETTI — rose petals, jasmine, gold & green leaves
   Behaviour: one burst when the cover button is tapped, then
   nothing. After the date is scratched: another burst, and
   from that point on the ambient fall runs continuously.
   ============================================================ */
const FLOWER_COLORS = [
  "#f2465e", "#ff6b8a", "#ffa62b", "#ffd93d", "#7ed957",
  "#3fb8af", "#4d96ff", "#b06bff", "#ff8fc8", "#ff4d4d",
  "#00c9a7", "#ffb703"
];

function flowerSVG(color) {
  const centers = ["#ffe066", "#fff3b0", "#ffd93d"];
  const center = centers[Math.floor(Math.random() * centers.length)];
  // five petals at 72° apart
  let petals = "";
  for (let i = 0; i < 5; i++) {
    petals += `<ellipse cx="10" cy="4.4" rx="3.1" ry="4.4" fill="${color}"
                 transform="rotate(${i * 72} 10 10)"/>`;
  }
  return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    ${petals}
    <circle cx="10" cy="10" r="2.3" fill="${center}"/>
  </svg>`;
}
function randomPiece() {
  return flowerSVG(FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)]);
}

function spawnConfettiBurst(count = 28) {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece burst";
    piece.innerHTML = randomPiece();

    const size = 7 + Math.random() * 7;
    piece.style.width = size + "px";
    piece.style.height = size + "px";
    piece.style.animationDelay = (Math.random() * 0.2) + "s";

    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 300;
    piece.style.left = (46 + Math.random() * 8) + "%";
    piece.style.top = "40%";
    piece.style.setProperty("--bx", Math.cos(angle) * dist + "px");
    piece.style.setProperty("--by", (Math.sin(angle) * dist + 260) + "px");
    piece.style.setProperty("--spin", (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 400) + "deg");

    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 2300);
  }
}

function startAmbientConfetti(count = 34) {
  if (ambientStarted) return;
  ambientStarted = true;
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece ambient";
    piece.innerHTML = randomPiece();
const size = 8 + Math.random() * 7;
    piece.style.left = (Math.random() * 100) + "%";
    piece.style.width = size + "px";
    piece.style.height = size + "px";
    piece.style.animationDuration = (9 + Math.random() * 9) + "s";
    piece.style.animationDelay = (Math.random() * 14) + "s";
    piece.style.setProperty("--drift", (Math.random() * 90 - 45) + "px");
    piece.style.setProperty("--spin", (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 300) + "deg");
    layer.appendChild(piece);
  }
}

/* ============================================================
   COVER TAP — unblurs the cover, hides the heart, unlocks scroll
   ============================================================ */
function setupTapButton() {
  const button = document.getElementById("tapButton");
  const scene = document.getElementById("scene-intro");
  const after = document.getElementById("afterCover");
  if (!button || !scene) return;

  document.body.style.overflow = "hidden";

  button.addEventListener("click", () => {
    if (scene.classList.contains("opened")) return;
    scene.classList.add("opened");
    spawnConfettiBurst(110);
    startMusic();
    if (after) after.classList.add("unlocked");
    document.body.style.overflow = "auto";
    setTimeout(() => {
      document.querySelectorAll(".ov-intro .letters").forEach((el) => el.classList.add("in-view"));
    }, 300);
  });
}

/* ============================================================
   BACKGROUND MUSIC — starts on the first tap (browsers block
   autoplay until the user interacts, which the tap satisfies)
   ============================================================ */
function startMusic() {
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio) return;

  audio.volume = 0;
  audio.play().then(() => {
    if (toggle) toggle.hidden = false;
    // fade in gently so it doesn't jolt anyone
    let v = 0;
    const fade = setInterval(() => {
      v += 0.02;
      if (v >= 0.35) { v = 0.35; clearInterval(fade); }
      audio.volume = v;
    }, 120);
  }).catch(() => {
    // some browsers still refuse — show the button so it can be started manually
    if (toggle) toggle.hidden = false;
  });

  if (toggle && !toggle.dataset.bound) {
    toggle.dataset.bound = "1";
    toggle.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        toggle.classList.remove("muted");
      } else {
        audio.pause();
        toggle.classList.add("muted");
      }
    });
  }
}

/* ============================================================
   SCRATCH BAR — unlocks the rest of the invitation
   ============================================================ */
function setupScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  const card = document.getElementById("scratchCard");
  const hint = document.getElementById("scratchHint");
  if (!canvas || !card) return;

  const ctx = canvas.getContext("2d");
  let isScratching = false;
  let revealed = false;

  function sizeCanvas() {
    const rect = card.getBoundingClientRect();
    if (!rect.width) return;
    canvas.width = rect.width;
    canvas.height = rect.height;
    paintScratchLayer();
  }

  function paintScratchLayer() {
    if (revealed) return;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#f2d98b");
    grad.addColorStop(0.5, "#d9a637");
    grad.addColorStop(1, "#ab7c22");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "600 12px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  SCRATCH HERE  ✦", canvas.width / 2, canvas.height / 2);
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkReveal() {
    if (revealed) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0, total = 0;
    const step = 30;
    for (let i = 3; i < data.length; i += 4 * step) {
      total++;
      if (data[i] === 0) transparent++;
    }
    if (transparent / total > 0.5) {
      revealed = true;
      canvas.style.transition = "opacity 0.5s ease";
      canvas.style.opacity = "0";
      setTimeout(() => { canvas.style.display = "none"; }, 500);
      hint.textContent = "Revealed — scroll on ✦";
      hint.classList.add("done");
      unlockContent();
    }
  }

  function start(e) { if (revealed) return; isScratching = true; const p = getPos(e); scratchAt(p.x, p.y); }
  function move(e) { if (!isScratching || revealed) return; e.preventDefault(); const p = getPos(e); scratchAt(p.x, p.y); }
  function end() { if (!isScratching) return; isScratching = false; checkReveal(); }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: true });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);

  window.addEventListener("resize", () => { if (!revealed) sizeCanvas(); });
  setTimeout(sizeCanvas, 60);
  window.addEventListener("load", () => { if (!revealed) sizeCanvas(); });
}

function unlockContent() {
  const locked = document.getElementById("lockedContent");
  if (!locked) return;
  locked.classList.add("unlocked");
  spawnConfettiBurst(110);
  startAmbientConfetti();
  setTimeout(initScrollReveal, 100);

  // Nudge the page so the next section peeks into view — makes it
  // obvious there's more below without yanking them away from the reveal
  setTimeout(() => {
    window.scrollBy({ top: 260, behavior: "smooth" });
  }, 1100);
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function setupCountdown() {
  const target = new Date(CONFIG.muhurthamISO).getTime();
  const d = document.getElementById("cdDays");
  const h = document.getElementById("cdHours");
  const m = document.getElementById("cdMinutes");
  const s = document.getElementById("cdSeconds");
  if (!d) return;

  function tick() {
    let diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000); diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    d.textContent = String(days).padStart(2, "0");
    h.textContent = String(hours).padStart(2, "0");
    m.textContent = String(mins).padStart(2, "0");
    s.textContent = String(secs).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   LOCATION
   ============================================================ */
function renderLocation() {
  const mapFrame = document.getElementById("mapFrame");
  if (!mapFrame) return;
  const q = encodeURIComponent(CONFIG.location.mapQuery);
  mapFrame.src = `https://www.google.com/maps?q=${q}&output=embed`;
  document.getElementById("locationVenue").textContent = CONFIG.location.venueName;
  document.getElementById("locationAddress").textContent = CONFIG.location.address;
  document.getElementById("directionsLink").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
