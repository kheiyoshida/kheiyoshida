import { statusStore, store } from '../store'
import * as maze from './mutate/maze'

type Validator = () => boolean

export const isAcceptingControl: Validator = () => store.current.blockControl === false

export const isAcceptingStatusChange: Validator = () => store.current.blockStatusChange === false

export const canGo: Validator = () => maze.query.canProceed && statusStore.current.stamina !== 0

export const shouldGoDownstairs: Validator = () => maze.query.reachedStair

export const canOpenMap: Validator = () => !store.current.mapOpen
