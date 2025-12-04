import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import schoolLogo from './assets/kando.jpg'
import './App.css'

export const App = () => {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const API_BASE = 'http://192.168.40.153:3005'

  useEffect(() => {
    const controller = new AbortController()
    const fetchItems = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/items`, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data.status && data.status !== 'ok') {
          throw new Error(`API status: ${data.status}`)
        }
        setItems(data.items || data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
    return () => controller.abort()
  }, [])

  const fetchItemById = async (id) => {
    setSelectedItem(null)
    setDetailError(null)
    setDetailLoading(true)
    try {
      const res = await fetch(`${API_BASE}/items/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.status && data.status !== 'ok') {
        throw new Error(`API status: ${data.status}`)
      }
      setSelectedItem(data.item || data)
    } catch (err) {
      setDetailError(err.message)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://www.kkszki.hu" target="_blank"><img src={schoolLogo} alt="Iskola logó" width="200" /></a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          a számláló állása: {count}
        </button>
        <p>
          Módosítsd az <code>src/App.jsx</code>-t és mentsd le, hogy tesztelhesd a HMR-t!
        </p>
      </div>

      {/* Új: items lista és részletek */}
      <section style={{marginTop:20}}>
        <h2>Items</h2>
        {loading && <p>Töltés...</p>}
        {error && <p style={{color:'red'}}>Hiba: {error}</p>}
        {!loading && !error && (
          <>
            {Array.isArray(items) && items.length === 0 && <p>Nincsenek elemek.</p>}
            {Array.isArray(items) ? (
              <ul>
                {items.map(item => (
                  <li key={item.id ?? item._id ?? JSON.stringify(item)} style={{marginBottom:8}}>
                    <strong>{item.name ?? item.title ?? `ID: ${item.id ?? item._id ?? 'ismeretlen'}`}</strong>
                    {' '}
                    <button onClick={() => fetchItemById(item.id ?? item._id ?? item)} style={{marginLeft:8}}>Részletek</button>
                  </li>
                ))}
              </ul>
            ) : (
              <pre>{JSON.stringify(items, null, 2)}</pre>
            )}
          </>
        )}

        <div style={{marginTop:16}}>
          <h3>Részlet lekérdezés</h3>
          {detailLoading && <p>Töltés...</p>}
          {detailError && <p style={{color:'red'}}>Hiba: {detailError}</p>}
          {selectedItem && (
            <pre style={{background:'#f6f8fa', padding:12}}>{JSON.stringify(selectedItem, null, 2)}</pre>
          )}
        </div>
      </section>

      <p className="read-the-docs">
         Kattints a React, a Kandó, vagy a Vite logókra, további információkért!
      </p>
    </>
  )
}

export default App