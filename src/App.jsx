import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TempApp from './Components/TempApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TempApp/>
    </>
  )
}

export default App
