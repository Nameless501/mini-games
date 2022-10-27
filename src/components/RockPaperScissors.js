import { useState, useRef, useEffect } from 'react';
import ControlsFrame from './ControlsFrame.js';
import { getRandomNumber } from '../utils/utils.js';
import { RPS_CONFIG } from '../utils/constants.js';
import '../assets/styles/RockPaperScissors.css';

function RockPaperScissors() {
    const [frameSize, setFrameSize] = useState({x: 800, y: 600});
    const [inGame, setGameState] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const roundCount = useRef(1);
    const opponentScore = useRef(0);
    const userScore = useRef(0);
    const userBetRef = useRef();
    const opponentBetRef = useRef();

// reset all to default

    function setAllToDefault() {
        opponentScore.current = 0;
        userScore.current = 0;
        setGameState(true);
        roundCount.current = 1;
    }

// 

    function getOpponentBet() {
        const bet = {...RPS_CONFIG[getRandomNumber(0, RPS_CONFIG.length - 1)]};

        opponentBetRef.current.style.backgroundImage = `url(${bet.img})`;

        return bet;
    }

    function getUserBet(evt) {
        const bet = {...RPS_CONFIG.find(item => item.name === evt.target.value)};

        userBetRef.current.style.backgroundImage = `url(${bet.img})`;

        return bet;
    }

    function checkWinner(userBet, opponentBet) {
        if(userBet.name === opponentBet.beat) {
            setTimeout(() => {
                opponentScore.current += 1;;
            }, 1000);
        } else if(userBet.beat === opponentBet.name) {
            setTimeout(() => {
                userScore.current += 1;;
            }, 1000);
        }

        setTimeout(() => {
            roundCount.current += 1;;
        }, 1000);
    }

    function handleClick(evt) {
        const userBet = getUserBet(evt);
        const opponentBet = getOpponentBet();

        setIsActive(true);

        checkWinner(userBet, opponentBet);

        setTimeout(() => {
            setIsActive(false);
        }, 2000);
    }

// JSX

    return (
        <div className="rock-paper-scissors">
            <ControlsFrame
                inGame={inGame}
                setStart={setAllToDefault}
                score={0}
                setFrameSize={setFrameSize}
            >
                <div className="rock-paper-scissors__frame" >
                    <p className='rock-paper-scissors__round-counter'>
                        Round: 
                        <span className='rock-paper-scissors__round-count' >
                            {roundCount.current}
                        </span>
                    </p>
                    <div className="rock-paper-scissors__scores">
                        <p className="rock-paper-scissors__score">
                            Score:
                            <span className="rock-paper-scissors__score-count">
                                {userScore.current}
                            </span>
                        </p>
                        <p className="rock-paper-scissors__score">
                            Score:
                            <span className="rock-paper-scissors__score-count">
                                {opponentScore.current}
                            </span>
                        </p>
                    </div>
                    <div className="rock-paper-scissors__bets">
                        <div className="rock-paper-scissors__bet">
                            You
                            <div 
                                className={`rock-paper-scissors__bet-suggest
                                    rock-paper-scissors__user-bet
                                    ${isActive && 'rock-paper-scissors__bet-suggest_active'}
                                `}
                                ref={userBetRef}
                            />
                        </div>
                        <div className="rock-paper-scissors__bet">
                            Opponent
                            <div 
                                className={`rock-paper-scissors__bet-suggest
                                    rock-paper-scissors__opponent-bet
                                    ${isActive && 'rock-paper-scissors__bet-suggest_active'}
                                `}
                                ref={opponentBetRef}
                            />
                        </div>
                    </div>
                    <div className="rock-paper-scissors__controls">
                        <ul className="rock-paper-scissors__buttons-list">
                            <li>
                                <button 
                                    type="button" 
                                    value="rock"
                                    className="rock-paper-scissors__control-button 
                                        rock-paper-scissors__control-button_type_rock"
                                    onClick={handleClick}
                                    disabled={isActive ? true : false}
                                />
                            </li>
                            <li>
                                <button 
                                    type="button" 
                                    value="paper"
                                    className="rock-paper-scissors__control-button 
                                        rock-paper-scissors__control-button_type_paper" 
                                    onClick={handleClick}
                                    disabled={isActive ? true : false}
                                />
                            </li>
                            <li>
                                <button 
                                    type="button" 
                                    value="scissors"
                                    className="rock-paper-scissors__control-button 
                                        rock-paper-scissors__control-button_type_scissors"
                                    onClick={handleClick}
                                    disabled={isActive ? true : false}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </ControlsFrame>
        </div>
    );
}

export default RockPaperScissors;