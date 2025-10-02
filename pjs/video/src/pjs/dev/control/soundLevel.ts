import { SoundAnalyser } from '../../../media/audio/analyzer'

export class SoundLevel {
  private analyser: SoundAnalyser;
  constructor(source: MediaStreamAudioSourceNode) {
    this.analyser = new SoundAnalyser(source, 32);
  }

  public maxLoudness = -3
  public minLoudness = -0.2

  public getSoundLevel(): number {
    const decibels = this.analyser.getDecibels()
    return Math.min(1, Math.abs(decibels / (this.maxLoudness - this.minLoudness)))
  }
}
