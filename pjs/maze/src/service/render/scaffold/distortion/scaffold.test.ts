import { NumOfScaffoldLayers } from '../create.ts'
import { DistortionDelta } from '../types.ts'
import * as delta from './delta.ts'
import { createDistortionScaffold, turnDistortionDelta } from './scaffold.ts'
import { LR } from '../../../../utils/direction.ts'
import { Position3D } from 'p5utils/src/3d/types.ts'

describe(`${createDistortionScaffold.name}`, () => {
  it(`should create initial scaffold`, () => {
    const scaffold = createDistortionScaffold()
    expect(scaffold.deltas).toHaveLength(NumOfScaffoldLayers)
  })
  it(`can update delta values within range`, () => {
    const move = jest.fn()
    jest
      .spyOn(delta, 'createDistortionDelta')
      .mockReturnValue({ move } as unknown as DistortionDelta)
    const scaffold = createDistortionScaffold()
    scaffold.updateDeltas(3, 1)
    expect(move).toHaveBeenCalledWith(3, 1)
    expect(move).toHaveBeenCalledTimes(4 * 2 * 7)
  })
})

test.each([
  [[2, 0, 1], 'right', [1, 0, -2]],
  [[2, 0, 1], 'left', [-1, 0, 2]],
  [[2, 0, -1], 'right', [-1, 0, -2]],
  [[2, 0, -1], 'left', [1, 0, 2]],
])(`${turnDistortionDelta.name} (%s, %s)`, (values, lr, expected) => {
  const result = turnDistortionDelta(values as Position3D, lr as LR)
  expect(result).toMatchObject(expected)
})
