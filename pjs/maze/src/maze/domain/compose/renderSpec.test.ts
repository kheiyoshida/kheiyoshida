import { PathSpec } from './nodeSpec'
import { RenderGrid, convertToRenderGrid } from './renderSpec'

describe(`conversion to render specs`, () => {
  it(`should convert to render specs`, () => {
    /**
     * * \       ___
     * *  \    /|
     * *  |---` |
     * *  |     |
     * *  |---. |
     * *  /    \|___
     * * /
     */
    const specs: PathSpec = [
      null,
      {
        terrain: {
          left: 'corridor',
          front: 'wall',
          right: 'wall',
        },
      },
      {
        terrain: {
          left: 'wall',
          front: 'corridor',
          right: 'corridor',
        },
      },
    ]
    const expectResult: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
    expect(convertToRenderGrid(specs)).toMatchObject(expectResult)
  })

  it(`should include stair`, () => {
    const specs: PathSpec = [
      null,
      {
        terrain: {
          left: 'wall',
          front: 'wall',
          right: 'wall',
        },
        stair: true,
      },
      {
        terrain: {
          left: 'corridor',
          front: 'corridor',
          right: 'wall',
        },
      },
    ]
    const expectResult: RenderGrid = [null, null, [1, 1, 1], [1, 2, 1], [1, 0, 1], [0, 0, 1]]
    expect(convertToRenderGrid(specs)).toMatchObject(expectResult)
  })
})
