export interface Lesson {
  id: string
  locId: number
  locName: string
  start: string
  startMin: number
  endMin: number
  genre: string
  level: string
  inst: string
}

export interface LessonStatus {
  label: string
  color: string
  dim: boolean
}

export interface DecoLesson extends Lesson {
  end: string
  locTag: string
  avatar: string
  dim: boolean
  fav: boolean
  color: string
  statusLabel: string
  statusColor: string
}

export interface Positioned {
  top: number
  height: number
  left: string
  width: string
}
