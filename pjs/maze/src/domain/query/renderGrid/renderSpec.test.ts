import { PathSpec } from './nodeSpec'
import { convertToRenderGrid, RenderGrid } from './renderSpec'

describe(`${convertToRenderGrid.name}`, () => {
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
      {
        terrain: {
          left: 'wall',
          front: 'corridor',
          right: 'corridor',
        },
      },
      {
        terrain: {
          left: 'corridor',
          front: 'wall',
          right: 'wall',
        },
      },
      null,
    ]
    const expectResult: RenderGrid = [
      null,
      null, //
      [1, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as RenderGrid // reverse for readability
    expect(convertToRenderGrid(specs)).toMatchObject(expectResult)
  })

  it(`should include stair`, () => {
    const specs: PathSpec = [
      {
        terrain: {
          left: 'corridor',
          front: 'corridor',
          right: 'wall',
        },
      },
      {
        terrain: {
          left: 'wall',
          front: 'wall',
          right: 'wall',
        },
        stair: true,
      },
      null,
    ]
    const expectResult: RenderGrid = [
      null,
      null,
      [1, 1, 1],
      [1, 2, 1], // <- stair
      [1, 0, 1],
      [0, 0, 1],
    ].reverse() as RenderGrid // reverse for readability
    expect(convertToRenderGrid(specs)).toMatchObject(expectResult)
  })
})
