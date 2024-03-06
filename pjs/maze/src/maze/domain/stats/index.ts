import { toFloatPercent } from 'utils'
import { MazeState, store } from '../../store'

const MAX_STATUS_VALUE = 100
const MIN_STATUS_VALUE = 0

/**
 * status state in store
 */
export type StatusField = Extract<'stamina' | 'sanity', keyof MazeState>

/**
 * status object
 */
type Status = { [k in StatusField]: MazeState[k] }

/**
 * functions to manipulate statuses
 */
export type StatsManipFn = (amount: number) => void

/**
 * get current status
 */
export const getStats = (): Status => ({
  sanity: store.current.sanity,
  stamina: store.current.stamina,
})

export const nextStat = (current: number, amount: number, max: number, min: number): number => {
  const next = current + amount
  if (next >= max) return max
  else if (next <= min) return min
  else return next
}

/**
 * generate function to manipulate status state
 * returns false when it reaches the limit
 */
const manipStat =
  (field: StatusField, max = MAX_STATUS_VALUE, min = MIN_STATUS_VALUE): StatsManipFn =>
  (amount) => {
    const next = nextStat(store.current[field], amount, max, min)
    store.updateStatus(field, next)
  }

export const manipSanity = manipStat('sanity')
export const manipStamina = manipStat('stamina')

/**
 * event patterns for status update
 */
type StatsUpdatePattern = 'walk' | 'stand' | 'turn' | 'downstairs' | 'constant'

/**
 * renew status
 */
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

export const getSpeed = () => 1 / toFloatPercent(Math.min(100, 30 + store.current.stamina))
