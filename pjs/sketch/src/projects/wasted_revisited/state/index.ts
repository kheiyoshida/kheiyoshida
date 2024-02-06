import { makeCameraStore } from './camera'
import { makeGraphStore } from './graph'
import { makeSketchStore } from './sketch'

export const sketchStore = makeSketchStore()
export const graphStore = makeGraphStore()
export const cameraStore = makeCameraStore()
