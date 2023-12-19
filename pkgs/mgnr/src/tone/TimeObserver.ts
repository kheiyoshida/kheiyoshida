import * as Transport from '../tone/tone-wrapper/Transport'

export type TimeEventHandler = (time: number) => OnceTimeEvent | void

export type TimeEventMap = {
  once?: OnceTimeEvent[]
  repeat?: RepeatTimeEvent[]
}

export type OnceTimeEvent = {
  time: string
  handler: TimeEventHandler
}

export type RepeatTimeEvent = {
  interval: string | number
  start?: string | number
  repeat?: number
  handler: TimeEventHandler
}

export class TimeObserver {
  constructor(bpm: number) {
    this.setBPM(bpm)
  }

  public registerEvents(map: TimeEventMap) {
    if (map.once) {
      map.once.forEach((e) => this.registerOnce(e))
    }
    if (map.repeat) {
      map.repeat.forEach((e) => this.registerRepeat(e))
    }
  }

  private registerOnce(event: OnceTimeEvent) {
    Transport.scheduleOnce((time) => {
      const chain = event.handler(time)
      if (chain) {
        this.next(chain)
      }
    }, event.time)
  }

  private registerRepeat(event: RepeatTimeEvent) {
    Transport.scheduleRepeat(
      (time) => {
        const chain = event.handler(time)
        if (chain) {
          this.next(chain)
        }
      },
      event.interval,
      event.start || 0,
      this.getDuration(event.interval, event.repeat)
    )
  }

  private next(event: OnceTimeEvent) {
    this.registerOnce(event)
  }

  private getDuration(interval: string | number, repeat?: number) {
    if (!repeat) return undefined
    if (typeof interval === 'string') {
      return `${repeat * parseInt(interval.slice(0, interval.length - 1))}m`
    } else {
      return repeat * interval
    }
  }

  private setBPM(bpm: number) {
    Transport.setBPM(bpm)
  }
}
