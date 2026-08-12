# 🎨 Appearance Folder — Custom Player Head & Hair Guide

This folder lets you replace the built-in player avatar with **your own images**
(the head model and all haircuts). The game loads them through
`Appearance/manifest.js`.

> ⚠️ The game only uses your images when `enabled: true` in `manifest.js` and the
> files exist. Before that, it renders the simple built-in flat SVG head.

---

## 1. Folder structure (create these)

```
Appearance/
├── manifest.js          ← the configuration (edit this)
├── README.md            ← this file
├── head/
│   └── head.png         ← your head model (REQUIRED to enable custom mode)
│   └── tone_*.png       ← OPTIONAL per-skin-tone heads (see below)
└── hairs/
    └── short_fade.png   ← your haircuts, named freely (paths are set in the manifest)
    └── ...
```

You do NOT need to keep these exact file names — you can name files anything and
point the manifest at them. The only file that must keep its name is
`manifest.js`.

---

## 2. Image format & canvas requirements

| Property | Requirement |
|---|---|
| Format | **PNG with transparency** (24-bit + alpha). JPG works but looks worse (no transparency). |
| Aspect ratio | **5 : 6 portrait** (width : height). Example: `500 × 600 px`, `400 × 480 px`. |
| Recommended size | `500 × 600 px` or larger (2x for sharp displays, e.g. 1000 × 1200). |
| Head position | The face/head should occupy roughly the **upper 60%** of the canvas, centered horizontally. |
| Bottom part | Optional shoulders/shirt may occupy the bottom ~20% (the card shows the avatar in a 5:6 box). |
| Background | Must be fully transparent (PNG alpha). The game never draws a background behind your images. |
| Style | Match the flat/minimal style of the rest of the UI for the best look. |

The avatar is displayed at two sizes: ~100×120 px in the creation studio and
~120×144 px on the dashboard card. Your image is scaled to fit (`object-fit: contain`),
so high resolution is recommended.

---

## 3. Enabling custom mode — step by step

1. Put your head image at `Appearance/head/head.png` (or any path you like).
2. Put your haircut images in `Appearance/hairs/` (or anywhere).
3. Open `Appearance/manifest.js` and:
   - set `enabled: true`
   - set `head.base` to your head file path
   - add one entry per haircut in the `hairs` array
4. Refresh the game (hard refresh — Ctrl/Cmd+Shift+R) and open **Player Creation →
   🎨 Appearance**. You should see your head with your haircuts.

---

## 4. The `hairs` array — how your haircuts are mapped

The game has **35 built-in hair styles**. Your `hairs` array maps **by index**
to those styles — entry `0` = "Short Fade", entry `1` = "Buzz Cut", etc.:

| # | Style name | # | Style name |
|---|---|---|---|
| 0 | Short Fade | 18 | Mullet |
| 1 | Buzz Cut | 19 | Shaggy Crop |
| 2 | Spiky Top | 20 | Caesar Cut |
| 3 | Afro Puff | 21 | Frohawk |
| 4 | Dreadlocks | 22 | Flat Top |
| 5 | Side Part | 23 | Long Waves |
| 6 | Man Bun | 24 | Taper Fade |
| 7 | Ponytail | 25 | Retro Dreads |
| 8 | Curly Top | 26 | Half Knot |
| 9 | Braids / Cornrows | 27 | Surfer Hair |
| 10 | Undercut | 28 | Spiky Mohawk |
| 11 | Mohawk | 29 | Curly Afro |
| 12 | Slick Back | 30 | Pompadour |
| 13 | Bowl Cut | 31 | Textured Crop |
| 14 | Top Knot | 32 | Twin Braids |
| 15 | Wavy Fringe | 33 | Bald / Shaved |
| 16 | Messy Locks | 34 | Golden Locks |
| 17 | High Top Fade | | |

Example — you only made 4 haircuts:
```js
hairs: [
  { name: "Short Fade", file: "Appearance/hairs/my_fade.png" },
  { name: "Buzz Cut",   file: "Appearance/hairs/my_buzz.png" },
  { name: "Mohawk",     file: "Appearance/hairs/my_mohawk.png" },
  { name: "Bald / Shaved", file: "Appearance/hairs/my_bald.png" }
]
```
Styles 0–3 get your images; styles 4–34 automatically fall back to the
built-in simple hair shapes. The `name` field is only documentation — the game
uses the position in the array.

---

## 5. Hair drawing rules (for your artist)

- Hair image should be drawn to cover the top of the head exactly like a real
  cut. It is layered **on top of** the head image, so it may extend beyond the
  head outline (e.g. afros, spikes, long hair) — that's fine.
- The hair image occupies the **same 5:6 canvas** as the head image — draw your
  hair in the same coordinate space so it lines up perfectly with the head.
- Keep the hair's bottom edge transparent where it shouldn't cover the face
  (e.g. fade sides must not cover the eyes/ears).
- ⚠️ One image per style: the game re-colors your hair with a CSS filter to
  match the 12 hair colors the player picks in the studio. If you want a style
  to keep its exact original colors (e.g. an ombré or dyed design), add
  `tint: false` to that entry.

---

## 6. Skin tones (7 tones used by the game)

The studio has these exact skin tone values (the player picks one):

```
#f3c299  #e0ac69  #d19261  #ab6528  #704423  #4c2b11  #2b1404
```

**Option A (recommended): one head image per tone.** Put them in
`head.tones` keyed by hex:
```js
head: {
  base: "Appearance/head/head.png",
  tones: {
    "#f3c299": "Appearance/head/tone_f3c299.png",
    "#e0ac69": "Appearance/head/tone_e0ac69.png",
    "#d19261": "Appearance/head/tone_d19261.png",
    "#ab6528": "Appearance/head/tone_ab6528.png",
    "#704423": "Appearance/head/tone_704423.png",
    "#4c2b11": "Appearance/head/tone_4c2b11.png",
    "#2b1404": "Appearance/head/tone_2b1404.png"
  }
}
```
The game then uses the matching file with **no color filter** — pixel perfect.

**Option B: one head image, auto-tinted.** If a tone has no file, the game
approximates it with a CSS filter (sepia + hue-rotate + brightness) applied to
`head.base`. Good for testing; per-tone images look better.

---

## 7. Hair colors (12 shades used by the game)

```
#090909  #1d110a  #3d2314  #5c3317  #84471e  #b58c56
#d8a25c  #f4d081  #be4e13  #7a2b11  #221204  #2c1608
```

Hair images are auto-tinted toward the selected color with the same CSS-filter
technique, unless the entry has `tint: false`.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| I still see the old head | `enabled` is `false`, or the path in `head.base` is wrong, or you need a hard refresh (Ctrl/Cmd+Shift+R). |
| Images don't appear | Check the browser console (F12) for 404 errors; paths in the manifest are relative to `index.html`. |
| Hair doesn't line up with the head | Draw hair and head in the same 5:6 canvas coordinate space. |
| Skin tone looks wrong | Provide per-tone head images in `head.tones` (Option A). |
| Hair colors look wrong | Add `tint: false` to that hair entry if it should keep its own colors. |
| A style shows the old simple hair | You didn't provide a file for that index — provide one or accept the fallback. |

---

## 9. How it works (for curious devs)

`js/app.js` → `buildAvatarMarkup()` checks `window.APPEARANCE_MANIFEST`; if
`enabled` and a `head.base` exist, it calls `buildCustomAvatarMarkup()`, which
layers `<img>` elements (head under hair) inside the avatar container and
applies CSS `filter` tints via `_toneFilter()`. If a hair index has no custom
file, `_hairPath()` renders the built-in SVG hair shape instead. The dashboard
card and creation studio both use the same pipeline automatically.
