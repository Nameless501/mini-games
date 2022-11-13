import { useState, useRef, useEffect } from 'react';
import ControlsFrame from './ControlsFrame.js';
import { getRandomNumber } from '../utils/utils.js';
import { RPS_CONFIG } from '../utils/constants.js';
import '../assets/styles/RockPaperScissors.css';
import RockPaperScissorsIcons from './RockPaperScissorsIcons.js';

function RockPaperScissors() {
    const [inGame, setGameState] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const roundCount = useRef(0);
    const opponentScore = useRef(0);
    const userScore = useRef(0);
    const [bets, setBets] = useState({ user: {name: ''}, opponent: {name: ''} });

// reset all to default

    function setAllToDefault() {
        opponentScore.current = 0;
        userScore.current = 0;
        setGameState(true);
        roundCount.current = 0;
    }

// bets and result handlers

    function getOpponentBet() {
        const bet = {...RPS_CONFIG[getRandomNumber(0, RPS_CONFIG.length - 1)]};

        setBets(current => ({
            ...current,
            opponent: bet,
        }));
    }

    function getUserBet(evt) {
        const bet = {...RPS_CONFIG.find(item => item.name === evt.currentTarget.value)};

        setBets(current => ({
            ...current,
            user: bet,
        }));
    }

    function checkWinner() {
        if(bets.user.name === bets.opponent.beat) {
            setTimeout(() => {
                opponentScore.current += 1;;
            }, 1000);
        } else if(bets.user.beat === bets.opponent.name) {
            setTimeout(() => {
                userScore.current += 1;;
            }, 1000);
        }
    }

    function handleClick(evt) {
        getUserBet(evt);
        getOpponentBet();

        roundCount.current += 1;
    }

    useEffect(() => {
        checkWinner();

        if(roundCount.current >= 1) {
            setIsActive(true);
        

            setTimeout(() => {
                setIsActive(false);
            }, 2000);
        }
    }, [bets])

// JSX

    return (
        <div className="rock-paper-scissors">
            <ControlsFrame
                inGame={inGame}
                setStart={setAllToDefault}
                score={0}
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
                            >
                                <RockPaperScissorsIcons name={bets.user.name} sizeBig={true} />
                            </div>
                        </div>
                        <div className="rock-paper-scissors__bet">
                            Opponent
                            <div 
                                className={`rock-paper-scissors__bet-suggest
                                    rock-paper-scissors__opponent-bet
                                    ${isActive && 'rock-paper-scissors__bet-suggest_active'}
                                `}
                            >
                                <RockPaperScissorsIcons name={bets.opponent.name} sizeBig={true} />
                            </div>
                        </div>
                    </div>
                    <div className="rock-paper-scissors__controls">
                        <ul className="rock-paper-scissors__buttons-list">
                            <li>
                                <button 
                                    type="button" 
                                    value="rock"
                                    className="rock-paper-scissors__control-button"
                                    onClick={handleClick}
                                    disabled={isActive ? true : false}
                                >
                                    <RockPaperScissorsIcons name="rock" />
                                </button>
                            </li>
                            <li>
                                <button 
                                    type="button" 
                                    value="paper"
                                    className="rock-paper-scissors__control-button"
                                    onClick={handleClick}
                                    disabled={isActive ? true : false}
                                >
                                    <RockPaperScissorsIcons name="paper" />
                                </button>
                            </li>
                            <li>
                                <button 
                                    type="button" 
                                    value="scissors"
                                    className="rock-paper-scissors__control-button"
                                    onClick={handleClick}
                                    disabled={isActive ? true : false}
                                >
                                    <RockPaperScissorsIcons name="scissors" />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </ControlsFrame>
        </div>
    );
}

export default RockPaperScissors;