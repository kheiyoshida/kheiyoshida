import { GeometrySpec } from '../'
import { getGL } from '../../webgl'

/**
 * the reference to the data (indices range) of a geometry in the array buffer
 */
export type DrawRef = {
  vao: WebGLVertexArrayObject
  start: number
  end: number
}

// TODO: move somewhere
const AttributeLoc = {
  aPosition: 0,
  aNormal: 1,
  aTexCoords: 2,
}

const fBytes = (n: number) => n * Float32Array.BYTES_PER_ELEMENT

/**
 * load the given geometry & make it ready to be drawn
 */
export const loadGeometry = (spec: GeometrySpec): DrawRef => {
  const gl = getGL()

  const dataSource = parseGeometrySpecToArray(spec)

  const modelVAO = gl.createVertexArray()
  const modelVBO = gl.createBuffer()
  gl.bindVertexArray(modelVAO)

  gl.bindBuffer(gl.ARRAY_BUFFER, modelVBO)
  gl.bufferData(gl.ARRAY_BUFFER, dataSource, gl.STATIC_DRAW)

  const aPositionLoc = AttributeLoc.aPosition
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, fBytes(6), 0)
  gl.enableVertexAttribArray(aPositionLoc)

  const aNormalLoc = AttributeLoc.aNormal
  gl.vertexAttribPointer(aNormalLoc, 3, gl.FLOAT, false, fBytes(6), fBytes(3))
  gl.enableVertexAttribArray(aNormalLoc)

  // TODO: add texCoords

  gl.bindVertexArray(null)

  if (!modelVAO) throw Error(`failed to create VAO`)

  return {
    vao: modelVAO,
    start: 0,
    end: dataSource.length / 6, // TODO: fix when applying normals and other attributes
  }
}

export const parseGeometrySpecToArray = (spec: GeometrySpec): Float32Array => {
  const arr: number[] = []

  for (const triangle of spec.faces) {
    for (let i = 0; i < 3; i++) {
      const vertex = spec.vertices[triangle.vertexIndices[i]]
      const normal = spec.normals[triangle.normalIndices[i]]
      if (!vertex || !normal) {
        throw Error(`insufficient vertex or normal`)
      }
      arr.push(...vertex)
      arr.push(...normal);
      // TODO: add texCoords here
    }
  }

  return new Float32Array(arr)
}
