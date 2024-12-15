import { buildStages, mapStagesToFloors, stageModeMap } from './stage.ts'
import { FloorStage, RenderingMode, Stage } from '../../store/stage.ts'

describe(`${buildStages.name}`, () => {
  test(`each stage lasts for 2-3 floors`, () => {
    const stages = buildStages()
    expect(stages.length).toBeGreaterThan(10)
    stages.forEach((stage, i) => {
      expect(stage.endFloor - stage.startFloor).toBeGreaterThanOrEqual(2)
      expect(stage.endFloor - stage.startFloor).toBeLessThanOrEqual(3)
      if (stages[i + 1]) {
        expect(stages[i + 1].startFloor).toBe(stage.endFloor + 1)
      }
    })
  })
  test.each([...Array(100)])(
    `if the same style is used for 2 stages, the next stage should use another`,
    () => {
      const stages = buildStages()
      const styles = stages.map((stage) => stage.style)

      for (let i = 0; i < styles.length; i++) {
        if (styles[i] === styles[i + 1]) {
          expect(styles[i + 2]).not.toBe(styles[i])
        }
      }
    }
  )
  test(`it should change modes every 2 stages, but can only shift to the "adjacent" one in the range`, () => {
    const stages = buildStages()
    const modes = stages.map((stage) => stage.mode)

    let prev: RenderingMode | undefined
    for (let i = 0; i < modes.length; i += 2) {
      expect(modes[i]).toBe(modes[i + 1])

      const range = stageModeMap.get(i)
      expect(modes[i]).toBeGreaterThanOrEqual(range[0])
      expect(modes[i]).toBeLessThanOrEqual(range[1])

      if (prev) {
        expect(Math.abs(prev - modes[i])).toBe(1)
      }
      prev = modes[i]
    }
  })
})

test(`${mapStagesToFloors.name}`, () => {
  const stages: Stage[] = [
    {
      number: 1,
      startFloor: 1,
      endFloor: 2,
      style: 2, // poles
      mode: RenderingMode.atmospheric,
    },
    {
      number: 2,
      startFloor: 3,
      endFloor: 5,
      style: 5, // default
      mode: RenderingMode.atmospheric,
    },
    {
      number: 3,
      startFloor: 6,
      endFloor: 7,
      style: 8, // tiles
      mode: RenderingMode.smooth,
    },
  ]
  const expected: FloorStage[] = [
    // 1 - 2
    {
      style: 2,
      mode: RenderingMode.atmospheric,
    },
    {
      style: 2,
      mode: RenderingMode.atmospheric,
    },
    // 3 - 5
    {
      style: 5,
      mode: RenderingMode.atmospheric,
    },
    {
      style: 5,
      mode: RenderingMode.atmospheric,
    },
    {
      style: 5,
      mode: RenderingMode.atmospheric,
    },
    // 6 - 7
    {
      style: 8,
      mode: RenderingMode.smooth,
    },
    {
      style: 8,
      mode: RenderingMode.smooth,
    },
  ]
  const floorStages = mapStagesToFloors(stages)

  expect(floorStages).toEqual(expected)
})
