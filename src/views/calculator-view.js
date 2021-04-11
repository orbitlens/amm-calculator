import React from 'react'
import StateView from './state-view'
import HistoryView from './history-view'
import ParametersView from './parameters-view'
import OperationTabsView from './operations/operation-tabs'

export default function CalculatorView() {
    return <div className="container">
        <div style={{minHeight: 'calc(100vh - 9.5em)'}}>
            <h1>AMM simulation calculator</h1>
            <ParametersView/>
            <StateView/>

            <OperationTabsView/>

            <hr className="space"/>
            <HistoryView/>
        </div>
        <div style={{textAlign: 'center'}} className="space">
            <hr/>
            <a href="https://github.com/orbitlens/amm-calculator" target="_blank"><span
                className="dimmed">Source code</span></a>
        </div>
    </div>
}