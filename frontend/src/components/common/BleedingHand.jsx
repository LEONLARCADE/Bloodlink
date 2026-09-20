import {
  HAND_IMAGE_URL,
  HAND_IMAGE_DRIP,
  HAND_IMAGE_ASPECT,
} from "../../assets/handAsset";

/* ──────────────────────────────────────────────────────────────────────────
   Geometry contract shared with <BloodFlowAnimation />.

   The artwork lives in a 360 × 560 viewBox. The wound sits on the back of
   the hand above the middle finger; blood runs down that finger and hangs
   off the fingertip at (180, 470) — dead centre horizontally, 84% down the
   box. Everything downstream (falling droplet, pool, ripples) is aligned to
   this single anchor, which is what makes hand → droplet → pool read as one
   continuous vertical axis.
   ────────────────────────────────────────────────────────────────────────── */
export const HAND_VIEWBOX = { w: 360, h: 560 };
export const HAND_ASPECT = HAND_IMAGE_URL
  ? HAND_IMAGE_ASPECT
  : HAND_VIEWBOX.w / HAND_VIEWBOX.h;
export const HAND_DRIP_ANCHOR = HAND_IMAGE_URL
  ? HAND_IMAGE_DRIP
  : { x: 180 / HAND_VIEWBOX.w, y: 470 / HAND_VIEWBOX.h };

/* Outlines generated from an anatomical layout: four tapered fingers with
   rounded tips and a slight natural splay, an opposed thumb with a thenar
   mass, palm/dorsum and forearm. Kept as data so the shading pass below can
   re-stroke the same shapes for edge shadow and finger separation. */
const PALM =
  "M126,40 C124,92 130,132 136,170 C118,204 110,246 114,292 C116,314 126,330 146,338 " +
  "C180,352 222,350 250,332 C264,322 270,300 268,272 C264,230 250,200 232,170 " +
  "C236,130 240,88 238,40 Z";

const THENAR =
  "M124,236 C106,262 98,296 106,324 C115,352 142,360 156,342 C168,326 162,296 154,270 " +
  "C147,248 138,228 124,236 Z";

const THUMB =
  "M115.5,212.4 C114.3,214.3 110.6,219.9 108.2,223.7 C105.9,227.5 103.5,231.4 101.3,235.2 " +
  "C99.0,239.1 96.8,243.0 94.7,246.9 C92.6,250.8 90.5,254.8 88.5,258.7 C86.5,262.7 84.6,266.7 82.7,270.8 " +
  "C80.8,274.8 79.0,278.9 77.2,283.0 C75.5,287.0 73.8,291.2 72.2,295.3 C70.6,299.4 69.0,303.6 67.5,307.8 " +
  "C66.0,312.0 64.2,316.6 63.1,320.4 C62.0,324.1 60.9,327.1 61.0,330.4 C61.1,333.7 62.0,337.3 63.4,340.3 " +
  "C64.9,343.3 67.3,346.2 70.0,348.2 C72.6,350.2 76.0,351.8 79.3,352.5 C82.5,353.2 86.3,353.1 89.5,352.3 " +
  "C92.7,351.5 96.1,349.9 98.6,347.7 C101.2,345.6 102.8,342.7 104.9,339.6 C107.0,336.6 109.2,332.7 111.4,329.3 " +
  "C113.6,325.8 115.9,322.4 118.1,319.1 C120.4,315.7 122.7,312.4 125.0,309.0 C127.3,305.7 129.6,302.4 131.9,299.2 " +
  "C134.3,295.9 136.6,292.6 139.0,289.4 C141.4,286.2 143.8,283.0 146.2,279.8 C148.6,276.6 151.0,273.4 153.5,270.3 " +
  "C155.9,267.1 158.4,264.0 160.9,260.9 C163.4,257.8 167.3,253.2 168.5,251.6 Z";

const INDEX =
  "M122.3,246.5 C121.8,249.9 120.2,259.9 119.3,266.6 C118.4,273.4 117.6,280.1 116.9,286.9 " +
  "C116.2,293.6 115.5,300.4 115.0,307.2 C114.5,314.0 114.1,320.8 113.8,327.6 C113.5,334.4 113.3,341.2 113.2,348.1 " +
  "C113.1,354.9 113.2,361.8 113.3,368.7 C113.4,375.5 113.6,382.4 114.0,389.3 C114.3,396.2 114.7,403.1 115.2,410.0 " +
  "C115.7,416.9 116.4,426.1 117.0,430.7 C117.6,435.4 117.9,435.9 119.0,438.0 C120.2,440.2 122.0,442.3 124.0,443.7 " +
  "C126.0,445.2 128.5,446.3 130.9,446.7 C133.4,447.2 136.1,447.0 138.5,446.4 C140.9,445.7 143.3,444.4 145.2,442.8 " +
  "C147.0,441.2 148.7,439.0 149.6,436.7 C150.6,434.4 150.7,433.8 151.0,429.3 C151.3,424.7 151.2,415.9 151.4,409.2 " +
  "C151.6,402.6 151.9,395.9 152.3,389.3 C152.6,382.7 153.0,376.1 153.4,369.6 C153.8,363.0 154.3,356.5 154.8,349.9 " +
  "C155.3,343.4 155.8,336.9 156.4,330.4 C157.0,324.0 157.6,317.5 158.3,311.0 C159.0,304.6 159.7,298.2 160.4,291.8 " +
  "C161.2,285.3 162.0,278.9 162.9,272.6 C163.8,266.2 165.3,256.6 165.7,253.5 Z";

const MIDDLE =
  "M157.0,255.5 C156.9,259.1 156.7,269.8 156.6,277.0 C156.5,284.2 156.4,291.4 156.4,298.6 " +
  "C156.4,305.8 156.3,313.0 156.4,320.3 C156.4,327.5 156.5,334.8 156.7,342.1 C156.8,349.3 157.0,356.6 157.2,364.0 " +
  "C157.4,371.3 157.7,378.6 158.1,385.9 C158.4,393.3 158.8,400.6 159.2,408.0 C159.6,415.3 160.0,422.7 160.5,430.1 " +
  "C161.0,437.5 161.4,447.4 162.0,452.4 C162.6,457.4 162.8,457.8 163.9,460.1 C165.1,462.5 167.0,464.7 169.1,466.3 " +
  "C171.1,467.9 173.8,469.1 176.3,469.6 C178.9,470.2 181.8,470.1 184.4,469.5 C186.9,468.8 189.5,467.5 191.5,465.8 " +
  "C193.5,464.2 195.3,461.9 196.4,459.5 C197.5,457.1 197.6,456.6 198.0,451.6 C198.4,446.6 198.5,436.9 198.7,429.5 " +
  "C198.9,422.2 199.2,414.8 199.4,407.5 C199.7,400.2 199.9,392.9 200.2,385.6 C200.4,378.4 200.6,371.1 200.8,363.9 " +
  "C201.0,356.6 201.2,349.4 201.4,342.2 C201.5,335.0 201.7,327.8 201.8,320.6 C202.0,313.4 202.1,306.3 202.2,299.1 " +
  "C202.4,292.0 202.5,284.9 202.6,277.8 C202.7,270.6 202.9,260.0 203.0,256.5 Z";

const RING =
  "M194.5,253.4 C194.7,256.8 195.3,267.2 195.7,274.1 C196.1,281.0 196.4,287.8 196.8,294.7 " +
  "C197.1,301.6 197.4,308.5 197.7,315.4 C198.1,322.3 198.4,329.2 198.7,336.1 C199.0,343.0 199.3,349.9 199.6,356.8 " +
  "C199.9,363.7 200.3,370.6 200.6,377.5 C200.9,384.4 201.2,391.3 201.5,398.2 C201.8,405.1 202.0,412.0 202.3,418.9 " +
  "C202.6,425.8 202.6,434.9 203.0,439.6 C203.4,444.3 203.5,444.8 204.5,447.0 C205.5,449.3 207.2,451.5 209.1,453.1 " +
  "C211.0,454.6 213.5,455.9 215.9,456.5 C218.3,457.1 221.0,457.1 223.4,456.7 C225.8,456.2 228.4,455.0 230.3,453.5 " +
  "C232.3,452.0 234.0,449.9 235.2,447.7 C236.3,445.5 236.5,445.1 237.0,440.4 C237.5,435.6 238.0,426.3 238.4,419.3 " +
  "C238.8,412.3 239.2,405.3 239.5,398.3 C239.8,391.2 240.1,384.2 240.3,377.2 C240.5,370.2 240.7,363.1 240.8,356.1 " +
  "C240.9,349.1 240.9,342.0 240.8,335.0 C240.8,328.0 240.7,320.9 240.5,313.9 C240.3,306.9 240.1,299.8 239.8,292.8 " +
  "C239.5,285.8 239.1,278.7 238.8,271.7 C238.4,264.7 237.7,254.1 237.5,250.6 Z";

const PINKY =
  "M229.7,246.7 C230.0,249.2 231.1,256.5 231.7,261.5 C232.3,266.5 232.9,271.5 233.4,276.6 " +
  "C233.9,281.7 234.4,286.8 234.9,292.0 C235.3,297.2 235.7,302.4 236.1,307.7 C236.5,313.0 236.9,318.4 237.2,323.8 " +
  "C237.6,329.2 237.9,334.6 238.2,340.1 C238.4,345.7 238.7,351.2 238.9,356.9 C239.1,362.5 239.2,368.2 239.3,373.9 " +
  "C239.4,379.6 239.3,387.3 239.5,391.3 C239.7,395.2 239.8,395.7 240.6,397.6 C241.5,399.6 242.8,401.5 244.4,402.9 " +
  "C246.0,404.3 248.1,405.4 250.1,406.0 C252.1,406.5 254.5,406.6 256.5,406.3 C258.6,405.9 260.8,405.0 262.5,403.8 " +
  "C264.2,402.5 265.7,400.8 266.7,398.9 C267.7,397.1 267.9,396.7 268.5,392.7 C269.0,388.7 269.6,380.8 270.1,374.8 " +
  "C270.6,368.9 271.0,363.1 271.3,357.2 C271.6,351.4 271.9,345.6 272.1,339.9 C272.2,334.1 272.3,328.4 272.3,322.7 " +
  "C272.3,317.1 272.3,311.5 272.1,305.9 C271.9,300.3 271.7,294.8 271.4,289.3 C271.0,283.8 270.6,278.4 270.1,273.0 " +
  "C269.6,267.6 269.0,262.3 268.4,257.0 C267.8,251.7 266.7,243.9 266.3,241.3 Z";

const SHAPES = [PALM, THENAR, THUMB, PINKY, RING, INDEX, MIDDLE];

/** Blood runs from the wound straight down the middle finger to the tip. */
const BLOOD_TRAIL =
  "M178,228 C172,262 173,300 175,340 C177,382 178,424 180,458";

/**
 * Bleeding hand — the fixed origin point of the whole scroll animation.
 *
 * `dripPhase` (0–1) swells the pendant droplet still attached to the
 * fingertip; `dripOpacity` fades it out at the moment it detaches. Neither
 * moves the hand itself — the hand is the source, the droplet is what
 * travels.
 */
export function BleedingHand({ dripPhase = 0, dripOpacity = 1, className = "" }) {
  if (HAND_IMAGE_URL) {
    return (
      <img
        src={HAND_IMAGE_URL}
        alt=""
        aria-hidden="true"
        draggable="false"
        className={`block w-full h-auto select-none bl-hand-art ${className}`}
      />
    );
  }

  const swell = 0.55 + dripPhase * 0.75; // pendant drop grows before release
  const stretch = 1 + dripPhase * 0.9;
  const pendant = `translate(0 ${(dripPhase * 10).toFixed(2)}) translate(180 452) scale(1 ${stretch.toFixed(3)}) translate(-180 -452)`;

  return (
    <svg
      viewBox="0 0 360 560"
      className={`block w-full h-auto overflow-visible bl-hand-art ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="blSkin" x1="0.15" y1="0" x2="0.95" y2="1">
          <stop offset="0%" stopColor="#fae0cd" />
          <stop offset="38%" stopColor="#f0c6ab" />
          <stop offset="78%" stopColor="#dda98b" />
          <stop offset="100%" stopColor="#c68d70" />
        </linearGradient>

        <linearGradient id="blSleeve" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#eef1f5" />
          <stop offset="100%" stopColor="#d5dae1" />
        </linearGradient>

        <linearGradient id="blNail" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffeadd" />
          <stop offset="100%" stopColor="#e9b79c" />
        </linearGradient>

        <linearGradient id="blBlood" x1="0.3" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e11d2f" />
          <stop offset="60%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#8f0b20" />
        </linearGradient>

        <radialGradient id="blDropShine" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#ff8a8a" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#d61f36" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8f0b20" stopOpacity="0" />
        </radialGradient>

        <filter id="blSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="blSofter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="blCast" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#7c2d12" floodOpacity="0.18" />
        </filter>

        <clipPath id="blHandClip">
          {SHAPES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>

      <g filter="url(#blCast)">
        {/* ── flat skin base ─────────────────────────────────────────── */}
        {SHAPES.map((d, i) => (
          <path key={`base-${i}`} d={d} fill="url(#blSkin)" />
        ))}

        {/* ── modelling: everything below is clipped to the silhouette ─ */}
        <g clipPath="url(#blHandClip)">
          {/* ambient shadow down the ulnar (right) side */}
          <path
            d="M232,120 C268,200 288,300 274,470 L360,470 L360,60 Z"
            fill="#a8664a"
            opacity="0.34"
            filter="url(#blSoft)"
          />
          {/* rim light down the radial (left) side */}
          <path
            d="M128,60 C108,180 96,300 104,470 L60,470 L60,60 Z"
            fill="#fff3e8"
            opacity="0.4"
            filter="url(#blSoft)"
          />

          {/* contact shadow where each finger meets the next — re-stroking
              the real outlines gives true separation, not fake lines */}
          <g fill="none" stroke="#a4654c" strokeWidth="7" opacity="0.42" filter="url(#blSofter)">
            {SHAPES.map((d, i) => (
              <path key={`sep-${i}`} d={d} />
            ))}
          </g>

          {/* knuckle volumes */}
          <g fill="#ffe3cd" opacity="0.5" filter="url(#blSoft)">
            <ellipse cx="136" cy="262" rx="15" ry="10" />
            <ellipse cx="180" cy="267" rx="16" ry="11" />
            <ellipse cx="219" cy="263" rx="15" ry="10" />
            <ellipse cx="250" cy="253" rx="12" ry="9" />
          </g>

          {/* extensor tendons running back to the wrist */}
          <g fill="none" stroke="#cf9576" strokeWidth="5" strokeLinecap="round" opacity="0.3" filter="url(#blSofter)">
            <path d="M140,262 C148,232 156,210 160,190" />
            <path d="M180,266 C180,234 180,210 180,190" />
            <path d="M219,262 C214,232 206,210 200,190" />
            <path d="M250,252 C240,226 226,208 216,192" />
          </g>

          {/* thenar mass + web-space shadow */}
          <ellipse cx="126" cy="296" rx="34" ry="46" fill="#ffe1c9" opacity="0.38" filter="url(#blSoft)" />
          <path
            d="M136,244 C124,262 118,282 120,300 C106,292 104,266 116,244 Z"
            fill="#a8664a"
            opacity="0.4"
            filter="url(#blSofter)"
          />

          {/* wrist creases */}
          <g fill="none" stroke="#c48d6e" strokeWidth="3" strokeLinecap="round" opacity="0.34">
            <path d="M142,176 C166,186 202,186 226,176" />
            <path d="M146,188 C168,196 200,196 222,188" />
          </g>

          {/* finger joint creases */}
          <g fill="none" stroke="#c48d6e" strokeWidth="2.5" strokeLinecap="round" opacity="0.28">
            <path d="M118,344 C128,350 142,349 152,343" />
            <path d="M157,362 C168,368 188,367 200,361" />
            <path d="M199,352 C209,358 228,357 239,351" />
            <path d="M238,318 C246,323 262,322 271,316" />
          </g>

          {/* forearm sleeve cuff — crops the arm cleanly at the top edge */}
          <g>
            <path
              d="M96,-10 L266,-10 L266,86 C240,102 200,108 180,108 C160,108 120,102 96,86 Z"
              fill="url(#blSleeve)"
            />
            <path
              d="M96,84 C126,102 160,108 180,108 C200,108 236,102 266,84 L266,98 C236,116 200,122 180,122 C160,122 126,116 96,98 Z"
              fill="#c3cad3"
              opacity="0.55"
            />
            <path
              d="M96,96 C126,116 160,122 180,122 C200,122 236,116 266,96 L266,124 L96,124 Z"
              fill="#8a5c46"
              opacity="0.35"
              filter="url(#blSofter)"
            />
          </g>
        </g>

        {/* ── fingernails ────────────────────────────────────────────── */}
        <g stroke="#d49d80" strokeWidth="1.4" opacity="0.92">
          <ellipse cx="134" cy="412" rx="10" ry="13" fill="url(#blNail)" transform="rotate(-4 134 412)" />
          <ellipse cx="180" cy="434" rx="10.5" ry="13.5" fill="url(#blNail)" />
          <ellipse cx="220" cy="422" rx="10" ry="13" fill="url(#blNail)" transform="rotate(4 220 422)" />
          <ellipse cx="254" cy="374" rx="8.5" ry="11" fill="url(#blNail)" transform="rotate(7 254 374)" />
          <ellipse cx="91" cy="315" rx="11" ry="13.5" fill="url(#blNail)" transform="rotate(-28 91 315)" />
        </g>

        {/* ── the wound, on the back of the hand above the middle finger ─ */}
        <g clipPath="url(#blHandClip)">
          {/* bruised halo */}
          <ellipse cx="182" cy="226" rx="30" ry="20" fill="#9d1b2e" opacity="0.2" filter="url(#blSoft)" />
          {/* open cut */}
          <path
            d="M164,236 C173,224 188,213 203,207 C199,220 187,232 172,240 C168,241 165,239 164,236 Z"
            fill="url(#blBlood)"
          />
          <path
            d="M170,233 C178,223 189,215 198,211 C194,219 185,227 175,234 Z"
            fill="#6d0716"
            opacity="0.85"
          />
          {/* fresh blood welling out of the cut */}
          <path
            d="M160,234 C150,248 155,266 168,263 C181,260 188,245 183,232 C176,238 167,239 160,234 Z"
            fill="url(#blBlood)"
            opacity="0.92"
          />

          {/* trail running down the middle finger to the fingertip */}
          <path d={BLOOD_TRAIL} fill="none" stroke="#8f0b20" strokeWidth="17" strokeLinecap="round" opacity="0.22" filter="url(#blSofter)" />
          <path d={BLOOD_TRAIL} fill="none" stroke="url(#blBlood)" strokeWidth="10" strokeLinecap="round" />
          <path d={BLOOD_TRAIL} fill="none" stroke="#ff6b7a" strokeWidth="2.4" strokeLinecap="round" opacity="0.35" />
          <ellipse cx="174" cy="308" rx="7" ry="9" fill="url(#blBlood)" />
          <ellipse cx="177" cy="392" rx="6" ry="8" fill="url(#blBlood)" />
        </g>

        {/* ── pendant droplet, still attached to the fingertip ────────── */}
        <g opacity={dripOpacity} transform={pendant}>
          <path
            d={`M180,452 C${180 - 9 * swell},462 ${180 - 10 * swell},${470 + 10 * swell} 180,${
              478 + 16 * swell
            } C${180 + 10 * swell},${470 + 10 * swell} ${180 + 9 * swell},462 180,452 Z`}
            fill="url(#blBlood)"
          />
          <ellipse cx="176" cy={470 + 6 * swell} rx={4 * swell} ry={5 * swell} fill="url(#blDropShine)" />
        </g>
      </g>
    </svg>
  );
}

export default BleedingHand;