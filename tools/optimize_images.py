#!/usr/bin/env python3
"""
Turn full-size artwork into web-ready WebP files for the portfolio.

    originals/projects/<project-slug>/<name>.jpg|png   (your exports, NOT committed)
        ->  images/projects/<project-slug>/<name>-800.webp
            images/projects/<project-slug>/<name>-1600.webp
    (any folder works: originals/about/x.jpg -> images/about/x-800.webp ...)

What it does to every image:
  * applies the camera/app rotation flag (EXIF orientation) to the pixels
  * converts Display P3 / Adobe RGB to sRGB so colours look the same everywhere
  * shrinks so the longest side is at most 800 px and 1600 px
  * saves WebP (quality 80) without metadata (transparency is kept, so
    character cut-outs stay cut out)
  * prints ready-to-paste values for js/projects.js: cover, width, height
    and the colours (tone, pop, swatches) measured from the artwork

Usage (needs Python 3 and Pillow:  pip install Pillow):
    python3 tools/optimize_images.py                        # everything in originals/
    python3 tools/optimize_images.py projects/goran-bakery  # only one folder
Existing outputs are skipped unless the original is newer.

No Python? Use https://squoosh.app instead: WebP, quality 80, resize the
longest side to 800 and to 1600, and name the files <name>-800.webp /
<name>-1600.webp in images/projects/<project-slug>/.
"""
import colorsys
import io
import sys
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "originals"
DST = ROOT / "images"
SIZES = (800, 1600)
QUALITY = 80
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
SRGB = ImageCms.createProfile("sRGB")


def to_srgb(im: Image.Image) -> Image.Image:
    icc = im.info.get("icc_profile")
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    if icc:
        try:
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            im = ImageCms.profileToProfile(im, src, SRGB, outputMode=im.mode)
        except Exception as exc:  # broken profile: keep pixels as they are
            print(f"   ! colour profile ignored ({exc})")
    return im


def palette(im: Image.Image) -> tuple[str, str, list[str]]:
    """Measure the artwork's colours: a dark 'tone' for the viewer background,
    a bright 'pop' accent and 5 swatches (most used colours first)."""
    small = im.convert("RGB")
    small.thumbnail((160, 160))
    q = small.quantize(colors=10, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    colours = []
    for count, idx in sorted(q.getcolors(), reverse=True):
        r, g, b = pal[idx * 3: idx * 3 + 3]
        h, l, sat = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        colours.append({"hex": f"#{r:02x}{g:02x}{b:02x}", "h": h, "l": l, "s": sat, "n": count})

    def distinct(cols, limit):
        out = []
        for c in cols:
            if all(abs(c["l"] - o["l"]) + abs(c["s"] - o["s"]) + min(abs(c["h"] - o["h"]), 1 - abs(c["h"] - o["h"])) > 0.12 for o in out):
                out.append(c)
            if len(out) == limit:
                break
        return out

    swatches = [c["hex"] for c in distinct(colours, 5)]
    pop = max(colours, key=lambda c: c["s"] * (1 - abs(c["l"] - 0.55)) * (c["n"] ** 0.25))
    base = max(colours, key=lambda c: c["n"] * (0.3 + c["s"]))
    # tone: the main hue, darkened until white text reads comfortably on it
    r, g, b = colorsys.hls_to_rgb(base["h"], min(base["l"], 0.2), min(base["s"], 0.7))
    tone = f"#{int(r * 255):02x}{int(g * 255):02x}{int(b * 255):02x}"
    return tone, pop["hex"], swatches


def process(path: Path) -> None:
    out_dir = DST / path.parent.relative_to(SRC)
    out_dir.mkdir(parents=True, exist_ok=True)
    stem = path.stem.lower().replace(" ", "-").replace("_", "-")
    targets = [out_dir / f"{stem}-{s}.webp" for s in SIZES]
    if all(t.exists() and t.stat().st_mtime >= path.stat().st_mtime for t in targets):
        return
    im = to_srgb(ImageOps.exif_transpose(Image.open(path)))
    for size, target in zip(SIZES, targets):
        copy = im.copy()
        copy.thumbnail((size, size), Image.LANCZOS)
        copy.save(target, "WEBP", quality=QUALITY, method=6)
        print(f"   {target.relative_to(ROOT)}  {copy.width}x{copy.height}  {target.stat().st_size // 1024} KB")
        if size == SIZES[0]:
            base = str(target.relative_to(ROOT)).removesuffix(f"-{size}.webp")
            print(f'   → for projects.js:  cover: "{base}",  width: {copy.width}, height: {copy.height},')
            tone, pop, swatches = palette(im)
            print(f'   → colours:          tone: "{tone}", pop: "{pop}", swatches: {swatches},'.replace("'", '"'))


def main() -> None:
    if not SRC.is_dir():
        sys.exit(f"Put your exports in {SRC}/projects/<project-slug>/ first.")
    roots = [SRC / a for a in sys.argv[1:]] or [SRC]
    for root in roots:
        for f in sorted(p for p in root.rglob("*") if p.suffix.lower() in EXTS):
            print(f.relative_to(SRC))
            process(f)


if __name__ == "__main__":
    main()
