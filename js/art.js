/* ============================================================
   美术层：全部资源为代码绘制的内联 SVG
   风格：2D 简约手绘国风 / 低饱和 / 卡通治愈
   说明：不使用任何真实人物照片或写实建模，人物均为原创卡通形象
   ============================================================ */

const PALETTE = {
  red: '#A62B2B', redDeep: '#7C1D1D', redSoft: '#C85A4C',
  cream: '#F6F0E2', creamDeep: '#E4D8BC',
  amber: '#E3C177', amberDeep: '#C79F49',
  teal: '#245059', tealSoft: '#4C7C7A', tealLight: '#7FA6A2',
  ink: '#2F2A24', inkSoft: '#6B6053',
  skin: '#F0D3B4', skinShade: '#DDB68E',
  cloth: '#9AA98F', clothDeep: '#6E7F66',
  snow: '#EDF3F4', grass: '#BFCB92'
};

const starPath = 'M50 8 L59.7 36.7 L89.9 37 L65.7 55.1 L74.7 84 L50 66.5 L25.3 84 L34.3 55.1 L10.1 37 L40.3 36.7 Z';

function _redStar(x, y, r, fill, stroke) {
  const s = r / 50;
  return `<g transform="translate(${x - 50 * s},${y - 50 * s}) scale(${s})">
    <path d="${starPath}" fill="${fill || PALETTE.red}" stroke="${stroke || PALETTE.amberDeep}" stroke-width="3"/>
  </g>`;
}

const ART = {

  /* ==================== 道具 / 通用图标 ==================== */
  icons: {
    star: () => `<svg viewBox="0 0 100 100"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amberDeep}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,

    heart: () => `<svg viewBox="0 0 100 100">
      <path d="M50 84 C22 64 14 46 18 33 C22 20 36 16 46 24 L50 28 L54 24 C64 16 78 20 82 33 C86 46 78 64 50 84 Z"
        fill="${PALETTE.redSoft}" stroke="${PALETTE.redDeep}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M32 46 h10 l6 -8 l7 14 l6 -10 h9" fill="none" stroke="#FFF2DF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    saw: () => `<svg viewBox="0 0 100 100">
      <rect x="10" y="34" width="40" height="22" rx="5" fill="${PALETTE.amberDeep}" stroke="#8A6A2B" stroke-width="2.5"/>
      <path d="M50 30 L88 34 L88 50 L50 56 Z" fill="#C9CFC6" stroke="${PALETTE.inkSoft}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M56 31 l3 5 l6 -4 M66 32 l3 5 l6 -4 M76 33 l3 5 l6 -4" fill="none" stroke="${PALETTE.inkSoft}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="22" cy="45" r="5" fill="${PALETTE.cream}" stroke="#8A6A2B" stroke-width="2"/>
    </svg>`,

    tourniquet: () => `<svg viewBox="0 0 100 100">
      <path d="M24 24 C58 8 78 22 70 44 C64 62 40 66 30 56 C22 48 26 34 40 34 C50 34 54 42 50 48"
        fill="none" stroke="${PALETTE.clothDeep}" stroke-width="9" stroke-linecap="round"/>
      <rect x="60" y="52" width="26" height="26" rx="6" fill="${PALETTE.amber}" stroke="${PALETTE.amberDeep}" stroke-width="2.5"/>
      <path d="M73 52 v26 M60 65 h26" stroke="${PALETTE.amberDeep}" stroke-width="2.5"/>
      <circle cx="24" cy="24" r="5" fill="${PALETTE.red}" stroke="${PALETTE.amberDeep}" stroke-width="2"/>
    </svg>`,

    ligature: () => `<svg viewBox="0 0 100 100">
      <rect x="16" y="46" width="24" height="34" rx="5" fill="${PALETTE.cream}" stroke="${PALETTE.inkSoft}" stroke-width="2.5"/>
      <path d="M16 54 h24 M16 66 h24 M16 76 h24" stroke="${PALETTE.redSoft}" stroke-width="2.5"/>
      <path d="M44 52 C62 40 70 58 84 44" fill="none" stroke="${PALETTE.teal}" stroke-width="3" stroke-linecap="round"/>
      <path d="M84 44 l6 -8 l-10 2 z" fill="${PALETTE.tealSoft}"/>
      <circle cx="86" cy="38" r="3" fill="${PALETTE.teal}"/>
    </svg>`,

    bandage: () => `<svg viewBox="0 0 100 100">
      <path d="M22 26 h40 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 H22 Z" fill="${PALETTE.cream}" stroke="${PALETTE.inkSoft}" stroke-width="2.5"/>
      <ellipse cx="30" cy="44" rx="13" ry="18" fill="#FBF6E9" stroke="${PALETTE.inkSoft}" stroke-width="2.5"/>
      <ellipse cx="30" cy="44" rx="6" ry="9" fill="none" stroke="${PALETTE.line || '#C8B895'}" stroke-width="2"/>
      <path d="M62 30 l22 8 M62 46 l22 -8" stroke="${PALETTE.redSoft}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    antiseptic: () => `<svg viewBox="0 0 100 100">
      <rect x="38" y="12" width="24" height="12" rx="3" fill="${PALETTE.amberDeep}" stroke="#8A6A2B" stroke-width="2"/>
      <path d="M34 24 h32 l4 60 a6 6 0 0 1 -6 6 H36 a6 6 0 0 1 -6 -6 Z" fill="#E9F1EF" stroke="${PALETTE.tealSoft}" stroke-width="2.5"/>
      <path d="M31 54 h38 v26 a6 6 0 0 1 -6 6 H37 a6 6 0 0 1 -6 -6 Z" fill="${PALETTE.tealLight}" opacity=".85"/>
      <path d="M34 34 h32" stroke="${PALETTE.tealSoft}" stroke-width="2"/>
    </svg>`,

    water: () => `<svg viewBox="0 0 100 100">
      <path d="M26 40 h48 l-5 34 a8 8 0 0 1 -8 7 H39 a8 8 0 0 1 -8 -7 Z" fill="${PALETTE.tealLight}" stroke="${PALETTE.teal}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M74 48 h8 a10 10 0 0 1 0 16 h-6" fill="none" stroke="${PALETTE.teal}" stroke-width="2.5"/>
      <path d="M40 28 c4 -6 0 -9 0 -9 c0 0 -4 3 0 9 M52 26 c4 -6 0 -9 0 -9 c0 0 -4 3 0 9 M64 28 c4 -6 0 -9 0 -9 c0 0 -4 3 0 9"
        fill="none" stroke="${PALETTE.tealSoft}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M34 62 q10 -6 20 0 t14 0" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".8" stroke-linecap="round"/>
    </svg>`,

    pond: () => `<svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="60" rx="38" ry="24" fill="#B9D2CE" stroke="${PALETTE.tealSoft}" stroke-width="2.5"/>
      <path d="M24 56 q12 -7 24 0 t24 0" fill="none" stroke="#F2FAF8" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M28 68 q12 -7 24 0 t20 0" fill="none" stroke="#F2FAF8" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>
      <path d="M20 42 l4 6 l7 -3 M74 46 l4 6 l7 -3" fill="none" stroke="${PALETTE.grass || '#BFCB92'}" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="66" cy="70" r="3" fill="${PALETTE.amberDeep}"/>
    </svg>`,

    well: () => `<svg viewBox="0 0 100 100">
      <path d="M22 44 h56 l-6 34 a6 6 0 0 1 -6 5 H34 a6 6 0 0 1 -6 -5 Z" fill="#B9AE95" stroke="${PALETTE.inkSoft}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M28 56 h44 M30 70 h40" stroke="#948A73" stroke-width="2"/>
      <ellipse cx="50" cy="44" rx="28" ry="9" fill="#D9CDB0" stroke="${PALETTE.inkSoft}" stroke-width="2.5"/>
      <ellipse cx="50" cy="44" rx="20" ry="6" fill="#7FA6A2" opacity=".8"/>
      <path d="M30 44 v-26 M70 44 v-26 M50 12 v-2" stroke="${PALETTE.clothDeep}" stroke-width="3" stroke-linecap="round"/>
      <path d="M22 18 h56" stroke="${PALETTE.clothDeep}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M42 20 h16 v14 h-16 z" fill="${PALETTE.amber}" stroke="${PALETTE.amberDeep}" stroke-width="2"/>
    </svg>`,

    cloth: () => `<svg viewBox="0 0 100 100">
      <path d="M18 62 l22 -34 a6 6 0 0 1 10 0 l22 34 a6 6 0 0 1 -5 10 H23 a6 6 0 0 1 -5 -10 Z" fill="${PALETTE.cream}" stroke="${PALETTE.inkSoft}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M34 40 l16 26 M50 34 l10 32" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="2" opacity=".55" stroke-linecap="round"/>
      <path d="M26 72 q12 -6 24 0 t22 0" fill="none" stroke="${PALETTE.line || '#C8B895'}" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

    herb: () => `<svg viewBox="0 0 100 100">
      <path d="M50 84 V34" stroke="${PALETTE.clothDeep}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M50 52 C34 50 26 40 26 28 C40 28 50 38 50 52 Z" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <path d="M50 44 C66 42 74 32 74 20 C60 20 50 30 50 44 Z" fill="#A9B894" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <path d="M50 70 C38 68 32 62 30 54 C42 54 50 60 50 70 Z" fill="#B7C4A0" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <path d="M50 34 q6 -10 0 -18 q-6 8 0 18 Z" fill="${PALETTE.redSoft}" opacity=".8"/>
    </svg>`,

    cheqian: () => `<svg viewBox="0 0 100 100">
      <path d="M50 86 V40" stroke="${PALETTE.clothDeep}" stroke-width="3.2"/>
      <path d="M50 42 C34 40 24 30 24 18 C40 18 50 28 50 42 Z" fill="#A9B894" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <path d="M50 46 C66 44 78 34 78 22 C62 22 50 32 50 46 Z" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <path d="M50 60 C36 58 28 52 26 44 C40 44 50 50 50 60 Z" fill="#B7C4A0" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <g stroke="${PALETTE.clothDeep}" stroke-width="2.4" fill="${PALETTE.cream}">
        <circle cx="50" cy="34" r="2.4"/><circle cx="50" cy="26" r="2.6"/><circle cx="50" cy="18" r="2.4"/>
      </g>
    </svg>`,

    huihui: () => `<svg viewBox="0 0 100 100">
      <path d="M50 88 V44" stroke="${PALETTE.clothDeep}" stroke-width="3.2"/>
      <path d="M50 56 l-24 -18 l18 -4 l6 14 Z" fill="#B7C4A0" stroke="${PALETTE.clothDeep}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M50 48 l24 -20 l-18 -4 l-6 16 Z" fill="#A9B894" stroke="${PALETTE.clothDeep}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M50 70 l-20 -12 l14 -4 l6 10 Z" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M50 30 l-10 -12 l14 2 z" fill="#CBD6B4" stroke="${PALETTE.clothDeep}" stroke-width="2"/>
    </svg>`,

    duqin: () => `<svg viewBox="0 0 100 100">
      <path d="M50 90 V34" stroke="${PALETTE.clothDeep}" stroke-width="3.6"/>
      <path d="M50 34 v-14 M26 24 q6 6 12 6 M74 24 q-6 6 -12 6 M32 40 q-8 -6 -12 -12 M68 40 q8 -6 12 -12"
        fill="none" stroke="${PALETTE.clothDeep}" stroke-width="2.4" stroke-linecap="round"/>
      <g fill="none" stroke="${PALETTE.clothDeep}" stroke-width="2">
        <circle cx="26" cy="24" r="4"/><circle cx="74" cy="24" r="4"/><circle cx="20" cy="28" r="3.4"/>
        <circle cx="80" cy="28" r="3.4"/><circle cx="38" cy="18" r="3.4"/><circle cx="62" cy="18" r="3.4"/>
      </g>
      <circle cx="50" cy="22" r="3" fill="#EDEBD7" stroke="${PALETTE.clothDeep}" stroke-width="1.6"/>
      <circle cx="44" cy="58" r="4" fill="#8E6BB0" opacity=".85"/>
      <circle cx="57" cy="70" r="3.4" fill="#8E6BB0" opacity=".8"/>
      <circle cx="46" cy="76" r="3" fill="#8E6BB0" opacity=".75"/>
      <path d="M50 90 C38 88 30 82 28 74 C40 74 50 80 50 90 Z" fill="#A9B894" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
      <path d="M50 90 C62 88 70 82 72 74 C60 74 50 80 50 90 Z" fill="#B7C4A0" stroke="${PALETTE.clothDeep}" stroke-width="2.4"/>
    </svg>`,

    ganjiang: () => `<svg viewBox="0 0 100 100">
      <path d="M20 62 q8 -18 24 -18 q10 0 12 10 q2 10 -8 12 q-10 2 -12 -4 q-2 -6 6 -8" fill="${PALETTE.amber}" stroke="${PALETTE.amberDeep}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M56 44 q10 -12 22 -10 q8 2 6 12 q-2 10 -14 8 q-8 -2 -8 -6" fill="#E8CE96" stroke="${PALETTE.amberDeep}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M40 74 q10 6 22 2" fill="none" stroke="${PALETTE.amberDeep}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M28 54 q4 -4 8 0 M60 40 q4 -4 8 0 M70 60 q4 -4 8 0" fill="none" stroke="${PALETTE.amberDeep}" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    probe: () => `<svg viewBox="0 0 100 100">
      <path d="M30 84 L64 34" stroke="#C9CFC6" stroke-width="6" stroke-linecap="round"/>
      <path d="M64 34 q8 -10 16 -6 q6 4 2 12 q-6 8 -16 6 z" fill="#C9CFC6" stroke="${PALETTE.inkSoft}" stroke-width="2"/>
      <circle cx="30" cy="84" r="6" fill="${PALETTE.teal}" stroke="${PALETTE.tealSoft}" stroke-width="2"/>
      <path d="M22 20 q8 6 8 14 M30 18 q10 8 10 18" fill="none" stroke="${PALETTE.amberDeep}" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

    fire: () => `<svg viewBox="0 0 100 100">
      <path d="M50 16 C62 34 74 42 74 58 a24 24 0 0 1 -48 0 C26 44 38 34 50 16 Z" fill="${PALETTE.redSoft}" opacity=".9"/>
      <path d="M50 40 C58 52 64 56 64 64 a14 14 0 0 1 -28 0 C36 56 42 52 50 40 Z" fill="${PALETTE.amber}"/>
      <path d="M28 82 h44" stroke="${PALETTE.inkSoft}" stroke-width="4" stroke-linecap="round"/>
      <path d="M36 82 l-6 10 M64 82 l6 10" stroke="${PALETTE.clothDeep}" stroke-width="4" stroke-linecap="round"/>
    </svg>`,

    warmwater: () => `<svg viewBox="0 0 100 100">
      <path d="M20 50 h60 l-6 26 a8 8 0 0 1 -8 6 H34 a8 8 0 0 1 -8 -6 Z" fill="#E9F1EF" stroke="${PALETTE.teal}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M26 62 q12 -7 24 0 t24 0" fill="none" stroke="${PALETTE.tealLight}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M34 40 c4 -7 0 -10 0 -10 c0 0 -4 3 0 10 M50 36 c4 -7 0 -10 0 -10 c0 0 -4 3 0 10 M66 40 c4 -7 0 -10 0 -10 c0 0 -4 3 0 10"
        fill="none" stroke="${PALETTE.redSoft}" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>
      <circle cx="50" cy="18" r="4" fill="${PALETTE.amber}" opacity=".7"/>
    </svg>`,

    soup: () => `<svg viewBox="0 0 100 100">
      <path d="M18 52 h64 a32 32 0 0 1 -32 32 a32 32 0 0 1 -32 -32 Z" fill="${PALETTE.cream}" stroke="${PALETTE.inkSoft}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M24 60 h52" stroke="#C99A5E" stroke-width="6" stroke-linecap="round"/>
      <path d="M40 40 c4 -7 0 -11 0 -11 c0 0 -4 4 0 11 M56 36 c4 -7 0 -11 0 -11 c0 0 -4 4 0 11"
        fill="none" stroke="${PALETTE.tealSoft}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M14 52 h72" stroke="${PALETTE.inkSoft}" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    legging: () => `<svg viewBox="0 0 100 100">
      <path d="M26 30 h34" stroke="${PALETTE.clothDeep}" stroke-width="3" stroke-linecap="round"/>
      <path d="M28 34 h30 l4 44 a8 8 0 0 1 -8 8 H32 a8 8 0 0 1 -8 -8 Z" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M30 34 q6 22 0 52 M48 34 q-6 22 0 52" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="2" opacity=".6"/>
      <path d="M62 40 q14 8 14 22 q0 14 -14 20" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="30" cy="30" r="4" fill="${PALETTE.red}"/>
    </svg>`,

    rub: () => `<svg viewBox="0 0 100 100">
      <path d="M32 74 q-10 -14 -2 -26 q8 -12 20 -6 q12 6 8 20 q-4 14 -14 14" fill="${PALETTE.skin}" stroke="${PALETTE.skinShade}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M40 62 q8 -6 14 0" fill="none" stroke="${PALETTE.skinShade}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M46 84 q14 -8 22 0" fill="none" stroke="${PALETTE.skinShade}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M18 30 l10 10 M14 44 l10 4 M24 18 l6 10" stroke="${PALETTE.amberDeep}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M74 34 l-10 -8 M82 46 l-12 0" stroke="${PALETTE.amberDeep}" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`,

    tight: () => `<svg viewBox="0 0 100 100">
      <path d="M40 16 h20 v68 h-20 z" fill="${PALETTE.skin}" stroke="${PALETTE.skinShade}" stroke-width="2.6"/>
      <path d="M38 40 h24 v10 h-24 z M38 56 h24 v10 h-24 z" fill="${PALETTE.cream}" stroke="${PALETTE.inkSoft}" stroke-width="2.4"/>
      <path d="M60 44 l14 6 M60 50 l14 6 M60 60 l14 6" stroke="${PALETTE.redSoft}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M30 26 l-10 6 M30 34 l-12 0 M70 26 l10 6" stroke="${PALETTE.red}" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`,

    booklet: () => `<svg viewBox="0 0 100 100">
      <path d="M22 20 h52 a4 4 0 0 1 4 4 v58 a4 4 0 0 1 -4 4 H22 Z" fill="${PALETTE.cream}" stroke="${PALETTE.amberDeep}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 20 v66" stroke="${PALETTE.amberDeep}" stroke-width="6"/>
      <path d="M34 34 h30 M34 44 h30 M34 54 h22" stroke="${PALETTE.inkSoft}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M62 62 l16 20 M78 62 l-16 20" stroke="${PALETTE.redSoft}" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`,

    kit: () => `<svg viewBox="0 0 100 100">
      <rect x="14" y="34" width="72" height="48" rx="6" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="3"/>
      <path d="M36 34 a14 12 0 0 1 28 0" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="3"/>
      <rect x="14" y="52" width="72" height="8" fill="${PALETTE.clothDeep}" opacity=".7"/>
      ${starPath && `<g transform="translate(36,54) scale(0.56)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="4"/></g>`}
    </svg>`,

    lantern: () => `<svg viewBox="0 0 100 100">
      <path d="M36 40 h28 l4 34 H32 Z" fill="#F7E3A8" stroke="${PALETTE.amberDeep}" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M32 74 h36" stroke="${PALETTE.amberDeep}" stroke-width="5" stroke-linecap="round"/>
      <path d="M30 40 h40" stroke="${PALETTE.amberDeep}" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 40 V26 M38 26 h24" stroke="${PALETTE.amberDeep}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="50" cy="58" rx="8" ry="12" fill="${PALETTE.amber}" opacity=".9"/>
      <path d="M50 46 q-6 -12 0 -20 q6 8 0 20 z" fill="${PALETTE.red}" opacity=".85"/>
    </svg>`,

    snow: () => `<svg viewBox="0 0 100 100">
      <g stroke="#7FA6A2" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M50 14 V86"/><path d="M19 32 L81 68"/><path d="M19 68 L81 32"/>
        <path d="M50 28 l-8 -8 M50 28 l8 -8"/>
        <path d="M50 72 l-8 8 M50 72 l8 8"/>
        <path d="M30 41 l-11 -2 M30 41 l-2 -11"/>
        <path d="M70 59 l11 2 M70 59 l2 11"/>
        <path d="M30 59 l-11 2 M30 59 l-2 11"/>
        <path d="M70 41 l11 -2 M70 41 l2 -11"/>
      </g>
      <circle cx="50" cy="50" r="6" fill="#CFE3EA" stroke="#7FA6A2" stroke-width="2.5"/>
    </svg>`,

    /* ----- 三名战士 ----- */
    patientA: () => ART._soldier('#8FA3AE', 'cold'),
    patientB: () => ART._soldier('#A8A08A', 'tired'),
    patientC: () => ART._soldier('#9AA98F', 'ok'),

    /* ----- 标题用 ----- */
    _fallback: () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="${PALETTE.creamDeep}"/></svg>`
  },

  /* 统一的士兵卡通头像：冷 / 累 / 尚可 */
  _soldier(coat, mood) {
    const browL = mood === 'cold' ? 'M30 42 q6 -4 11 -1' : (mood === 'tired' ? 'M30 44 q6 -2 11 1' : 'M30 43 q6 -3 11 0');
    const browR = mood === 'cold' ? 'M58 41 q6 -3 11 1' : (mood === 'tired' ? 'M58 45 q6 -2 11 1' : 'M58 43 q6 -3 11 0');
    const mouth = mood === 'cold'
      ? 'M42 66 q8 -4 16 0'
      : (mood === 'tired' ? 'M42 68 q8 -3 16 1' : 'M42 65 q8 5 16 0');
    return `<svg viewBox="0 0 100 100">
      <path d="M50 10 h0" />
      <path d="M26 34 a24 22 0 0 1 48 0 v-6 a4 4 0 0 0 -4 -4 h-8 a6 6 0 0 0 -24 0 h-8 a4 4 0 0 0 -4 4 z" fill="${coat}" stroke="${PALETTE.clothDeep}" stroke-width="2.6" stroke-linejoin="round"/>
      ${`<g transform="translate(42,17) scale(0.32)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="6"/></g>`}
      <path d="M30 40 h40 l6 46 a6 6 0 0 1 -6 7 H30 a6 6 0 0 1 -6 -7 Z" fill="${coat}" stroke="${PALETTE.clothDeep}" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="50" cy="52" rx="24" ry="23" fill="${PALETTE.skin}" stroke="${PALETTE.skinShade}" stroke-width="2.6"/>
      ${ART._moodOverlay(mood)}
      <path d="${browL}" stroke="${PALETTE.inkSoft}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="${browR}" stroke="${PALETTE.inkSoft}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="${mouth}" stroke="${PALETTE.inkSoft}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </svg>`;
  },

  _moodOverlay(mood) {
    if (mood === 'cold') {
      return `<path d="M28 58 q10 -6 22 0 t22 0" fill="none" stroke="#CFE3EA" stroke-width="2.4" opacity=".9"/>
        <circle cx="39" cy="52" r="3" fill="${PALETTE.inkSoft}"/><circle cx="61" cy="52" r="3" fill="${PALETTE.inkSoft}"/>
        <path d="M74 26 l4 6 M80 20 l3 5" stroke="#CFE3EA" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    if (mood === 'tired') {
      return `<circle cx="39" cy="52" r="3" fill="${PALETTE.inkSoft}"/><circle cx="61" cy="52" r="3" fill="${PALETTE.inkSoft}"/>
        <path d="M68 78 q8 -6 12 -14 M70 80 q10 -4 16 -10" stroke="${PALETTE.tealSoft}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
    }
    return `<circle cx="39" cy="52" r="3" fill="${PALETTE.inkSoft}"/><circle cx="61" cy="52" r="3" fill="${PALETTE.inkSoft}"/>`;
  },

  /* ==================== 场景背景 ==================== */
  scenes: {
    /* 救护所：门板手术台 + 油灯 + 药箱 + 木梁 */
    aid: () => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="aidWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E8DCC0"/><stop offset="1" stop-color="#D8C9A6"/>
        </linearGradient>
      </defs>
      <rect width="800" height="420" fill="url(#aidWall)"/>
      <path d="M0 0 h800 v40 H0 z" fill="#B69C6E" opacity=".55"/>
      <path d="M60 40 l40 60 h-80 z" fill="#A88C5C" opacity=".5"/>
      <path d="M740 40 l40 60 h-80 z" fill="#A88C5C" opacity=".5"/>
      <rect x="90" y="120" width="140" height="120" rx="6" fill="#F3E7C8" stroke="#B69C6E" stroke-width="4"/>
      <path d="M160 120 v120 M90 180 h140" stroke="#B69C6E" stroke-width="3"/>
      <path d="M330 40 v60" stroke="#A88C5C" stroke-width="6"/>
      <ellipse cx="330" cy="112" rx="30" ry="10" fill="#F7E3A8" opacity=".95"/>
      <ellipse cx="330" cy="104" rx="14" ry="18" fill="#FBE9A8" opacity=".9"/>
      <rect x="120" y="300" width="330" height="26" rx="6" fill="#C6A87A" stroke="#96794C" stroke-width="3"/>
      <rect x="150" y="326" width="18" height="70" fill="#A88C5C"/>
      <rect x="400" y="326" width="18" height="70" fill="#A88C5C"/>
      <rect x="150" y="240" width="270" height="60" rx="8" fill="#E3D3AC" stroke="#96794C" stroke-width="3"/>
      <path d="M170 240 l130 -40 l130 40 z" fill="#D6C39A" stroke="#96794C" stroke-width="3"/>
      <rect x="560" y="250" width="120" height="80" rx="8" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="4"/>
      <path d="M596 250 a24 18 0 0 1 48 0" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="4"/>
      <g transform="translate(590,282) scale(0.5)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="4"/></g>
      <rect x="470" y="330" width="200" height="16" rx="4" fill="#B69C6E" opacity=".6"/>
      <path d="M0 396 h800" stroke="#B69C6E" stroke-width="6" opacity=".5"/>
    </svg>`,

    /* 雪山：远山 + 雪 + 队伍剪影 + 红旗 */
    snow: () => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="skyC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#DCE8EC"/><stop offset="1" stop-color="#F3EFE2"/>
        </linearGradient>
      </defs>
      <rect width="800" height="420" fill="url(#skyC)"/>
      <path d="M0 250 L120 150 L210 230 L300 120 L420 250 Z" fill="#CBD9DE"/>
      <path d="M420 250 L520 160 L640 260 L720 190 L800 260 Z" fill="#C2D2D8"/>
      <path d="M300 120 l-40 60 h80 z" fill="#F4F8F9"/>
      <path d="M520 160 l-36 52 h72 z" fill="#F4F8F9"/>
      <path d="M0 300 q150 -40 340 -10 t460 -20 v160 H0 Z" fill="#EEF3F4"/>
      <path d="M0 340 q200 -30 400 -6 t400 -14 v100 H0 Z" fill="#E3EDEF"/>
      <g opacity=".55">
        <circle cx="90" cy="60" r="4" fill="#fff"/><circle cx="200" cy="110" r="3" fill="#fff"/>
        <circle cx="330" cy="50" r="4" fill="#fff"/><circle cx="470" cy="120" r="3" fill="#fff"/>
        <circle cx="610" cy="70" r="4" fill="#fff"/><circle cx="720" cy="140" r="3" fill="#fff"/>
        <circle cx="150" cy="180" r="3" fill="#fff"/><circle cx="560" cy="200" r="3" fill="#fff"/>
      </g>
      <g opacity=".85">
        <path d="M700 330 v-70" stroke="#96794C" stroke-width="4"/>
        <path d="M700 262 h60 l-12 16 h-48 z" fill="${PALETTE.red}"/>
        <g transform="translate(704,266) scale(0.34)"><path d="${starPath}" fill="${PALETTE.amber}" stroke="#fff" stroke-width="3"/></g>
      </g>
      <g fill="#5D6B66" opacity=".55">
        <ellipse cx="180" cy="368" rx="12" ry="20"/><circle cx="180" cy="342" r="8"/>
        <ellipse cx="230" cy="372" rx="12" ry="20"/><circle cx="230" cy="346" r="8"/>
        <ellipse cx="285" cy="366" rx="11" ry="18"/><circle cx="285" cy="342" r="7.5"/>
        <ellipse cx="340" cy="374" rx="12" ry="20"/><circle cx="340" cy="348" r="8"/>
      </g>
    </svg>`,

    /* 草地：暖色远景 + 水泡 + 帐篷 */
    grass: () => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F6DFB4"/><stop offset="1" stop-color="#F2EBD2"/>
        </linearGradient>
      </defs>
      <rect width="800" height="420" fill="url(#skyG)"/>
      <circle cx="660" cy="150" r="52" fill="#F3C98C" opacity=".75"/>
      <path d="M0 220 q120 -40 260 -14 t300 -20 q180 -26 240 10 v230 H0 Z" fill="#C9CE9B"/>
      <path d="M0 270 q160 -30 340 -6 t460 -16 v180 H0 Z" fill="#B9C48D"/>
      <ellipse cx="200" cy="350" rx="90" ry="26" fill="#A8C6C0" opacity=".7"/>
      <ellipse cx="520" cy="382" rx="120" ry="26" fill="#A8C6C0" opacity=".6"/>
      <path d="M120 330 q20 -8 40 0 t40 0" fill="none" stroke="#E9f3f1" stroke-width="2.4" opacity=".8"/>
      <g>
        <path d="M120 300 l60 -46 l60 46 z" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M180 254 v46" stroke="${PALETTE.clothDeep}" stroke-width="4"/>
        <g transform="translate(168,262) scale(0.4)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="4"/></g>
      </g>
      <g fill="${PALETTE.clothDeep}" opacity=".55">
        <path d="M300 300 q6 -22 12 0 M320 300 q-6 -26 2 0 M340 302 q8 -20 10 0" stroke="${PALETTE.clothDeep}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M600 280 q6 -22 12 0 M620 280 q-6 -26 2 0 M640 282 q8 -20 10 0" stroke="${PALETTE.clothDeep}" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
      <g opacity=".7">
        <circle cx="420" cy="120" r="6" fill="#FFFFFF" opacity=".5"/>
        <ellipse cx="460" cy="104" rx="26" ry="10" fill="#FFFFFF" opacity=".55"/>
        <ellipse cx="500" cy="112" rx="34" ry="12" fill="#FFFFFF" opacity=".45"/>
      </g>
    </svg>`,

    none: () => ''
  },

  /* ==================== 大插画 ==================== */
  arts: {
    /* 饶正锡：原创卡通半身像（军帽 + 红五星 + 军装 + 药箱） */
    portrait: () => `<svg viewBox="0 0 300 360">
      <ellipse cx="150" cy="340" rx="110" ry="18" fill="#000" opacity=".08"/>
      <path d="M60 200 q0 -110 90 -110 q90 0 90 110 l8 130 H52 Z" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M150 200 L122 330 M150 200 L178 330" stroke="${PALETTE.clothDeep}" stroke-width="4" opacity=".5"/>
      <path d="M108 200 h84 v96 h-84 z" fill="#AFBCA4" opacity=".5"/>
      <path d="M150 214 v70" stroke="${PALETTE.clothDeep}" stroke-width="3" opacity=".6"/>
      <ellipse cx="150" cy="150" rx="62" ry="70" fill="${PALETTE.skin}" stroke="${PALETTE.skinShade}" stroke-width="4"/>
      <ellipse cx="122" cy="146" rx="7" ry="6" fill="${PALETTE.ink}"/>
      <ellipse cx="178" cy="146" rx="7" ry="6" fill="${PALETTE.ink}"/>
      <path d="M112 132 q10 -8 20 -2 M170 130 q10 -6 20 2" fill="none" stroke="${PALETTE.inkSoft}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M138 176 q12 6 24 0" fill="none" stroke="${PALETTE.inkSoft}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M84 96 q0 -60 66 -60 q66 0 66 60 q0 14 -6 22 q-14 -14 -60 -14 q-46 0 -60 14 q-6 -8 -6 -22 Z"
        fill="#8C9B85" stroke="#5F7059" stroke-width="5" stroke-linejoin="round"/>
      <path d="M84 96 q66 -14 132 0 q0 -6 -2 -10 q-64 -18 -128 0 q-2 4 -2 10 Z" fill="#7C8B76"/>
      <g transform="translate(150,52) scale(0.62)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="4"/></g>
      <rect x="196" y="252" width="96" height="70" rx="8" fill="#A9B894" stroke="#5F7059" stroke-width="5"/>
      <path d="M228 252 a16 12 0 0 1 32 0" fill="none" stroke="#5F7059" stroke-width="5"/>
      <path d="M196 286 h96" stroke="#5F7059" stroke-width="4"/>
      <g transform="translate(226,270) scale(0.52)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="5"/></g>
    </svg>`,

    twoPaths: () => `<svg viewBox="0 0 300 300">
      <path d="M40 250 q60 -30 110 -100" fill="none" stroke="${PALETTE.redSoft}" stroke-width="6" stroke-linecap="round"/>
      <path d="M260 250 q-60 -30 -110 -100" fill="none" stroke="${PALETTE.tealSoft}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="150" cy="150" r="34" fill="${PALETTE.cream}" stroke="${PALETTE.amberDeep}" stroke-width="5"/>
      <g transform="translate(132,132) scale(0.36)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="6"/></g>
      <circle cx="40" cy="250" r="20" fill="${PALETTE.redSoft}" opacity=".85"/>
      <circle cx="260" cy="250" r="20" fill="${PALETTE.tealLight}" opacity=".9"/>
      <path d="M30 250 h20 M250 250 h20" stroke="${PALETTE.inkSoft}" stroke-width="3"/>
    </svg>`,

    howto: () => `<svg viewBox="0 0 300 300">
      <rect x="40" y="70" width="220" height="160" rx="10" fill="${PALETTE.cream}" stroke="${PALETTE.amberDeep}" stroke-width="5"/>
      <path d="M70 110 h160 M70 140 h130 M70 170 h150" stroke="${PALETTE.inkSoft}" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(190,120) scale(0.7)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="5"/></g>
      <rect x="230" y="196" width="60" height="60" rx="8" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="5"/>
      <path d="M252 196 a14 10 0 0 1 28 0" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="4"/>
    </svg>`,

    rules: () => `<svg viewBox="0 0 300 300">
      <rect x="70" y="40" width="160" height="220" rx="12" fill="${PALETTE.cream}" stroke="${PALETTE.amberDeep}" stroke-width="5"/>
      <path d="M96 90 h108 M96 130 h108 M96 170 h80" stroke="${PALETTE.inkSoft}" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(118,196) scale(0.56)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="6"/></g>
      <path d="M40 60 q20 30 0 60" fill="none" stroke="${PALETTE.cloth}" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    /* 图鉴一插画：木锯与一只脚（用鞋与拐杖示意，避免写实伤口） */
    codex1: () => `<svg viewBox="0 0 520 300">
      <rect width="520" height="300" fill="#EFE4C8"/>
      <rect x="0" y="220" width="520" height="80" fill="#D9C9A2"/>
      <path d="M40 40 h440 v12 H40 z" fill="#C3AC7F" opacity=".6"/>
      <g transform="translate(150,60)">
        <ellipse cx="180" cy="180" rx="70" ry="24" fill="#EFE6D2" stroke="#A98F5E" stroke-width="5"/>
        <path d="M180 156 v-56 a12 12 0 0 1 24 0 v56" fill="none" stroke="#A98F5E" stroke-width="5"/>
        <path d="M170 150 h44 l6 30 h-56 z" fill="#BFA77C" stroke="#96794C" stroke-width="4"/>
        <path d="M176 180 h32" stroke="#96794C" stroke-width="4"/>
      </g>
      <g transform="translate(330,70) rotate(-14)">
        <rect x="-46" y="0" width="46" height="30" rx="8" fill="${PALETTE.amberDeep}" stroke="#8A6A2B" stroke-width="4"/>
        <path d="M0 6 L96 12 L96 40 L0 34 Z" fill="#CFD5CB" stroke="${PALETTE.inkSoft}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M10 8 l6 8 l10 -6 M28 10 l6 8 l10 -6 M46 12 l6 8 l10 -6 M64 14 l6 8 l10 -6"
          fill="none" stroke="${PALETTE.inkSoft}" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g transform="translate(40,110)">
        <rect x="0" y="0" width="80" height="60" rx="6" fill="${PALETTE.cloth}" stroke="${PALETTE.clothDeep}" stroke-width="4"/>
        <path d="M24 0 a16 12 0 0 1 32 0" fill="none" stroke="${PALETTE.clothDeep}" stroke-width="4"/>
        <g transform="translate(22,18) scale(0.44)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="5"/></g>
      </g>
      <g transform="translate(70,40)">
        <ellipse cx="20" cy="10" rx="18" ry="8" fill="#F7E3A8" stroke="${PALETTE.amberDeep}" stroke-width="3"/>
        <ellipse cx="20" cy="4" rx="8" ry="10" fill="#FBE9A8"/>
      </g>
    </svg>`,

    /* 图鉴二插画：手册、看护队与骡子（暖色草地） */
    codex2: () => `<svg viewBox="0 0 520 300">
      <defs><linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F6E3BA"/><stop offset="1" stop-color="#F1EBD2"/></linearGradient></defs>
      <rect width="520" height="300" fill="url(#cg2)"/>
      <circle cx="410" cy="80" r="40" fill="#F3C98C" opacity=".8"/>
      <path d="M0 210 q120 -30 260 -10 t260 -14 v114 H0 Z" fill="#C6C996"/>
      <ellipse cx="140" cy="270" rx="90" ry="22" fill="#A8C6C0" opacity=".65"/>
      <g transform="translate(300,150)">
        <ellipse cx="60" cy="90" rx="72" ry="26" fill="#000" opacity=".07"/>
        <path d="M14 90 q0 -46 46 -46 q46 0 46 46 z" fill="#B7A487" stroke="#8B7A5E" stroke-width="4"/>
        <path d="M6 90 l-8 -18 l14 4 z" fill="#B7A487" stroke="#8B7A5E" stroke-width="4"/>
        <path d="M24 44 q22 -30 46 -6" fill="none" stroke="#8B7A5E" stroke-width="4"/>
        <ellipse cx="30" cy="36" rx="16" ry="12" fill="#CDBB9B" stroke="#8B7A5E" stroke-width="4"/>
        <circle cx="22" cy="34" r="2.6" fill="${PALETTE.ink}"/>
        <path d="M14 60 h30 v14 h-30 z" fill="#9C8B6C" stroke="#7A6A50" stroke-width="3"/>
      </g>
      <g transform="translate(60,120)">
        <rect x="0" y="0" width="120" height="150" rx="8" fill="${PALETTE.cream}" stroke="${PALETTE.amberDeep}" stroke-width="5"/>
        <path d="M16 30 h88 M16 56 h88 M16 82 h60" stroke="${PALETTE.inkSoft}" stroke-width="4" stroke-linecap="round"/>
        <path d="M40 110 l60 24 M100 110 l-60 24" stroke="${PALETTE.redSoft}" stroke-width="4" stroke-linecap="round"/>
        <path d="M0 0 v150" stroke="${PALETTE.amberDeep}" stroke-width="8"/>
      </g>
      <g fill="#5D6B66" opacity=".6">
        <ellipse cx="230" cy="200" rx="12" ry="20"/><circle cx="230" cy="176" r="8"/>
        <ellipse cx="262" cy="204" rx="11" ry="18"/><circle cx="262" cy="182" r="7.5"/>
      </g>
    </svg>`,

    ending: () => `<svg viewBox="0 0 520 280">
      <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F7E7C4"/><stop offset="1" stop-color="#F1E8D0"/></linearGradient></defs>
      <rect width="520" height="280" fill="url(#eg)"/>
      <circle cx="410" cy="76" r="42" fill="#F3C98C" opacity=".8"/>
      <path d="M0 190 q140 -40 280 -12 t240 -18 v120 H0 Z" fill="#C6C996"/>
      <path d="M0 230 q160 -26 320 -6 t200 -8 v66 H0 Z" fill="#B7C48D"/>
      <g fill="#5D6B66" opacity=".7">
        <ellipse cx="120" cy="212" rx="12" ry="20"/><circle cx="120" cy="188" r="8"/>
        <ellipse cx="164" cy="216" rx="12" ry="20"/><circle cx="164" cy="192" r="8"/>
        <ellipse cx="208" cy="210" rx="11" ry="19"/><circle cx="208" cy="187" r="7.5"/>
        <ellipse cx="252" cy="218" rx="12" ry="20"/><circle cx="252" cy="194" r="8"/>
        <ellipse cx="296" cy="212" rx="11" ry="19"/><circle cx="296" cy="189" r="7.5"/>
      </g>
      <g transform="translate(430,120)">
        <path d="M0 0 v-70" stroke="#96794C" stroke-width="5"/>
        <path d="M0 -68 h64 l-14 18 H0 z" fill="${PALETTE.red}"/>
        <g transform="translate(4,-64) scale(0.36)"><path d="${starPath}" fill="${PALETTE.amber}" stroke="#fff" stroke-width="3"/></g>
      </g>
      <g transform="translate(60,60)">
        <rect x="0" y="0" width="86" height="110" rx="7" fill="${PALETTE.cream}" stroke="${PALETTE.amberDeep}" stroke-width="4.5"/>
        <path d="M12 26 h62 M12 46 h62 M12 66 h42" stroke="${PALETTE.inkSoft}" stroke-width="3.4" stroke-linecap="round"/>
        <g transform="translate(30,80) scale(0.4)"><path d="${starPath}" fill="${PALETTE.red}" stroke="${PALETTE.amber}" stroke-width="6"/></g>
      </g>
    </svg>`,

    /* 标题屏插画：远山 + 红旗 + 行军队伍 + 麦穗 */
    titleScene: () => `<svg viewBox="0 0 640 220">
      <defs><linearGradient id="ts" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F2E9D4"/><stop offset="1" stop-color="#EADFC4"/></linearGradient></defs>
      <rect width="640" height="220" fill="url(#ts)"/>
      <path d="M0 120 L90 60 L160 118 L240 48 L330 120 L420 70 L520 126 L640 76 V220 H0 Z" fill="#D8CFB2" opacity=".85"/>
      <path d="M0 160 q160 -26 320 -6 t320 -12 v78 H0 Z" fill="#C6C08F"/>
      <g fill="#7C8B76" opacity=".75">
        <ellipse cx="120" cy="186" rx="11" ry="18"/><circle cx="120" cy="164" r="7.5"/>
        <ellipse cx="158" cy="190" rx="11" ry="18"/><circle cx="158" cy="168" r="7.5"/>
        <ellipse cx="196" cy="184" rx="10" ry="17"/><circle cx="196" cy="164" r="7"/>
        <ellipse cx="234" cy="192" rx="11" ry="18"/><circle cx="234" cy="170" r="7.5"/>
      </g>
      <g transform="translate(520,60)">
        <path d="M0 0 v-76" stroke="#96794C" stroke-width="5"/>
        <path d="M0 -74 h70 l-14 20 H0 z" fill="${PALETTE.red}"/>
        <g transform="translate(4,-70) scale(0.4)"><path d="${starPath}" fill="${PALETTE.amber}" stroke="#fff" stroke-width="3"/></g>
      </g>
      <g opacity=".9" transform="translate(40,40)">
        <path d="M0 60 V10" stroke="${PALETTE.amberDeep}" stroke-width="4"/>
        <g fill="${PALETTE.amber}" stroke="${PALETTE.amberDeep}" stroke-width="3">
          <ellipse cx="-12" cy="16" rx="7" ry="13" transform="rotate(-24 -12 16)"/>
          <ellipse cx="12" cy="24" rx="7" ry="13" transform="rotate(24 12 24)"/>
          <ellipse cx="-11" cy="34" rx="7" ry="13" transform="rotate(-24 -11 34)"/>
          <ellipse cx="12" cy="44" rx="7" ry="13" transform="rotate(24 12 44)"/>
        </g>
      </g>
      <g transform="translate(560,150) scale(1)" opacity=".85">
        <ellipse cx="0" cy="0" rx="14" ry="22" fill="#B7A487" stroke="#8B7A5E" stroke-width="3.4"/>
        <ellipse cx="-8" cy="-20" rx="11" ry="8" fill="#CDBB9B" stroke="#8B7A5E" stroke-width="3.4"/>
        <path d="M6 22 v10 M-6 22 v10" stroke="#8B7A5E" stroke-width="3.4"/>
      </g>
    </svg>`
  },

  /* ==================== 对外接口 ==================== */
  icon(name) {
    const f = this.icons[name];
    return f ? f() : this.icons._fallback();
  },
  scene(name) {
    const f = this.scenes[name];
    return f ? f() : '';
  },
  art(name) {
    const f = this.arts[name];
    return f ? f() : '';
  }
};
