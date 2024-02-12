import {loadImage as li} from 'p5utils/src/media/image'

export const loadImage = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imgLoc = require('../../../assets/img/man.jpg')
  return li(imgLoc)
}
