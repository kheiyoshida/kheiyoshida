
export const roundArgs = <Args extends number[]>(...args: Args): Args => {
  return args.map(a => Math.floor(a)) as Args
}
