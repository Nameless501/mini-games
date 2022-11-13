import React, { useLayoutEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import ColorContext from '../contexts/ColorContext.js';
import '../assets/styles/App.css';
import Header from './Header.js';
import RockPaperScissors from './RockPaperScissors';
import Snake from './Snake.js';
import Main from './Main.js';
import Breakout from './Breakout';
import Basketball from './Basketball';
import { COLORS } from '../utils/constants.js';
import { getRandomNumber } from '../utils/utils.js';

function App() {
  const [currentColors, setNewColors] = useState(() => getRandomColors());

  function getRandomColors() {
    const randomColors = COLORS[getRandomNumber(0, COLORS.length)];
    return randomColors;
  }

  function handleColorsChange() {
    const newColors = getRandomColors();
    setNewColors(newColors);
  }

  useLayoutEffect(() => {
    document.body.style.backgroundColor = currentColors.dark;
  }, [currentColors]);

  return (
    <ColorContext.Provider value={currentColors} >
        <div 
          className="app" 
          style={{
            '--color-light': currentColors.light,
            '--color-dark': currentColors.dark
          }} 
        >
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
            <Route path='/basketball' >
              <Basketball />
            </Route>
          </Switch>
        </div>
    </ColorContext.Provider>
  );
}

export default App;
