import { IsMobile, wh, ww } from '../../config'
import { PhysicalButtons } from './buttons'
import { Debug } from './debug'
import { Start } from './start'
import React from 'react'

export const Interface = ({ version, start }: { version: string; start: () => void }) => {
  return (
    <div style={style}>
      <Debug />
      <Start version={version} start={start} />
      {IsMobile ? <PhysicalButtons /> : null}

      <div
        id="interface"
        style={{
          width: ww,
          height: wh,
        }}
      >
        <canvas id="ui-canvas" width={ww} height={wh} style={{

        }}/>
      </div>
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
  fontFamily: 'Courier New, Courier, monospace',
}
