import { callContext, createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'

import { fftSize } from './constants'
import { requireMusic } from '../../assets'

const soundSource = createSoundSource(requireMusic('regrets_240313.mp3'))

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
