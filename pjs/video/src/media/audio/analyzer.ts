import { FFTSize } from './types'

export const getAudioCtx = (() => {
  let context: AudioContext
  return () => {
    if (context) return context
    else {
      context = new AudioContext()
      return context
    }
  }
})()

export const createSoundSource = (fileLocation: string): MediaElementAudioSourceNode => {
  const context = getAudioCtx()
  const audioElement = document.createElement('audio')
  audioElement.src = fileLocation
  audioElement.crossOrigin = 'anonymous'
  return context.createMediaElementSource(audioElement)
}

export class SoundAnalyser {
  constructor(source: AudioNode, fftSize?: FFTSize, smoothing = 0.6) {
    const context = getAudioCtx()
    this.analyserNode = context.createAnalyser()
    this.analyserNode.smoothingTimeConstant = smoothing
    source.connect(this.analyserNode)
    this.analyserNode.connect(context.destination)
    this.analyserNode.fftSize = fftSize || this.analyserNode.fftSize
    this.bufferLength = this.analyserNode.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
  }

  private readonly analyserNode: AnalyserNode
  public readonly bufferLength: number
  private readonly dataArray: Uint8Array

  analyze () {
    this.analyserNode.getByteFrequencyData(this.dataArray)
    return Array.from(this.dataArray).map((d) => d / 255)
  }

  /**
   * returns simply averaged level in range of 0 - 1
   */
  getAverageLevel() {
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const val = (this.dataArray[i]) / 255;
      sum += val;
    }

    return sum / this.dataArray.length;
  }

  getRMS() {
    this.analyserNode.getByteFrequencyData(this.dataArray)

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const val = (this.dataArray[i] - 128) / 128; // convert 0–255 to -1..1
      sum += val * val;
    }
    return Math.sqrt(sum / this.dataArray.length);
  }

  getDecibels() {
    const rms = this.getRMS()
    return 20 * Math.log10(rms)
  }

  waveform () {
    this.analyserNode.getByteTimeDomainData(this.dataArray)
    return Array.from(this.dataArray).map((d) => d / 255)
  }
}
