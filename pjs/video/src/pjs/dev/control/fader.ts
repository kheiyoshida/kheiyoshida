import { IFaderParamsControlAdapter } from '../../../lib/params/adapter'
import { ChannelManager } from '../../../lib/channel/manager'

export class ChannelParamsControl implements IFaderParamsControlAdapter {
  constructor(private readonly channelManager: ChannelManager) {}
  applyFaderValue1(value: number): void {
    if (this.channelManager.channels.length < 1) return
    this.channelManager.remote.switchRate[0] = value / 127
  }
  applyFaderValue2(value: number): void {
    if (this.channelManager.channels.length < 2) return
    this.channelManager.remote.switchRate[1] = value / 127
  }
  applyFaderValue3(value: number): void {
    if (this.channelManager.channels.length < 3) return
    this.channelManager.remote.switchRate[2] = value / 127
  }
  applyFaderValue4(value: number): void {
    if (this.channelManager.channels.length < 4) return
    this.channelManager.remote.switchRate[3] = value / 127
  }
  applyFaderValue5(value: number): void {
    if (this.channelManager.channels.length < 5) return
    this.channelManager.remote.switchRate[4] = value / 127
  }
  applyFaderValue6(value: number): void {
    this.channelManager.channelSwitchRate = value / 127 / 10
  }
  applyFaderValue7(value: number): void {
    this.channelManager.videoSwitchRate = value / 127 / 10
  }
  applyFaderValue8(value: number): void {
    this.channelManager.videoPlaybackSpeed = Math.floor((value / 127) * 10) / 10
    console.log(this.channelManager.videoPlaybackSpeed)
  }
}
