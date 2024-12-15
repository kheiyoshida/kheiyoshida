import { RenderGrid } from '../../../../domain/query'
import { convertToClassicGeometryCodes } from './default.ts'

describe(`${convertToClassicGeometryCodes.name}`, () => {
  it(`converts render patterns to geometry codes in default style`, () => {
    const grid: RenderGrid = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as RenderGrid

    const {grid: codeGrid} = convertToClassicGeometryCodes(grid)
    expect(codeGrid).toEqual(
      [
        [[], [], []],
        [[], [], []],
        // TODO: remove unnecessary geometry codes
        [['FrontWall', 'LeftWall'], ['FrontWall'], ['FrontWall', 'RightWall']],
        [
          ['Floor', 'Ceil'],
          ['Floor', 'Ceil'],
          ['FrontWall', 'RightWall'],
        ],
        [
          ['FrontWall', 'LeftWall'],
          ['Floor', 'Ceil'],
          ['FrontWall', 'RightWall'],
        ],
        [
          ['FrontWall', 'LeftWall'],
          ['Floor', 'Ceil'],
          ['Floor', 'Ceil'],
        ],
      ].reverse()
    )
  })
  test(`stairs`, () => {
    const grid: RenderGrid = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [1, 2, 1], // stair
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as RenderGrid

    const {grid: codeGrid} = convertToClassicGeometryCodes(grid)
    expect(codeGrid).toEqual(
      [
        [[], [], []],
        [[], [], []],
        [['FrontWall', 'LeftWall'], ['FrontWall'], ['FrontWall', 'RightWall']],
        [
          ['FrontWall', 'LeftWall'],
          [
            'StairCeil',
            'StairSteps',
            'StairRightWall',
            'StairLeftWall',
            'StairCorridorRightWall',
            'StairCorridorLeftWall',
            'StairCorridorCeil',
            'StairCorridorFloor',
          ],
          ['FrontWall', 'RightWall'],
        ],
        [
          ['FrontWall', 'LeftWall'],
          ['Floor', 'Ceil'],
          ['FrontWall', 'RightWall'],
        ],
        [
          ['FrontWall', 'LeftWall'],
          ['Floor', 'Ceil'],
          ['Floor', 'Ceil'],
        ],
      ].reverse()
    )
  })

  test(`stairs_warp`, () => {
    const grid: RenderGrid = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [1, 3, 1], // stair_warp
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as RenderGrid

    const {grid: codeGrid} = convertToClassicGeometryCodes(grid)
    expect(codeGrid).toEqual(
      [
        [[], [], []],
        [[], [], []],
        [['FrontWall', 'LeftWall'], ['FrontWall'], ['FrontWall', 'RightWall']],
        [
          ['FrontWall', 'LeftWall'],
          ['Octahedron', 'Floor', 'Ceil'],
          ['FrontWall', 'RightWall'],
        ],
        [
          ['FrontWall', 'LeftWall'],
          ['Floor', 'Ceil'],
          ['FrontWall', 'RightWall'],
        ],
        [
          ['FrontWall', 'LeftWall'],
          ['Floor', 'Ceil'],
          ['Floor', 'Ceil'],
        ],
      ].reverse()
    )
  })
})
