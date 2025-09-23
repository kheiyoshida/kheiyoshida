import { PixelChannelBase, VideoPixelChannel } from './channel'
import { IFaderParamsControlAdapter } from '../params/adapter'
import { ChannelRemote } from './remote'
import { fireByRate } from 'utils'

export class ChannelManager {
  constructor(readonly channels: PixelChannelBase[]) {
    this.remote = new ChannelRemote(channels.length)
  }

  public readonly remote: ChannelRemote

  private get currentChannel() {
    return this.channels[this.remote.channelNumber]
  }

  public set channelNumber(value: number) {
    this.remote.channelNumber = value
  }
  public get channelNumber(): number {
    return this.remote.channelNumber
  }

  public channelSwitchRate = 0

  public videoSwitchRate = 0

  private _videoPlaybackSpeed = 0.3
  public set videoPlaybackSpeed(value: number) {
    this._videoPlaybackSpeed = value
    if (this.currentChannel instanceof VideoPixelChannel) {
      this.currentChannel.source.updateOptions({ speed: this._videoPlaybackSpeed })
    }
  }
  public get videoPlaybackSpeed(): number {
    return this._videoPlaybackSpeed
  }

  public getChannel(): PixelChannelBase {
    if (fireByRate(this.channelSwitchRate)) {
      this.channelNumber = this.remote.random()
      if (this.currentChannel instanceof VideoPixelChannel) {
        this.currentChannel.source.updateOptions({ speed: this._videoPlaybackSpeed })
      }
    }

    if (this.currentChannel instanceof VideoPixelChannel && fireByRate(this.videoSwitchRate)) {
      this.currentChannel.source.swapVideo()
    }

    if (this.currentChannel.isAvailable) return this.currentChannel
    return this.getNextAvailableChannel()
  }

  private getNextAvailableChannel(retry = 0): PixelChannelBase {
    if (retry > this.channels.length) throw new Error("No channel's available")
    if (!this.currentChannel.isAvailable) {
      this.channelNumber++
      return this.getNextAvailableChannel(retry + 1)
    }
    return this.currentChannel
  }
}

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
