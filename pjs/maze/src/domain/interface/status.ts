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
    sanity: 5,
    stamina: -50,
  },
  turn: {
    sanity: 0,
    stamina: 0,
  },
  constant: {
    sanity: -10,
    stamina: 20,
  },
  downstairs: {
    sanity: 10 * 2 * 40, // + 40 seconds
    stamina: 0,
  },
}
