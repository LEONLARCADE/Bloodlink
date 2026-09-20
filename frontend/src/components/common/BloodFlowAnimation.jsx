import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useLoopedScrollProgress from "../../hooks/useLoopedScrollProgress";
import useScrollDepth from "../../hooks/useScrollDepth";
import BleedingHand, { HAND_ASPECT, HAND_DRIP_ANCHOR } from "./BleedingHand";

/* ── maths helpers ───────────────────────────────────────────────────────── */
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const norm = (v, a, b) => (b === a ? 0 : clamp((v - a) / (b - a)));
const easeOut = (t) => 1 - (1 - t) ** 3;
const gravity = (t) => t * t * 0.78 + t * 0.22; // accelerating fall
const arc = (t) => Math.sin(Math.PI * t); // 0 → 1 → 0

/**
 * Whole-frame state as a pure function of looped scroll progress p ∈ [0,1).
 * Nothing runs on a timer, so motion tracks the wheel exactly and freezes
 * the instant scrolling stops. Every value is ~0 at p=0 and p→1, which is
 * what makes the loop back to HOME invisible instead of a hard reset.
 *
 *   0.00–0.10  blood gathers at the fingertip
 *   0.10–0.13  the droplet detaches
 *   0.10–0.60  it falls down the central axis (HOME → … → CONTACT US)
 *   0.60       impact in the pool
 *   0.60–0.80  first concentric ripple
 *   0.61–0.84  secondary droplet rebounds and falls back
 *   0.84–0.99  second, subtler ripple
 *   0.90–1.00  pool recedes and the cycle returns to HOME
 */
function frame(p, reduced) {
  if (reduced) {
    return {
      dripPhase: 0.5,
      dripOpacity: 1,
      fall: 0,
      dropOpacity: 0,
      dropStretch: 1,
      poolOpacity: 0.55,
      poolScale: 1,
      ripple1: { scale: 1, opacity: 0.18 },
      ripple2: { scale: 0, opacity: 0 },
      rebound: { lift: 0, opacity: 0 },
    };
  }

  const gather = norm(p, 0, 0.1);
  const ft = norm(p, 0.1, 0.6);
  const r1 = norm(p, 0.6, 0.8);
  const r2 = norm(p, 0.84, 0.99);
  const rb = norm(p, 0.61, 0.84);
  const poolIn = norm(p, 0.3, 0.58);
  const poolOut = 1 - norm(p, 0.9, 1);

  return {
    dripPhase: gather,
    dripOpacity: 1 - norm(p, 0.1, 0.13),
    fall: gravity(ft),
    dropOpacity: norm(p, 0.1, 0.14) * (1 - norm(p, 0.58, 0.6)),
    // stretches as it accelerates, squashes just before it lands
    dropStretch: 1 + 1.35 * ft * ft - 0.55 * norm(p, 0.55, 0.6),
    poolOpacity: (0.25 + 0.6 * poolIn) * poolOut * norm(p, 0.28, 0.34),
    poolScale: 0.72 + 0.28 * easeOut(poolIn),
    ripple1: { scale: 0.2 + 1.5 * easeOut(r1), opacity: arc(r1) * 0.55 },
    ripple2: { scale: 0.15 + 0.95 * easeOut(r2), opacity: arc(r2) * 0.38 },
    rebound: {
      lift: arc(rb),
      opacity: rb > 0 && rb < 1 ? Math.min(1, rb * 12) * Math.min(1, (1 - rb) * 8) : 0,
    },
  };
}

/** Small blood droplet used for both the falling drop and the rebound. */
function Droplet({ size = 18 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="blFallGrad" x1="0.3" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e11d2f" />
          <stop offset="65%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#8f0b20" />
        </linearGradient>
      </defs>
      <path d="M10 0 C13 9 19 14 19 19 A9 9 0 0 1 1 19 C1 14 7 9 10 0 Z" fill="url(#blFallGrad)" />
      <ellipse cx="7" cy="18" rx="2.6" ry="3.4" fill="#ff8f9b" opacity="0.5" />
    </svg>
  );
}

export function BloodFlowAnimation() {
  const p = useLoopedScrollProgress(1500);
  const depth = useScrollDepth(1);
  const reduced = usePrefersReducedMotion();
  const s = frame(p, reduced);

  // The hand never moves — it only steps back once the reader reaches the
  // content below the hero, so the copy always stays legible.
  const handOpacity = reduced ? 1 : 1 - 0.78 * easeOut(depth);

  const stageVars = {
    "--bl-hand-h": `calc(var(--bl-hand-w) / ${HAND_ASPECT})`,
    "--bl-drip-y": `calc(var(--bl-hand-top) + var(--bl-hand-h) * ${HAND_DRIP_ANCHOR.y})`,
    "--bl-drip-x": `calc(50% + var(--bl-hand-w) * ${HAND_DRIP_ANCHOR.x - 0.5})`,
  };

  const travel = `calc((var(--bl-pool-y) - var(--bl-drip-y)) * ${s.fall.toFixed(4)})`;

  return (
    <div className="bl-stage" style={stageVars} aria-hidden="true">
      {/* soft cinematic glow keeping the hand anchored to the centre axis */}
      <div className="bl-glow" style={{ opacity: 0.55 * handOpacity }} />

      {/* ── the hand: centred, large, the origin of everything ────────── */}
      <div className="bl-hand" style={{ opacity: handOpacity }}>
        <BleedingHand dripPhase={s.dripPhase} dripOpacity={s.dripOpacity} />
      </div>

      {/* ── the travelling droplet, locked to the wound's vertical axis ── */}
      <div
        className="bl-drop"
        style={{ opacity: s.dropOpacity, transform: `translate3d(-50%, ${travel}, 0)` }}
      >
        <div
          style={{
            transform: `scaleY(${s.dropStretch.toFixed(3)}) scaleX(${(
              1 / Math.sqrt(Math.max(0.35, s.dropStretch))
            ).toFixed(3)})`,
            transformOrigin: "50% 0%",
          }}
        >
          <Droplet size={20} />
        </div>
      </div>

      {/* ── the pool at the foot of the axis ───────────────────────────── */}
      <div className="bl-pool" style={{ opacity: s.poolOpacity }}>
        <div className="bl-pool-body" style={{ transform: `scale(${s.poolScale.toFixed(3)})` }} />
        <div
          className="bl-ripple"
          style={{
            opacity: s.ripple1.opacity,
            transform: `translate(-50%, -50%) scale(${s.ripple1.scale.toFixed(3)})`,
          }}
        />
        <div
          className="bl-ripple bl-ripple--soft"
          style={{
            opacity: s.ripple2.opacity,
            transform: `translate(-50%, -50%) scale(${s.ripple2.scale.toFixed(3)})`,
          }}
        />
      </div>

      {/* ── secondary droplet thrown up by the impact ──────────────────── */}
      <div
        className="bl-rebound"
        style={{
          opacity: s.rebound.opacity,
          transform: `translate3d(-50%, calc(var(--bl-bounce) * ${(-s.rebound.lift).toFixed(4)}), 0)`,
        }}
      >
        <Droplet size={11} />
      </div>
    </div>
  );
}

export default BloodFlowAnimation;