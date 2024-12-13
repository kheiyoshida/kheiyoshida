import { RenderingStyle, Stage } from '../../store/stage.ts'
import { clamp, fireByRate, makeConstrainedRandomEmitter, randomIntInclusiveBetween } from 'utils'
import { store } from '../../store'

export const InitialNumOfStages = 20

export const initStages = (): void => {
  store.setStageQueue(buildStages())
}

export const buildStages = (): Stage[] => {
  const stages: Stage[] = []
  let currentFloor = 1

  let currentStyle: RenderingStyle = 5
  const pickStyle = makeConstrainedRandomEmitter(
    () => clamp(currentStyle + randomIntInclusiveBetween(-3, 3), 1, 9) as RenderingStyle,
    (v, p) => evalStyle(v) === evalStyle(p),
    2 // can stay in the same rendering style for 2 stages in a row, but not more than that
  )

  for (let i = 0; i < InitialNumOfStages; i++) {
    const floors = fireByRate(0.66) ? 2 : 3
    const style = pickStyle()
    stages.push({
      number: i,
      mode: 'atmospheric',
      startFloor: currentFloor,
      endFloor: currentFloor + floors,
      style,
    })
    currentFloor += floors + 1
    currentStyle = style
  }

  return stages
}

const evalStyle = (s: RenderingStyle) => {
  if (s >= 1 && s <= 3) return 0
  if (s >= 4 && s <= 6) return 1
  if (s >= 7 && s <= 9) return 2
}
