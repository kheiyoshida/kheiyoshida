import { getGL } from '../../gl/gl'
import { GlyphInstance } from '../../gl/model/glyph/instance'
import { Texture } from '../../gl/texture'
import { FntParser } from '../../media/font/glyph'
import fnt from '../../assets/fonts/A.fnt?raw'
import fontImageUrl from '../../assets/fonts/A.png?url'
import { randomFloatBetween, randomItemFromArray } from 'utils'
import { ScreenPass } from '../../gl/pass/onscreen'

export const app = async () => {
  const gl = getGL()
  const canvas = gl.canvas
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // rendering
  const screenRenderer = new ScreenPass()
  screenRenderer.backgroundColor = [0, 0, 0, 1]
  const maxInstanceCount = 100
  const dotAspectRatio = 1
  const dotInstance = new GlyphInstance(maxInstanceCount, dotAspectRatio)

  const singleDotSize = (40 * 0.5) / canvas.height

  const texture = new Texture()
  const image = new Image()
  image.src = fontImageUrl
  let loaded = false
  image.onload = () => {
    texture.setTextureImage(image)
    loaded = true
  }

  const parser = new FntParser(fnt, { textureWidth: 512, textureHeight: 512 })
  const As = 'Aあa亜ア阿 '.split('')
  const pick = () => randomItemFromArray(As)

  function renderVideo(frameCount: number) {
    if (!loaded) return
    let k = 0
    for (let i = 0; i < maxInstanceCount; i++) {
      // offset
      dotInstance.instanceDataArray[k++] = i * (40 / window.innerWidth)
      dotInstance.instanceDataArray[k++] = randomFloatBetween(0.3, 0.7)

      // color
      dotInstance.instanceDataArray[k++] = 1
      dotInstance.instanceDataArray[k++] = 1
      dotInstance.instanceDataArray[k++] = 1

      // size
      dotInstance.instanceDataArray[k++] = singleDotSize

      // uvs
      const {uvMin, uvMax} = parser.getAttributes(pick())
      dotInstance.instanceDataArray[k++] = uvMin[0]
      dotInstance.instanceDataArray[k++] = uvMin[1]
      dotInstance.instanceDataArray[k++] = uvMax[0]
      dotInstance.instanceDataArray[k++] = uvMax[1]
    }
    dotInstance.updateInstances(100)
    screenRenderer.render([dotInstance])
  }

  const targetFps = 30
  const minFrameTime = 1000 / targetFps // ms
  let lastFrame = performance.now()
  let frameCount = 0
  function loop(now: number) {
    const elapsed = now - lastFrame
    if (elapsed >= minFrameTime) {
      lastFrame = now - (elapsed % minFrameTime) // reduce drift
      frameCount += 1
      renderVideo(frameCount)
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
