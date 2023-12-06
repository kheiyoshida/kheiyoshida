import { Event } from '../../core/Message'
import { FadeValues, MuteValue } from './mixer/Channel'

export class ChannelAssigned extends Event {
  channelId!: string
}

export class FadeRequired extends Event {
  channel!: string
  values!: FadeValues
}

export class MuteRequired extends Event {
  channel!: string
  value!: MuteValue
}

/**
 * require channel's send to fade in/out
 * @param channel channel id in mixer
 * @param send send id in channel
 * @param values fade spec
 */
export class SendFadeRequired extends Event {
  channel!: string
  send!: string
  values!: FadeValues
}

/**
 * mute on/off/toggle for channel's send
 * @param channel channel id in mixer
 * @param send send id in channel
 * @param value mute spec
 */
export class SendMuteRequired extends Event {
  channel!: string
  send!: string
  value!: MuteValue
}

export class DisposeChannelRequired extends Event {
  channelId!: string
}

export class DeleteChannelRequired extends Event {
  channelId!: string
}
