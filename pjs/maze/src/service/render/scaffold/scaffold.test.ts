import { Scaffold, ScaffoldValues } from './scaffold.ts'
import { ViewX, ViewY, ViewZ } from '../../../integration/query/structure/view/view.ts'
import { DeformedBox } from 'maze-gl'

describe(`${Scaffold.name}`, () => {
  it(`should provide deformed boxes for each corresponding view position`, () => {
    const scaffold = new Scaffold()

    const values: ScaffoldValues = {
      floor: 400,
      path: 600,
      wall: 400,
      distortionRange: 0,
      distortionSpeed: 0,
    }
    scaffold.update(values)

    const box = scaffold.getBox({ x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1 })

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

    scaffold.update({...values, distortionRange: 100, distortionSpeed: 10})
    expect(scaffold.getBox({ x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1 })).not.toEqual(expected)
  })
})
