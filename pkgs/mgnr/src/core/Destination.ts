import { Output } from './Output'

export abstract class Destination<I = any> {
  abstract output: Output<I>
}
