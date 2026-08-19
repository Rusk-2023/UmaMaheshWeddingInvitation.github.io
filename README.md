# Uma & Divya — Wedding Invite Site

A single-page interactive wedding invitation built around your own
invitation artwork: envelope-open intro, illustrated "scenes" for each
ceremony, a scratch-to-reveal date card, a live countdown to the
Sumuhurtham, and a venue map. No RSVP form — just a warm welcome.

## 1. Edit your content

Open **`script.js`** and edit the `CONFIG` object at the top:

- `groom`, `bride` — names, parents, and a short blurb each
- `muhurthamISO` — the exact Sumuhurtham datetime, powers the countdown
- `saveTheDateShort`, `venueCity` — shown on the scratch card
- `location` — venue name, address, and map search query
- `welcomeNote` — the thank-you note text
- `events.haldi` / `events.sangeet` / `events.muhurtham` / `events.reception`
  — each has a date/time label and the exact start/end used for the
  "Add to calendar" file

**One thing to double check:** the Sangeet time (currently set to 6:00 PM
on the 29th) was an assumption since it follows Haldi the same day — update
`events.sangeet.dateTimeLabel` and `icsStart`/`icsEnd` if the real time is
different.

## Page flow (in order)

1. Envelope intro (tap to open, confetti burst)
2. Padala's Wedding Invitation — opening scene
3. The Groom & The Bride
4. Haldi & Sangeet (same day, back-to-back)
5. Scratch-to-reveal the date
6. Live countdown to the Sumuhurtham
7. The formal wedding invitation wording (Sumuhurtham details)
8. Reception
9. A welcome note for guests
10. Venue location with map
11. Closing — "With love, Uma Maheswara Rao..."

## 2. Your images

Your six invitation images are already placed in **`assets/`**, renamed by
what they're used for:

- `intro-couple-temple.jpg` — opening scene
- `bride-groom-frame.jpg` — the teal arch used for both names
- `muhurtham-baraat.jpg` — the formal invitation scene
- `haldi-sangeet.jpg` — Haldi & Sangeet scene
- `scratch-elephants.jpg` — banner above the scratch card
- `reception-couple.jpg` — banner above the reception details

To swap any of them, just replace the file with the same name (keep the
same filename so the CSS keeps finding it), or open `styles.css` and
search for the filename to point it elsewhere.

## 3. Colors

All colors are CSS variables at the top of **`styles.css`** under `:root`
— sampled from your own invitation artwork (deep teal, maroon, marigold,
rose/coral, gold). Adjust any of them there to fine-tune the palette.

## 4. Text animations

Two effects are built in and reusable:

- **Letter-by-letter reveal** — add class `letters` to any heading-level
  element and it'll animate in letter by letter as it scrolls into view
  (already used on the couple's names)
- **Fade-up on scroll** — add class `reveal` to any element and it'll
  fade + rise into place once visible (used throughout)

## 5. Confetti

Falling ambient pieces mix rose petals, jasmine flowers, and gold/green
leaves — colors and shapes are defined in `script.js` under `ROSE_COLORS`,
`LEAF_COLORS`, and the `rosePetalSVG` / `jasmineSVG` / `leafSVG` functions.
A denser burst fires when the envelope opens and when the scratch card is
fully revealed.

## 6. Preview before hosting

Double-click `index.html` to open it in any browser — everything works
locally, no server needed to test.

## 7. Host it for free

**Easiest — Netlify Drop:**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder (including the `assets` folder) into the browser
3. You get a live link instantly — share that with your guests

Also works the same way with **Vercel** or **GitHub Pages** if you prefer
those (drag-and-drop or upload the same folder including `assets/`).

## What's built vs. not yet built

**Built:** envelope intro, six illustrated scenes using your real artwork,
scratch-to-reveal date, live countdown, formal Sumuhurtham wording, Haldi
& Sangeet + Reception cards with add-to-calendar, welcome note, venue map
with directions, letter-reveal + scroll-fade + gold shimmer text effects,
rose/jasmine/leaf confetti (ambient + burst on open/reveal).

**Removed per your request:** the RSVP form.

**Not yet built, can add anytime:** "Tap the Dhol" rhythm game, "Pick your
side" team toggle, background music toggle.
