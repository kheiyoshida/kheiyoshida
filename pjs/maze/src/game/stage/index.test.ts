import { Stage, StageContext } from './index.ts'
import { Atmosphere } from '../world'
import * as stage from './stage.ts'

describe(`${StageContext.name}`, () => {
  it(`can get world for a given level`, () => {
    const stages: Stage[] = [
      {
        number: 1,
        startLevel: 1,
        endLevel: 2,
        world: {
          structure: 'classic',
          atmosphere: Atmosphere.atmospheric,
          ambience  : 5,
        }
      },
      {
        number: 1,
        startLevel: 3,
        endLevel: 5,
        world: {
          structure: 'poles',
          atmosphere: Atmosphere.atmospheric,
          ambience  : 3
        }
      },
      {
        number: 1,
        startLevel: 6,
        endLevel: 7,
        world: {
          structure: 'classic',
          atmosphere: Atmosphere.smooth,
          ambience  : 5
        }
      },
    ]

    jest.spyOn(stage, 'buildStages').mockReturnValueOnce(stages)

    const ctx = new StageContext()
    expect(ctx.getWorld(1)).toEqual(stages[0].world)
    expect(ctx.getWorld(2)).toEqual(stages[0].world)
    expect(ctx.getWorld(3)).toEqual(stages[1].world)
    expect(ctx.getWorld(4)).toEqual(stages[1].world)
    expect(ctx.getWorld(5)).toEqual(stages[1].world)
    expect(ctx.getWorld(6)).toEqual(stages[2].world)
    expect(ctx.getWorld(7)).toEqual(stages[2].world)
  })
})


