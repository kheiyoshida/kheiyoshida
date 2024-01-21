import { WebMidi } from 'webmidi'

export const createMidiInput = async (portName: string) => {
  if (!WebMidi.enabled) {
    await WebMidi.enable()
  }
  const input = WebMidi.inputs.find(i => i.name === portName)
  if (!input) {
    throw new PortNotFoundError(portName)
  }
  return input
}

class PortNotFoundError extends Error {
  constructor(portName: string) {
    super(`
    Midi port ${portName} was not found. 
    Availble ports are: 
    ${WebMidi.inputs.map((device) => device.name).join(`\n`)}
    `)
  }
}
