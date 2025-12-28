import { BlurDir, BlurModel } from './model'
import { ScreenEffectNode } from '../node'

export class BlurNode extends ScreenEffectNode {
  constructor(dir: BlurDir) {
    super(new BlurModel(dir))
  }
}
