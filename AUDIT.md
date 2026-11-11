# Portfolio Audit: Kristina Petrova

Audit date: 2026-11-11 · Branch: `claude/krisi-portfolio-audit-0o1h9h` · Scope: whole repo (read-only, this file is the only addition)

> **Screenshot references** (`[shot: name]`) point to files captured in this audit session at
> `/tmp/claude-0/-home-user-portfolio/9b8e87f0-88ed-5b6d-9f95-9d14f4dbf153/scratchpad/shots/`.
> They are **not committed** (the brief allowed only AUDIT.md) and will go away when the session ends. Re-running Step 2 brings them back.

---

## 0. Inventory

### What it is
- **Stack:** one static `index.html` (1,810 lines, 74.8 KB). Inline `<style>` (lines 27–1106, ~1,080 lines) and inline `<script>` (lines 1360–1808). No build step, no package.json, no framework.
- **Origin:** a Gemini Canvas export, then hand-edited through GitHub's web uploader. Every commit is "Add files via upload" or "Update index.html".
- **Deployment:** **unknown.** No `CNAME`, no `.github/workflows`, no `netlify.toml`/`vercel.json`. Probably GitHub Pages from `main`, but nothing in the repo confirms it (see Questions).

### File tree (repo root, flat)
```
README.md              11 B   ("# portfolio", nothing else)
index.html          74,770 B
Business-card.JPG  615,942 B  2077×1568 JPEG q90   (upper-case extension)
Tshirtgoran.png  2,916,267 B  1024×1536 PNG        (photo mockup saved as PNG)
adforjeep.jpg      149,233 B   905×1280 q87
bigman.jpg       2,281,840 B  2300×3000 q96
bookcoveralice.jpg 207,214 B  1280×914  q87
brighttv.jpg       223,490 B  1280×1280 q87
cat.jpg            338,039 B  2300×3000 q96
character1.jpg      34,114 B  1280×889 stored, EXIF Orientation=8 (shows as 889×1280), Display P3
character2.jpg     109,280 B  1280×889  Display P3
character3.jpg     127,851 B  1280×1280
chillingdesign.jpg 127,020 B  1280×981  ← NOT REFERENCED ANYWHERE (orphan)
gokologo.jpg        79,730 B  1280×1280 q72
goranlogo.jpg      589,798 B  3000×3000 q96
meandyou.jpg       261,612 B  1280×1110
nightpic.jpg       157,682 B   981×1280 q72
photoofmyself.jpg  206,621 B   960×1280 Display P3
roomdesign.jpg     202,289 B  1280×1280
traveller.jpg    2,337,211 B  2300×3000 q96
tshirt2.jpg         81,038 B   923×1280
websitebackground.jpg 95,732 B 1024×1024
```
Images total **10.9 MB**. `.git` is 11 MB. No `.gitignore`. No config files of any kind.

### Git log (all 7 commits; there are fewer than 20)
```
c28df8e 2026-03-17 Add files via upload        (bigman, cat, traveller, tshirt2, websitebackground)
4b18a56 2026-03-17 Delete tshirt2.jpg
14c3dfd 2026-03-17 Delete websitebackground.jpg
5c8b7d3 2026-03-17 Update index.html           (+209 / −100)
5392d88 2026-01-09 Add files via upload        (17 images)
aa9462c 2026-01-09 Add files via upload        (index.html, 1,701 lines)
0d44ba4 2026-01-09 Initial commit
```

### External dependencies
| Resource | Where | Notes |
|---|---|---|
| Google Fonts CSS: Inter 300–700 + Poppins 300–700 (10 weights) | `index.html:23-25` | Render-blocking. Lighthouse estimates 820 ms savings |
| fonts.gstatic.com woff2 (4 files fetched, ~72 KB) | runtime | Visitor IP goes to Google (GDPR, see N-19) |
| Formspree `https://formspree.io/f/mgvgywpe` | `index.html:1308` | Contact form backend |
| Instagram link | `index.html:1303` | Only social/contact link on the site |
| No JS libraries, no analytics, no trackers | | Good |

### Personal data / metadata check
- No email address or phone number anywhere in the HTML. **Fine.**
- I checked every image's EXIF: **no GPS data, no camera make/model.** **Fine.**
- No cookies and no localStorage set during a test session (checked in Playwright). **Fine.**

---

## 1. Executive summary

**Verdict:** the work is good. The site around it isn't ready for production. It's a Gemini template with Krisi's images dropped in, and it has one **site-breaking bug** that every visitor runs into in the first second. The design language (pastel gradient, centered H2 with underline, gradient icon circles, typewriter hero, custom cursor, 5-step "My Process") is the generic AI-template look. Clients and recruiters have seen it hundreds of times, and it pulls attention away from her illustrations, which are distinctive. Fixing this means taking things out, not adding them. Plain HTML/CSS/JS is enough. No framework is needed.

**The 5 highest-impact problems:**

1. **An invisible full-screen lightbox sits on top of the page at load and eats the first click or tap** (N-01). On desktop the first click on "View Selected Work" does nothing. On iPhone the first tap on the menu button does nothing, because the hidden modal's "×" sits exactly on top of it. To a first-time visitor, the site looks broken.
2. **No artwork until about 2,350 px down (desktop) or about 3,000 px down (phone)** (N-02). The first screen is a typewriter line in 1.8:1 low-contrast pastel gradient text. Then come About and three generic "Capabilities" cards. A reviewer deciding in 10 seconds sees zero work.
3. **The grid crops and breaks her work** (N-03, N-04). The Jeep ad's headline is cut off. The Alice cover shows the *back* cover and barcode instead of the front. "ГОРАН ГОКО" is clipped at 1024 px. On desktop the featured tile leaves a ~380 px empty white hole in the grid.
4. **7.2 MB of images load up front, including two 2.3 MB 2300×3000 originals shown at 357×350** (N-05). All 13 grid images load immediately, without lazy loading, srcset or dimensions. Converted to properly sized WebP, the same grid is about 0.75 MB.
5. **Keyboard and screen-reader users can't open a single project** (N-07). The cards are `<div>`s. The lightbox has no dialog semantics and no focus handling, and its close button is a `<span>`. If JS fails, the page below the hero is **completely blank** (N-08): every section is `opacity:0` until JS runs, and the projects exist only in JS.

Lighthouse (local, Chromium): Performance 98 / Accessibility 89 / Best Practices 100 / SEO 91. **Don't read the 98 as "fast".** The page is tested on localhost, the LCP element is text, and all the image weight sits below the fold, so it barely moves the score. The 7.2 MB still costs every mobile visitor, and Lighthouse flags it ("Total size was 7,205 KiB").

---

## 2. Findings

Severity is judged by how a client or recruiter on a phone experiences the site. All line numbers refer to `index.html`.

| ID | Sev | Area | Location | Problem | Why it matters | Concrete fix | Effort |
|---|---|---|---|---|---|---|---|
| N-01 | **Critical** | JS/CSS bug | `:718`, `:732`, `:736`, `:1342` | `.modal` sets `display:none` (718), then `display:flex` 14 lines later (732) **in the same rule**, so the modal is always rendered: fixed, full-viewport, `opacity:0`, `z-index:2000`. Measured: `elementFromPoint` at the viewport centre returns `.modal`/`.modal-dialog` at **all 6 widths**. First click on "View Selected Work": scrollY stays 0. Second click: it works (scrollY 2350). iPhone 13: the first tap on the hamburger lands on the invisible `.close-modal` (Playwright: "`<span class=close-modal>` intercepts pointer events"). The menu opens only on the second tap. | Every visitor's first interaction fails. On mobile the main navigation looks broken. | Delete line 732. Use `.modal{display:flex; visibility:hidden; pointer-events:none; opacity:0}` and `.modal.show{visibility:visible; pointer-events:auto; opacity:1}`. Remove the `style.display` toggling at `:1695` and `:1787`. Better still, switch to `<dialog>` (see N-07). | S |
| N-02 | High | UX / layout | `:342-352` (hero `height:100vh`), section order `:1147-1251` | Order is Hero (100vh, no images) → About → Capabilities → Work. The work grid starts at y≈2,350 px at 1440 and y≈3,000+ px at 390. `[shot: w1440-fold, w390-fold, w1440-part0]` | For a portfolio, the work must be the first thing people see. Recruiters skim. | Put `#portfolio` directly after the hero. Cut the hero to ~60–70svh, or put 3–4 featured pieces inside it. Fold "Capabilities" into About as one line (see N-15). | S |
| N-03 | High | Visual / image treatment | `:632` (`height:350px`), `:655` (`object-fit:cover`) | Every thumbnail is force-cropped to a fixed 350 px box, whatever the artwork's shape. Jeep ad (905×1280 portrait) in a 747×350 landscape tile loses its headline "WHERE DESERT CALLS, JEEP ANSWERS" `[shot: w1440-part1]`. The Alice cover shows the back cover and barcode, with the front title cut `[w1440-part1, w390-part2]`. On mobile the caption sits on top of the barcode. "ГОРАН ГОКО" is clipped `[w1024-part1]`. | The client sees a broken version of the actual deliverable. | Add an optional `thumb` (a crop Krisi makes on purpose) and `focus` (`object-position`) per project in the data. Use `object-fit:contain` on a matching background for logos and covers. Or give up fixed heights and use `aspect-ratio` per item. | M |
| N-04 | High | Visual / grid | `:619-623`, `:632`, `:1491-1492` | At ≥1024, item 1 gets `grid-row: span 2`, but the item has a fixed `height:350px`. It fills only the top half of its 2-row area and leaves a ~382 px blank hole under the Jeep tile `[shot: w1440-part1, w1024-part1]`. The layout also uses `:nth-child(1)/(4)` (DOM position) while the data's `featured:"large"/"wide"` adds classes `featured-large`/`featured-wide` that have **no CSS**. Changing project order silently changes which tile is big. | The most visible layout bug on desktop. It also defeats the data-driven setup. | `.portfolio-grid{grid-auto-rows:350px}`, remove `height:350px` from `.portfolio-item`, and replace the nth-child rules with `.featured-large{grid-column:span 2;grid-row:span 2}` and `.featured-wide{grid-column:span 2}`. | S |
| N-05 | High | Performance | `:1506`, `:1192`; image files | 13 grid images plus the portrait load eagerly: **7.2 MB, 20 requests** (measured, same at every width). No `loading="lazy"`, `decoding`, `width`/`height`, `srcset` or WebP/AVIF. `bigman.jpg`/`traveller.jpg`/`cat.jpg` are 2300×3000 JPEG q96 (2.2–2.3 MB each) shown at ≤357×350. `goranlogo.jpg` is 3000×3000 (590 KB). `Tshirtgoran.png` is a 2.9 MB PNG for a photo mockup. Test conversion (scratchpad only): all images → 1600w WebP = 2.1 MB, 800w thumbs = **0.76 MB** for everything. | On 4G, the work loads slowly or not at all. It burns the visitor's data. | Two derivatives per image: `-800.webp` (grid) and `-1600.webp` (lightbox). Grid `<img>` gets `loading="lazy" decoding="async" width height`, plus `srcset` if you want. Bake EXIF rotation and convert P3 to sRGB on export. See section 4 for the script. | M |
| N-06 | High | Responsive / lightbox | `:725` (`overflow:hidden`), `:745` (`max-height:90vh`), `:761` (`max-height:60vh`) | On iPhone 13 (664 px viewport) the lightbox content is 716 px tall and can't scroll. Gallery thumbnails sit at y=690, **off-screen and unreachable**. For Goran, the Concept 01/02 thumbnails (business card, t-shirt, website) can't be reached at all on a phone `[shot: m-modal-goran]`. | Her one real multi-piece branding project can't be viewed on mobile. | `.modal{overflow-y:auto}` `.modal-dialog{max-height:none;margin:auto}` `.modal-img{max-height:55svh}`. Better: make the mobile lightbox a vertical scroll of all images (a case-study layout, see N-14). | S |
| N-07 | High | Accessibility | `:1500` (card `<div>`), `:1342-1355`, `:1343` (`<span>` close), `:1346` (no alt) | Portfolio cards are `<div>`s with click handlers: **0 of 13 are keyboard-focusable** (measured). The modal has no `role="dialog"`/`aria-modal`. Focus stays on `<body>` when it opens, and the next Tab goes to a nav link *behind* the modal (measured). The close control is a non-focusable `<span>`. The modal image has no `alt` (axe: critical `image-alt`). The modal title is an empty `<h3>` at load. | Keyboard and screen-reader users can't see any work. A WCAG 2.1 A failure. | Wrap each card in `<button type="button">` (or `<a href="#project-slug">`). Replace the modal with `<dialog>` + `showModal()`, which gives a focus trap, Esc and an inert background for free. Close becomes `<button aria-label="Close">`. Set `modalImg.alt = project.alt` on open. Return focus to the card on close. | M |
| N-08 | High | Resilience / SEO | `:243-248` (`.reveal{opacity:0}`), `:1249`, `:1488` | With JS disabled, or if one script error stops execution, About, Skills, Work, Process and Contact all stay at `opacity:0`, and the grid is empty (measured: 0 items, About opacity 0) `[shot: nojs-1440]`. Non-JS crawlers (most social preview bots, some search) see no projects. | One typo in the projects array blanks the whole site. Risky, because projects get added by hand. | Add `<html class="no-js">`, then `document.documentElement.classList.replace('no-js','js')` as the first line of the script. Scope `.js .reveal{opacity:0}`. Long-term, render the project cards as static HTML (see section 4) or at least wrap the renderer in try/catch. | S |
| N-09 | High | Accessibility / color | `:36-37`, `:213-216`, `:421-427`, `:493-497`, `:988`, `:1039` | Brand pastels used as text fail badly. `.highlight` #E1B3A4 on white = **1.87:1**. `.step-number` = **1.75:1**. White text on the gradient buttons ("View Selected Work", "Send Message") = **1.86–1.88:1**. Hero gradient H1 on #FDFBFA ≈ **1.8:1**. Process `<p>` (#555 at opacity .8 → #777) = 4.47:1 (axe: 12 nodes). Threshold is 4.5:1 (3:1 for large text). | The main CTA and the hero headline are hard to read, especially outdoors on a phone. | Keep the pastels for fills and accents. Add a text token `--color-accent-ink:#9A5B47` (5.3:1 on white). Gradient buttons get `color:#333` (6.7:1 on both stops). Hero H1 gets solid `#333` with the gradient only on an underline or accent, or darker gradient stops. Remove `opacity:.8` at `:994`. | S |
| N-10 | Medium | UX / motion | `:1154-1156`, `:1538-1567` | The H1 is a typewriter cycling "Digital Designer / Illustrator / Visual Storyteller". At 360/390 the H1 jumps between 53 px and 106 px tall (1↔2 lines) every cycle, so the tagline and CTAs jump 26 px every few seconds (measured). The H1 never contains her name (the SEO-relevant heading). Screen readers get a mutating heading. | Layout shift right where the CTA is. Weak H1 for search. Typewriter heroes are a template signal. | Static H1, e.g. "Kristina Petrova" plus a static role line (her wording; this is a **suggestion**). If she wants the rotation, give it `aria-hidden="true"` and `min-height`, and put the rotating word outside the H1. | S |
| N-11 | Medium | Accessibility / motion | whole stylesheet (no `prefers-reduced-motion` query exists) | Infinite animations: hero gradient (`:380`), 3 blurred floating shapes (`:360`), blinking caret (`:433`), typewriter, scroll reveals on every section, `scroll-behavior:smooth` (`:73`), hover lifts. | Vestibular-disorder users. Battery. WCAG 2.3.3 (AAA) / general best practice. | Add `@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1;transform:none}}` and skip `type()` when `matchMedia('(prefers-reduced-motion: reduce)').matches`. | S |
| N-12 | Medium | UX / template | `:65-70` (`cursor:none` on `*`), `:102-137`, `:1516-1535`, `:634`, `:816`, `:843`, `:894` | Custom cursor issues. (a) It hides the text I-beam in the form inputs at ≥769 px. (b) `.portfolio-item`, `.tab-btn`, `.close-modal` and thumbnails set `cursor:pointer`, so a **native pointer and the custom ring show together**. (c) The ring sits at (0,0) until the first mousemove, visible top-left in `[w1440-fold]`. (d) Width-based gating (`max-width:768px`) hides the cursor on 1024 px iPads/touch laptops with trackpads. (e) `mix-blend-mode:difference` on #333 is faint on the light background. | It looks like a template, makes the form harder to use, and adds nothing to the work. | **Recommended: delete it** (CSS `:98-137`, JS `:1516-1535`, all `hover-target` classes). If she wants to keep it, gate it with `@media (hover:hover) and (pointer:fine)` and leave `cursor:auto` on inputs and textarea. | S |
| N-13 | Medium | Responsive / nav | `:1067-1075`, `:1132-1138`, `:1125` | (a) The closed off-canvas menu's `box-shadow:-5px 0 15px` bleeds into the viewport as a grey strip down the right edge `[w390-fold, w768-fold]`. (b) The hamburger is a `<div>`: not focusable, no `aria-expanded`/`aria-controls`/label, 25×20 px tap target (measured; minimum 44×44). (c) The closed menu's links stay in the Tab order while off-screen (measured: focus goes to x=499 on a 390 px viewport). (d) Tapping the dimmed overlay doesn't close the menu. (e) `height:100vh` (`:1068`) has the iOS address-bar problem. | Mobile nav is the main navigation for most visitors. | Make it `<button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-links">` with 44×44 padding. Put the shadow only on `.nav-links.active`. Add `visibility:hidden` when closed (with a transition delay). Add a click handler on the overlay. Use `height:100dvh`. With only 3 links, an even simpler option is no hamburger at all: show the 3 links inline at every width. | S |
| N-14 | Medium | UX / content | `:1372-1483`, `:1342-1355` | No case-study structure: each project is one image plus one sentence. Only Goran has extra images. No brief, role, tools, year, client or outcome. Titles read like filenames ("Character 1/2/3", "Night Pic", "Bigman", "Ad For Jeep"). Descriptions are written in AI-style prose ("immersive", "evocative", "breathtaking") that doesn't sound like her About text. | Clients hire for process and thinking, and recruiters look for role and context. Thumbnails alone read as a student gallery. | Add optional fields to the data: `year`, `client`/`type` (self-initiated/student/client), `role`, `tools`, `brief`, `images[]`. Render a short case-study block in the lightbox. Titles and copy must come from **Krisi**. These are suggestions, not edits. | M (code) + her time |
| N-15 | Medium | Copy / positioning | `:1158`, `:1178`, `:1210-1224`, `:1259-1285`, `:1299` | Mixed message. Hero: "Helping brands stand out…". Contact: "dedicated partner to elevate your brand". About: "still exploring and finding my style". The "Capabilities" cards and the 5-step "My Process" (Discover → Deliver, "polish every detail to perfection") are agency boilerplate that no case study backs up. | Recruiters and clients notice the gap. Generic copy makes real work look less authentic. | **Suggestion only:** pick one positioning (depends on Q1/Q2). Keep her About voice; it's the most genuine text on the page. Cut Process, or rewrite it from a real project. Reduce Capabilities to a tag line. | S (her decision) |
| N-16 | Medium | Visual / layout | `:943-963` | 5 process cards with `auto-fit minmax(200px,1fr)` wrap 4+1 at 1440/1920. "Deliver" is orphaned on its own row, and the connector line after "Refine" points into empty space `[w1440-part3]`. | Visible misalignment in a designer's portfolio. | If the section stays: `@media(min-width:1024px){.process-steps{grid-template-columns:repeat(5,1fr)}}` and hide the connector on `:nth-child(5n)`. | S |
| N-17 | Medium | Visual / template | `:165-181`, `:150-154`, `:529-571`, `:354-389` | Every H2 is centered, 2.5rem, with the same 40 px gradient underline. Every section has identical 8rem padding. Gradient icon circles on white cards. Blurred pastel blobs plus an animated gradient hero. Pill buttons and pill tags. This is the standard Gemini/AI landing-page kit. | The page looks like a template, which works against "I'm a designer". The pastel palette also clashes with her saturated artwork (orange, violet, neon). | **Suggestion:** neutral, quiet chrome (off-white/near-black), left-aligned editorial headings, no decorative blobs or gradients, and let the artwork supply the colour. Keep one accent colour, chosen by her. | M |
| N-18 | Medium | Contact form | `:1308-1323`, `:1621-1650` | No spam protection (no `_gotcha` honeypot). Status is written with `innerHTML` from server strings (`:1632`, `:1638`). Status `<p>` has no `aria-live` and uses an inline style. Error red #FF0000 = 4.0:1. No disabled/loading state, so double submits are possible. No fallback contact (email) if Formspree is down or blocked. The only other contact path is Instagram. | Lost leads are the costliest failure for a freelancer. | Add `<input type="text" name="_gotcha" hidden>`, `textContent` instead of `innerHTML`, `role="status" aria-live="polite"`, disable the button while sending, use `#B00020` for errors, and add a visible email link (needs her OK, see Q5). Check the Formspree plan limit (free tier is capped per month). | S |
| N-19 | Medium | Performance / GDPR | `:23-25` | 2 families × 5 weights, render-blocking (Lighthouse: ~820 ms FCP savings on mobile). Inter + Poppins is the default AI-template pairing. Loading from Google's CDN sends visitor IPs to Google. A German court (LG München, 2022) ruled that a GDPR violation. Relevant if she's EU-based (the Cyrillic logo suggests Bulgaria; see Q6). | Slower first paint, legal exposure, generic typography. | Self-host 1 family (or 1 display + 1 text) in 2–3 weights as woff2, `<link rel="preload">` the main weight, `font-display:swap`. Typeface choice is hers. | S |
| N-20 | Medium | SEO / sharing | `:14-17`, `:20`, `:1155`, `:1335` | `og:image` is relative (`photoofmyself.jpg`); Facebook/LinkedIn/Slack need an absolute URL. No `og:url`, `twitter:card`, canonical, `robots.txt`, `sitemap.xml` or JSON-LD `Person`. Favicon is a ✨ emoji data-URI (invalid per the Nu validator, not on-brand). No `apple-touch-icon`. The H1 isn't her name (N-10). Footer says "© 2025". | Shared links show a broken or blank preview. A personal brand needs a proper favicon. | Absolute `og:image` with a 1200×630 crop of her best piece (not a selfie), `og:url`, `twitter:card=summary_large_image`, `<link rel="canonical">`, a JSON-LD `Person` (name, jobTitle, sameAs Instagram), a real SVG/PNG favicon from her monogram, `robots.txt` + `sitemap.xml`. Footer year via JS or just updated. Needs the live URL (Q3). | S |
| N-21 | Medium | Maintainability / JS | `:1488-1513`, `:1495-1497`, `:1669-1678`, `:1239-1245` | The renderer builds HTML from unescaped template strings, so a `"` or `<` in a title or alt breaks the markup. Gallery arrays travel through `data-*` as JSON with a `&quot;` replace hack, then get parsed back from the DOM, instead of indexing the array. Filter buttons are hardcoded in HTML separately from the categories in the data, so a new category means editing two places. 4 of 6 filters have only 1 project. `gallery`/`gallery2` is a one-off for Goran (hardcoded "Concept 01/02" labels at `:1712`, `:1754`). | Adding projects is error-prone. That's exactly the workflow this site needs to support. | Move the data to `projects.js` (a plain `const PROJECTS=[…]`, no fetch, works from `file://`). Store `data-index` on each card and look up the object. Build the filter buttons from the categories in the data. Generalise `gallery2` to `concepts:[{label, images:[]}]`. Merge single-item categories (e.g. Illustration / Branding / Characters). | M |
| N-22 | Low | Lightbox UX | `:1706-1766`, `:868-879` | Tabs "CONCEPT 01 / CONCEPT 02" plus a second label "Concept 01 — Primary Direction" repeat the same information `[shot: modal-goran-1440]`. No prev/next between projects, no swipe, no counter. The lightbox loads full originals (3000×3000 logo, 2.9 MB PNG). | Clunky browsing and heavy loads. | Drop `.concept-label` or the tabs. Add ←/→ and swipe between projects. Serve the `-1600.webp` derivative. | S |
| N-23 | Low | Validity | `:20`, `:426`, `:1239-1245`, `:1322`, `:1346`, `:1350` | Nu validator: 4 errors (favicon data-URI `<`, non-existent `text-fill-color`, `<img>` without `src` and without `alt`) plus an empty heading. html-validate: 7 `<button>`s without `type`, one inline style. | Cheap to fix, and it signals care. | Fix each one: URL-encode or replace the favicon, delete `:426`, add `type="button"`, move the inline style to CSS, give the modal img `alt=""` and a `src` at open. | S |
| N-24 | Low | Dead / duplicated code | `:718` vs `:732`; `:736` (`!important`); `:55` (`--transition-card` never used); `:318` (`z-index` on non-positioned element); `:395`+`:1083` (duplicate padding); `:1500` (`item-N` classes unused); `:1674` (re-adding `.reveal` does nothing); `:362-364`, `:548`, `:553`, `:989`, `:1035` (hardcoded brand hex/rgba instead of tokens) | Gemini leftovers. Nobody has refactored the code. | Noise for whoever maintains it next. | Delete; use `var(--color-primary)` / `color-mix()` for tints. | S |
| N-25 | Low | Hover affordances | `:513-517` (`.tag`), `:553` (`.skill-card`), `:975` (`.process-step`), `hover-target` on non-interactive spans | Tags, skill cards and process cards lift on hover like buttons but do nothing. | False affordance, so users click and nothing happens. | Remove hover transforms from non-interactive elements. | S |
| N-26 | Low | Assets / hygiene | `chillingdesign.jpg`; `Business-card.JPG`, `Tshirtgoran.png`; `character1.jpg` | `chillingdesign.jpg` (127 KB) isn't referenced; is it a forgotten project? Mixed-case names work now only because the HTML matches exactly. Re-uploading `business-card.jpg` from another machine would 404 on Linux hosting (GitHub Pages is case-sensitive). `character1.jpg` depends on EXIF Orientation=8. Browsers rotate it, but some OG scrapers and image tools don't. | Silent breakage when files get replaced. | Lower-case kebab-case names in `/images/` (section 4). Bake the rotation in on export. Ask about `chillingdesign.jpg` (Q8). | S |
| N-27 | Low | Repo hygiene | `README.md`, no `.gitignore` | README is a single line. No `.gitignore` (risk of `.DS_Store`/`Thumbs.db` uploads). All commits are web uploads with default messages. | Hard for her (or anyone) to know how to add work or deploy. | Write a README covering "how to add a project", "how to export images" and "how to deploy". Add `.gitignore` (`.DS_Store`, `Thumbs.db`, `/originals/` if originals stay local). | S |
| N-28 | Low | Licensing / attribution | `bookcoveralice.jpg` (Seal Press logo, price, barcode), `adforjeep.jpg` (Jeep mark + landscape photo) | The book cover carries a real publisher's logo. The Jeep ad uses the trademark and what looks like a photograph. If these are student or spec pieces, presenting them without a label implies a commission. | Small legal and reputational risk, and an honesty signal to recruiters. | Label them "Self-initiated / concept work, not affiliated with…". Confirm the source and licence of the Jeep background photo (Q9). | S |
| N-29 | Low | iOS / cross-browser | `:343`, `:1068` (`100vh`), `:729` (`backdrop-filter` without `-webkit-`), `:1701`/`:1787` (`body.style.overflow`) | `100vh` overshoots behind the iOS toolbar. The modal's `backdrop-filter` has no `-webkit-` prefix (Safari < 18 gets no blur; harmless at 95% black). `overflow:hidden` on body doesn't stop background scroll on iOS Safari. | Minor polish issues on iPhone. | `100svh`/`100dvh`; add `-webkit-backdrop-filter`; `<dialog>` (N-07) or `position:fixed` body lock for iOS. | S |

**Areas checked and found fine:**
- No horizontal overflow at any of the 6 widths (scrollWidth = clientWidth).
- No console errors and no failed requests.
- All 19 referenced asset paths return 200 locally, and file-name case matches.
- Form labels are correctly associated (`for`/`id`).
- `lang="en"` is present.
- Landmarks (`header`, `nav`, `main`, `footer`) are present.
- Heading order is H1 → H2 → H3 with no skips.
- Native focus outlines are visible on links and buttons (`outline: auto`).
- CLS is low (0.003–0.008).
- No exposed email or phone, no GPS EXIF.
- No third-party trackers.

---

## 3. Quick wins (each under ~30 min, biggest visible impact first)

1. **Fix the invisible modal** (N-01): delete `index.html:732`, switch to visibility/pointer-events. 10 min. Fixes the "first click does nothing" bug for every visitor.
2. **Fix the grid hole** (N-04): `grid-auto-rows:350px`, drop the fixed height, wire `featured-large/wide`. 15 min.
3. **Move Work up under the hero and cut the hero to ~65svh** (N-02). 10 min.
4. **Lazy-load the grid** (N-05, partial): add `loading="lazy" decoding="async"` in the template at `:1506`. 2 min. Cuts initial weight a lot even before re-encoding.
5. **Re-export the 4 monsters** (`bigman`, `traveller`, `cat`, `goranlogo`, plus `Tshirtgoran.png` → JPEG/WebP): about 8.3 MB → about 0.9 MB. 20 min with Squoosh.
6. **Readable CTAs** (N-09): dark text on gradient buttons; `.highlight` and `.step-number` to `#9A5B47`. 10 min.
7. **Mobile lightbox scroll** (N-06): `overflow-y:auto` + `max-height:none`. 5 min.
8. **No-JS safety net** (N-08): the `no-js`/`js` class swap. 10 min.
9. **Remove the custom cursor** (N-12). 10 min.
10. **Hamburger shadow and button** (N-13 a/b). 15 min.
11. **Absolute og:image + footer year + real favicon** (N-20). 20 min, once the URL is known.

---

## 4. Proposed target structure

No build step needed. Plain HTML/CSS/JS can handle about 30 projects and a lightbox with no trouble. The only "tooling" is an optional one-file image script she runs locally.

```
/
├── index.html              ← markup only (header, sections, empty grid container, <dialog>)
├── css/
│   └── styles.css          ← tokens at top (:root), then base → layout → components
├── js/
│   ├── projects.js         ← THE ONLY FILE TOUCHED TO ADD WORK: const PROJECTS = [ … ]
│   └── main.js             ← render grid + filters from PROJECTS, lightbox, nav, form
├── images/
│   ├── projects/
│   │   ├── goran-bakery/
│   │   │   ├── cover-800.webp      (grid thumbnail, deliberately cropped)
│   │   │   ├── 01-logo-1600.webp
│   │   │   ├── 02-tshirt-1600.webp
│   │   │   └── 03-business-card-1600.webp
│   │   └── alice-book-cover/ …
│   ├── about/kristina-portrait-800.webp
│   └── og/og-1200x630.jpg
├── favicon.svg  apple-touch-icon.png
├── robots.txt  sitemap.xml
├── tools/optimize-images.sh  (optional; see below)
├── README.md  .gitignore
└── (originals stay OUT of the repo: keep them in her own Drive/Dropbox)
```

**Adding a project (the whole workflow):**
1. Export images → drop them into `images/projects/<slug>/`, named `cover-800.webp` and `NN-name-1600.webp`.
2. Add one object to `js/projects.js`:
   ```js
   {
     slug: "goran-bakery",
     title: "Goran Bakery Identity",
     category: "branding",            // filter buttons are generated from these
     type: "Self-initiated",          // or "Client" / "Student"
     year: 2025,
     cover: "images/projects/goran-bakery/cover-800.webp",
     coverFit: "contain",             // optional: "cover" (default) | "contain"
     focus: "50% 30%",                // optional object-position for crops
     featured: "large",               // optional: "large" | "wide"
     alt: "Mascot logo of a baker resting on a giant croissant",
     summary: "One or two sentences in Krisi's own words.",
     concepts: [                      // generalises gallery/gallery2
       { label: "Primary", images: ["…/01-logo-1600.webp", "…/02-tshirt-1600.webp"] },
       { label: "Alternative", images: ["…/04-alt-logo-1600.webp"] }
     ]
   }
   ```
3. Commit with a message like `Add project: Goran Bakery identity` → push → live.

The renderer validates required fields and logs a clear console warning (instead of blanking the page) if a field is missing or an image 404s.

**Image processing:**
- **Zero-install path (recommended for Krisi):** [Squoosh](https://squoosh.app) or Photoshop "Export As": WebP, quality 78–82, sRGB, longest side 800 (cover) and 1600 (detail), "strip metadata" on.
- **Scripted path (optional):** `tools/optimize-images.sh` using `cwebp`/ImageMagick (`magick in.jpg -auto-orient -colorspace sRGB -resize 1600x1600\> -quality 80 out.webp`). It bakes the EXIF rotation (character1) and converts P3 → sRGB. In this audit, the same settings took 10.9 MB of images to 2.1 MB (1600 w) and 0.76 MB (800 w).
- **Naming:** lower-case, kebab-case, no spaces, ASCII only, `NN-` prefix for gallery order. This prevents the case-sensitivity 404s on Linux hosts.

**Deployment:** GitHub Pages from `main` (free; custom domain via `CNAME`) or Netlify/Cloudflare Pages drag-and-drop. Pick after Q3/Q4.
**Workflow:** a branch per change (`add/project-slug`, `fix/…`), a PR so there's a preview link (Netlify/Cloudflare give one per PR), merge to `main` = deploy.

---

## 5. Phased roadmap (each phase = one reviewable commit or small PR)

| Phase | Contents | Findings | Effort | Visible impact |
|---|---|---|---|---|
| **1. Unbreak** | Invisible modal, grid hole, mobile lightbox scroll, no-JS safety net, hamburger as `<button>`, shadow bleed, validator errors | N-01, N-04, N-06, N-08, N-13, N-23 | ~1.5 h | Site stops looking broken |
| **2. Images & performance** | Re-encode all images (800/1600 WebP), lazy-load, width/height, sRGB/rotation baked in, delete orphan (after Q8), lower-case kebab names in `/images/` | N-05, N-26, N-22 (derivatives) | ~2 h | 7.2 MB → ~0.8 MB initial |
| **3. Split files & data** | Extract `css/styles.css`, `js/main.js`, `js/projects.js`; tokens for all colours; escape-safe renderer; filters generated from data; `concepts[]`; delete dead code | N-21, N-24 | ~2 h | None visually; adding work becomes a one-file edit |
| **4. Accessibility & motion** | `<dialog>` lightbox with focus management, button cards, contrast tokens, reduced-motion, remove custom cursor, remove false hover affordances | N-07, N-09, N-11, N-12, N-25, N-29 | ~2.5 h | Usable by everyone; CTAs readable |
| **5. Layout & visual direction** *(needs her sign-off)* | Work directly after the hero, static H1, per-project crop/fit, quieter neutral chrome, heading style, fix/remove Process | N-02, N-03, N-10, N-16, N-17 | ~3 h + review | Work becomes the hero |
| **6. Content & case studies** *(needs her input)* | Real titles, her copy, project metadata (year/type/role/tools), single positioning, spec-work labels | N-14, N-15, N-28 | code ~1.5 h, her writing time separate | Reads as a professional, not a gallery |
| **7. SEO, contact, launch** | OG/Twitter/canonical/JSON-LD, favicon, robots/sitemap, self-hosted fonts, form honeypot + aria-live + email fallback, README, `.gitignore`, deploy config | N-18, N-19, N-20, N-27 | ~2 h | Good share previews, fewer lost leads, GDPR-safe |

Phases 1–4 need no creative decisions and can go first. Phases 5–6 change how the site looks and reads, so I'd propose them as before/after screenshots first.

---

## 6. Questions for me

1. **Goal of the site:** freelance clients, full-time jobs, or both? This decides the hero copy, the CTA ("Hire me" vs "Download CV") and whether Process/Capabilities stay at all.
2. **Her specialty / what she wants more of:** branding, illustration, character design, print, UI, or mixed? Today the grid is ~70% illustration, but the copy sells "brand identity". Which should lead?
3. **Live URL:** is the site deployed, and where? (Needed for absolute OG URLs, canonical and sitemap.)
4. **Hosting:** GitHub Pages, Netlify, or something else? Is there a custom domain?
5. **Contact:** can a public email address be shown as a fallback to the form? Any other profiles to link (Behance, LinkedIn, Dribbble)?
6. **Location / audience:** is she EU-based (Bulgaria?), and is the audience local or international? This affects GDPR (fonts, form privacy note) and whether a Bulgarian-language version is wanted.
7. **Name spelling:** the site says "Petrova", Instagram is "krisi.petrowa". Which is the public brand? "Kristina" or "Krisi"?
8. **`chillingdesign.jpg`:** is it in the repo but missing from the site on purpose, or a forgotten project?
9. **Jeep ad background photo and Alice cover:** her own photo/illustration, or stock? Were these student, spec or client work? (For labelling and licensing.)
10. **Goran Logo:** is "Goran/Goko" a real client? Can it be called a client project?
11. **Formspree:** which plan, and does the endpoint currently deliver to her inbox? (I couldn't reach formspree.io from this environment.)
12. **Visual direction:** is she attached to the pastel pink/sage palette and the Poppins/Inter pairing, or open to a quieter, neutral frame for the work?
13. **Project titles and descriptions:** did she write them, or did Gemini? Will she provide her own?

---

## 7. Not verified

| Item | Why |
|---|---|
| **Safari (WebKit) and Firefox rendering** | Only Chromium is installed in this environment. I did not install other browsers, because a second Playwright version wouldn't match the pre-installed setup. Section-10 compatibility notes come from reading the code against known support data. |
| **Real iOS Safari quirks** (100vh toolbar, body scroll-lock leak, backdrop-filter) | No physical device or WebKit engine available. "iPhone 13" tests used Chromium device emulation (viewport, touch, DPR), not WebKit. |
| **External links: Instagram, Formspree endpoint** | The environment's egress proxy refused connections to `instagram.com`, `formspree.io` and `validator.w3.org`. Form submission end-to-end was **not** tested. The HTML validator was run locally with `vnu.jar` instead. |
| **Live site** | No live URL is known (Q3). Everything was tested on `python3 -m http.server` at `127.0.0.1:8765`. Caching headers, HTTPS, compression and 404 behaviour on the real host are untested. |
| **Lighthouse on a real network** | Local runs with Lighthouse's simulated throttling. Real-world 4G numbers will be worse than the reported 98 because of the 7.2 MB image payload. |
| **Screen reader output** (VoiceOver/NVDA) | Not available. Accessibility findings come from axe-core, keyboard simulation in Playwright and code reading. |
| **Image licences** | Can't be determined from files (see Q9). |

**Tools actually run:**
- Playwright/Chromium screenshots at 360/390/768/1024/1440/1920, with console/network capture and interaction tests (first click, menu, lightbox, filter, keyboard Tab, reduced-motion, JS-disabled).
- Lighthouse 13.6 (mobile + desktop).
- axe-core (WCAG 2.0/2.1 A/AA + best-practice).
- Nu HTML Checker (`vnu.jar`, local) and `html-validate`.
- ImageMagick/Pillow for image metadata and a test WebP conversion (in the scratchpad only, repo untouched).
