#!/usr/bin/env python3
"""
Make a character cut-out (transparent background) from artwork that sits on a
plain, single-colour background, e.g. a white or flat grey canvas.

    python3 tools/make_cutout.py originals/projects/cat/cat.jpg
        -> originals/projects/cat/cat-cutout.png

Then run  python3 tools/optimize_images.py  to make the web versions and add
    cutout: "images/projects/cat/cat-cutout"
to that project in js/projects.js.

How it works: it reads the background colour from the image corners and removes
every pixel of that colour that touches the outside edge. Areas of the same
colour *inside* the drawing (eyes, highlights) are kept. Edges are softened so
fur and brush strokes stay natural.

Options:
    --tolerance 40   how different a pixel may be from the background and still
                     count as background (default 40; raise it for noisy scans)
    --soft 30        width of the soft edge (default 30)

This only works for plain backgrounds. For busy backgrounds, export the
character from Procreate with the background layer hidden instead.

Needs Python 3 and Pillow (pip install Pillow).
"""
import argparse
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


def background_colour(im: Image.Image) -> tuple[int, int, int]:
    w, h = im.size
    s = max(4, min(w, h) // 50)
    corners = [im.crop(box).resize((1, 1), Image.BOX).getpixel((0, 0))
               for box in ((0, 0, s, s), (w - s, 0, w, s), (0, h - s, s, h), (w - s, h - s, w, h))]
    return tuple(sorted(c[i] for c in corners)[1] for i in range(3))  # robust middle value


def cutout(src: Path, tolerance: int, soft: int) -> Path:
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    bg = background_colour(im)

    # How far each pixel is from the background colour (largest channel difference)
    diff = ImageChops.difference(im, Image.new("RGB", im.size, bg))
    dist = ImageChops.lighter(ImageChops.lighter(*diff.split()[:2]), diff.split()[2])

    # Background candidates, then keep only the part connected to the image edge
    candidates = dist.point(lambda v: 255 if v <= tolerance + soft else 0)
    w, h = im.size
    step = max(1, min(w, h) // 200)
    for x in range(0, w, step):
        for y in (0, h - 1):
            if candidates.getpixel((x, y)) == 255:
                ImageDraw.floodfill(candidates, (x, y), 128)
    for y in range(0, h, step):
        for x in (0, w - 1):
            if candidates.getpixel((x, y)) == 255:
                ImageDraw.floodfill(candidates, (x, y), 128)
    outside = candidates.point(lambda v: 255 if v == 128 else 0)

    # Soft edge: fully clear at the background colour, fully solid past tolerance + soft
    ramp = dist.point(lambda v: 0 if v <= tolerance else 255 if v >= tolerance + soft else int((v - tolerance) * 255 / soft))
    alpha = ImageChops.lighter(ramp, ImageOps.invert(outside))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    out = im.convert("RGBA")
    out.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        sys.exit(f"{src}: nothing left after removing the background — try a lower --tolerance.")
    pad = max(w, h) // 40
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(w, box[2] + pad), min(h, box[3] + pad))
    out = out.crop(box)

    target = src.with_name(f"{src.stem}-cutout.png")
    out.save(target, "PNG", optimize=True)
    removed = 100 - round(100 * alpha.point(lambda a: 255 if a > 128 else 0).histogram()[255] / (w * h))
    print(f"{target}  {out.width}x{out.height}  background {('#%02x%02x%02x' % bg)} removed ({removed}% of the canvas)")
    return target


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("images", nargs="+", type=Path)
    ap.add_argument("--tolerance", type=int, default=40)
    ap.add_argument("--soft", type=int, default=30)
    args = ap.parse_args()
    for p in args.images:
        cutout(p, args.tolerance, args.soft)


if __name__ == "__main__":
    main()
