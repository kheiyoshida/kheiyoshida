import { generateRandomNumber } from '../../../../utils/calc'
import { Color, RGB } from '../../../supporting/color'
import { Shader } from 'graph-gl'

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
  relativeColor: RGB
}

export class ColorMaterial extends Material<ColorMaterialUniforms> {
  constructor(
    shader: Shader,
    uniforms: ColorMaterialUniforms = {
      diffuse: [0.25, 0.24, 0.25],
      shininess: 0.5,
      specular: [0.05, 0.05, 0.05],
      relativeColor: [0.1, 0.1, 0.1],
    }
  ) {
    super(shader, uniforms)
  }

  applyUniforms(): void {
    this.shader.setUniformVec3('relativeColor', this.uniforms.relativeColor)
  }

  setColor(color: Color | null) {
    if (color === null) {
      this.uniforms.relativeColor = [0, 0, 0]
    } else this.uniforms.relativeColor = color.normalizedRGB
  }

  setShininess(shininess: number) {
    this.uniforms.shininess = shininess
  }
}
