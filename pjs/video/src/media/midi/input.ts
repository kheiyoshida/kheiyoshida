
export async function bindMidiInputMessage(
  callback: (data: Uint8Array) => void,
  inputName: string = 'LCXL3 1 MIDI Out',
) {
  try {
    const midi = await navigator.requestMIDIAccess()
    const input = getInput(midi, inputName)
    input.onmidimessage = (e: Event) => {
      callback((e as MIDIMessageEvent).data)
    }
  } catch (e) {
    console.error(e)
  }
}

function getInput(midiAccess: MIDIAccess, name: string): MIDIInput {
  let requestedInput: MIDIInput | undefined = undefined
  midiAccess.inputs.forEach((input) => {
    if (input.name?.includes(name)) {
      requestedInput = input
    }
  })
  if (requestedInput) return requestedInput
  throw Error(`${name} not found`)
}
