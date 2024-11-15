import { glMatrix } from 'gl-matrix'

export * from './models'
export * from './render'

// TODO: consider if this makes things faster
glMatrix.setMatrixArrayType(Array)
