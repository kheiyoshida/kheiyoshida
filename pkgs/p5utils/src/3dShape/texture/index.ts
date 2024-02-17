import { loadEmptyImage, loadImage } from '../../media/image/data'

export const createImageTexture = (imageLoc: string) => {
  const img = loadImage(imageLoc)
  return img
}

export const createRenderedTexture = (size: number) => {
  return loadEmptyImage(size, size)
}
