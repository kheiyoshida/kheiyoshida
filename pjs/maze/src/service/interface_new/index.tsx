import { IsMobile } from '../../config'
import { Buttons } from './buttons'
import { Map } from './map'
import { Start } from './start'

export const Interface = ({ version }: { version: string }) => {
  return (
    <div style={style}>
      <Start version={version} />
      {IsMobile ? <Buttons /> : null}
      <Map />
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
