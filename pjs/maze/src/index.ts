/* eslint-disable no-var */
import Logger from 'js-logger'
import p5 from 'p5'

Logger.useDefaults()
Logger.setLevel(Logger.WARN)

declare global {
  var p: p5
}
