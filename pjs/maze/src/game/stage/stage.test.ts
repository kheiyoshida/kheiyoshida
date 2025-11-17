import { buildStages, stageModeMap } from './stage.ts'
import { Atmosphere } from '../world'

describe(`${buildStages.name}`, () => {
  test(`each stage lasts for 1-2 floors`, () => {
    const stages = buildStages()
    expect(stages.length).toBeGreaterThan(10)
    stages.forEach((stage, i) => {
      expect(stage.endLevel - stage.startLevel + 1).toBeGreaterThanOrEqual(1)
      expect(stage.endLevel - stage.startLevel + 1).toBeLessThanOrEqual(2)
      if (stages[i + 1]) {
        expect(stages[i + 1].startLevel).toBe(stage.endLevel + 1)
      }
    })
  })
  test.each([...Array(100)])(
    `if the same world structure is used for 2 stages, the next stage should use another`,
    () => {
      const stages = buildStages()
      const structures = stages.map((stage) => stage.world.structure)

      for (let i = 0; i < structures.length; i++) {
        if (structures[i] === structures[i + 1]) {
          expect(structures[i + 2]).not.toBe(structures[i])
        }
      }
    }
  )
  test.each([...Array(100)])(
    `it should change world atmosphere every 2 stages, but can only shift to the "adjacent" one in the range`,
    () => {
      const stages = buildStages()
      const atmosphereList = stages.map((stage) => stage.world.atmosphere)

      let prev: Atmosphere | undefined
      for (let i = 0; i < atmosphereList.length; i += 2) {
        expect(atmosphereList[i]).toBe(atmosphereList[i + 1])

        const range = stageModeMap.get(i)
        expect(atmosphereList[i]).toBeGreaterThanOrEqual(range[0])
        expect(atmosphereList[i]).toBeLessThanOrEqual(range[1])

        if (prev) {
          expect(Math.abs(prev - atmosphereList[i])).toBeLessThanOrEqual(1)
        }
        prev = atmosphereList[i]
      }
    }
  )
})
