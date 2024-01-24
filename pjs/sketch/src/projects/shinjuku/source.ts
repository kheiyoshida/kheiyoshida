import { randomItemFromArray } from "utils"
import { GetVideoSource, VideoSourceList } from 'p5utils/src/lib/media/video/types'
import { requireVideo } from "../../assets"

export const videoSource: VideoSourceList = [
  require('../../assets/video/shinjuku1_resized.mp4'),
  // require('../../assets/video/shinjuku2.mp4'),
  // require('../../assets/video/shinjuku3.mp4'),
  // require('../../assets/video/shinjuku4.mp4'),
  // require('../../assets/video/shinjuku5.mp4'),
  // require('../../assets/video/shinjuku6.mp4'),
  // require('../../assets/video/shinjuku7.mp4'),
  // require('../../assets/video/shinjuku8.mp4'),
  // require('../../assets/video/shinjuku9.mp4'),
  // require('../../assets/video/shinjuku10.mp4'),
  // require('../../assets/video/shinjuku11.mp4'),
  // require('../../assets/video/shinjuku12.mp4'),
]

// export const videoSource: VideoSourceList = [
//   requireVideo('shinjuku1.mp4'),
//   requireVideo('shinjuku2.mp4'),
//   requireVideo('shinjuku3.mp4'),
//   requireVideo('shinjuku4.mp4'),
//   requireVideo('shinjuku5.mp4'),
//   requireVideo('shinjuku6.mp4'),
//   requireVideo('shinjuku7.mp4'),
//   requireVideo('shinjuku8.mp4'),
//   requireVideo('shinjuku9.mp4'),
//   requireVideo('shinjuku10.mp4'),
//   requireVideo('shinjuku11.mp4'),
//   requireVideo('shinjuku12.mp4'),
// ]

export const randomVideoSource: GetVideoSource = () => {
  return randomItemFromArray(videoSource)
}
