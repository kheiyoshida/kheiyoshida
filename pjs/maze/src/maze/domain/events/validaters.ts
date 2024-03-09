import * as mapper from '../maze/mapper'
import * as maze from '../maze/maze'
import { getStats } from '../stats'
import { store } from '../../store'

export type CommandValidator = () => boolean

export const isAccepting: CommandValidator = () => store.current.acceptCommand

export const canGo: CommandValidator = () => maze.query.canProceed && getStats().stamina !== 0

export const shouldGoDownstairs: CommandValidator = () => maze.query.reachedStair

export const canOpenMap = () => !mapper.query.mapOpen
