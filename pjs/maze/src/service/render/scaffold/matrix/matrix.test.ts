import { ScaffoldPointMatrix } from './matrix.ts'
import { ViewX, ViewY, ViewZ } from '../../../../integration/query/structure/view/view.ts'
import { DeformedBox } from 'maze-gl'

describe(`${ScaffoldPointMatrix.name}`, () => {
  it(`should hold points data`, () => {
    const matrix = new ScaffoldPointMatrix(400, 600, 400)
    const box = matrix.getBox({ x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1 })
    const expected: DeformedBox = {
      FBL: [-200, -200, 200],
      FBR: [200, -200, 200],
      FTL: [-200, 200, 200],
      FTR: [200, 200, 200],
      BBL: [-200, -200, -200],
      BBR: [200, -200, -200],
      BTL: [-200, 200, -200],
      BTR: [200, 200, -200],
    }
    expect(box).toEqual(expected)
  })
})
