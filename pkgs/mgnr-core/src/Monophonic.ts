import { Range } from 'utils'

/**
 * @note not inclusive for max value
 */
export type PitchRange = Range

/**
 * @note start should always smaller than the end
 */
type TimeRange = [start: number, end: number]

type Note = [pitch: number, ...TimeRange]

export class MonophoniManager {
  #maps: MonophonicMap[]
  constructor(pitchRanges?: PitchRange[]) {
    if (pitchRanges) {
      this.#maps = pitchRanges.map((r) => new MonophonicMap(r))
    } else {
      this.#maps = [new MonophonicMap()]
    }
  }
  register(...note: Note): Note | null {
    const [pitch, ...range] = note
    const map = this.#maps.find((m) => m.range.min <= pitch && pitch < m.range.max)
    if (!map) return note
    const separate = map.register(range)
    return separate ? [pitch, ...separate] : null
  }
  clear(time: number) {
    this.#maps.forEach((m) => m.clear(time))
  }
}

export class MonophonicMap {
  #map: TimeRange[] = []
  constructor(public range: PitchRange = { min: 0, max: 120 }) {}
  register(note: TimeRange): TimeRange | null {
    const separate = this.#map.reduce((n, r) => avoidIntersect(r, n), note)
    if (separate[0] === separate[1]) return null
    this.#map.push(separate)
    return separate
  }
  clear(time: number) {
    this.#map = this.#map.filter((r) => r[1] >= time)
  }
}

export const avoidIntersect = (base: TimeRange, compare: TimeRange): TimeRange => {
  if (compare[0] <= base[0] && base[0] <= compare[1]) return [compare[0], base[0]]
  if (base[1] <= compare[1] && compare[0] <= base[1]) return [base[1], compare[1]]
  return compare
}
