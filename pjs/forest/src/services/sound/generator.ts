import { SequenceGenerator, pingpongSequenceLength } from 'mgnr-tone'

export class ForestSequenceGenerator extends SequenceGenerator {
  changeLength(num: number) {
    pingpongSequenceLength('extend')(this.context, num)
  }
}
