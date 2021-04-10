import React, {useState} from 'react'
import {useStorage} from './storage-context'

export default function UserSelectorView({children, props = {}}) {
    const [{users}, setStorage] = useStorage()
    const [user, setUser] = useState('u1')

    function addNewUser(name) {
        setStorage({users: [...users, {name, stake: 0}]})
    }

    const options = [...users]
    let newOption
    if (options[options.length - 1].stake) {
        newOption = {name: 'u' + (options.length + 1), stake: 0}
        options.push(newOption)
    }

    function selectUser(u) {
        setUser(u)
        if (newOption && u === newOption.name) {
            addNewUser(u)
        }
    }

    return <>
        <div>
            <label>User <select value={user} onChange={e => selectUser(e.target.value)}>
                {options.map(o => <option value={o.name} key={o.name}>{o.name} ({o.stake} stake weight)</option>)}
            </select></label>
        </div>
        <div className="micro-space">
            {React.cloneElement(children, {user})}
        </div>
    </>
}