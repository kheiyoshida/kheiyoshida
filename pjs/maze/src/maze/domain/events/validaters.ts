import { store } from '../../store'
import * as maze from '../maze/maze'
import { getStats } from '../stats'

type Validator = () => boolean

export const isAccepting: Validator = () => store.current.acceptCommand

export const canGo: Validator = () => maze.query.canProceed && getStats().stamina !== 0

export const shouldGoDownstairs: Validator = () => maze.query.reachedStair

export const canOpenMap: Validator = () => !store.current.mapOpen
