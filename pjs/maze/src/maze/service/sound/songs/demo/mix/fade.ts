import * as TC from 'src/lib/music/externals/tone/commands'
import * as TE from 'src/lib/music/externals/tone/events'
import { random } from "src/lib/random"

type FadeConfig = {
  rate: number
  duration: string
  volume: number
}

export function fade(
  chId: string,
  interval: string | number,
  fadeIn: FadeConfig,
  fadeOut: FadeConfig
) {
  let state: 'muted' | 'ramping' | 'on' = 'muted'

  function handleFadeIn() {
    if (!random(fadeIn.rate)) return
    if (state === 'muted') {
      TE.MuteRequired.pub({
        channel: chId,
        value: 'off',
      })
      return {
        time: '+0m',
        handler: () => {
          state = 'ramping'
          TE.FadeRequired.pub({
            channel: chId,
            values: [fadeIn.volume, fadeIn.duration],
          })
          return {
            time: `+${fadeIn.duration}`,
            handler: () => {
              state = 'on'
            },
          }
        },
      }
    }
  }

  function handleFadeOut() {
    if (!random(fadeOut.rate)) return
    if (state === 'on') {
      state = 'ramping'
      TE.FadeRequired.pub({
        channel: chId,
        values: [fadeOut.volume, fadeOut.duration],
      })
      return {
        time: `+${fadeOut.duration}`,
        handler: () => {
          TE.MuteRequired.pub({
            channel: chId,
            value: 'on',
          })
          state = 'muted'
        },
      }
    }
  }

  TC.RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          interval,
          handler: handleFadeIn,
        },
        {
          interval,
          handler: handleFadeOut,
        },
      ],
    },
  })
}

export function fadeWithoutMute(
  chId: string,
  interval: string | number,
  fadeIn: FadeConfig,
  fadeOut: FadeConfig
) {
  let state: 'muted' | 'ramping' | 'on' = 'muted'

  function handleFadeIn() {
    if (!random(fadeIn.rate)) return
    if (state === 'muted') {
      state = 'ramping'
      TE.FadeRequired.pub({
        channel: chId,
        values: [fadeIn.volume, fadeIn.duration],
      })
      return {
        time: `+${fadeIn.duration}`,
        handler: () => {
          state = 'on'
        },
      }
    }
  }

  function handleFadeOut() {
    if (!random(fadeOut.rate)) return
    if (state === 'on') {
      state = 'ramping'
      TE.FadeRequired.pub({
        channel: chId,
        values: [fadeOut.volume, fadeOut.duration],
      })
      return {
        time: `+${fadeOut.duration}`,
        handler: () => {
          state = 'muted'
        },
      }
    }
  }

  TC.RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          interval,
          handler: handleFadeIn,
        },
        {
          interval,
          handler: handleFadeOut,
        },
      ],
    },
  })
}
