import { makeSkinStore } from './skin'
import { makeCameraStore } from './camera'
import { makeGeometryStore } from './geometry'
import { makeSketchStore } from './sketch'

export const sketchStore = makeSketchStore()
export const cameraStore = makeCameraStore()
export const geometryStore = makeGeometryStore()
export const skinStore = makeSkinStore()