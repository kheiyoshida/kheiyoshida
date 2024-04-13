import { statusStore, store } from '../../store'
import * as maze from '../interface/maze'

type Validator = () => boolean

export const isAccepting: Validator = () => store.current.acceptCommand

export const canGo: Validator = () => maze.query.canProceed && statusStore.current.stamina !== 0

export const shouldGoDownstairs: Validator = () => maze.query.reachedStair

export const canOpenMap: Validator = () => !store.current.mapOpen
