import { statusStore } from '../../store'

export const manipSanity = (delta: number) => statusStore.addStatusValue('sanity', delta)
export const manipStamina = (delta: number) => statusStore.addStatusValue('stamina', delta)
type StatsUpdatePattern = 'walk' | 'stand' | 'turn' | 'downstairs' | 'constant'

export const updateStats = (pattern: StatsUpdatePattern) => {
  if (pattern === 'walk') {
    manipSanity(4)
    manipStamina(-4)
  } else if (pattern === 'turn') {
    manipStamina(-1)
  } else if (pattern === 'stand') {
    manipStamina(1)
    manipSanity(-1)
  } else if (pattern === 'downstairs') {
    manipSanity(50)
    manipStamina(20)
  }
}
