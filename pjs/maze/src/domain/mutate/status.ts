import { statusStore } from '../../store'
import { FPS } from '../../config'

export const addSanity = (delta: number) => statusStore.addStatusValue('sanity', delta)
export const addStamina = (delta: number) => statusStore.addStatusValue('stamina', delta)

type StatsUpdatePattern = 'walk' | 'constant' | 'turn' | 'downstairs' | 'idle'

export const updateStats = (pattern: StatsUpdatePattern) => {
  const { sanity, stamina } = StatusEventValues[pattern]
  if (sanity) {
    addSanity(sanity)
  }
  if (stamina) {
    addStamina(stamina)
  }
}

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
