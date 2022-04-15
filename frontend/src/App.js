import logo from './logo.svg';
import './App.css';
import Camview from './components/Camview.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Camview/>
      </header>
    </div>
  );
}

export default App;
