import { RenderGrid } from '../../../../../../domain/compose/renderSpec'
import { generateDrawEntityGrid } from './grid'

describe(`drawEntity`, () => {
  it(`should generate draw entities `, () => {
    /**
     * * \       ___
     * *  \    /|
     * *  |---` |
     * *  |     |
     * *  |---. |
     * *  /    \|___
     * * /
     */
    const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
    expect(generateDrawEntityGrid(grid)).toMatchObject([
      null,
      null,
      ['wall-hori', 'wall-hori', null],
      [null, null, 'wall-vert'],
      ['wall-vert', null, 'edge-wall'],
      ['wall-vert', null, 'wall-hori-extend'],
    ])
  })

  it(`should include stair `, () => {
    const grid: RenderGrid = [null, null, [1, 1, 1], [1, 2, 1], [1, 0, 1], [1, 0, 0]]
    expect(generateDrawEntityGrid(grid)).toMatchObject([
      null,
      null,
      [null, null, null],
      [null, 'stair', null],
      ['wall-vert', null, 'edge-wall'],
      ['wall-vert', null, 'wall-hori-extend'],
    ])
  })
})
