import { createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
import song from '../../assets/music/018th.mp3'
import { fftSize } from './config'

export const soundSource = createSoundSource(song)
export const analyser = createAnalyzer(soundSource.source, fftSize)
