import { VideoSupply } from '../../media/video/supply'
import { DebugChannel, DebugVideoChannel, VideoPixelChannel } from '../../lib/channel/channel'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'

const devVideoList = ['/assets/footage/bird/960p/bird1.mp4']

export class DevVideoChannel extends VideoPixelChannel {
  constructor(videoAspectRatio: number, videoWidth: number, outputResolutionWidth: number) {
    const supply = new VideoSupply(shinjukuVideoSourceList)
    supply.onEnded = () => supply.swapVideo()
    super(supply, videoAspectRatio, videoWidth, outputResolutionWidth)
  }
}

const youtubeVideoList = [
  `/assets/footage/youtube/lain.mp4`,
  `/assets/footage/youtube/GIS.mp4`,
  `/assets/footage/youtube/GIS2.mp4`,

  `/assets/footage/youtube/sh2-IWasWeak.mp4`,
  `/assets/footage/youtube/siren.mp4`,

  `/assets/footage/youtube/shiren.mp4`,
  `/assets/footage/youtube/smt.mp4`,

  `/assets/footage/youtube/Breaking Bad.mp4`,
  `/assets/footage/youtube/blade runner.mp4`,
  `/assets/footage/youtube/seventh seal.mp4`,
  `/assets/footage/youtube/chunking express.mp4`,
]
const randomVideoList = [
  `/assets/footage/youtube/Chargeman.mp4`,
  `/assets/footage/youtube/Noriaki.mp4`,
  `/assets/footage/youtube/Nonomura.mp4`,
  // `/assets/footage/youtube/Gouketsuji.mp4`,
]

export class YoutubeVideoChannel extends VideoPixelChannel {
  constructor(videoAspectRatio: number, videoWidth: number, outputResolutionWidth: number) {
    const supply = new VideoSupply(youtubeVideoList)
    supply.onEnded = () => supply.swapVideo()
    super(supply, videoAspectRatio, videoWidth, outputResolutionWidth)
  }
}

export class RandomVideoChannel extends VideoPixelChannel {
  constructor(videoAspectRatio: number, videoWidth: number, outputResolutionWidth: number) {
    const supply = new VideoSupply(youtubeVideoList)
    supply.onEnded = () => supply.swapVideo()
    super(supply, videoAspectRatio, videoWidth, outputResolutionWidth)
  }
}
