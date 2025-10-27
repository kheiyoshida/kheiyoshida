import { Color, ColorMaterial } from 'maze-gl'
import { getShader, MaterialShaderType } from './shaders'

export class MeshMaterial extends ColorMaterial {
  constructor(materialShaderType: MaterialShaderType) {
    super(getShader(materialShaderType))
  }
}

export class DefaultMaterial extends MeshMaterial {
  setColor(materialColor: Color) {
    this.uniforms.diffuse = materialColor.normalizedRGB

    // specular should be lower than diffuse
    materialColor.lightness -= 0.3
    this.uniforms.specular = materialColor.normalizedRGB
  }
}

export class DistinctMaterial extends MeshMaterial {
  setColor(materialColor: Color) {
    // should be saturated
    materialColor.saturation += 0.5
    this.uniforms.diffuse = materialColor.normalizedRGB

    // specular should be low for distinct material
    materialColor.lightness += 0.2
    this.uniforms.specular = materialColor.normalizedRGB
  }
}
