import { OffscreenPixelDrawNode } from 'graph-gl'
import { Channel } from './channel'
import { ChannelManager } from './manager'

export class SingleChannelNode extends OffscreenPixelDrawNode {
  constructor(private channel: Channel) {
    super()
  }

  override get drawables() {
    return [this.channel]
  }
}

export class MultiChannelNode extends OffscreenPixelDrawNode {
  constructor(private channelManager: ChannelManager) {
    super()
  }

  override get drawables() {
    return [this.channelManager.getChannel()]
  }
}
