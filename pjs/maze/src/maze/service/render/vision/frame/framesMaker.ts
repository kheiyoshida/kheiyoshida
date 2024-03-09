import { pipe } from 'utils'
import { Frame } from '.'
import { Conf } from '../../../../config'
import { distortFrame, narrowFrame, upFrame } from './altFrame'
import { createFrame, createRoofTopFrame } from './createFrame'
import { rectWH } from './helpers'
import { DEFAULT_MAGNIFY_RATES, longPath, narrowPaths } from './magnify'
import { FrameMakerParams } from '../../../../domain/vision/frameMake'

export type MakeFrames = (metaMagnify?: number) => Frame[]

const inject =
  (
    makeFrames: (w: number, h: number, rect: [number, number], fi: number) => Frame,
    magRates = DEFAULT_MAGNIFY_RATES,
    w = Conf.ww,
    h = Conf.wh
  ) =>
  (metaMagnify = 1) =>
    magRates.map((rate, fi) => makeFrames(w, h, rectWH(metaMagnify, rate, w, h), fi))

export const frames: MakeFrames = inject(createFrame)

export const distorted = (distortion = 0.03): MakeFrames =>
  inject((w, h, rect) => pipe(createFrame(w, h, rect), distortFrame(distortion, rect)))

export const distortedNarrow = (dis = 0.03, narrow = 0): MakeFrames =>
  inject((w, h, rect) =>
    pipe(createFrame(w, h, rect), distortFrame(dis, rect), narrowFrame(narrow))
  )

export const high = (up = 0.3): MakeFrames =>
  inject((w, h, rect) => pipe(createFrame(w, h, rect), upFrame(up, rect)))

export const highDistorted = (dis = 0.03, up = 0.3): MakeFrames =>
  inject((w, h, rect) => pipe(createFrame(w, h, rect), distortFrame(dis, rect), upFrame(up, rect)))

export const highDistortedNarrow = ({ dist, up, narrow }: FrameMakerParams): MakeFrames =>
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

export const highRoof: MakeFrames = inject(createRoofTopFrame)

export const highRoofDistorted = (dis = 0.03): MakeFrames =>
  inject((w, h, rect) => pipe(createRoofTopFrame(w, h, rect), distortFrame(dis, rect)))

export const highRoofDistortedNarrow = ({ dist, narrow, long }: FrameMakerParams): MakeFrames =>
  inject(
    (w, h, rect) =>
      pipe(createRoofTopFrame(w, h, rect), narrowFrame(narrow), distortFrame(dist, rect)),
    narrowPaths(narrow, undefined, longPath(long)),
    Conf.ww * Math.max(0.5, 1 - narrow / 2)
  )
