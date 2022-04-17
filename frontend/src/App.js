import {useSocketIO} from "./utils/effects";
import Main from "./components/pages/Main";

import './App.scss';


function AppInner({ socket }) {
  // const data = useFaceID(socket, 1)
  // console.log(data)

  return <Main />
}

function App() {
  const socket = useSocketIO()
  return <AppInner socket={socket} />
}

export default App
