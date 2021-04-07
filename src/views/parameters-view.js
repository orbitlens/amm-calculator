import React from 'react'
import {resetHistory} from './history-view'
import ammStrategies from '../strategies/amm'
import {useStorage} from './storage-context'

function reinit(params) {
    return Object.assign({
        ammStrategy: ammStrategies[0].key,
        users: [{name: 'u1', stake: 0}],
        fee: 3,
        state: null
    }, params)
}

export default function ParametersView() {
    const [storage, update] = useStorage()
    const {ammStrategy, fee} = storage
    return <div>
        <h3>Parameters</h3>
        <label>
            AMM strategy:{' '}
            <select value={ammStrategy} onChange={e => {
                update(reinit({ammStrategy: e.target.value}))
                resetHistory()
            }}>
                {ammStrategies.map(s => <option value={s.key} key={s.key}>{s.name}</option>)}
            </select>
        </label>
        &emsp;
        <label>
            Trading fee:{' '}
            <input type="text" style={{textAlign: 'right'}} value={fee} onChange={e => {
                const parsed = parseInt(e.target.value)
                if (parsed >= 0 && parsed < 1000) update({fee: parsed})
            }}/> ‰
        </label>
        &emsp;
        <button onClick={e => {
            update(reinit())
            resetHistory()
        }}>reset</button>
    </div>
}