import { ToneAudioNode } from "tone"

export interface SoundEffectSource {
  node: ToneAudioNode
  play: () => void
}
