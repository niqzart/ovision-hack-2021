import logo from './logo.svg'
import './App.css'
import Camview from './components/Camview.js'
import { useSocketIO } from './utils/effects'


function AppInner({ socket }) {
  return <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <Camview />
    </header>
  </div>
}

function App() {
  const socket = useSocketIO()
  return <AppInner socket={socket} />
}

export default App
