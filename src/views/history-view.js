import React, {useState} from 'react'

let setHistoryRef

export function resetHistory() {
    setHistoryRef(history => [])
}

export function logHistory(record) {
    setHistoryRef(history => [{n: history.length + 1, record}, ...history])
}

export default function HistoryView() {
    const [history, setHistory] = useState([])
    setHistoryRef = setHistory

    function clear(e) {
        e.preventDefault()
        setHistory([])
    }

    return <>
        {history.length > 0 && <div style={{float: 'right', paddingTop: '0.5em'}}>
            <a href="#" onClick={e => clear(e)} title="Clear history log">clear</a>
        </div>}
        <h3>Operations history</h3>
        <ul>
            {history.map(r => <li key={r.n}><span className="dimmed">{r.n}.</span> {r.record}</li>)}
        </ul>
    </>
}