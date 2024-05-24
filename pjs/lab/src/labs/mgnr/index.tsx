import * as Tone from 'tone'
import { prepareSong } from './song'

const play = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
  prepareSong()
  Tone.Transport.start()
}

export default () => {
  return (
    <div style={synthLabStyle} onClick={play}>
      click to play
    </div>
  )
}
const synthLabStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(100, 100, 100)',
}
