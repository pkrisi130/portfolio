# Kristina Petrova — Portfolio

A plain HTML/CSS/JavaScript site. No build step and nothing to install to run it:
open `index.html` in a browser, or push to GitHub and it goes live.

Live site: https://pkrisi130.github.io/portfolio/ *(update this line if the address is different)*

---

## Add a new project (the 3-step version)

1. **Make the web images.** For every image you need two WebP files:
   `<name>-800.webp` (longest side 800 px) and `<name>-1600.webp` (longest side 1600 px).
   - Easiest: [squoosh.app](https://squoosh.app). Drop the image, choose **WebP**, quality **80**,
     *Resize* the longest side to 800, download; repeat with 1600.
   - Or, if you have Python: put your full-size exports in `originals/projects/<slug>/` and run
     `python3 tools/optimize_images.py` (see below). It makes both sizes for you.
2. **Put them in `images/projects/<slug>/`**, where `<slug>` is a short lowercase name with dashes,
   e.g. `images/projects/summer-poster/poster-800.webp` and `poster-1600.webp`.
3. **Open `js/projects.js`**, copy an existing project block (from `{` to `},`), paste it where it
   should appear (order in the file = order on the site) and change the fields:

   ```js
   {
     slug: "summer-poster",
     title: "Summer Festival Poster",
     filter: "illustration",            // one of the keys in FILTERS at the top of the file
     label: "Poster Design",            // small text above the title
     cover: "images/projects/summer-poster/poster",   // without -800.webp
     width: 566, height: 800,           // size of poster-800.webp (see tip below)
     alt: "Poster with a yellow sun over a crowd at an open-air concert",
     description: "One or two sentences about the project.",
     // optional:
     year: 2026,
     type: "Self-initiated",            // or "Client project", "Student work"
     tools: ["Procreate", "Illustrator"],
     tone: "#3a2a17", pop: "#d9a35a",   // viewer background + accent (the image tool suggests these)
     swatches: ["#917e66", "#765425", "#18110f"],  // paint chips shown in the viewer
     tiktok: "https://www.tiktok.com/@…/video/…",  // "Watch the process" button
     cutout: "images/projects/summer-poster/character",  // transparent character, see below
     images: ["images/projects/summer-poster/poster", "images/projects/summer-poster/mockup"]
   },
   ```

   **Tip — finding width/height:** `tools/optimize_images.py` prints a ready-to-paste
   `cover: …, width: …, height: …` line for every image. Without it: on Mac, select the `-800.webp`
   file and press ⌘I; on Windows, right-click → Properties → Details.

4. Commit and push (or upload through github.com). Done.

Every field is explained at the top of `js/projects.js`. If you forget a required field, the site
still works and the browser console (F12 → Console) tells you what's missing.

### Other things you can change
| What | Where |
|---|---|
| Filter buttons | `FILTERS` at the top of `js/projects.js` (buttons with no projects hide themselves) |
| Hide a project without deleting it | add `hidden: true` to it |
| Stickers around the name at the top | `HERO_STICKERS` at the top of `js/projects.js` (which projects, position, size, tilt) |
| About text, process, contact text | `index.html` |
| Portrait photo | replace `images/about/kristina-portrait-800.webp` and `-1600.webp` |
| Mat colour, yellow accent, fonts, spacing | the `:root` block at the top of `css/styles.css` |
| Social share picture | `images/og/og-image.jpg` (1200 × 630) |

---

## Character cut-outs (die-cut stickers)

A character exported with a **transparent background** becomes a real die-cut sticker at the top
of the page: the white edge follows the character's outline and visitors can drag it around.

1. In Procreate: hide the background layer → Share → **PNG**. At least 2000 px on the longest side,
   with a little empty space around the character.
2. Put it in `originals/projects/<slug>/` and run `python3 tools/optimize_images.py`
   (transparency is kept), or export WebP with transparency from Squoosh.
3. Add `cutout: "images/projects/<slug>/<name>"` to that project in `js/projects.js`.
   If the project is listed in `HERO_STICKERS`, the cut-out is used automatically.

## Sharing a single project

Every project has its own link: open it on the site and press the link icon in the viewer
(on phones it opens the share menu). Links look like
`https://pkrisi130.github.io/portfolio/#work/goran-bakery`; the part after `#work/` is the
project's `slug`, so **don't rename a slug once you've shared its link**.
The browser back button closes the viewer, as people expect on phones.

## Security note

`index.html` has a *Content-Security-Policy* line that only allows files from this site and
lets the form talk to Formspree. It blocks injected scripts. If you ever add something from
another website (a YouTube video, Google Analytics, an Instagram feed), add that website's
address to that line, or it will be blocked.

## Folder structure

```
index.html               page markup and text
404.html                 "page not found" page
css/styles.css           all styling (design tokens at the top)
js/projects.js           ← your projects and filters
js/main.js               behaviour (grid, filters, viewer, contact form)
images/projects/<slug>/  web images, two sizes each (-800 / -1600 .webp)
images/about/            portrait
images/og/               social share image
fonts/                   self-hosted Inter + Poppins (SIL Open Font License)
tools/optimize_images.py image converter (optional)
originals/               your full-size files — NOT uploaded (listed in .gitignore)
favicon.svg, favicon-32.png, apple-touch-icon.png, robots.txt, sitemap.xml
```

**Image file names:** lowercase, dashes instead of spaces, no special characters
(`business-card-1600.webp`, not `Business Card.JPG`). Web servers are case-sensitive, so
`Photo.JPG` and `photo.jpg` are different files there.

## Image tool (optional)

```bash
pip install Pillow                                   # once
python3 tools/optimize_images.py                     # converts everything in originals/
python3 tools/optimize_images.py projects/my-slug    # just one folder
```

It fixes rotation, converts colours to sRGB, resizes to 800 and 1600 px, saves WebP and strips
metadata (e.g. location data). Files that are already up to date are skipped.

## Preview locally

Double-clicking `index.html` works. For an exact preview of the live site, run
`python3 -m http.server` in this folder and open http://localhost:8000.

## Publishing (GitHub Pages)

Settings → Pages → *Deploy from a branch* → `main` / `(root)`. Every push to `main` updates the site
within a minute or two. For a custom domain, add it in the same settings page and update the address in
`index.html` (search for `pkrisi130.github.io`), `robots.txt` and `sitemap.xml`.

**Suggested workflow:** make changes on a branch, open a pull request, check it, then merge to `main`.

## Contact form

Messages are sent through [Formspree](https://formspree.io) to the address registered with the form
ID in `index.html` (`action="https://formspree.io/f/…"`). A hidden `_gotcha` field filters out simple
spam bots. The free Formspree plan has a monthly submission limit — check your dashboard.
