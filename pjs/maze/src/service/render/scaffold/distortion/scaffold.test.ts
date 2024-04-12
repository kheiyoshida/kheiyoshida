import * as delta from './delta'
import { NumOfScaffoldLayers } from '../create'
import { createDistortionScaffold } from './scaffold'
import { DistortionDelta } from '../types'

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
