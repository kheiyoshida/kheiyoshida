import { CommandHandlerMap, EventHandlerMap, Handler, Message } from '../../core/Message'
import { DisposeSequenceOutRequired, SequenceOutSetupRequired } from '../../core/events'
import { Generator } from '../../generator/Generator'
import { ToneDestination } from './Destination'
import * as Commands from './commands'
import * as Events from './events'
import { InstChannel, SendChannel } from './mixer/Channel'

export type ToneHandler<M extends Message = any> = Handler<ToneDestination, M>

const setupInstChannel: ToneHandler<Commands.SetupInstChannel> = (mes, { mixer }) => {
  mixer.addInstChannel(mes.conf.id, new InstChannel(mes.conf))
  if (mes.conf.fadeIn) {
    return [
      Events.FadeRequired.create({
        channel: mes.conf.id,
        values: mes.conf.fadeIn,
      }),
    ]
  }
  return null
}

const setupSendChannel: ToneHandler<Commands.SetupSendChannel> = (mes, { mixer }) => {
  mixer.addSendChannel(mes.conf.id, new SendChannel(mes.conf))
  return null
}

const assignSendChannel: ToneHandler<Commands.AssignSendChannel> = (mes, { mixer }) => {
  mixer.connectSendChannel(mes.from, mes.to, mes.gainAmount)
  return null
}

/**
 * assign generator to instrument
 */
const assignGenerator: ToneHandler<Commands.AssignGenerator> = (mes, { mixer }) => {
  const instCh = mixer.findInstChannelById(mes.channelId)
  const gen = new Generator({
    conf: mes.conf,
    notes: mes.notes,
  })

  return [
    SequenceOutSetupRequired.create({
      gen: gen,
      inst: instCh.inst,
      outId: mes.channelId,
      loop: mes.loop,
      events: mes.events,
    }),
  ]
}

const handleFade: ToneHandler<Events.FadeRequired> = (mes, { mixer }) => {
  const ch = mixer.findChannelById(mes.channel)
  ch.volumeFade(mes.values)
  return null
}

const handleMute: ToneHandler<Events.MuteRequired> = (mes, { mixer }) => {
  mixer.muteChannel(mes.channel, mes.value)
  return null
}

const handleSendFade: ToneHandler<Events.SendFadeRequired> = (mes, { mixer }) => {
  mixer.fadeChannelSend(mes.channel, mes.send, mes.values)
  return null
}

const handleSendMute: ToneHandler<Events.SendMuteRequired> = (mes, { mixer }) => {
  mixer.muteChannelSend(mes.channel, mes.send, mes.value)
  return null
}

const registerTimeEvents: ToneHandler<Commands.RegisterTimeEvents> = (mes, dest) => {
  dest.timeObserver.registerEvents(mes.events)
  return null
}

const disposeChannel: ToneHandler<Events.DisposeChannelRequired> = (mes, { mixer }) => {
  const ch = mixer.findChannelById(mes.channelId)
  if (ch instanceof InstChannel) {
    return [
      DisposeSequenceOutRequired.create({
        outId: mes.channelId,
      }),
      Events.DeleteChannelRequired.create({
        channelId: mes.channelId,
      }),
    ]
  } else {
    return [
      Events.DeleteChannelRequired.create({
        channelId: mes.channelId,
      }),
    ]
  }
}

const deleteChannel: ToneHandler<Events.DeleteChannelRequired> = (mes, { mixer }) => {
  mixer.deleteChannel(mes.channelId)
  return null
}

export const TONE_EVENT_HANDLERS: EventHandlerMap<ToneDestination, keyof typeof Events> = {
  ChannelAssigned: [],
  FadeRequired: [handleFade],
  MuteRequired: [handleMute],
  SendFadeRequired: [handleSendFade],
  SendMuteRequired: [handleSendMute],
  DeleteChannelRequired: [deleteChannel],
  DisposeChannelRequired: [disposeChannel],
}

export const TONE_COMMAND_HANDLERS: CommandHandlerMap<ToneDestination, keyof typeof Commands> = {
  SetupInstChannel: setupInstChannel,
  SetupSendChannel: setupSendChannel,
  AssignSendChannel: assignSendChannel,
  AssignGenerator: assignGenerator,
  RegisterTimeEvents: registerTimeEvents,
}
