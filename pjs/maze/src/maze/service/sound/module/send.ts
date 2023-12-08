import * as Tone from 'tone'
import * as Commands from 'mgnr/src/externals/tone/commands'
import { ChConf, SendCh } from 'mgnr/src/externals/tone/mixer/Channel'

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
