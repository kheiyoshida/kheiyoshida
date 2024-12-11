import { Shader } from '../shader'
import { generateRandomNumber } from '../../utils/calc'
import { Color, RGB } from '../../color'

type UniformValues = Record<string, unknown>

export abstract class Material<U extends UniformValues = UniformValues> {
  protected constructor(
    readonly shader: Shader,
    protected uniforms: U,
    private id = generateRandomNumber()
  ) {}

  static currentMaterialId: number

  /**
   * apply this material to the geometries drawn after this call
   */
  apply() {
    this.shader.use()
    if (Material.currentMaterialId !== this.id) {
      this.applyUniforms()
      Material.currentMaterialId = this.id
    }
  }

  abstract applyUniforms(): void
}

export type ColorMaterialUniforms = {
  shininess: number
  diffuse: RGB
  specular: RGB
}

export class ColorMaterial extends Material<ColorMaterialUniforms> {
  constructor(
    shader: Shader,
    uniforms: ColorMaterialUniforms = {
      diffuse: [0.25, 0.24, 0.25],
      shininess: 0.5,
      specular: [0.05, 0.05, 0.05],
    }
  ) {
    super(shader, uniforms)
  }

  applyUniforms(): void {
    this.shader.setVec3('material.diffuse', this.uniforms.diffuse)
    this.shader.setVec3('material.specular', this.uniforms.specular)
    this.shader.setFloat('material.shininess', this.uniforms.shininess)
  }

  setColor(color: Color) {
    this.uniforms.diffuse = color.normalizedRGB
    this.uniforms.specular = color.normalizedRGB
  }

  setShininess(shininess: number) {
    this.uniforms.shininess = shininess
  }
}
