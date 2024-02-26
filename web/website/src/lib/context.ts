import { createContext } from 'react'

type PageType = { type: 'feed' | 'work' }
export const PageTypeContext = createContext({} as PageType)
