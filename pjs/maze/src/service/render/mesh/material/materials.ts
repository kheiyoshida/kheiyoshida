import { Color, ColorMaterial } from 'maze-gl'
import { getShader } from './shaders'

export class DefaultMaterial extends ColorMaterial {
  constructor() {
    super(getShader('default'))
  }
  setColor(materialColor: Color) {
    this.uniforms.diffuse = materialColor.normalizedRGB

    // specular should be lower than diffuse
    materialColor.lightness -= 0.3
    this.uniforms.specular = materialColor.normalizedRGB
  }
}

export class DistinctMaterial extends ColorMaterial {
  constructor() {
    super(getShader('default'))
  }
  setColor(materialColor: Color) {
    // should be saturated
    materialColor.saturation += 0.5
    this.uniforms.diffuse = materialColor.normalizedRGB

    // specular should be low for distinct material
    materialColor.lightness += 0.2
    this.uniforms.specular = materialColor.normalizedRGB
  }
}
