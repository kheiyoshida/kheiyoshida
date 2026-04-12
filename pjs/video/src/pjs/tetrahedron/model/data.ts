import { vec3} from 'gl-matrix'
import { GeometrySpec, Vector3D } from '../../../lib/model/parse'

export class Tetrahedron {
  constructor(private geometrySpec: GeometrySpec) {
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
  private static readonly q = vec3.fromValues(Tetrahedron.reflectionCoefficient, Tetrahedron.reflectionCoefficient, Tetrahedron.reflectionCoefficient)

  public extend(vertexIndex: number): Tetrahedron {
    const newGeometrySpec:GeometrySpec = deepCopy(this.geometrySpec)

    const reflectionVertex = this.geometrySpec.vertices[vertexIndex]
    const reflectionFace = this.geometrySpec.faces.find(face => !face.vertexIndices.includes(vertexIndex))
    if (!reflectionFace) throw new Error('no reflection face')
    const faceNormal = this.geometrySpec.normals[reflectionFace?.normalIndices[0]]
    vec3.normalize(faceNormal, faceNormal)
    const reflectedVertex = vec3.add(vec3.create(), reflectionVertex, vec3.mul(vec3.create(), faceNormal, Tetrahedron.q))

    newGeometrySpec.vertices[vertexIndex] = reflectedVertex as Vector3D

    for (const face of newGeometrySpec.faces) {
      face.vertexIndices = [face.vertexIndices[0], face.vertexIndices[2], face.vertexIndices[1]]
    }

    return new Tetrahedron(newGeometrySpec)
  }
}

const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj))
