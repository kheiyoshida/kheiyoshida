import vertexSrc from './renderers/shaders/dev.vert?raw'
// import fragmentSrc from './renderers/shaders/dev.frag?raw'
import fragmentSrc from './renderers/shaders/captureBrightness.frag?raw'
import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { createProgram } from './renderers/gl'
import { OffscreenRenderer, ScreenRenderer } from './renderers/ScreenRenderer'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const width = 400
const height = 300
// const renderer = new ScreenRenderer(createProgram(vertexSrc, fragmentSrc))
const renderer = new OffscreenRenderer(createProgram(vertexSrc, fragmentSrc), width, height)

// render loop
function render() {
  requestAnimationFrame(render)

  if (!videoSupply) return
  const video = videoSupply.currentVideo

  // inject video as texture
  if (video.readyState >= video.HAVE_CURRENT_DATA) {
    renderer.setTextureImage(video)

    renderer.drawToOffscreenBuffer()

    const pixelBuffer = renderer.readPixels()

    const threshold = 200; // brightness threshold (0–255)
    const brightSpots = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const brightness = pixelBuffer[index];

        if (brightness > threshold) {
          brightSpots.push({
            x: x / width,
            y: 1.0 - y / height, // flip Y for OpenGL → NDC space
          });
        }
      }
    }
    // console.log(brightSpots)
  }
}
render()
