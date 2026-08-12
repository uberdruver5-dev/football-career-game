/**
 * ============================================================
 *  APPEARANCE MANIFEST — Custom player head & hair images
 * ============================================================
 *  This file tells the game where your custom player model
 *  images live. Put your PNG images inside this folder
 *  (sub-folders recommended: Appearance/head/ and
 *  Appearance/hairs/), then set "enabled" to true.
 *
 *  IMPORTANT: paths are relative to index.html (game root),
 *  so they always start with "Appearance/...".
 *
 *  Full documentation: open Appearance/README.md
 * ============================================================
 */
window.APPEARANCE_MANIFEST = {
  // Set to true ONLY when your images are in place and named
  // exactly as listed below. While false, the game uses the
  // simple built-in flat SVG head.
  enabled: false,

  // ---- HEAD IMAGE ---------------------------------------------------
  // "base": the main head image (must include face + skin + neck).
  //         Recommended: PNG with transparency, portrait 5:6 ratio
  //         (e.g. 500x600 px), head occupying the upper ~60% of the
  //         canvas, shoulders optional in the bottom part.
  //
  // "tones" (OPTIONAL but recommended for exact skin tones):
  //   If you provide one image per skin tone, keyed by the EXACT
  //   hex values below, the game uses them as-is (no color filter).
  //   If a tone is missing, the game auto-tints "base" with a CSS
  //   filter approximation — good enough, but per-tone images look
  //   best.
  head: {
    base: "Appearance/head/head.png",
    // tones: {
    //   "#f3c299": "Appearance/head/tone_f3c299.png",
    //   "#e0ac69": "Appearance/head/tone_e0ac69.png",
    //   "#d19261": "Appearance/head/tone_d19261.png",
    //   "#ab6528": "Appearance/head/tone_ab6528.png",
    //   "#704423": "Appearance/head/tone_704423.png",
    //   "#4c2b11": "Appearance/head/tone_4c2b11.png",
    //   "#2b1404": "Appearance/head/tone_2b1404.png"
    // }
  },

  // ---- HAIR IMAGES --------------------------------------------------
  // The list maps BY INDEX to the game's 35 built-in hair styles:
  //   0 Short Fade, 1 Buzz Cut, 2 Spiky Top, 3 Afro Puff,
  //   4 Dreadlocks, 5 Side Part, 6 Man Bun, 7 Ponytail,
  //   8 Curly Top, 9 Braids / Cornrows, 10 Undercut, 11 Mohawk,
  //   12 Slick Back, 13 Bowl Cut, 14 Top Knot, 15 Wavy Fringe,
  //   16 Messy Locks, 17 High Top Fade, 18 Mullet, 19 Shaggy Crop,
  //   20 Caesar Cut, 21 Frohawk, 22 Flat Top, 23 Long Waves,
  //   24 Taper Fade, 25 Retro Dreads, 26 Half Knot, 27 Surfer Hair,
  //   28 Spiky Mohawk, 29 Curly Afro, 30 Pompadour, 31 Textured Crop,
  //   32 Twin Braids, 33 Bald / Shaved, 34 Golden Locks
  //
  // You may provide fewer than 35 files: any style without a file
  // automatically falls back to the built-in simple hair shape.
  //
  // Optional per-hair flag:  tint: false  → never color-filter this
  // hair (use the image's own colors exactly).
  hairs: [
    // { name: "Short Fade", file: "Appearance/hairs/short_fade.png" },
    // { name: "Buzz Cut", file: "Appearance/hairs/buzz_cut.png" },
    // { name: "Spiky Top", file: "Appearance/hairs/spiky_top.png" },
    // { name: "Afro Puff", file: "Appearance/hairs/afro_puff.png" },
    // ... one entry per style you provide ...
  ]
};
