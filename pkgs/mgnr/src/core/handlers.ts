import * as Events from './events'
import * as Commands from './commands'
import { CoreHandler, CommandHandlerMap, EventHandlerMap } from './Message'
import Logger from 'js-logger'
import { Destination } from './Destination'
import { SeqEventKey } from './SequenceEvent'

const setupSequenceOut: CoreHandler<Events.SequenceOutSetupRequired> = (
  mes,
  { output }
) => {
  output.set(mes.outId, mes.gen, mes.inst, mes.events)
  output.outs[mes.outId].assignSequence(mes.loop)
  return null
}

const changeSequenceLength: CoreHandler<Events.SequenceLengthChangeRequired> = (
  mes
) => {
  Logger.debug(`${mes.method}: ${mes.len} (current length: ${mes.gen.sequence.length})`)
  const result = mes.gen.changeSequenceLength(mes.method, mes.len, mes.refill)
  if (result === false) {
    if (mes.exceeded === 'reverse') {
      mes.gen.toggleReverse()
      mes.gen.changeSequenceLength(mes.method, mes.len, mes.refill)
    } else if (mes.exceeded === 'erase') {
      return [
        Events.EraseNotesRequired.create({
          gen: mes.gen
        })
      ]
    }
  }
  return null
}

const eraseSequenceNotes: CoreHandler<Events.EraseNotesRequired> = (mes) => {
  mes.gen.erase()
  return null
}

const modulateScale: CoreHandler<Events.ScaleModulationRequired> = (mes) => {
  mes.scale.modulate(mes.next, mes.stages)
  return [Events.AdjustNotesRequired.create({ scale: mes.scale })]
}

const adjustSequenceNotes: CoreHandler<Events.AdjustNotesRequired> = (
  mes,
  { output }
) => {
  Logger.debug('adjust notes')
  const gens = output.findGeneratorByScale(mes.scale)
  gens.forEach((gen) => gen.adjustPitch())
  return null
}

/**
 * generic handler to deal with time-based events of sequences
 */
const handleSequenceEvent = <T extends Events.SequenceElapsed>(
  key: SeqEventKey
) => {
  const handler: CoreHandler<T> = (mes, dest) => {
    Logger.debug(key)
    const eventSpec = mes.out.events[key]
    if (!eventSpec) {
      return [
        Events.SequenceReAssignRequired.create({
          out: mes.out,
          loop: mes.loop,
          startTime: mes.endTime,
        }),
      ]
    } else {
      // Event[]
      if (Array.isArray(eventSpec)) {
        return eventSpec
      }
      // Handler
      else if (typeof eventSpec === 'function') {
        return eventSpec(mes, dest)
      }
      // MutateSpec
      else {
        mes.out.generator.mutate(eventSpec)
        return null
      }
    }
  }
  return handler
}

const reassignSequence: CoreHandler<Events.SequenceReAssignRequired> = (
  mes
) => {
  if (mes.reset) {
    mes.out.generator.resetNotes()
  }
  if (!mes.out.isDisposed) {
    Logger.debug('reassign', mes.out.outId)
    mes.out.assignSequence(mes.loop, mes.startTime)
  }
  return null
}

const disposeSequenceOut: CoreHandler<Events.DisposeSequenceOutRequired> = (
  mes,
  { output }
) => {
  output.delete(mes.outId)
  return null
}

export const CORE_EVENT_HANDLERS: EventHandlerMap<
  Destination,
  keyof typeof Events
> = {
  SequenceLengthChangeRequired: [changeSequenceLength],
  ScaleModulationRequired: [modulateScale],
  AdjustNotesRequired: [adjustSequenceNotes],
  SequenceOutSetupRequired: [setupSequenceOut],
  SequenceAssigned: [],
  SequenceStarted: [],
  SequenceElapsed: [handleSequenceEvent<Events.SequenceElapsed>('elapsed')],
  SequenceEnded: [handleSequenceEvent<Events.SequenceEnded>('ended')],
  SequenceReAssignRequired: [reassignSequence],
  DisposeSequenceOutRequired: [disposeSequenceOut],
  EraseNotesRequired: [eraseSequenceNotes]
}

export const CORE_COMMAND_HANDLERS: CommandHandlerMap<
  Destination,
  keyof typeof Commands
> = {
  Setup: (mes, output) => {
    return []
  },
}
