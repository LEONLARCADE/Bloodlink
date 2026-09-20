/**
 * Optional photographic / illustrated hand asset.
 *
 * Drop a transparent-background file named `bleeding-hand.webp` (or .png)
 * into this folder and the hero automatically switches from the built-in
 * vector hand to that image — no code change required. If the file is not
 * present, `HAND_IMAGE_URL` is null and <BleedingHand /> renders its vector
 * fallback. import.meta.glob resolves at build time, so a missing file is
 * simply an empty match, never a build error.
 */
const matches = import.meta.glob("./bleeding-hand.{webp,png,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const HAND_IMAGE_URL = Object.values(matches)[0] ?? null;

/**
 * Where the wound's drip point sits inside the asset box, as a fraction of
 * the box (0–1). The vector hand drips from the middle fingertip at dead
 * centre horizontally. If you swap in an image whose wound sits elsewhere,
 * change only these two numbers and the whole droplet/pool axis realigns.
 */
export const HAND_IMAGE_DRIP = { x: 0.5, y: 0.86 };

/** width / height of the asset box, used to reserve space without layout shift. */
export const HAND_IMAGE_ASPECT = 360 / 560;

export default HAND_IMAGE_URL;