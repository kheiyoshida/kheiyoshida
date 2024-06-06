import { clamp, randomIntInclusiveBetween } from 'utils'
import { store } from '../../store'

export const updateAesthetics = () => {
  const delta = randomIntInclusiveBetween(-3, 3)
  store.setAesthetics(clamp(store.current.aesthetics + delta, 1, 9))
}
