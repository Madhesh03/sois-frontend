# SOIS — Photography Specification

Hand this to the photographer before the shoot. All sizes are derived from the
live site CSS, sized for 2× (retina) display at a 1920px-wide desktop.

---

## 1. The one rule that matters most

**Every image on the site is cropped by the browser using `object-fit: cover`.**
The same photo gets shown in portrait, landscape *and* square boxes depending on
the slot and the device. Nothing is letterboxed — the frame is filled and the
overflow is cut off.

So: **shoot loose.** Leave 12–15% empty margin around the product/subject on all
four sides, and keep the product centred. That way a square crop, a 3:4 crop and
a 5:4 crop all still contain the whole piece.

Shoot at full sensor resolution. Deliver wider than the final crop. Do not
deliver pre-tightened frames.

---

## 2. Delivery sizes by slot

| Slot | Aspect ratio | Deliver at | Notes |
|---|---|---|---|
| **Product photos** (cards, listing, product page) | **4:5 portrait** | **2400 × 3000 px** | The primary spec. Most of the shoot is this. |
| **Category tiles** (8 images: Rings, Earrings, Necklaces, Pendants, Bracelets, Sets, Gift Box, All Products) | **5:4 landscape** | **2000 × 1600 px** | Bottom 40% carries a dark gradient + white label text — keep it visually quiet. |
| **Homepage hero** (3 slides) | **3:4 tall portrait** | **2400 × 3200 px** | Crop is anchored to the **top** of the frame and slowly zooms in 8%. Keep the face/jewellery in the upper 60%; leave headroom at the top edge. |
| **"Styled for Every Occasion"** (lifestyle carousel) | **4:5 portrait** | **1600 × 2000 px** | Also crops to **3:4** on mobile (loses ~6% off each side). Keep the subject off the side edges. |
| **Our Story / Craftsmanship** (2 images) | **3:2 landscape** | **2400 × 1600 px** | These sit in a wide box (~830 × 560 px on desktop, and only 280 px tall on mobile). A portrait shot here gets almost entirely cropped away. |
| **Full-width editorial banner** (optional / future) | **16:5 ultra-wide** | **3840 × 1200 px** | Darkened ~55% with a large centred headline over it. Mood shot — centre must stay uncluttered. |

### Product page gallery
The product page shows a large 4:5 image plus a row of **80 × 80 px square**
thumbnails, and site search shows **54 × 54 px squares**. These are square
centre-crops of the same 4:5 master — another reason the product must be centred
in frame.

Shoot **at least 4 frames per SKU** to fill the gallery:
1. Hero / straight-on
2. 45° angle
3. Macro detail (clasp, hallmark, stone setting, texture)
4. On-model or on-hand, for scale

---

## 3. Technical delivery

- **Colour space: sRGB (IEC61966-2.1), embedded.** Not Adobe RGB, not ProPhoto —
  silver goes flat or blue-grey on the web when converted from a wide gamut.
- **Format:** retouched masters as 16-bit **TIFF or PSD** for archive, plus
  **JPEG quality 90+** (or PNG for anything needing transparency) for handoff.
  Do **not** deliver WebP or AVIF — the website generates those automatically.
- **No baked-in sharpening for web** and no downsizing. Full-size masters only;
  the site resizes per device.
- **Bit depth / raw:** keep and hand over the RAW files.

### Backgrounds
- **Product / catalogue shots:** seamless pure white `#FFFFFF`. The card sits on
  a very light grey (`#F3F4F6`), so a clean white sweep reads as floating.
- **Category tiles and lifestyle:** the brand palette is deep forest green and
  sage. Warm neutrals, off-white `#FAFAFA`, soft sage and deep green backdrops
  all sit correctly against the site.
- Keep lighting consistent across the whole catalogue — mismatched white balance
  between SKUs is very visible in a 4-across grid.

### File naming
Name by SKU/product slug, then frame number, e.g.
`crescent-moon-pendant-01.jpg`, `crescent-moon-pendant-02.jpg`. Category tiles as
`category-rings.jpg`, `category-earrings.jpg`, etc. The site will reference these
names directly.

---

## 4. Quick summary to text the photographer

> Portrait **4:5** for all product shots, delivered at **2400 × 3000 px**,
> sRGB, JPEG q90+ plus RAW. Product centred with ~15% margin all round —
> the site crops to square and 3:4 as well. Minimum 4 frames per product:
> front, 45°, macro detail, on-model.
> Separately: 8 category images in **5:4 landscape at 2000 × 1600**,
> 3 hero images in **3:4 portrait at 2400 × 3200** (subject in the top 60%),
> and 2 story images in **3:2 landscape at 2400 × 1600**.
> Seamless white for product, brand neutrals/sage/forest green for lifestyle.

---

## 5. After the shoot (for us, not the photographer)

Images currently come from Unsplash URLs in [src/lib/data.ts](src/lib/data.ts).
Once the real photos land, drop them in [public/](public/) and replace the `I`
map in that file with local paths. The `remotePatterns` entries in
[next.config.ts](next.config.ts) can then be removed.
