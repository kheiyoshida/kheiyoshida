import { loadImage } from '../../media/image/data'

export const createImageTexture = (imageLoc: string) => {
  const img = loadImage(imageLoc)
  return img
}
