const IMGKIT = 'https://ik.imagekit.io/72lduu8js'

export const resolveImagekitPath = (...paths: string[]) => IMGKIT + '/' + paths.join('/')

export const retrieveImgAlt = (path: string) => {
  const p = path.split('/')
  return p[p.length - 1]
}

export const imageKitLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  const paramsString = `w-${width},q-${quality || 30}`
  return `${src}?tr=${paramsString}`
}
