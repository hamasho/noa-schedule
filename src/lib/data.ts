export const LOCS: ReadonlyArray<readonly [number, string]> = [
  [8, '新宿'],
  [4, '池袋'],
  [1, '秋葉原'],
  [2, '恵比寿'],
  [7, '中目黒'],
  [3, '銀座'],
  [11, '赤坂'],
  [12, '原宿'],
  [6, '吉祥寺'],
  [10, '都立大'],
  [5, '駒沢'],
  [14, '御茶ノ水'],
  [15, '中野'],
  [13, '自由が丘'],
]

/**
 * Curated colors for the common NOA genres (matched on a substring of the
 * API's `GENRE_SUB_NAME`, so e.g. both `ヒップホップダンス` and `R&B ヒップホップ`
 * resolve to the HIP-HOP hue). Genres not listed fall back to a deterministic
 * slot in {@link GENRE_PALETTE} via {@link genreColor}.
 */
const GENRE_COLOR_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/ヒップホップ|HIPHOP|HIP-HOP|HIP HOP|R&B/i, '#C05B3A'],
  [/ハウス|HOUSE/i, '#3E8A9C'],
  [/ロック|LOCK/i, '#B08A2E'],
  [/ソウル|SOUL/i, '#9C6B2E'],
  [/パンキング|PUNKING|WAACK|VOGU/i, '#B54B84'],
  [/ポップ|POP|アニメーション/i, '#4C7FBF'],
  [/ジャズ|JAZZ/i, '#7B5EA7'],
  [/リズム/i, '#5B9455'],
  [/フリー|FREESTYLE/i, '#2E8A7B'],
]

/** Fallback palette for genres without a curated rule. */
const GENRE_PALETTE = [
  '#C05B3A', '#7B5EA7', '#3E8A9C', '#B08A2E', '#B54B84',
  '#4C7FBF', '#5B9455', '#9C6B2E', '#2E8A7B', '#8A5EA7',
]

/** Small deterministic string hash for stable palette assignment. */
function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Resolves a stable accent color for any genre display name. */
export function genreColor(genre: string): string {
  for (const [re, color] of GENRE_COLOR_RULES) {
    if (re.test(genre)) return color
  }
  return GENRE_PALETTE[hashString(genre) % GENRE_PALETTE.length]
}

/**
 * Canonical level ordering (easy → hard, then special buckets). Used to sort
 * the level filter chips; unknown levels sort last, alphabetically.
 */
export const LEVEL_ORDER = [
  '超入門', '入門', '初級', '初級・中級', '中級', '中上級', '上級',
  'KIDS 1', 'KIDS 2', 'WORKSHOP', '期間限定レッスン',
]

export const DOWS = ['月', '火', '水', '木', '金', '土', '日']

export const STAR_YELLOW = '#E7AE33'
export const DAY_START = 10 * 60
export const DAY_END = 23 * 60
export const PPH = 118

export type ClosedDisplay = 'グレー表示' | '非表示'
export const CLOSED_DISPLAY: ClosedDisplay = 'グレー表示'
