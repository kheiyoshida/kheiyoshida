type WorkType = 'music' | 'visual' | 'video' | 'sketch' | 'other'
type Layout = 'row' | 'grid'

type WorkInfo = {
  date: string // YYMMDD
  type: WorkType[]
  title: string
  description?: string

  // content
  visualLoc?: string[]
  musicLoc?: string[]
  videoLoc?: string[]

  // other
  info?: { [k: string]: string }

  // pref
  layout?: Layout
}

type ResolvedImages = {
  thumbnail?: string // thumbnail image path
  imagePaths: string[]
}

type Work = WorkInfo & ResolvedImages

type WorkInfoNew = {
  title: string
  date: string // YYMMDD
  contents: WorkContent[]
}

type WorkContent = {
  [k in WorkContentType]?: string[]
}

type WorkContentType = 'text' | 'images' | 'embed' | 'sketch'
