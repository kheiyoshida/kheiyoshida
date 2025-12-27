import { ScreenEffectModel } from '../model'
import { Shader } from '../../../models'
import vert from '../shared/screen.vert?raw'
import frag from './fog.frag?raw'

export class FogEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
  }
}
