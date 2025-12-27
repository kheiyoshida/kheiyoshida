import { ScreenEffectNode } from '../node'
import { FogEffect } from './model'

export class FogEffectNode extends ScreenEffectNode {
  constructor() {
    super(new FogEffect())
  }
}
