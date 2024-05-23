import { makeCameraStore } from './camera'
import { makeObjectStore } from './object'
import { makeSketchStore } from './sketch'
import { makeVariableStore } from './variable'

export const sketchStore = makeSketchStore()
export const variableStore = makeVariableStore()
export const cameraStore = makeCameraStore()
export const objectStore = makeObjectStore()
