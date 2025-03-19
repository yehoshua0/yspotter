import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/layout/Home'
import About from './components/layout/About'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="*"
          element={
            <div className="grid place-items-center">
              <h1>404 - Not Found</h1>
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
