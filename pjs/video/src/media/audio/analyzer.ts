import type { CreateAnalyzer, CreateSoundSource } from './types'

export const callContext = (() => {
  let context: AudioContext
  return () => {
    if (context) return context
    else {
      context = new AudioContext()
      return context
    }
  }
})()

export const createSoundSource: CreateSoundSource = (fileLocation) => {
  const context = callContext()
  const audioElement = document.createElement('audio')
  audioElement.src = fileLocation
  audioElement.crossOrigin = 'anonymous'
  const source = context.createMediaElementSource(audioElement)
  return {
    play: () => audioElement.play(),
    source,
  }
}

export const createAnalyzer: CreateAnalyzer = (source, fftSize, smoothing = 0.6) => {
  const context = callContext()
  const analyzer = context.createAnalyser()
  analyzer.smoothingTimeConstant = smoothing
  source.connect(analyzer)
  analyzer.connect(context.destination)
  analyzer.fftSize = fftSize || analyzer.fftSize
  const bufferLength = analyzer.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  return {
    bufferLength,
    analyze: () => {
      analyzer.getByteFrequencyData(dataArray)
      return Array.from(dataArray).map((d) => d / 255)
    },
    waveform: () => {
      analyzer.getByteTimeDomainData(dataArray)
      return Array.from(dataArray).map((d) => d / 255)
    },
  }
}
