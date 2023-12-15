import { CORE_COMMAND_HANDLERS, CORE_EVENT_HANDLERS } from './handlers'
import {
  Event,
  Command,
  Message,
  EventHandlerMap,
  CommandHandlerMap,
} from './Message'
import { Destination } from './Destination'

export class MessageBus<D extends Destination> {
  private static instance: MessageBus<any>

  public destination: Destination
  readonly EventHandlers
  readonly CommandHandlers

  private constructor(
    destination: D,
    externalEvents: EventHandlerMap<D>,
    externalCommands: CommandHandlerMap<D>,
    userEvents?: EventHandlerMap<D>,
    userCommands?: CommandHandlerMap<D>
  ) {
    this.destination = destination
    this.EventHandlers = Object.assign(
      CORE_EVENT_HANDLERS,
      externalEvents,
      userEvents
    )
    this.CommandHandlers = Object.assign(
      CORE_COMMAND_HANDLERS,
      externalCommands,
      userCommands
    )
  }

  public static init<O extends Destination>(
    output: O,
    externalEvents: EventHandlerMap<O>,
    externalCommands: CommandHandlerMap<O>,
    userEvents?: EventHandlerMap<O>,
    userCommands?: CommandHandlerMap<O>
  ): MessageBus<O> {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus(
        output,
        externalEvents,
        externalCommands,
        userEvents,
        userCommands
      )
    }
    return MessageBus.instance
  }

  public static get() {
    if (!MessageBus.instance) {
      throw new Error('MessageBus is not instantiated')
    }
    return MessageBus.instance
  }

  private queue: Message[] = []

  public handle(message: Message) {
    this.queue = [message]
    while (this.queue.length) {
      const m = this.queue.shift()!
      if (m instanceof Event) {
        this.handleEvent(m)
      } else if (m instanceof Command) {
        this.handleCommand(m)
      }
    }
  }

  private handleEvent(event: Event) {
    for (const handler of this.EventHandlers[event.constructor.name]) {
      const nextEvents = handler(event, this.destination as D)
      if (nextEvents) {
        this.collect(nextEvents)
      }
    }
  }

  private handleCommand(command: Command) {
    const handler = this.CommandHandlers[command.constructor.name]
    const nextEvents = handler(command, this.destination as D)
    if (nextEvents) {
      this.collect(nextEvents)
    }
  }

  private collect(events: Event[]) {
    events.forEach((e) => this.queue.push(e))
  }
}
