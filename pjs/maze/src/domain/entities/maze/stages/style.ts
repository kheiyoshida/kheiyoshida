import { IntRange } from 'utils'

export type RenderingStyle = IntRange<1, 10>

export const classifyStyle = (s: RenderingStyle) => {
  if (s >= 1 && s <= 3) return 0
  if (s >= 4 && s <= 6) return 1
  if (s >= 7 && s <= 9) return 2
}
