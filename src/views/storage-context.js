import React, {createContext, useContext, useState} from 'react'
import equals from 'react-fast-compare'
import deepmerge from 'deepmerge'
import ammStrategies from '../strategies/amm'

class StoredData {
    ammStrategy
    users
    state
    fee
}

let currentContext = new StoredData()

export function initContext(params) {
    return Object.assign({
        ammStrategy: ammStrategies[0].key,
        users: [{name: 'u1', stake: 0}],
        fee: 3,
        state: null
    }, params)
}

Object.assign(currentContext, initContext())

//load context from location.hash
if (location.hash) {
    try {
        const params = JSON.parse(decodeURIComponent(location.hash.substr(1)))
        Object.assign(currentContext, params)
    } catch (e) {
        console.error('Failed to load the state from URI')
        console.error(e)
    }
}

function storeContextInUrl() {
    location.hash = '#' + encodeURIComponent(JSON.stringify(currentContext))
}

function cloneContext(context, additionalParams) {
    const propsToMerge = [context]
    if (additionalParams) {
        propsToMerge.push(additionalParams)
    }
    const res = Object.assign(new StoredData(), deepmerge.all(propsToMerge, {arrayMerge: (target, source) => source}))
    if (!res.state){
        res.state = {}
    }
    return res
}

const StorageContextContainer = createContext(currentContext)

let onContextUpdated = null

export function StorageContext({children}) {
    const [context, setContext] = useState(currentContext)
    onContextUpdated = setContext
    return <StorageContextContainer.Provider value={context}>{children}</StorageContextContainer.Provider>
}

/**
 *
 * @returns {[StoredData, Function]}
 */
export function useStorage() {
    const context = useContext(StorageContextContainer)

    function updateContext(newValue) {
        const newContext = newValue ? cloneContext(context, newValue) : new StoredData()
        if (!equals(newContext, currentContext)) {
            currentContext = newContext
            onContextUpdated && onContextUpdated(currentContext)
            storeContextInUrl()
        }
    }

    return [
        cloneContext(context),
        updateContext
    ]
}