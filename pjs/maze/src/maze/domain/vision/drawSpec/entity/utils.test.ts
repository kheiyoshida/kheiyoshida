import { RenderPattern } from 'src/maze/service/render/compose/renderSpec'
import { DrawEntityGrid } from './drawEntity'
import { findPositionByEntity, removeEntity } from './utils'
import { DrawEntities } from './wall/entities'

describe(`util methods`, () => {
  /**
   * * \       ___
   * *  \    /|
   * *  |---` |
   * *  |     |
   * *  |---. |
   * *  /    \|___
   * * /
   */
  const _entityGrid: DrawEntityGrid<DrawEntities> = [
    null,
    null,
    ['wall-hori', 'wall-hori', null],
    [null, null, 'wall-vert'],
    ['wall-vert', null, 'edge-wall'],
    ['edge-wall', null, null],
  ]
  const factory = () =>
    _entityGrid.map((l) =>
      l ? l.slice() : null
    ) as DrawEntityGrid<DrawEntities>

  it(`can find position by entity`, () => {
    const grid = factory()
    expect(findPositionByEntity(grid, 'edge-wall')).toMatchObject([4, 2])
    expect(findPositionByEntity(grid, 'stair')).toBe(undefined)
  })

  it(`can remove entity and insert null`, () => {
    expect(removeEntity(factory(), [2, 1])).toMatchObject([
      null,
      null,
      ['wall-hori', null, null],
      [null, null, 'wall-vert'],
      ['wall-vert', null, 'edge-wall'],
      ['edge-wall', null, null],
    ])
  })
})
