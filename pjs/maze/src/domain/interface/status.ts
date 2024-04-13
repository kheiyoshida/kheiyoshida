import { statusStore } from '../../store'

export const addSanity = (delta: number) => statusStore.addStatusValue('sanity', delta)
export const addStamina = (delta: number) => statusStore.addStatusValue('stamina', delta)

type StatsUpdatePattern = 'walk' | 'constant' | 'turn' | 'downstairs'

export const updateStats = (pattern: StatsUpdatePattern) => {
  const { sanity, stamina } = StatusEventValues[pattern]
  if (sanity) {
    addSanity(sanity)
  }
  if (stamina) {
    addStamina(stamina)
  }
}

const StatusEventValues: Record<StatsUpdatePattern, { sanity: number; stamina: number }> = {
  walk: {
    sanity: 4,
    stamina: -3,
  },
  turn: {
    sanity: 0,
    stamina: -1,
  },
  constant: {
    sanity: -1,
    stamina: 1,
  },
  downstairs: {
    sanity: 50,
    stamina: 0,
  },
}
