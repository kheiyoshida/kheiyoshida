import { glMatrix, vec3 } from 'gl-matrix'
import { GeometrySpec, Vector3D } from '../../../lib/model/parse'

glMatrix.setMatrixArrayType(Array)

export class Tetrahedron {
  constructor(private geometrySpec: GeometrySpec, private avoidIndex?: number) {
    const sum = geometrySpec.vertices.reduce((pre, acc) => vec3.add(pre, pre, acc), vec3.create())
    this.center = vec3.div(sum, sum, vec3.fromValues(4, 4, 4)) as Vector3D
  }

  public readonly center: Vector3D

  public mapToArray(): number[] {
    const arr: number[] = []
    const spec = this.geometrySpec

    for (const triangle of spec.faces) {
      for (let i = 0; i < 3; i++) {
        const vertex = spec.vertices[triangle.vertexIndices[i]]
        const normal = spec.normals[triangle.normalIndices[i]]

        arr.push(...vertex)
        arr.push(...normal)
        arr.push(...this.center)
      }
    }

    return arr
  }

  private static readonly reflectionCoefficient = 1.632993
  private static readonly q = vec3.fromValues(
    Tetrahedron.reflectionCoefficient,
    Tetrahedron.reflectionCoefficient,
    Tetrahedron.reflectionCoefficient
  )

  private getExtendIndex(): number {
    const i = Math.floor(Math.random() * 3) // 0, 1, 2
    if (i === this.avoidIndex) return i + 1 // 0 ~ 3
    return i
  }

  public extend(vertexIndex: number = this.getExtendIndex()): Tetrahedron {
    const newGeometrySpec: GeometrySpec = {
      vertices: [...this.geometrySpec.vertices],
      normals: [...this.geometrySpec.normals],
      faces: [...this.geometrySpec.faces],
    }

    // vertex reflection
    const reflectionVertex = this.geometrySpec.vertices[vertexIndex]
    const reflectionFace = this.geometrySpec.faces.find((face) => !face.vertexIndices.includes(vertexIndex))
    if (!reflectionFace) throw new Error('no reflection face')
    const faceNormal = this.geometrySpec.normals[reflectionFace?.normalIndices[0]]
    const reflectedVertex = vec3.add(
      vec3.create(),
      reflectionVertex,
      vec3.mul(vec3.create(), faceNormal, Tetrahedron.q)
    )
    newGeometrySpec.vertices[vertexIndex] = reflectedVertex as Vector3D

    // handle winding order
    const newFaces = []
    for (const face of this.geometrySpec.faces) {
      const newFace = { ...face }
      newFace.vertexIndices = [face.vertexIndices[0], face.vertexIndices[2], face.vertexIndices[1]]
      newFaces.push(newFace)
    }
    newGeometrySpec.faces = newFaces

    // compute normals
    for(const face of newGeometrySpec.faces) {
      const normal = vec3.create()
      const v0 = newGeometrySpec.vertices[face.vertexIndices[0]]
      const v1 = newGeometrySpec.vertices[face.vertexIndices[1]]
      const v2 = newGeometrySpec.vertices[face.vertexIndices[2]]
      vec3.cross(normal, vec3.sub(vec3.create(), v1, v0), vec3.sub(vec3.create(), v2, v0))
      vec3.normalize(normal, normal)
      newGeometrySpec.normals[face.normalIndices[0]] = normal as Vector3D
    }

    return new Tetrahedron(newGeometrySpec, vertexIndex)
  }
}
