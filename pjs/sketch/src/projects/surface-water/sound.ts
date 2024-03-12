import { createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
import profit from '../../assets/music/profit.mp3'
import { fftSize } from './config'

export const soundSource = createSoundSource(profit)
export const analyser = createAnalyzer(soundSource.source, fftSize)
