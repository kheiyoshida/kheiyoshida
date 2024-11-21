import { Shader } from './shader'
import { generateRandomNumber } from '../../utils/id'

type UniformValues = Record<string, unknown>

export abstract class Material<U extends UniformValues = UniformValues> {
  constructor(
    readonly shader: Shader,
    protected uniforms: U,
    private id = generateRandomNumber()
  ) {}

  static currentMaterialId: number

  /**
   * apply this material to the geometries drawn after this call
   */
  apply() {
    if (Material.currentMaterialId === this.id) return
    this.shader.use()
    this.applyUniforms()
    Material.currentMaterialId = this.id
  }

  abstract applyUniforms(): void
}

export type Color = [number, number, number]
export type ColorMaterialUniforms = {
  shininess: number
  diffuse: Color
  specular: Color
}

export class ColorMaterial extends Material<ColorMaterialUniforms> {
  applyUniforms(): void {
    this.shader.setVec3('material.diffuse', this.uniforms.diffuse)
    this.shader.setVec3('material.specular', this.uniforms.specular)
    this.shader.setFloat('material.shininess', this.uniforms.shininess)
  }
}
