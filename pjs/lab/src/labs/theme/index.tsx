import * as Tone from 'tone'
import { Alignment, createMusic, createThemeGrid } from './music'
import { useState } from 'react'

const themeGrid = createThemeGrid()
const music = createMusic(themeGrid)

let started = false

const play = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
  if (started) return
  Tone.Transport.bpm.value = 162
  Tone.Transport.start(0)
  Tone.Transport.scheduleRepeat((t) => {
    music.applyNextTheme()
  }, '2m')
  started = true
}

export default () => {
  return (
    <div style={synthLabStyle}>
      <Grid />
      <div style={{ margin: 16 }}>
        <button style={{ padding: 16 }} onClick={play}>
          click to start
        </button>
      </div>
    </div>
  )
}

const Grid = () => {
  const [alignment, setAlignment] = useState(themeGrid.currentAlignment)

  const select = (alignment: Alignment) => {
    themeGrid.updateAlignment(alignment)
    setAlignment(alignment)
  }
  return (
    <div
      style={{
        display: 'grid',
        width: 500,
        height: 500,
        gap: 8,
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{ backgroundColor: alignment === i - 1 ? 'rgb(180, 10, 50)' : 'rgb(50, 50, 50)' }}
          onClick={() => select((i - 1) as Alignment)}
        >
          {i - 1}
        </div>
      ))}
    </div>
  )
}

const synthLabStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: 'white',
  fontSize: 24,
  backgroundColor: 'rgba(100, 100, 100)',
}
