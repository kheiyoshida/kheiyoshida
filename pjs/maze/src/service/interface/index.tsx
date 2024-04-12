import { IsMobile } from '../../config'
import { Buttons } from './buttons'
import { Floor } from './floor'
import { Map } from './map'
import { Start } from './start'

export const Interface = ({ version, start }: { version: string, start: () => void }) => {
  return (
    <div style={style}>
      <Start version={version} start={start} />
      {IsMobile ? <Buttons /> : null}
      <Map />
      <Floor />
    </div>
  )
}

const style: React.CSSProperties = {
  zIndex: 11, // higher than main webgl canvas
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  margin: '0 auto',
  touchAction: 'manipulation',
  overflowX: 'hidden',
  overflowY: 'hidden',
  overscrollBehavior: 'none',
}
