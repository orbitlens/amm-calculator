import React, {useState} from 'react'
import cn from 'classnames'
import UserSelectorView from '../user-selector-view'
import DepositView from './deposit-view'
import WithdrawView from './widthdraw-view'
import SwapView from './swap-view'

const tabs = [
    {key: 'swap', text: 'Swap'},
    {key: 'deposit', text: 'Deposit'},
    {key: 'withdraw', text: 'Withdraw'}
]

function OperationView({operation}) {
    switch (operation) {
        case 'deposit':
            return <UserSelectorView>
                <DepositView/>
            </UserSelectorView>
        case 'withdraw':
            return <UserSelectorView>
                <WithdrawView/>
            </UserSelectorView>
        case 'swap':
            return <SwapView/>
        default:
            throw new Error(`Unknown ${operation} tab`)
    }

}

export default function OperationTabsView() {
    const [operation, setOperation] = useState('swap')

    function selectTab(e, key) {
        e.preventDefault()
        setOperation(key)
    }

    return <div>
        <h3>Operations</h3>
        <div className="tabs">
            {tabs.map(t => <a href={'#' + t.key} key={t.key} className={cn({active: operation === t.key})}
                              onClick={e => selectTab(e, t.key)}>{t.text}</a>)}
        </div>
        <div className="space">
            <OperationView operation={operation}/>
        </div>
    </div>
}