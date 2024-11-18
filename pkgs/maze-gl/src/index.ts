import { glMatrix } from 'gl-matrix'

export * from './models'
export * from './render'
export * from './frame'

// TODO: consider if this makes things faster
glMatrix.setMatrixArrayType(Array)
