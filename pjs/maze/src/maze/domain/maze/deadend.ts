type DeadEndItem = true

const deadEnds: {
  [k: string]: DeadEndItem
} = {}

const deadEndKey = (pos: number[]) => pos.join('-')

export const getDeadEndItem = (pos: number[]) => {
  const key = deadEndKey(pos)
  if (key in deadEnds) {
    return deadEnds[key]
  } else {
    return null
  }
}

export const putDeadEndItem = (pos: number[], item: DeadEndItem) => {
  const key = deadEndKey(pos)
  deadEnds[key] = item
}

export const resetDeadEndItems = () => {
  for (const key in deadEnds) {
    delete deadEnds[key]
  }
}
