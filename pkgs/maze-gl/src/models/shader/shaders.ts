import { Shader } from './base'
import { bindUBO } from '../uniformBlock'

export class MaterialShader extends Shader {
  constructor(...params: ConstructorParameters<typeof Shader>) {
    super(...params)
    // bind all the UBOs

    bindUBO(this.program, 'DeformedBox')
    bindUBO(this.program, 'Eye')
    bindUBO(this.program, 'Color')
  }
}

export class ScreenShader extends Shader {}
