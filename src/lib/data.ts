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

export const GENRES = [
  'HIP-HOP',
  'JAZZ',
  'LOCK/SOUL',
  'HOUSE',
  'PUNKING/FREESTYLE',
  'POP',
  'リズムトレーニング',
]

export const GENRE_COLORS: Record<string, string> = {
  'HIP-HOP': '#C05B3A',
  JAZZ: '#7B5EA7',
  'LOCK/SOUL': '#B08A2E',
  HOUSE: '#3E8A9C',
  'PUNKING/FREESTYLE': '#B54B84',
  POP: '#4C7FBF',
  リズムトレーニング: '#5B9455',
}

export const LEVELS = ['超入門', '入門', '初級', '中級']

export const INSTRUCTORS = [
  'KAORI', 'YU-KI', 'SHOTA', 'MIHO', 'RYO', 'ERIKA', 'TAKU', 'NANA',
  'KENJI', 'AYAKA', 'DAI', 'RIKO', 'HARUKA', 'JUN', 'SAYA', 'TOMO',
]

export const DOWS = ['月', '火', '水', '木', '金', '土', '日']

export const STAR_YELLOW = '#E7AE33'
export const DAY_START = 10 * 60
export const DAY_END = 23 * 60
export const PPH = 118

export type ClosedDisplay = 'グレー表示' | '非表示'
export const CLOSED_DISPLAY: ClosedDisplay = 'グレー表示'
