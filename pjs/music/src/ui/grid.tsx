import { makeContextManager } from 'mgnr-tone'
import { useEffect, useState } from 'react'
import { fireByRate } from 'utils'
import { Music } from '../pjs/demo'
import { Commands, Expressions, commandBuffer } from './buttons'
import { GridPosition } from '../grid'

export const makeMusicGrid = (makeMusic: () => Music): React.FC => {
  const music = makeMusic()
  const context = makeContextManager({
    bpm: music.config.bpm,
    initialise: () => music.applyInitialScene(),
    interval: music.config.interval,
    onInterval: () => {
      const command = commandBuffer.command
      if (command) {
        music.checkNextShift(command)
      }
    },
  })
  const play = () => {
    context.startContext()
    context.startPlaying()
  }
  return () => {
    useEffect(play, [])
    return (
      <div style={style}>
        <Grid music={music} />
        <Expressions />
        <Commands play={play} />
      </div>
    )
  }
}

const Grid = ({ music }: { music: Music }) => {
  const [position, setPosition] = useState<GridPosition | null>('center-middle')
  const [alignment, setAlignment] = useState<GridPosition | null>('center-middle')
  useEffect(() => {
    setInterval(() => {
      if (fireByRate(0.5)) {
        setPosition(music.currentPosition.parentGridPosition)
        setAlignment(music.currentPosition.childGridPosition)
      } else {
        setPosition(null)
        setAlignment(null)
      }
    }, 60000 / 162)
  }, [])

  return (
    <div
      style={{
        display: 'grid',
        width: 304,
        height: 304,
        gap: 20,
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
    >
      {positions.map((p) => (
        <MiniGrid key={p} alignment={alignment} matchPosition={p === position} />
      ))}
    </div>
  )
}

const MiniGrid = ({
  alignment,
  matchPosition,
}: {
  alignment: GridPosition | null
  matchPosition: boolean
}) => {
  return (
    <div
      style={{
        display: 'grid',
        width: '100%',
        height: '100%',
        gap: 20,
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
    >
      {positions.map((p) => (
        <div
          key={p}
          style={{
            backgroundColor:
              matchPosition && alignment === p
                ? 'rgb(180, 10, 50)'
                : fireByRate(0.3)
                  ? 'white'
                  : 'gray',
          }}
        ></div>
      ))}
    </div>
  )
}

// prettier-ignore
const positions: GridPosition[] = [
  'left-top','center-top','right-top',
  'left-middle','center-middle','right-middle',
  'left-bottom','center-bottom','right-bottom',
]

const style: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: 'white',
  backgroundColor: 'black',
  zIndex: 20,
  position: 'fixed',
  top: 0,
  left: 0,
}
