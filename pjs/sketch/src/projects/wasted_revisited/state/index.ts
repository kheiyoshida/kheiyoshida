import { makeCameraStore } from './camera'
import { makeGraphStore } from './graph'
import { makeSketchStore } from './sketch'
import { makeSkinStore } from './skin'

export const sketchStore = makeSketchStore()
export const graphStore = makeGraphStore()
export const cameraStore = makeCameraStore()
export const skinStore = makeSkinStore()