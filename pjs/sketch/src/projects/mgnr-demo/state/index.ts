import { makeCameraStore } from './camera'
import { makeSketchStore } from './sketch'
import { makeVariableStore } from './variable'

export const sketchStore = makeSketchStore()
export const variableStore = makeVariableStore()
export const cameraStore = makeCameraStore()