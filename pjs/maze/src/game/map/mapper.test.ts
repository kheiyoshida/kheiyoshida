import { Mapper } from './mapper.ts'
import { makeTestGrid } from '../../__test__/grid/visualise.ts'

describe(`${Mapper.name}`, () => {
  it(`should track the visited cells`, () => {
    const mapper = new Mapper()
    const grid = makeTestGrid([
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ])
    mapper.resetMap(grid)

    expect(mapper.map.get({ x: 0, y: 0 })).toEqual({ visited: false })
    expect(mapper.map.get({ x: 1, y: 0 })).toEqual({ visited: false })
    expect(mapper.map.get({ x: 1, y: 1 })).toEqual(null)
  })
})
