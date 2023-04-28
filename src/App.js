import logo from './img/logo.svg';
import './css/App.css';
import './css/main.css';
import './css/navfooter.css';
import NavbarAfterLogin from './navbarAfterLogin';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <NavbarAfterLogin />
      </header>
    </div>
  );
}

export default App;

