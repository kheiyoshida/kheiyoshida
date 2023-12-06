import * as Tone from 'tone'
import * as Commands from 'src/lib/music/externals/tone/commands'
import { ChConf, SendCh } from 'src/lib/music/externals/tone/mixer/Channel'

export const createFilteredDelaySend = () => {
  const delayCh: ChConf<SendCh> = {
    id: 'filterDelay',
    effects: [
      new Tone.Filter(1200, 'highpass'),
      new Tone.Filter(8000, 'lowpass'),
      new Tone.PingPongDelay({delayTime: '8n.', maxDelay: 1, feedback: 0.5})
    ]
  }
  Commands.SetupSendChannel.pub({conf: delayCh})
  return delayCh
}
