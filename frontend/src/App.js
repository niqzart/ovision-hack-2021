import './App.scss';

import Camview from './components/Camview.js'
import { useListen, useSocketIO } from './utils/effects'

function AppInner({ socket }) {
  // useListen usage example:
  useListen(socket, "metadata", (data) => console.log("metadata:", data))

  return <div className="App">
    <header className="App-header">
      <Camview />
    </header>
  </div>
}

function App() {
  const socket = useSocketIO()
  return <AppInner socket={socket} />
}

export default App
