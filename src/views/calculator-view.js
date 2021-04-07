import React, {useState} from 'react'
import StateView from './state-view'
import HistoryView from './history-view'
import ParametersView from './parameters-view'
import OperationTabsView from './operations/operation-tabs'


export default function CalculatorView() {
    return <div className="container">
        <h1>AMM simulation calculator</h1>
        <ParametersView/>
        <StateView/>

        <OperationTabsView/>

        <hr className="space"/>
        <HistoryView/>
    </div>
}