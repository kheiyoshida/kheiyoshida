import * as Tone from 'tone'

export const createFilteredDelaySend = () => {
  const delayCh = {
    id: 'filterDelay',
    effects: [
      new Tone.Filter(1200, 'highpass'),
      new Tone.Filter(8000, 'lowpass'),
      new Tone.PingPongDelay({ delayTime: '8n.', maxDelay: 1, feedback: 0.5 }),
      new Tone.Chorus(1000),
    ],
  }
  return delayCh
}
