import * as TC from 'mgnr/dist/externals/tone/commands'
import * as TE from 'mgnr/dist/externals/tone/events'
import { random } from 'src/lib/utils/random'

type FadeConfig = {
  volumeRange: {
    min: number
    max: number
  }
  autoFadeIn?: {
    fireRate: number
    duration: string
    fireInterval: string
  }
  autoFadeOut?: {
    fireRate: number
    duration: string
    fireInterval: string
  }
}

type FadeStateValue = 'muted' | 'ramping' | 'on'
type FadeState = ReturnType<typeof makeFadeState>

export type Fader = {
  fadeState: FadeState
  manualFadeIn: (duration: string) => void
  manualFadeOut: (duration: string) => void
}

const makeFadeState = (initial: FadeStateValue = 'on') => {
  let state: FadeStateValue = initial
  return {
    get value() {
      return state
    },
    set: (newState: FadeStateValue) => {
      state = newState
    },
  }
}

const _fadeIn = (
  fadeState: FadeState,
  chId: string,
  volumeTo: number,
  duration: string
) => {
  if (fadeState.value === 'muted') {
    TE.MuteRequired.pub({
      channel: chId,
      value: 'off',
    })
    return {
      time: '+0m',
      handler: () => {
        fadeState.set('ramping')
        TE.FadeRequired.pub({
          channel: chId,
          values: [volumeTo, duration],
        })
        return {
          time: `+${duration}`,
          handler: () => {
            fadeState.set('on')
          },
        }
      },
    }
  }
}

const _fadeOut = (
  fadeState: FadeState,
  chId: string,
  volumeTo: number,
  duration: string
) => {
  if (fadeState.value === 'on') {
    fadeState.set('ramping')
    TE.FadeRequired.pub({
      channel: chId,
      values: [volumeTo, duration],
    })
    return {
      time: `+${duration}`,
      handler: () => {
        TE.MuteRequired.pub({
          channel: chId,
          value: 'on',
        })
        fadeState.set('muted')
      },
    }
  }
}

export const makeFader = (
  chId: string,
  config: FadeConfig,
  initialState: FadeStateValue = 'on'
): Fader => {
  const fadeState = makeFadeState(initialState)

  if (initialState === 'muted') {
    TE.MuteRequired.pub({
      channel: chId,
      value: 'on',
    })
  }

  const fadeIn = (duration: string) =>
    _fadeIn(fadeState, chId, config.volumeRange.max, duration)
  const fadeOut = (duration: string) =>
    _fadeOut(fadeState, chId, config.volumeRange.min, duration)

  if (config.autoFadeIn) {
    const { fireInterval, fireRate, duration } = config.autoFadeIn
    TC.RegisterTimeEvents.pub({
      events: {
        repeat: [
          {
            interval: fireInterval,
            handler: () => {
              if (random(fireRate)) {
                return fadeIn(duration)
              }
            },
          },
        ],
      },
    })
  }
  if (config.autoFadeOut) {
    const { fireInterval, fireRate, duration } = config.autoFadeOut
    TC.RegisterTimeEvents.pub({
      events: {
        repeat: [
          {
            interval: fireInterval,
            handler: () => {
              if (random(fireRate)) {
                return fadeOut(duration)
              }
            },
          },
        ],
      },
    })
  }

  return {
    fadeState,
    manualFadeIn: (duration: string) => {
      TC.RegisterTimeEvents.pub({
        events: {
          once: [
            {
              time: '+0m',
              handler: () => fadeIn(duration),
            },
          ],
        },
      })
    },
    manualFadeOut: (duration: string) => {
      TC.RegisterTimeEvents.pub({
        events: {
          once: [
            {
              time: '+0m',
              handler: () => fadeOut(duration),
            },
          ],
        },
      })
    },
  }
}
