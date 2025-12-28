import { BlurDir, BlurModel } from './model'
import { ScreenEffectNode } from '../node'
import { BlurParams } from '../../../models'

export class BlurNode extends ScreenEffectNode {
  constructor(dir: BlurDir) {
    super(new BlurModel(dir))
  }

  updateParams(params?: BlurParams) {
    const fx = this.effect as BlurModel
    if (params) fx.updateParams(params)
    else fx.enabled = false
  }
}
