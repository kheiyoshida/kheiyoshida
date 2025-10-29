import { Vec3 } from 'maze-gl'
import { Scaffold } from '../types.ts'
import { iterateScaffold, retrieveScaffoldEntity } from '../utils.ts'
import { ScaffoldDistortion, createScaffoldDistortion } from './scaffold.ts'

export const Distortion = createScaffoldDistortion()

export const applyDistortion = (scaffold: Scaffold, distScaffold: ScaffoldDistortion) => {
  iterateScaffold(scaffold, (position3d, scaffoldKey) => {
    const delta = retrieveScaffoldEntity(distScaffold.deltas, scaffoldKey)
    Vec3.add(position3d, delta.values)
  })
}
