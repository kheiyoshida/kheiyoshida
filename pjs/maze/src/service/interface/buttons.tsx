import { wh, ww } from '../../config'
import React from 'react'

export const getButtons = () => {
  const map = document.getElementById(Map.id)
  const up =  document.getElementById(Up.id)
  const right = document.getElementById(Right.id)
  const left = document.getElementById(Left.id)
  if (!map || !up || !right || !left) {
    throw Error(`button not found`)
  }
  return {
    map,
    up,
    right,
    left,
  }
}

const base = wh * 0.08
const unit = wh * 0.095

const Map = { id: 'map-button', text: 'M', x: ww / 2 - base / 2, y: wh - unit - base / 4 }
const Up = { id: 'up-button', text: '△', x: ww / 2 - base / 2, y: wh - 2 * unit - base }
const Right = { id: 'right-button', text: '⇨', x: ww / 2 + unit, y: wh - unit - base }
const Left = { id: 'left-button', text: '⇦', x: ww / 2 - unit - base, y: wh - unit - base }

export const Buttons = () => {
  return (
    <>
      <Button {...Map} />
      <Button {...Up} />
      <Button {...Right} />
      <Button {...Left} />
    </>
  )
}

const Button = ({ id, text, x, y }: { id: string; text: string; x: number; y: number }) => {
  return (
    <div id={id} style={getButtonStyle(x, y)}>
      {text}
    </div>
  )
}

const getButtonStyle = (x: number, y: number): React.CSSProperties => ({
  color: 'rgba(255,255,255,0.4)',
  letterSpacing: '0',
  fontSize: base,
  textAlign: 'center',
  width: base,
  userSelect: 'none',
  position: 'fixed',
  top: y,
  left: x,
})
