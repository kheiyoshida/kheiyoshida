import { PathSpec } from './path.ts'
import { convertToLogicalView, LogicalView } from './logicalView.ts'

describe(`${convertToLogicalView.name}`, () => {
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
    const expectResult: LogicalView = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as LogicalView // for readability

    expect(convertToLogicalView(specs)).toMatchObject(expectResult)
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
        stair: 'normal',
      },
      null,
    ]
    const expectResult: LogicalView = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [1, 2, 1], // <- stair
      [1, 0, 1],
      [0, 0, 1],
    ].reverse() as LogicalView // reverse for readability
    expect(convertToLogicalView(specs)).toMatchObject(expectResult)
  })
})
