
const IMAGEKIT_MUSIC = 'https://ik.imagekit.io/72lduu8js/music'
const IMAGEKIT_VIDEO = 'https://ik.imagekit.io/72lduu8js/video'

const join = (...args: string[]) => args.join('/')

export const requireMusic = (assetName: string) => {
  return join(IMAGEKIT_MUSIC, assetName)
}

export const requireVideo = (assetName: string) => {
  return join(IMAGEKIT_VIDEO, assetName)
}