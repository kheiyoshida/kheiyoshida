import { makeRandomItemPicker as makeRandomArrayPicker } from 'utils'
import { VideoSource } from '../../lib/source/source'
import { checkLoadingState, loadVideoSourceList, waitForVideosToLoad } from './load'

export interface SupplyVideoOption {
  speed: number
}

export class VideoSupply implements VideoSource {
  private readonly videoElements: HTMLVideoElement[]

  constructor(videoUrls: string[], loadingLimitSecs = 30) {
    this.videoElements = loadVideoSourceList(videoUrls)
    this.randomVideo = makeRandomArrayPicker(this.videoElements)
    this.readyPromise = waitForVideosToLoad(
      this.videoElements,
      loadingLimitSecs,
      'canplaythrough'
    )
  }

  public readyPromise: Promise<void>

  get currentVideo(): HTMLVideoElement {
    if (!this._currentVideo) {
      this.swapVideo()
    }
    return this._currentVideo!
  }

  private _currentVideo: HTMLVideoElement | null = null

  private readonly randomVideo: () => HTMLVideoElement

  private options: SupplyVideoOption = { speed: 0.3 }
  public updateOptions(newOptions: SupplyVideoOption) {
    this.options = { ...this.options, ...newOptions }
  }

  public swapVideo() {
    if (this._currentVideo) {
      this._currentVideo.pause()
    }
    this._currentVideo = this.randomVideo()

    this.currentVideo.playbackRate = this.options.speed
    this.currentVideo.play().catch((e) => console.error(e))
    this.currentVideo.onended = () => this.onEnded()
    this.onSwap?.(this.currentVideo)
  }

  public onSwap?: (video: HTMLVideoElement) => void

  public onEnded: () => void = () => this.swapVideo()

  public get loadingProgress() {
    return checkLoadingState(this.videoElements)
  }
}
