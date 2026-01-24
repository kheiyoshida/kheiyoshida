import { mat4, vec3 } from 'gl-matrix'

export const getView = () => {
  const position: vec3 = [0, 0, 3.0]

  // get view matrix
  const view = mat4.create()
  mat4.lookAt(view, position, [0, 0, 0], [0, 1, 0])

  // get projection matrix
  const projection = mat4.create()
  mat4.perspective(projection, 1.0, 16/9, 0.01, 5.0)

  return [view, projection]
}
