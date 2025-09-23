import { VideoSupply } from '../../media/video/supply'
import { DebugChannel, DebugVideoChannel, VideoPixelChannel } from '../../lib/channel/channel'

const devVideoList = ['/assets/footage/bird/960p/bird1.mp4']
// const devVideoList = ['/assets/footage/shinjuku/shinjuku1.mp4']

export class DevVideoChannel extends VideoPixelChannel {
  constructor(videoAspectRatio: number, videoWidth: number, outputResolutionWidth: number) {
    const supply = new VideoSupply(devVideoList)
    supply.onEnded = () => supply.swapVideo()
    super(supply, videoAspectRatio, videoWidth, outputResolutionWidth)
  }
}

export class DebugDevVideoChannel extends DebugVideoChannel {
  constructor() {
    const supply = new VideoSupply(devVideoList)
    supply.onEnded = () => supply.swapVideo()
    super(supply)
  }
}

const youtubeVideoList = [
  `/assets/footage/youtube/Breaking Bad.mp4`,
  `/assets/footage/youtube/Chargeman.mp4`,
  `/assets/footage/youtube/Eva.mp4`,
  `/assets/footage/youtube/Gouketsuji.mp4`,
  `/assets/footage/youtube/Nonomura.mp4`,
  `/assets/footage/youtube/Noriaki.mp4`,
  `/assets/footage/youtube/You Died.mp4`,
]

export class YoutubeVideoChannel extends VideoPixelChannel {
  constructor(videoAspectRatio: number, videoWidth: number, outputResolutionWidth: number) {
    const supply = new VideoSupply(youtubeVideoList)
    supply.onEnded = () => supply.swapVideo()
    super(supply, videoAspectRatio, videoWidth, outputResolutionWidth)
  }
}
