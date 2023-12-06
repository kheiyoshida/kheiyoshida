import { getStats } from 'src/maze/domain/stats'
import * as maze from '../../domain/maze/maze'
import * as mapper from '../../domain/maze/mapper'
import { store } from 'src/maze/store'

export type CommandValidator = () => boolean

export const isAccepting: CommandValidator = () => store.read('acceptCommand')

export const canGo: CommandValidator = () =>
  maze.query.canProceed && getStats().stamina !== 0

export const shouldGoDownstairs: CommandValidator = () => maze.query.reachedStair

export const canOpenMap = () => !mapper.query.mapOpen