import { OffscreenDrawNode, OffscreenPixelDrawNode } from 'graph-gl'
import { Channel } from './channel'
import { ChannelManager } from './manager'
import { PixelDataRTHandle } from './target'

export abstract class PixelDataProviderNode extends OffscreenPixelDrawNode<PixelDataRTHandle> {
  get scope() {
    return this.renderTarget!.scope
  }
  override get outputResolution() {
    return this.scope.finalResolution
  }
}

export class SingleChannelNode<Ch extends Channel> extends PixelDataProviderNode {
  constructor(protected channel: Ch) {
    super()
  }

  override get drawables() {
    return [this.channel]
  }
}

export class MultiChannelNode extends PixelDataProviderNode {
  constructor(protected channelManager: ChannelManager) {
    super()
  }

  override get drawables() {
    return [this.channelManager.getChannel()]
  }
}

// without readPixels
export class ChannelNode extends OffscreenDrawNode {
  constructor(protected channel: Channel) {
    super()
  }
  override get drawables() {
    return [this.channel]
  }
}
