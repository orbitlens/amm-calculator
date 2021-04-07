import React from 'react'
import {useStorage} from './storage-context'
import StrategyManager from '../strategies/strategy-manager'
import {formatWithAutoPrecision} from '../utils/numeric'

function PoolParam({name, value}) {
    return <span><b>{name}</b>: {value}&emsp;</span>
}

export default function StateView() {
    const [storage] = useStorage(),
        strategyManager = new StrategyManager(storage),
        {state} = storage,
        stateKeys = Object.keys(state)
    return <div>
        <h3>Pool state</h3>
        {!stateKeys.length && <div className="dimmed">(Pool not initialized)</div>}
        {Object.keys(state).map(key => <PoolParam key={key} name={key} value={state[key]}/>)}
        {<PoolParam name="Price" value={formatWithAutoPrecision(strategyManager.getPrice()) + ' A/B'}/>}
        <div className="dimmed" style={{fontSize: '0.9em'}}>
            <p>
                All amounts represented in stroops. Rounding always favors the pool.
                <br/>
                Note: Rounding errors may be much more significant than pool fee impact for small swap amounts. It's
                recommended to use numbers > 10<sup>4</sup> to minimize integer approximation impact.
            </p>
        </div>
    </div>
}