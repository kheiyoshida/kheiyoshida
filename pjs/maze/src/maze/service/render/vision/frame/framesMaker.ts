import { pipe } from 'utils'
import { Frame, FrameMakerParams } from '.'
import { Conf } from '../../../../config'
import { distortFrame, narrowFrame, upFrame } from './altFrame'
import { createFrame, createRoofTopFrame } from './createFrame'
import { rectWH } from './helpers'
import { DEFAULT_MAGNIFY_RATES, longPath, narrowPaths } from './magnify'

export type FramesMaker = (metaMagnify?: number) => Frame[]

const inject =
  (
    makeFrames: (w: number, h: number, rect: [number, number], fi: number) => Frame,
    magRates = DEFAULT_MAGNIFY_RATES,
    w = Conf.ww,
    h = Conf.wh
  ) =>
  (metaMagnify = 1) =>
    magRates.map((rate, fi) => makeFrames(w, h, rectWH(metaMagnify, rate, w, h), fi))

export const frames: FramesMaker = inject(createFrame)

export const distorted = (distortion = 0.03): FramesMaker =>
  inject((w, h, rect) => pipe(createFrame(w, h, rect), distortFrame(distortion, rect)))

export const distortedNarrow = (dis = 0.03, narrow = 0): FramesMaker =>
  inject((w, h, rect) =>
    pipe(createFrame(w, h, rect), distortFrame(dis, rect), narrowFrame(narrow))
  )

export const high = (up = 0.3): FramesMaker =>
  inject((w, h, rect) => pipe(createFrame(w, h, rect), upFrame(up, rect)))

export const highDistorted = (dis = 0.03, up = 0.3): FramesMaker =>
  inject((w, h, rect) => pipe(createFrame(w, h, rect), distortFrame(dis, rect), upFrame(up, rect)))

export const highDistortedNarrow = ({ dist, up, narrow }: FrameMakerParams): FramesMaker =>
  inject(
    (w, h, rect) =>
      pipe(
        createFrame(w, h, rect),
        narrowFrame(narrow),
        upFrame(up, rect),
        distortFrame(dist, rect)
      ),
    narrowPaths(narrow, undefined),
    Conf.ww * Math.max(0.5, 1 - narrow / 2)
  )

export const highRoof: FramesMaker = inject(createRoofTopFrame)

export const highRoofDistorted = (dis = 0.03): FramesMaker =>
  inject((w, h, rect) => pipe(createRoofTopFrame(w, h, rect), distortFrame(dis, rect)))

export const highRoofDistortedNarrow = ({ dist, narrow, long }: FrameMakerParams): FramesMaker =>
  inject(
    (w, h, rect) =>
      pipe(createRoofTopFrame(w, h, rect), narrowFrame(narrow), distortFrame(dist, rect)),
    narrowPaths(narrow, undefined, longPath(long)),
    Conf.ww * Math.max(0.5, 1 - narrow / 2)
  )
