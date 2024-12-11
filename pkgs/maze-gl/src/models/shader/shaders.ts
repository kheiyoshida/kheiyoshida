import { Shader } from './base'
import { UniformNameBPMap } from '../uniformBlock'

export class MaterialShader extends Shader {
  constructor(...params: ConstructorParameters<typeof Shader>) {
    super(...params)
    // bind all the UBOs
    Object.entries(UniformNameBPMap).forEach(([uniformName, bp]) => {
      const blockIndex = this.gl.getUniformBlockIndex(this.program, uniformName)
      this.gl.uniformBlockBinding(this.program, blockIndex, bp)
    })
  }
}

export class ScreenShader extends Shader {}
