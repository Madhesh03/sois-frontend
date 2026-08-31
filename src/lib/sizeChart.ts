/**
 * Ring size reference.
 *
 * `diameterMm` is the ring's inside diameter and `circumferenceMm` the inside
 * circumference — the two measurements a customer can actually take at home.
 * Values follow the standard US ring-size scale (each full US size is roughly
 * 0.4 mm of diameter / 1.3 mm of circumference).
 *
 * Sizes are matched to a product by the `size` strings the backend returns in
 * `size_stock`, so a product only ever shows the rows it actually sells.
 */
export interface RingSize {
  us: string;
  diameterMm: number;
  circumferenceMm: number;
}

export const RING_SIZE_CHART: RingSize[] = [
  { us: "4", diameterMm: 14.9, circumferenceMm: 46.8 },
  { us: "4.5", diameterMm: 15.3, circumferenceMm: 48.0 },
  { us: "5", diameterMm: 15.7, circumferenceMm: 49.3 },
  { us: "5.5", diameterMm: 16.1, circumferenceMm: 50.6 },
  { us: "6", diameterMm: 16.5, circumferenceMm: 51.9 },
  { us: "6.5", diameterMm: 16.9, circumferenceMm: 53.1 },
  { us: "7", diameterMm: 17.3, circumferenceMm: 54.4 },
  { us: "7.5", diameterMm: 17.7, circumferenceMm: 55.7 },
  { us: "8", diameterMm: 18.1, circumferenceMm: 57.0 },
  { us: "8.5", diameterMm: 18.5, circumferenceMm: 58.3 },
  { us: "9", diameterMm: 18.9, circumferenceMm: 59.5 },
  { us: "9.5", diameterMm: 19.4, circumferenceMm: 60.8 },
  { us: "10", diameterMm: 19.8, circumferenceMm: 62.1 },
  { us: "10.5", diameterMm: 20.2, circumferenceMm: 63.4 },
  { us: "11", diameterMm: 20.6, circumferenceMm: 64.6 },
  { us: "12", diameterMm: 21.4, circumferenceMm: 67.2 },
];

/** How to measure, shown alongside the table. */
export const RING_SIZE_TIPS: string[] = [
  "Wrap a strip of paper snugly around the base of your finger, mark where it overlaps, then measure the length in millimetres — that is your circumference.",
  "Measure at the end of the day, when fingers are at their largest.",
  "If you are between sizes, choose the larger one — a ring must pass the knuckle.",
  "Wider bands fit more snugly, so consider going up half a size for a broad band.",
];
