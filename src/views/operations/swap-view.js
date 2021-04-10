import React, {useState} from 'react'
import {logHistory} from '../history-view'
import {filterDecimalCharacters, filterNumbersOnly, formatWithAutoPrecision} from '../../utils/numeric'
import StrategyManager from '../../strategies/strategy-manager'
import {useStorage} from '../storage-context'

function swapDirection({a, b}) {
    return a > 0 ? `${-a} A » POOL » ${-b} B` : `${-b} B » POOL » ${-a} A`
}

export default function SwapView({user}) {
    const [direction, setDirection] = useState('buy'),
        [token, setToken] = useState('A'),
        [amount, setAmount] = useState('0'),
        [target, setTarget] = useState('amount'),
        [price, setPrice] = useState('0'),
        [disableApproximation, setDisableApproximation] = useState(false),
        [storage, update] = useStorage()

    const tradeParams = {approximation: !disableApproximation}
    let isInvalid
    if (target === 'price') {
        tradeParams.price = parseFloat(price)
        isInvalid = !tradeParams.price || tradeParams.price <= 0
    } else {
        tradeParams.direction = direction
        tradeParams.token = token
        tradeParams.amount = parseInt(amount)
        isInvalid = !(parseInt(amount) > 0)
    }
    const {a, b} = new StrategyManager(storage).estimateTrade(tradeParams)

    function swap() {
        if (disableApproximation) alert('disable estimate approximation')
        const result = new StrategyManager(storage).swap(a, b)
        logHistory(result)
        update(storage)
        setAmount('0')
        setPrice('0')
    }

    if (!storage.state.amountA) return <div className="dimmed">
        Pool not funded yet
    </div>

    const newA = storage.state.amountA + a,
        newB = storage.state.amountB + b

    return <>
        <select value={target} onChange={e => setTarget(e.target.value)}>
            <option value="price">price-targeted</option>
            <option value="amount">amount-targeted</option>
        </select>
        {target === 'price' ? <p>
            <label>{direction} {token} tokens up to price{' '}
                <input type="text" value={price === '0' ? '' : price}
                       onChange={e => setPrice(filterDecimalCharacters(e.target.value) || '0')}/> A/B</label>
        </p> : <>
            &emsp;
            <select value={direction} onChange={e => setDirection(e.target.value)}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            </select>
            &emsp;
            <select value={token} onChange={e => setToken(e.target.value)}>
                <option value="A">token A</option>
                <option value="B">token B</option>
            </select>
            <p>
                <label>{direction} <input type="text" value={amount === '0' ? '' : amount}
                                          onChange={e => setAmount(filterNumbersOnly(e.target.value) || '0')}/>
                    {' '}{token} tokens
                </label>
            </p>
        </>}
        {!isInvalid && <div className="dimmed">
            <p>
                Estimated swap: user swaps {swapDirection({a, b})}<br/>
                Average price: {formatWithAutoPrecision(Math.abs(a / b))}<br/>
                Pool balance after the
                swap: {newA} A&emsp;{newB} B&emsp;k={newA * newB}&emsp;p={formatWithAutoPrecision(newA / newB)}
            </p>
        </div>}
        <label>
            <input type="checkbox" checked={disableApproximation}
                   onChange={e => setDisableApproximation(e.target.checked)}/> disable estimate approximation</label>
        <div className="micro-space">
            <button onClick={swap} disabled={isInvalid}>Swap</button>
        </div>
    </>
}