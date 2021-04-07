import React, {useState} from 'react'

let setHistoryRef

export function resetHistory() {
    setHistoryRef(history => [])
}

export function logHistory(record) {
    setHistoryRef(history => [record, ...history])
}

export default function HistoryView() {
    const [history, setHistory] = useState([])
    setHistoryRef = setHistory
    return <>
        <h3>Operations history</h3>
        <ul>
            {history.map(r => <li key={r}>{r}</li>)}
        </ul>
    </>
}