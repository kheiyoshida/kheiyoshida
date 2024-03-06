import { toFloatPercent } from 'utils'
import { statusStore } from '../../store'

export const getStats = () => statusStore.current

export const manipSanity = (delta: number) => statusStore.addStatusValue('sanity', delta)
export const manipStamina = (delta: number) => statusStore.addStatusValue('stamina', delta)

type StatsUpdatePattern = 'walk' | 'stand' | 'turn' | 'downstairs' | 'constant'

export const updateStats = (pattern: StatsUpdatePattern) => {
  if (pattern === 'walk') {
    manipSanity(1)
    manipStamina(-2)
  } else if (pattern === 'turn') {
    manipStamina(-1)
    manipSanity(-1)
  } else if (pattern === 'stand') {
    manipStamina(2)
  } else if (pattern === 'downstairs') {
    manipSanity(30)
  } else if (pattern === 'constant') {
    manipSanity(-1)
  }
}

/**
 * get thresholds to trigger sanity/stamin low effects
 */
export const floorToThreshold = (floor: number): [number, number] => {
  if (floor < 8) return [70, 30]
  if (floor < 16) return [80, 40]
  return [90, 50]
}

export const getSpeed = () => 1 / toFloatPercent(Math.min(100, 30 + statusStore.current.stamina))
