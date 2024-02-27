import React from 'react'
import ReactDOM from 'react-dom/client'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PJ1 />
    </React.StrictMode>
  )
} else throw Error(`root not found`)
