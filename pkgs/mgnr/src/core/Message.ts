import { Destination } from './Destination'
import { MessageBus } from './MessageBus'

export class Message {
  static pub<T extends Message>(this: { new (): T }, values: T) {
    MessageBus.get().handle(
      Object.assign(Object.assign(Object.create(this.prototype), new this()), values)
    )
  }
  static create<T extends Message>(this: { new (): T }, values: T): T {
    return Object.assign(Object.assign(Object.create(this.prototype), new this()), values)
  }
}

export class Command extends Message {}
export class Event extends Message {}

export type Handler<D extends Destination, M extends Message = any> = (
  mes: M,
  destination: D
) => Event[] | null

export type CoreHandler<M extends Message = any> = Handler<Destination, M>

export type EventHandlerMap<D extends Destination, Keys extends string = string> = {
  [k in Keys]: Handler<D>[]
}

export type CommandHandlerMap<D extends Destination, Keys extends string = string> = {
  [k in Keys]: Handler<D>
}
