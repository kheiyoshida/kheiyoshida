import { IsMobile, wh, ww } from '../../config'
import { Buttons } from './buttons'
import { Debug } from './debug'
import { Floor } from './floor'

import { Start } from './start'
import React, { useEffect } from 'react'
import { getUIRenderer } from './renderer'

export const Interface = ({ version, start }: { version: string; start: () => void }) => {
  return (
    <div style={style}>
      <Start version={version} start={start} />
      {IsMobile ? <Buttons /> : null}
      {/*<Map />*/}
      <Floor />
      <Debug />

      <UserInterfaceLayer />
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

const UserInterfaceLayer = () => {

  const draw = () => {
    const renderer = getUIRenderer()
    renderer.drawRect({
      centerX: 0,
      centerY: 0,
      width: 100,
      height: 100,
    })
  }

  useEffect(() => {
    draw()
  }, [])
  return (
    <div
      id="interface"
      style={{
        width: ww,
        height: wh,
      }}
    >
      <canvas id="ui-canvas" width={ww} height={wh}></canvas>
    </div>
  )
}
