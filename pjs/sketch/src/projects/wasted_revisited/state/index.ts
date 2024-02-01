import { makeCameraStore } from "./camera";
import { makeControlStore } from "./control";
import { makeGraphStore } from "./graph";
import { makeSketchStore } from "./sketch";

export const sketchStore = makeSketchStore()
export const graphStore = makeGraphStore()
export const controlStore = makeControlStore()
export const cameraStore = makeCameraStore()
