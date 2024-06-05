import { ThemeGridDirection, ThemeGridPosition } from 'mgnr-tone'
import { useEffect, useState } from 'react'
import * as Tone from 'tone'
import { createCommandBuffer, createMusic } from './music'
import { themeGrid } from './themes'

const commandBuffer = createCommandBuffer()

const music = createMusic(themeGrid)

let started = false

const play = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
  if (started) return
  Tone.Transport.bpm.value = 162
  Tone.Transport.start(0)
  music.applyInitialTheme()
  Tone.Transport.scheduleRepeat(
    () => {
      music.checkNextTheme(commandBuffer.command)
    },
    '4m',
    0
  )
  started = true
}

export default () => {
  return (
    <div style={style}>
      <Grid />
      <div style={{ margin: 16 }}>
        <button style={{ padding: 16 }} onClick={play}>
          click to start
        </button>
      </div>
      <Commands />
    </div>
  )
}

const commands: ThemeGridDirection[] = ['up', 'down', 'right', 'left']

const Commands = () => {
  return (
    <div style={{ margin: 16 }}>
      {commands.map((c) => (
        <button key={c} onClick={() => commandBuffer.set(c)}>
          {c}
        </button>
      ))}
    </div>
  )
}

const Grid = () => {
  const [currentPosition, setPosition] = useState<ThemeGridPosition>('center-middle')
  useEffect(() => {
    setPosition(themeGrid.current)
  }, [themeGrid.current])

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
      {positions.map((p, i) => (
        <div
          key={p}
          style={{
            backgroundColor: currentPosition === p ? 'rgb(180, 10, 50)' : 'rgb(50, 50, 50)',
          }}
        >
          {p}
        </div>
      ))}
    </div>
  )
}

// prettier-ignore
const positions: ThemeGridPosition[] = [
  'left-top','center-top','right-top',
  'left-middle','center-middle','right-middle',
  'left-bottom','center-bottom','right-bottom',
]

const style: React.CSSProperties = {
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
