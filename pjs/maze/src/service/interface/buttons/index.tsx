import React from 'react'
import { getUIRenderer } from '../renderer'
import { physicalToLogicalPoint } from '../renderer/utils.ts'
import { makeButtonState } from './state.ts'
import { btnSize, centerX, centerY } from './constants.ts'
import { IsMobile } from '../../../config'
import { store } from '../../../store'

export const getButtons = () => {
  const map = document.getElementById(Map.id)
  const up = document.getElementById(Up.id)
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

type PhysicalButtonSpec = {
  id: string
  x: number
  y: number
}

const Up: PhysicalButtonSpec = { id: 'up-button', x: centerX, y: centerY - btnSize }
const Right: PhysicalButtonSpec = {
  id: 'right-button',
  x: centerX + btnSize,
  y: centerY - btnSize / 4,
}
const Left: PhysicalButtonSpec = {
  id: 'left-button',
  x: centerX - btnSize,
  y: centerY - btnSize / 4,
}
const Map: PhysicalButtonSpec = { id: 'map-button', x: centerX, y: centerY }

const logicalUpPos = physicalToLogicalPoint(Up)
const logicalRightPos = physicalToLogicalPoint(Right)
const logicalLeftPos = physicalToLogicalPoint(Left)
const logicalMapPos = physicalToLogicalPoint(Map)

const upButtonState = makeButtonState()
const rightButtonState = makeButtonState()
const leftButtonState = makeButtonState()

export type ButtonMember = 'up' | 'right' | 'left' | 'map'

export const drawButtons = (pressedButton?: ButtonMember) => {
  if (!IsMobile) return
  if (store.current.mapOpen) return

  const renderer = getUIRenderer()

  if (pressedButton === 'up') {
    upButtonState.addOffset()
  }
  if (pressedButton === 'right') {
    rightButtonState.addOffset()
  }
  if (pressedButton === 'left') {
    leftButtonState.addOffset()
  }

  renderer.clearCanvas()
  renderer.changeStrokeColor([0, 0.0, 0.5])

  renderer.drawLineShape({
    points: [
      logicalMapPos,
      {
        x: logicalLeftPos.x - leftButtonState.currentOffset,
        y: logicalLeftPos.y,
      },
      {
        x: logicalUpPos.x,
        y: logicalUpPos.y - upButtonState.currentOffset,
      },
      {
        x: logicalRightPos.x + rightButtonState.currentOffset,
        y: logicalRightPos.y,
      },
      logicalMapPos,
    ],
    omitFill: true,
    lineWidth: 2,
    alpha: 0.2,
  })
  renderer.drawCircle({
    centerX: logicalMapPos.x,
    centerY: logicalMapPos.y,
    size: btnSize / 8,
    lineWidth: 4,
    alpha: 0.3,
    // omitFill: true,
  })
}

export const hideButtons = () => {
  getUIRenderer().clearCanvas()
}

export const PhysicalButtons = () => (
  <>
    <Button {...Map} />
    <Button {...Up} />
    <Button {...Right} />
    <Button {...Left} />
  </>
)

const Button = ({ id, x, y }: PhysicalButtonSpec) => {
  return <div id={id} style={getButtonStyle(x, y)}></div>
}

const getButtonStyle = (x: number, y: number): React.CSSProperties => ({
  top: y - btnSize / 2,
  left: x - btnSize / 2,
  width: btnSize,
  height: btnSize,
  backgroundColor: 'transparent',
  // backgroundColor: 'rgba(0,0,0,0.6)',
  letterSpacing: '0',
  fontSize: btnSize,
  textAlign: 'center',
  userSelect: 'none',
  position: 'fixed',
})
