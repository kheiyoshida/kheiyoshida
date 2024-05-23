import { callContext, createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
import { requireMusic } from '../../../assets'
import { fftSize } from '../config'

const soundSource = createSoundSource(requireMusic('wasted_240217.mp3'))

export const soundAnalyzer = createAnalyzer(soundSource.source, fftSize)

export const bindPlayEvent = () => {
  const start = () => {
    const context = callContext()
    if (context.state === 'suspended') {
      context.resume()
    }
    soundSource.play()
  }
  return start
}
