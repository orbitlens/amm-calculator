import React, {useState} from 'react'
import {logHistory} from '../history-view'
import {filterNumbersOnly} from '../../utils/numeric'
import StrategyManager from '../../strategies/strategy-manager'
import {useStorage} from '../storage-context'

export default function DepositView({user}) {
    const [amountA, setAmountA] = useState('0'),
        [amountB, setAmountB] = useState('0'),
        [storage, update] = useStorage()

    function deposit() {
        const result = new StrategyManager(storage).deposit(user, parseInt(amountA), parseInt(amountB))
        logHistory(result)
        update(storage)
        setAmountA('0')
        setAmountB('0')
    }

    return <>
        <div>
            <label>Amount A <input type="text" value={amountA === '0' ? '' : amountA}
                                   onChange={e => setAmountA(filterNumbersOnly(e.target.value) || '0')}/></label>
            &emsp;
            <label>Amount B <input type="text" value={amountB === '0' ? '' : amountB}
                                   onChange={e => setAmountB(filterNumbersOnly(e.target.value) || '0')}/></label>
        </div>
        <div className="space">
            <button onClick={deposit}>Deposit</button>
        </div>
    </>
}