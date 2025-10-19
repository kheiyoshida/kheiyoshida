import { OffscreenPixelDrawNode } from 'graph-gl'
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

export class SingleChannelNode extends PixelDataProviderNode {
  constructor(private channel: Channel) {
    super()
  }

  override get drawables() {
    return [this.channel]
  }
}

export class MultiChannelNode extends PixelDataProviderNode {
  constructor(private channelManager: ChannelManager) {
    super()
  }

  override get drawables() {
    return [this.channelManager.getChannel()]
  }
}
