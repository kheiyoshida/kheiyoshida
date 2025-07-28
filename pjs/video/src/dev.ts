import vertexSrc from './renderers/shaders/dev.vert?raw'
// import fragmentSrc from './renderers/shaders/dev.frag?raw'
import fragmentSrc from './renderers/shaders/captureBrightness.frag?raw'
import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { createProgram } from './renderers/gl'
import { OffscreenRenderer } from './renderers/renderers/ScreenRenderer'
import { DotsRenderer } from './renderers/renderers/DotsRenderer'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const width = window.innerWidth
const height = window.innerHeight

const offscreenRenderer = new OffscreenRenderer(createProgram(vertexSrc, fragmentSrc), width, height)
const dotsRenderer = new DotsRenderer()

// render loop
function render() {
  requestAnimationFrame(render)

  if (!videoSupply) return
  const video = videoSupply.currentVideo

  // inject video as texture
  if (video.readyState >= video.HAVE_CURRENT_DATA) {
    offscreenRenderer.setTextureImage(video)

    const pixelBuffer = offscreenRenderer.drawToOffscreenBuffer()

    const threshold = 123; // brightness threshold (0–255)
    const brightSpots = [];

    for (let y = 0; y < height; y+=48) {
      for (let x = 0; x < width; x+=48) {
        const index = (y * width + x) * 4;
        const brightness = pixelBuffer[index];

        if (brightness > threshold) {
          brightSpots.push({
            x: 1.0 - x / width,
            y: y / height, // flip Y for OpenGL → NDC space
          });
        }
      }
    }

    const positions = new Float32Array(brightSpots.length * 2)
    for(let i = 0; i < brightSpots.length; i++) {
      positions[i] = brightSpots[i].x
      positions[i + 1] = brightSpots[i].y
    }

    // const positions = new Float32Array([
    //   0.5, 0.1
    // ])

    dotsRenderer.setDotPositions(positions)
    dotsRenderer.draw()

  }
}
render()
