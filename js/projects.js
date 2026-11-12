/* =========================================================================
   PORTFOLIO PROJECTS — the only file you need to edit to add or change work.
   =========================================================================

   HOW TO ADD A PROJECT
   1. Put the web images in  images/projects/<slug>/
      (each image needs two files: <name>-800.webp and <name>-1600.webp —
       see README.md or run tools/optimize_images.py)
   2. Copy one block below (from { to },) and paste it where it should appear.
      The order here is the order on the site.
   3. Fill in the fields. Only the ones marked REQUIRED are needed.

   FIELDS
   slug        REQUIRED  short id, lowercase-with-dashes, same as the image folder
   title       REQUIRED  project name shown on the card and in the viewer
   filter      REQUIRED  which filter button it belongs to (a key from FILTERS)
   label       REQUIRED  small text above the title, e.g. "Brand Identity"
   cover       REQUIRED  image path WITHOUT "-800.webp", e.g. "images/projects/cat/cat"
   width/height REQUIRED pixel size of the cover's -800.webp file (prevents jumping)
   alt         REQUIRED  what the image shows, for blind visitors and Google
   description           one or two sentences shown in the viewer
   featured              "large" (2x2 tile) or "wide" (2x1 tile) on big screens
   fit                   "contain" shows the whole image (logos, covers, posters);
                         default "cover" fills the tile and may crop the edges
   focus                 which part stays visible when cropped, e.g. "50% 20%"
                         (left-right% top-bottom%)
   background            tile colour behind a "contain" image, e.g. "#e8862a"
   year, type, role, tools   optional facts shown in the viewer
                         (type: "Client project", "Self-initiated", "Student work")
   images                extra images for the viewer (paths without -800/-1600)
   concepts              instead of images: several directions, each with a label
                         [{ label: "Concept 01", images: [...] }, ...]
   hidden                true = keep it in the file but don't show it on the site
   ========================================================================= */

const FILTERS = [
  { key: "illustration", label: "Illustration" },
  { key: "advertising",  label: "Advertising" },
  { key: "branding",     label: "Branding" },
  { key: "books",        label: "Book Design" },
  { key: "characters",   label: "Characters" },
  { key: "isometric",    label: "Isometric" }
];

const PROJECTS = [
  {
    slug: "jeep-ad",
    title: "Ad For Jeep",
    filter: "advertising",
    label: "Advertising",
    cover: "images/projects/jeep-ad/jeep-ad",
    width: 566, height: 800,
    alt: "Jeep Ad Campaign",
    description: "An adventurous advertising concept designed to capture the rugged, unrestrained spirit of the open road.",
    featured: "large",
    fit: "contain",
    background: "#6e5530"
  },
  {
    slug: "goran-bakery",
    title: "Goran Logo",
    filter: "branding",
    label: "Brand Identity",
    cover: "images/projects/goran-bakery/01-logo",
    width: 800, height: 800,
    alt: "Bakery Logo Design",
    description: "A warm, character-driven brand identity built to evoke the comforting, nostalgic aroma of freshly baked pastries.",
    concepts: [
      {
        label: "Concept 01",
        images: [
          "images/projects/goran-bakery/01-logo",
          "images/projects/goran-bakery/02-polo-shirt",
          "images/projects/goran-bakery/03-business-card",
          "images/projects/goran-bakery/04-pattern"
        ]
      },
      {
        label: "Concept 02",
        images: [
          "images/projects/goran-bakery/05-alt-logo",
          "images/projects/goran-bakery/06-alt-tshirt"
        ]
      }
    ],
    fit: "contain",
    background: "#e6851f"
  },
  {
    slug: "alice-book-cover",
    title: "Book Cover Alice",
    filter: "books",
    label: "Book Cover Design",
    cover: "images/projects/alice-book-cover/cover",
    width: 800, height: 571,
    alt: "Alice in Wonderland Book Cover",
    description: "A whimsical redesign capturing the surreal, magical essence of Wonderland through vibrant digital illustration.",
    fit: "contain",
    background: "#2a1c1f"
  },
  {
    slug: "gamer-room",
    title: "Room Design",
    filter: "isometric",
    label: "Isometric Design",
    cover: "images/projects/gamer-room/room",
    width: 800, height: 800,
    alt: "Gamer's Room Isometric Design",
    description: "An isometric exploration of a cozy, personalized sanctuary tailored for the ultimate gaming experience.",
    fit: "contain",
    background: "#230938"
  },
  {
    slug: "character-01",
    title: "Character 1",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/character-01/character",
    width: 556, height: 800,
    alt: "Character Illustration 1",
    description: "A study in distinct shape language and expressive personality, brought to life through clean digital strokes.",
    fit: "contain",
    background: "#a09e9a"
  },
  {
    slug: "character-02",
    title: "Character 2",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/character-02/character",
    width: 800, height: 556,
    alt: "Character Illustration 2",
    description: "A vibrant exploration of street-style aesthetics, emphasizing dynamic poses and modern fashion.",
    fit: "contain",
    background: "#ffffff"
  },
  {
    slug: "character-03",
    title: "Character 3",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/character-03/character",
    width: 800, height: 800,
    alt: "Character Illustration 3",
    description: "An atmospheric character portrait focusing on mood, elegant lighting, and quiet contemplation."
  },
  {
    slug: "me-and-you",
    title: "Me And You",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/me-and-you/me-and-you",
    width: 800, height: 694,
    alt: "Couple Illustration",
    description: "A heartwarming custom illustration capturing connection and shared memories in a playful, animated style.",
    focus: "50% 35%"
  },
  {
    slug: "bright-tv",
    title: "Bright TV",
    filter: "illustration",
    label: "Cute Drawings",
    cover: "images/projects/bright-tv/bright-tv",
    width: 800, height: 800,
    alt: "Stylized Illustration",
    description: "A stylized composition blending bold, contrasting colors to recreate the cozy nostalgia of a late-night movie marathon."
  },
  {
    slug: "night",
    title: "Night Pic",
    filter: "illustration",
    label: "Atmospheric Art",
    cover: "images/projects/night/night",
    width: 613, height: 800,
    alt: "Environment Art",
    description: "An evocative environment piece exploring the interplay of soft lighting and shadow during a quiet evening."
  },
  {
    slug: "big-man",
    title: "Bigman",
    filter: "illustration",
    label: "Surreal Scenes",
    cover: "images/projects/big-man/big-man",
    width: 613, height: 800,
    alt: "Bigman",
    description: "A surreal perspective study playing with extreme camera angles and dramatic scale against a towering urban backdrop.",
    focus: "50% 45%"
  },
  {
    slug: "traveller",
    title: "Traveller",
    filter: "illustration",
    label: "Surreal Scenes",
    cover: "images/projects/traveller/traveller",
    width: 613, height: 800,
    alt: "Traveller",
    description: "An adventurous narrative scene merging character design with an expansive, breathtaking natural landscape.",
    focus: "50% 70%"
  },
  {
    slug: "cat",
    title: "Cat",
    filter: "illustration",
    label: "Cute Drawings",
    cover: "images/projects/cat/cat",
    width: 613, height: 800,
    alt: "Cat",
    description: "A minimalist, charming depiction of a feline companion, using bold contrast and simple geometric forms.",
    fit: "contain",
    background: "#ffffff"
  },
  {
    // Found in the repo but never shown on the old site. Set hidden: false
    // (and give it a real title/description) to publish it.
    slug: "chilling",
    title: "Chilling",
    filter: "illustration",
    label: "Illustration",
    cover: "images/projects/chilling/chilling",
    width: 800, height: 613,
    alt: "A girl lying on the roof of a van under a purple, starry night sky",
    description: "",
    hidden: true
  }
];
