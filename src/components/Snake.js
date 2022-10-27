import { useState, useRef, useEffect } from 'react';
import '../assets/styles/Snake.css';
import SnakeBlocks from './SnakeBlocks.js';
import SnakeFood from './SnakeFood.js';
import ControlsFrame from './ControlsFrame.js';
import { DEFAULT_SNAKE, SNAKE_MOVE_TIME, SNAKE_POSSIBLE_KEYS, SNAKE_POSSIBLE_DIRECTION, SNAKE_KEY_MOVES, SNAKE_DEFAULT_DIRECTION } from '../utils/constants.js';
import { getRandomNumber } from '../utils/utils.js';

function Snake() {
    const [snakePosition, setSnakePosition] = useState(DEFAULT_SNAKE);
    const [frameSize, setFrameSize] = useState({x: 800, y: 600})
    const [previousTalePosition, setPreviousTalePosition] = useState({});
    const [foodCollision, setFoodCollision] = useState(false);
    const [selfCollision, setSelfCollision] = useState(false);
    const [score, setScore] = useState(0)
    const [inGame, setGameState] = useState(false);
    const currentDirection = useRef(SNAKE_DEFAULT_DIRECTION);

// reset all to default

    function setAllToDefault() {
        currentDirection.current = SNAKE_DEFAULT_DIRECTION;
        setSnakePosition(DEFAULT_SNAKE);
        setPreviousTalePosition({});
        setSelfCollision(false);
        setScore(0);
        setGameState(true);
    }

// Snake move handlers

    function getNewSnakePosition(axis, multiplier) {
        const newHead = {
            x: snakePosition[0]['x'],
            y: snakePosition[0]['y'],
        };
    
        const overflowTopOrLeft = (newHead[axis] + 40 * multiplier) < 0;
        const overflowBottomOrRight = (newHead[axis] + 40 * multiplier) > (frameSize[axis] - 40);

        if(overflowTopOrLeft) {
            newHead[axis] = (frameSize[axis] - 40);
        } else if (overflowBottomOrRight) {
            newHead[axis] = 0;
        } else {
            newHead[axis] += 40 * multiplier;
        }
    
        const newPosition = [newHead];
        snakePosition.forEach((item, index) => {
            if(index === snakePosition.length - 1) {
                setPreviousTalePosition(item);
            } else {
                newPosition.push(item);
            }
        })
    
        setSnakePosition(newPosition);
    }

    function handleSnakeMove() {
        const [axis, multiplier] = currentDirection.current;
    
        getNewSnakePosition(axis, multiplier);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleSnakeMove();
        }, SNAKE_MOVE_TIME);
    
        return () => clearTimeout(timeout);
    }, [snakePosition]);

// keyboard event handlers

    useEffect(() => {
        function handleKeydown(evt) {
            const isPossibleKey = SNAKE_POSSIBLE_KEYS.some(key => key === evt.code);

            if (isPossibleKey) {
                const isPossibleDirection = SNAKE_POSSIBLE_DIRECTION[currentDirection.current[2]].some(key => {
                    return key === evt.code;
                });

                if(isPossibleDirection) {
                    currentDirection.current = [...SNAKE_KEY_MOVES[evt.code]];
                }
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return(() => {
            window.removeEventListener('keydown', handleKeydown);
        })
    }, []);

// food collision handler 

    function addNewSnakeBlock() {
        const newBlock = {...previousTalePosition};
    
        setSnakePosition([
            ...snakePosition, 
            newBlock,
        ]);
    };

    useEffect(() => {
        if(foodCollision) {
            addNewSnakeBlock();

            setFoodCollision(false);
        }
    }, [foodCollision]);

// snake self collision handlers

    function checkSnakeCollision() {
        let snakeHeadX, snakeHeadY;

        snakePosition.forEach((item, index) => {
            if(index === 0) {
                snakeHeadX = item.x;
                snakeHeadY = item.y;
            } else if(index > 0 && snakeHeadX === item.x && snakeHeadY === item.y) {
                setSelfCollision(true);
            }
        })
    }

    useEffect(() => {
        checkSnakeCollision();
    }, [snakePosition]);

    useEffect(() => {
        if(selfCollision) {
            setScore(snakePosition.length - 3);
            setGameState(false);
        }
    }, [selfCollision]);

// JSX

    return (
        <>
            <ControlsFrame 
                inGame={inGame}
                setStart={setAllToDefault}
                score={score}
                setFrameSize={setFrameSize}
            >
                <SnakeBlocks 
                    snakePosition={snakePosition} 
                />
                <SnakeFood
                    snakePosition={snakePosition}
                    setCollisionState={setFoodCollision}
                    frameSize={frameSize}
                />
            </ControlsFrame>
        </>
    );
}

export default Snake;