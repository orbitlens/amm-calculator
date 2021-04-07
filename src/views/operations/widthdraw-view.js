import React from 'react'
import {logHistory} from '../history-view'
import StrategyManager from '../../strategies/strategy-manager'
import {useStorage} from '../storage-context'

export default function WithdrawView({user}) {
    const [storage, update] = useStorage()

    function withdraw() {
        const result = new StrategyManager(storage).withdraw(user)
        logHistory(result)
        update(storage)
    }

    return <>
        <p>
            The withdraw operation transfers all liquidity that belongs to an account.
        </p>
        <div className="space">
            <button onClick={withdraw}>Withdraw</button>
        </div>
    </>
}