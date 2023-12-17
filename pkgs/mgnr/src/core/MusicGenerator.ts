import { Destination } from './Destination'

export class MusicGenerator<Dest extends Destination> {
  private destination: Dest

  constructor(destination: Dest) {
    this.destination = destination
  }
  checkDestination(message: string) {
    console.log('this is the dest, yay')
    console.log(JSON.stringify(this.destination, null, 2))
    console.log(message)
  }
}
