import React from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './components/Application/App'

import '@materializecss/materialize/dist/css/materialize.min.css'
import '@materializecss/materialize/dist/css/materialize.colors.min.css'
import './styles/materialize-overrides.css'
import './style.css'
import './styles/button-row.css'
import './styles/utility.css'
import './styles/modal-overrides.css'
import './styles/font-overrides.css'
import './styles/z-index-overrides.css'

const root = createRoot(document.getElementById('root'))
root.render(React.createElement(Root))
