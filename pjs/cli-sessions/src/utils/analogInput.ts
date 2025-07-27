/* eslint-disable no-console */
import { SerialPortStream } from '@serialport/stream'
import { autoDetect } from '@serialport/bindings-cpp'
import { ReadlineParser } from '@serialport/parser-readline'
import { CliSequenceGenerator } from '@mgnr/cli'

const usbPath = '/dev/cu.usbmodem1101'

type InputCallback = (data: ControllerInputData) => void

/**
 * set up analog input via usb from arduino micro controller
 */
export const setupAnalogInput = (callback: InputCallback) => {
  // Detect platform-specific bindings
  const Bindings = autoDetect()

  const port = new SerialPortStream(
    {
      path: usbPath,
      baudRate: 9600,
      binding: Bindings,
    },
    (e) => {
      console.error(e)
    }
  )

  // set up a line parser (to parse '\n'-terminated lines)
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

  // On receiving data from Arduino
  parser.on('data', (data) => {
    try {
      const parsedData = parseInput(data)
      callback(parsedData)
    } catch (e) {
      console.error(e)
    }
  })

  // prevent console from printing error 130
  process.on('SIGINT', () => {
    port.close((err) => {
      if (err) {
        console.error('Error closing port:', err.message)
      } else {
        console.log('Serial port closed.')
      }
      process.exit(0) // Exit manually with code 0
    })
  })
}

export enum GeneratorParameter {
  Density = 0,
  SequenceLength = 1,
}

export enum ScaleParameter {
  Low = 0,
  High= 1
}

export type ControllerInputData = {
  target: number
  valueType: GeneratorParameter | ScaleParameter
  value: number
}

const parseInput = (inputString: string): ControllerInputData => {
  const [target, valueType, value] = inputString.trim().split(',')
  return {
    target: parseInt(target),
    valueType: parseInt(valueType),
    value: parseFloat(value),
  }
}
