import { PixelChannelBase, VideoPixelChannel } from './channel'
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

