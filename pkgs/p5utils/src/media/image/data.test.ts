import p5 from 'p5'
import { loadEmptyImage, loadImage, updateImagePixels } from './data'
import * as pixels from '../pixel/pixels'

jest.mock('p5', () => ({
  ...jest.requireActual('p5'),
  Image: jest.fn().mockImplementation((width: number, height: number) => ({
    pixels: new Array(width * height * 4).fill(0),
    width,
    height,
    loadPixels: jest.fn()
  }))
}))

test(`${loadImage.name}`, () => {
  const spyLoadImage = jest.spyOn(p, 'loadImage').mockImplementation(() => new p5.Image(1,1))
  const imageLoc = 'somewhere/pic.jpg'
  const img = loadImage(imageLoc)
  expect(spyLoadImage).toHaveBeenCalledWith(imageLoc)
  expect(img.loadPixels).toHaveBeenCalled()
})

test(`${loadEmptyImage.name}`, () => {
  const spyLoadImage = jest.spyOn(p, 'createImage').mockImplementation(() => new p5.Image(1,1))
  const img = loadEmptyImage(100,100)
  expect(spyLoadImage).toHaveBeenCalled()
  expect(img.loadPixels).toHaveBeenCalled()
})

test(`${updateImagePixels.name}`, () => {
  const img = new p5.Image(4,4)
  expect(img.width).toBe(4)
  expect(img.height).toBe(4)
  updateImagePixels(img, ([r, g, b, a]) => [r + 10, g, b, a])

  pixels.iteratePixels(img, ([ri]) => {
    expect(img.pixels[ri]).toBe(10)
  })
})
