import vertexSrc from './renderers/shaders/dev.vert?raw'
import fragmentSrc from './renderers/shaders/dev.frag?raw'
import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { createProgram } from './renderers/gl'
import { ScreenRenderer } from './renderers/ScreenRenderer'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const renderer = new ScreenRenderer(createProgram(vertexSrc, fragmentSrc))

// render loop
function render() {
  requestAnimationFrame(render)

  if (!videoSupply) return
  const video = videoSupply.currentVideo

  // inject video as texture
  if (video.readyState >= video.HAVE_CURRENT_DATA) {
    renderer.setTextureImage(video)
  }

  renderer.draw()
}
render()
