import { ListenableState } from '.'

export type FrameMakerParams = {
  dist: number
  narrow: number
  up: number
  long: number
}

export const calcFrameProviderParams = ({ sanity, stamina }: ListenableState): FrameMakerParams => {
  return {
    dist: dist(sanity),
    up: up(stamina),
    long: long(stamina),
    narrow: narrow(sanity, stamina),
  }
}

const dist = (sanity: number) => (100 - sanity) * 0.0005

const narrow = (sanity: number, stamina: number) => (200 - sanity - stamina) * 0.005

const up = (stamina: number) => (100 - stamina) * 0.01

const long = (stamina: number) => (100 - stamina) * 0.01
