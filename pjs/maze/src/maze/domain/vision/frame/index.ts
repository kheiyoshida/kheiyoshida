import { ListenableState } from '..'
import { DrawPoint } from '../draw/types'

import {
  FramesMaker,
  highDistortedNarrow,
  highRoofDistortedNarrow,
} from './framesMaker'

export type Frame = {
  tl: DrawPoint
  tr: DrawPoint
  bl: DrawPoint
  br: DrawPoint
}

export type FrameProvider = (state: ListenableState) => FramesMaker

const dist = (sanity: number) => (100 - sanity) * 0.0005

const narrow = (sanity: number, stamina: number) => (200 - sanity - stamina) * 0.005

const up = (stamina: number) => (100 - stamina) * 0.01

const long = (stamina: number) => (100 - stamina) * 0.01

export const normalFrameProvider: FrameProvider = ({
  floor,
  sanity,
  stamina,
}) =>
  highDistortedNarrow(
    dist(sanity),
    up(stamina),
    narrow(sanity, stamina),
    long(stamina)
  )

export const highWallFrameProvider: FrameProvider = ({ sanity, stamina }) =>
  highRoofDistortedNarrow(dist(sanity), narrow(sanity, stamina), long(stamina))
