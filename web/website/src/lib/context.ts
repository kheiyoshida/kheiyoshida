import { createContext } from 'react'

type PageType = { type: 'feed' | 'work' | 'project' }
export const PageTypeContext = createContext({} as PageType)
