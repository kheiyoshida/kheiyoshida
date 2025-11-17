import { FloorStage, Stage } from './index.ts'
import {
  clamp,
  fireByRate,
  makeConstrainedRandomEmitter,
  makeRangeMap,
  randomIntInclusiveBetween,
} from 'utils'
import { debugRenderingMode, InitialStyle } from '../../config/debug.ts'
import { classifyStyle, RenderingStyle } from './style.ts'
import { Atmosphere } from '../world'

export const InitialNumOfStages = 20

export const buildFloorStages = () => {
  const stages = buildStages()
  const floorStages = mapStagesToFloors(stages)

  if (process.env.DEBUG === 'true') {
    floorStages[0].mode = debugRenderingMode
    floorStages[1].mode = debugRenderingMode
  }

  return floorStages
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
    (v, p) => classifyStyle(v) === classifyStyle(p),
    2 // can stay in the same rendering style for 2 stages in a row, but not more than that
  )

  let currentMode = Atmosphere.atmospheric

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

type ModeRange = [min: Atmosphere, max: Atmosphere]

// prettier-ignore
export const stageModeMap = makeRangeMap<ModeRange>([
  [[0, 1], [Atmosphere.atmospheric, Atmosphere.atmospheric]],
  [[2, 3], [Atmosphere.smooth, Atmosphere.smooth]],
  [[4, 5], [Atmosphere.smooth, Atmosphere.ambient]],
  [[6, 7], [Atmosphere.ambient, Atmosphere.digital]],
  [[8, 9], [Atmosphere.digital, Atmosphere.abstract]],
  [[10, 11], [Atmosphere.abstract, Atmosphere.abstract]],
  [[12, 13], [Atmosphere.digital, Atmosphere.abstract]],
  [[14, 15], [Atmosphere.atmospheric, Atmosphere.digital]], // full range
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
