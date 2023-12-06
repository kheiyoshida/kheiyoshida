import { RenderGrid } from 'src/maze/service/render/compose/renderSpec'
import { generateDrawEntityGrid } from './grid'

describe(`floor grid generation`, () => {
  it(`should generate entity grid based on the "cliff" edges in the terrain`, () => {
    const grid: RenderGrid = [
      null,
      null,
      [1, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [1, 0, 0],
    ]
    expect(generateDrawEntityGrid(grid)).toMatchObject([
      null,
      null,
      [null, null, null],
      ['path-side', 'l', null],
      [null, 'f', null],
      [null, 'fr', 'path-side-forefront'],
    ])
  })
  it(`include stair`, () => {
    const grid: RenderGrid = [
      [1, 1, 1],
      [1, 2, 1],
      [1, 0, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 0, 0],
    ]
    expect(generateDrawEntityGrid(grid)).toMatchObject([
      [null, null, null],
      [null, 'stair', null],
      [null, 'f', null],
      [null, 'fr', 'path-side'],
      [null, 'f', null],
      [null, 'fr', 'path-side-forefront'],
    ])
  })
})
