import { FloorStage, RenderingMode, RenderingStyle, Stage } from '../../store/stage.ts'
import {
  clamp,
  fireByRate,
  makeConstrainedRandomEmitter,
  makeRangeMap,
  randomIntInclusiveBetween,
} from 'utils'
import { store } from '../../store'
import { debugRenderingMode, InitialStyle } from '../../config/debug.ts'

export const InitialNumOfStages = 20

export const initStages = (): void => {
  const stages = buildStages()
  console.log(stages)
  const floorStages = mapStagesToFloors(stages)

  if (process.env.DEBUG === 'true') {
    floorStages[0].mode = debugRenderingMode
    floorStages[1].mode = debugRenderingMode
  }

  console.log(floorStages)
  store.setStageQueue(floorStages)
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
    const floors = fireByRate(0.8) ? 1 : 0
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

// prettier-ignore
export const stageModeMap = makeRangeMap<ModeRange>([
  [[0, 1], [RenderingMode.atmospheric, RenderingMode.atmospheric]],
  [[2, 3], [RenderingMode.atmospheric, RenderingMode.smooth]],
  [[4, 5], [RenderingMode.smooth, RenderingMode.ambient]],
  [[6, 7], [RenderingMode.ambient, RenderingMode.digital]],
  [[8, 9], [RenderingMode.digital, RenderingMode.abstract]],
  [[10, 11], [RenderingMode.abstract, RenderingMode.abstract]],
  [[12, 13], [RenderingMode.digital, RenderingMode.abstract]],
  [[14, 15], [RenderingMode.atmospheric, RenderingMode.digital]], // full range
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
