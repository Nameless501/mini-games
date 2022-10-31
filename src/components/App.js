import { Switch, Route } from 'react-router-dom';
import '../assets/styles/App.css';
import Header from './Header.js';
import RockPaperScissors from './RockPaperScissors';
import Snake from './Snake.js';
import Main from './Main.js';
import Breakout from './Breakout';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' >
          <Header/>
          <Main />
        </Route>
        <Route path='/snake' >
          <Snake />
        </Route>
        <Route path='/rock-paper-scissors' >
          <RockPaperScissors />
        </Route>
        <Route path='/breakout' >
          <Breakout />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
