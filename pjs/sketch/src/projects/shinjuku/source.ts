import { GetVideoSource, VideoSourceList } from 'p5utils/src/lib/media/video/types'
import { randomItemFromArray } from "utils"
import { requireVideo } from "../../assets"

// export const videoSource: VideoSourceList = [
//   require('../../assets/video/shinjuku/320p/shinjuku1.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku2.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku8.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku9.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku11.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku12.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku13.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku14.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku15.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku16.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku17.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku18.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku19.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku20.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku21.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku22.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku23.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku24.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku25.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku26.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku27.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku28.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku29.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku30.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku31.mp4'),
//   require('../../assets/video/shinjuku/320p/shinjuku32.mp4'),
// ]


export const videoSource: VideoSourceList = [
  requireVideo('/320p/shinjuku1.mp4'),
  requireVideo('/320p/shinjuku2.mp4'),
  requireVideo('/320p/shinjuku8.mp4'),
  requireVideo('/320p/shinjuku9.mp4'),
  requireVideo('/320p/shinjuku11.mp4'),
  requireVideo('/320p/shinjuku12.mp4'),
  requireVideo('/320p/shinjuku13.mp4'),
  requireVideo('/320p/shinjuku14.mp4'),
  requireVideo('/320p/shinjuku15.mp4'),
  requireVideo('/320p/shinjuku16.mp4'),
  requireVideo('/320p/shinjuku17.mp4'),
  requireVideo('/320p/shinjuku18.mp4'),
  requireVideo('/320p/shinjuku19.mp4'),
  requireVideo('/320p/shinjuku20.mp4'),
  requireVideo('/320p/shinjuku21.mp4'),
  requireVideo('/320p/shinjuku22.mp4'),
  requireVideo('/320p/shinjuku23.mp4'),
  requireVideo('/320p/shinjuku24.mp4'),
  requireVideo('/320p/shinjuku25.mp4'),
  requireVideo('/320p/shinjuku26.mp4'),
  requireVideo('/320p/shinjuku27.mp4'),
  requireVideo('/320p/shinjuku28.mp4'),
  requireVideo('/320p/shinjuku29.mp4'),
  requireVideo('/320p/shinjuku30.mp4'),
  requireVideo('/320p/shinjuku31.mp4'),
  requireVideo('/320p/shinjuku32.mp4'),
]

export const randomVideoSource: GetVideoSource = () => {
  return randomItemFromArray(videoSource)
}
