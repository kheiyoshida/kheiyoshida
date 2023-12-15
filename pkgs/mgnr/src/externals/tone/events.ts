import { Event } from '../../core/Message'
import { FadeValues, MuteValue } from './mixer/Channel'

export class FadeRequired extends Event {
  channel!: string
  values!: FadeValues
}

export class MuteRequired extends Event {
  channel!: string
  value!: MuteValue
}

export class SendFadeRequired extends Event {
  channel!: string
  send!: string
  values!: FadeValues
}

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
