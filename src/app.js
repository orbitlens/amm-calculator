import React from 'react'
import {render} from 'react-dom'
import {StorageContext} from './views/storage-context'
import CalculatorView from './views/calculator-view'
import './styles.scss'

const appContainer = document.createElement('div')

render(<StorageContext><CalculatorView/></StorageContext>, appContainer)
document.body.appendChild(appContainer)