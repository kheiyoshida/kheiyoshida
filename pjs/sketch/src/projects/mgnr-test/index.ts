import * as Tone from 'tone'

import { testWrap } from './mgnr-test'
import { test2 } from './mgnr-test2'

const setup = () => {
  // startSound()
  testWrap(() => {
    test2()
    Tone.start()
    Tone.Transport.start()
  })
}

const draw = () => {}

export default <Sketch>{
  setup,
  draw,
}
