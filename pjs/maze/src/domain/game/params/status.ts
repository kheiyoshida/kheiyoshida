
export type StatsUpdatePattern = 'walk' | 'constant' | 'turn' | 'downstairs' | 'idle'

export const StatusEventValues: Record<StatsUpdatePattern, { sanity: number; stamina: number }> = {
  walk: {
    sanity: 15,
    stamina: -95,
  },
  constant: {
    sanity: -10,
    stamina: 0,
  },
  idle: {
    sanity: -2,
    stamina: 12,
  },
  downstairs: {
    sanity: 900,
    stamina: 0,
  },
  turn: {
    sanity: 0,
    stamina: 0,
  },
}
