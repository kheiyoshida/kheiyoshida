import { makeCameraStore } from './camera'
import { makeGeometryStore } from './geometry'
import { makeSketchStore } from './sketch'

export const sketchStore = makeSketchStore()
export const cameraStore = makeCameraStore()
export const geometryStore = makeGeometryStore()