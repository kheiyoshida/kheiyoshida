import { Scaffold } from '../types.ts'
import { iterateScaffold, retrieveScaffoldEntity } from '../utils.ts'
import { DistortionScaffold, createDistortionScaffold } from './scaffold.ts'

export const Distortion = createDistortionScaffold()

export const applyDistortion = (scaffold: Scaffold, distScaffold: DistortionScaffold) => {
  iterateScaffold(scaffold, (position3d, scaffoldKey) => {
    const delta = retrieveScaffoldEntity(distScaffold.deltas, scaffoldKey)
    const values = delta.values
    position3d[0] += values[0]
    position3d[1] += values[1]
    position3d[2] += values[2]
  })
}
