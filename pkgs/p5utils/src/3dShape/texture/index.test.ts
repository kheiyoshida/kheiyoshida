import p5 from 'p5'
import { createImageTexture } from '.'

test(`${createImageTexture.name}`, () => {
  const img = createImageTexture('somewhere/pic.jpg')
  expect(img).toBeInstanceOf(p5.Image)
})
