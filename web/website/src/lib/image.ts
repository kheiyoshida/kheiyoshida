import path from 'path'

const IMGKIT = 'https://ik.imagekit.io/72lduu8js'
const worksPath = '/works'

export const resolveWorkInfo = (work: WorkInfo) => {
  let imagePaths: string[] = []
  if (work.visualLoc) {
    imagePaths = work.visualLoc.map((p) => IMGKIT + path.join(worksPath, work.date, p))
  }
  const resolved: Work = { ...work, imagePaths }
  return resolved
}

export const retrieveImgAlt = (path: string) => {
  const p = path.split('/')
  return p[p.length - 1]
}

export const retrieveImgLink = (img: string) => {
  const p = img.split('/')
  return path.join(
    p[p.length - 3], // work
    p[p.length - 2] // YYMMDD
  )
}
