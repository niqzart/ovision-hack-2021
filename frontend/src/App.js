import {useListen, useSocketIO} from "./utils/effects";
import Main from "./components/pages/Main";

import "./components/templates/resets.scss";
import './App.scss';

function AppInner({ socket }) {
  // useListen usage example:
  useListen(socket, "metadata", (data) => console.log("metadata:", data))

  return (
      <Main />
  );
}

function App() {
  const socket = useSocketIO()
  return <AppInner socket={socket} />
}

export default App
