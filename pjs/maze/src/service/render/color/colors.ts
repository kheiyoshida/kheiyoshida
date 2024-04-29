import { RGB } from '.'

export const Colors: Record<'gray'|'white'|'darkness', RGB> = {
  gray: [127, 127, 127],
  white: [255, 255, 255],
  darkness: [0, 0, 0],
} as const
