import { FloorStage, RenderingMode, RenderingStyle, Stage } from '../../store/stage.ts'
import {
  clamp,
  fireByRate,
  makeConstrainedRandomEmitter,
  makeRangeMap,
  randomIntInAsymmetricRange,
  randomIntInclusiveBetween,
} from 'utils'
import { store } from '../../store'

export const InitialNumOfStages = 20

const InitialStyle = 5

export const initStages = (): void => {
  store.setStageQueue(mapStagesToFloors(buildStages()))
}

export const buildStages = (): Stage[] => {
  // return fixedStages

  const stages: Stage[] = []
  let currentFloor = 1

  let currentStyle: RenderingStyle = 5
  const pickStyle = makeConstrainedRandomEmitter(
    () => {
      if (currentFloor === 1) return InitialStyle // initial style
      return clamp(currentStyle + randomIntInclusiveBetween(-3, 3), 1, 9) as RenderingStyle
    },
    (v, p) => evalStyle(v) === evalStyle(p),
    2 // can stay in the same rendering style for 2 stages in a row, but not more than that
  )

  let currentMode = RenderingMode.atmospheric

  for (let s = 0; s < InitialNumOfStages; s++) {
    const floors = fireByRate(0.66) ? 2 : 3
    const style = pickStyle()

    // update mode every 2 stages
    if (s >= 2 && s % 2 === 0) {
      const [min, max] = stageModeMap.get(s)
      currentMode = clamp(currentMode + (fireByRate(0.5) ? 1 : -1), min, max)
    }

    stages.push({
      number: s,
      mode: currentMode,
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

type ModeRange = [min: RenderingMode, max: RenderingMode]

export const stageModeMap = makeRangeMap<ModeRange>([
  [[1, 2], [RenderingMode.atmospheric, RenderingMode.atmospheric]],
  [[3, 4], [RenderingMode.atmospheric, RenderingMode.smooth]],
  [[5, 6], [RenderingMode.smooth, RenderingMode.ambient]],
  [[7, 8], [RenderingMode.ambient, RenderingMode.digital]],
  [[9, 10], [RenderingMode.digital, RenderingMode.abstract]],
  [[11, 12], [RenderingMode.digital, RenderingMode.abstract]],
  [[11, 12], [RenderingMode.digital, RenderingMode.digital]],
  [[13, 14], [RenderingMode.atmospheric, RenderingMode.digital]], // full range
])

export const mapStagesToFloors = (stages: Stage[]): FloorStage[] => {
  const floorStages: FloorStage[] = []
  for (const stage of stages) {
    for (let i = stage.startFloor; i <= stage.endFloor; i++) {
      floorStages.push({
        mode: stage.mode,
        style: stage.style,
      })
    }
  }
  return floorStages
}
