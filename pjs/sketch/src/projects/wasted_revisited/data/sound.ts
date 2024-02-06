import { callContext, createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
import { requireMusic } from '../../../assets'
import { fftSize } from '../config'
import { instruction } from 'p5utils/src/utils/project'

const soundSource = createSoundSource(requireMusic('wasted_new.mp3'))

export const soundAnalyzer = createAnalyzer(soundSource.source, fftSize)

export const bindPlayEvent = () => {
  const div = instruction()

  const start = () => {
    const context = callContext()
    if (context.state === 'suspended') {
      context.resume()
    }
    soundSource.play()
    div.remove()
  }
  p.mousePressed = start
  p.touchStarted = start
}
