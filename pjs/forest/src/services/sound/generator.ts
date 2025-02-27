import { SequenceGenerator, pingPongSequenceLength } from 'mgnr-tone'

export class ForestSequenceGenerator extends SequenceGenerator {
  private _changeLength = pingPongSequenceLength('extend')
  changeLength(num: number) {
    this._changeLength(this.context, num)
  }
}
