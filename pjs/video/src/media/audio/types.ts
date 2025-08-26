export type SoundSource = {
  play: () => void
  source: MediaElementAudioSourceNode
}

export type CreateSoundSource = (fileLocation: string) => SoundSource

/**
 * array of float between 0 and 1
 * the middle is 0.5
 */
export type FrequencyData = number[]
export type WaveformData = number[]

export interface Analyzer {
  bufferLength: number
  analyze: () => FrequencyData
  waveform: () => WaveformData
}

export type FFTSize = 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768

export type CreateAnalyzer = (
  source: MediaElementAudioSourceNode,
  fftSize?: FFTSize,
  smoothing?: number
) => Analyzer
