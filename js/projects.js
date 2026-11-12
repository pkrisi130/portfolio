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
   slug        REQUIRED  short id, lowercase-with-dashes, same as the image folder.
                         It is also the project's link (…/#work/<slug>), so don't
                         rename it after sharing a link.
   title       REQUIRED  project name shown on the sticker label and in the viewer
   filter      REQUIRED  which filter button it belongs to (a key from FILTERS)
   label       REQUIRED  small text on the label tape, e.g. "Brand Identity"
   cover       REQUIRED  image path WITHOUT "-800.webp", e.g. "images/projects/cat/cat"
   width/height REQUIRED pixel size of the cover's -800.webp file (prevents jumping)
   alt         REQUIRED  what the image shows, for blind visitors and Google
   description           one or two sentences shown in the viewer
   tone                  dark background colour of the viewer for this project
   pop                   bright accent colour taken from the artwork
   swatches              up to 5 colours from the artwork, shown as paint chips
                         (tools/optimize_images.py suggests tone/pop/swatches)
   cutout                path (without -800.webp) of a transparent PNG/WebP of the
                         character; used as a die-cut sticker in the hero
   year, type, client, role, tools   optional facts shown in the viewer
                         (type: "Client project", "Personal project", "Course project")
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

/* Stickers scattered around the name at the top of the page.
   x / y = position in % of the hero area (desktop), w = width in px, r = tilt in degrees.
   On phones they gather in a cluster above the name automatically.
   If a project has a "cutout" (transparent character), that is used instead of the cover. */
const HERO_STICKERS = [
  { slug: "goran-bakery", x: 62, y: 2,  w: 220, r: 6 },
  { slug: "character-01", x: 84, y: 30, w: 150, r: -6 },
  { slug: "bright-tv",    x: 56, y: 50, w: 190, r: -5 },
  { slug: "character-02", x: 77, y: 60, w: 210, r: 5 },
  { slug: "cat",          x: 90, y: 6,  w: 120, r: 9 },
  { slug: "character-03", x: 64, y: 80, w: 150, r: -3 }
];

const PROJECTS = [
  {
    slug: "jeep-ad",
    title: "Where Desert Calls",
    filter: "advertising",
    label: "Advertising",
    cover: "images/projects/jeep-ad/jeep-ad",
    width: 566, height: 800,
    alt: "A jeep drives out of a framed desert photo under the line “Where desert calls, Jeep answers”",
    description: "An adventurous advertising concept designed to capture the rugged, unrestrained spirit of the open road.",
    tone: "#2e2112", pop: "#d9a35a",
    swatches: ["#917e66", "#765425", "#664932", "#18110f", "#8a6c4a"],
    type: "Course project"
  },
  {
    slug: "goran-bakery",
    title: "Goran Goko Bakery",
    filter: "branding",
    label: "Brand Identity",
    cover: "images/projects/goran-bakery/01-logo",
    width: 800, height: 800,
    alt: "Bakery mascot logo: a baker resting against a giant croissant above the name ГОРАН ГОКО",
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
    tone: "#5a1a11", pop: "#e6851f",
    swatches: ["#e6851f", "#6e2015", "#eda75d", "#bc6721", "#fbc26d"]
  },
  {
    slug: "alice-book-cover",
    title: "Alice in Wonderland",
    filter: "books",
    label: "Book Cover Design",
    cover: "images/projects/alice-book-cover/cover",
    width: 800, height: 571,
    alt: "Alice in Wonderland wraparound book cover: Alice walks through a keyhole-shaped forest",
    description: "A whimsical redesign capturing the surreal, magical essence of Wonderland through vibrant digital illustration.",
    tone: "#24161a", pop: "#c3a59d",
    swatches: ["#543d3c", "#7c6160", "#37191c", "#c3a59d", "#0b0509"],
    type: "Course project"
  },
  {
    slug: "gamer-room",
    title: "Game Over Room",
    filter: "isometric",
    label: "Isometric Design",
    cover: "images/projects/gamer-room/room",
    width: 800, height: 800,
    alt: "Isometric gamer's bedroom glowing purple, with fairy lights and a Game Over neon sign",
    description: "An isometric exploration of a cozy, personalized sanctuary tailored for the ultimate gaming experience.",
    tone: "#1d0730", pop: "#a055e2",
    swatches: ["#8a27ca", "#230938", "#a055e2", "#ad94ed", "#21093a"]
  },
  {
    slug: "character-01",
    title: "Sneaker Bird",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/character-01/character",
    width: 556, height: 800,
    alt: "A long-necked spotted bird character in yellow sneakers",
    description: "A study in distinct shape language and expressive personality, brought to life through clean digital strokes.",
    tone: "#5d5b57", pop: "#f0b33a",
    swatches: ["#a09e9a", "#8d7f68", "#6a352d", "#c0ab89", "#f0b33a"],
    cutout: "images/projects/character-01/character-cutout"
  },
  {
    slug: "character-02",
    title: "Fuzzy Dance",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/character-02/character",
    width: 800, height: 556,
    alt: "A fuzzy yellow-green creature dancing",
    description: "A vibrant exploration of street-style aesthetics, emphasizing dynamic poses and modern fashion.",
    tone: "#3d3c08", pop: "#c8c41a",
    swatches: ["#a09c03", "#898404", "#d8d798", "#adab1b", "#f9f9f1"],
    cutout: "images/projects/character-02/character-cutout"
  },
  {
    slug: "character-03",
    title: "Sunset Drive",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/character-03/character",
    width: 800, height: 800,
    alt: "A woman leaning out of a car window, her hair blowing against a red sunset",
    description: "An atmospheric character portrait focusing on mood, elegant lighting, and quiet contemplation.",
    tone: "#061a22", pop: "#e07a62",
    swatches: ["#c36e5b", "#ac5d4d", "#2d2e34", "#051b23", "#000000"]
  },
  {
    slug: "me-and-you",
    title: "Me and You",
    filter: "characters",
    label: "Character Design",
    cover: "images/projects/me-and-you/me-and-you",
    width: 800, height: 694,
    alt: "Cartoon couple smiling in front of red flowers and palm trees",
    description: "A heartwarming custom illustration capturing connection and shared memories in a playful, animated style.",
    tone: "#26321f", pop: "#e0554b",
    swatches: ["#edc18f", "#374a2d", "#8b312d", "#bc9769", "#618983"]
  },
  {
    slug: "bright-tv",
    title: "Movie Night",
    filter: "illustration",
    label: "Cute Drawings",
    cover: "images/projects/bright-tv/bright-tv",
    width: 800, height: 800,
    alt: "Pink and navy drawing of teddy bears watching TV with snacks",
    description: "A stylized composition blending bold, contrasting colors to recreate the cozy nostalgia of a late-night movie marathon.",
    tone: "#1b1b5d", pop: "#f7688f",
    swatches: ["#23207a", "#f7688f", "#1b1b5d", "#c5597b", "#472b6e"]
  },
  {
    slug: "night",
    title: "Evening Light",
    filter: "illustration",
    label: "Atmospheric Art",
    cover: "images/projects/night/night",
    width: 613, height: 800,
    alt: "Warm orange evening light glowing through tall windows onto a wooden floor",
    description: "An evocative environment piece exploring the interplay of soft lighting and shadow during a quiet evening.",
    tone: "#1b1510", pop: "#f8a24a",
    swatches: ["#d2752b", "#f8b97a", "#15161e", "#a35b29", "#8c401f"]
  },
  {
    slug: "big-man",
    title: "Giant Steps",
    filter: "illustration",
    label: "Surreal Scenes",
    cover: "images/projects/big-man/big-man",
    width: 613, height: 800,
    alt: "Worm's-eye view of a giant cartoon man stepping over skyscrapers",
    description: "A surreal perspective study playing with extreme camera angles and dramatic scale against a towering urban backdrop.",
    tone: "#262725", pop: "#ff6a2b",
    swatches: ["#444643", "#bbcbda", "#646562", "#ff6a2b", "#8f928f"]
  },
  {
    slug: "traveller",
    title: "The Traveller",
    filter: "illustration",
    label: "Surreal Scenes",
    cover: "images/projects/traveller/traveller",
    width: 613, height: 800,
    alt: "A bearded traveller with a backpack looking over a green mountain valley",
    description: "An adventurous narrative scene merging character design with an expansive, breathtaking natural landscape.",
    tone: "#25352e", pop: "#e8c547",
    swatches: ["#aeafb6", "#342a2b", "#758180", "#d9d1c2", "#30433b"]
  },
  {
    slug: "cat",
    title: "Moon Cat",
    filter: "illustration",
    label: "Cute Drawings",
    cover: "images/projects/cat/cat",
    width: 613, height: 800,
    alt: "A black cat stepping over a yellow moon reflection on a navy square",
    description: "A minimalist, charming depiction of a feline companion, using bold contrast and simple geometric forms.",
    tone: "#14244a", pop: "#f5c518",
    swatches: ["#1c325f", "#998e63", "#0a111f", "#f5c518", "#ffffff"],
    cutout: "images/projects/cat/cat-cutout"
  },
  {
    slug: "chilling",
    title: "Rooftop Stargazing",
    filter: "illustration",
    label: "Illustration",
    cover: "images/projects/chilling/chilling",
    width: 800, height: 613,
    alt: "A girl lying on the roof of a van under a purple, starry night sky",
    description: "A quiet night on the road: lying on the roof of the van under a purple sky full of stars.",
    tone: "#3a2a3d", pop: "#d28cba",
    swatches: ["#6f61aa", "#3a2a3d", "#d28cba", "#201e2e", "#b484bd"]
  }
];
