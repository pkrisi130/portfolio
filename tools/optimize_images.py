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
  * saves WebP (quality 80) without metadata

Usage (needs Python 3 and Pillow:  pip install Pillow):
    python3 tools/optimize_images.py                        # everything in originals/
    python3 tools/optimize_images.py projects/goran-bakery  # only one folder
Existing outputs are skipped unless the original is newer.

No Python? Use https://squoosh.app instead: WebP, quality 80, resize the
longest side to 800 and to 1600, and name the files <name>-800.webp /
<name>-1600.webp in images/projects/<project-slug>/.
"""
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
