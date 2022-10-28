import { useState, useRef, useEffect } from 'react';
import '../assets/styles/Snake.css';
import SnakeBlocks from './SnakeBlocks.js';
import SnakeFood from './SnakeFood.js';
import ControlsFrame from './ControlsFrame.js';
import { SNAKE_MOVE_TIME, SNAKE_POSSIBLE_KEYS, SNAKE_POSSIBLE_DIRECTION, SNAKE_KEY_MOVES, SNAKE_DEFAULT_DIRECTION } from '../utils/constants.js';
import { getBlockSize, getFrameSize } from '../utils/utils.js';

function Snake() {
    const [snakePosition, setSnakePosition] = useState(() => getInitialSnakePosition());
    const [previousTalePosition, setPreviousTalePosition] = useState({});
    const [foodCollision, setFoodCollision] = useState(false);
    const [selfCollision, setSelfCollision] = useState(false);
    const [score, setScore] = useState(0)
    const [inGame, setGameState] = useState(false);
    const currentDirection = useRef(SNAKE_DEFAULT_DIRECTION);
    const blockSize = useRef();
    const frameSize = useRef();

// set initial sizes and position

    function calculateSnakePosition(blockSize, frameSize) {
        const headX = (frameSize.x / 2) - blockSize;
        const headY = (frameSize.y / 2) - blockSize;

        const initialPosition = [
            {x: headX, y: headY},
            {x: headX, y: (headY + blockSize)},
            {x: headX, y: (headY + blockSize * 2)},
        ]

        return initialPosition;
    }

    function getInitialSnakePosition() {
        const block = getBlockSize();
        const frame = getFrameSize();

        return calculateSnakePosition(block, frame);
    }

    useEffect(() => {
        const block = getBlockSize();
        const frame = getFrameSize();

        blockSize.current = block;
        frameSize.current = frame;
    }, []);

// reset all to default

    function setAllToDefault() {
        currentDirection.current = SNAKE_DEFAULT_DIRECTION;
        setSnakePosition(() => getInitialSnakePosition());
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

        const overflowTopOrLeft = (newHead[axis] + blockSize.current * multiplier) < 0;
        const overflowBottomOrRight = (newHead[axis] + blockSize.current * multiplier) > (frameSize.current[axis] - blockSize.current);

        if(overflowTopOrLeft) {
            newHead[axis] = (frameSize.current[axis] - blockSize.current);
        } else if (overflowBottomOrRight) {
            newHead[axis] = 0;
        } else {
            newHead[axis] += blockSize.current * multiplier;
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

    /* function handleDirectionChange(direction) {
        const isPossibleDirection = SNAKE_POSSIBLE_DIRECTION[currentDirection.current[2]].some(key => {
            return key === evt.code;
        });

        if(isPossibleDirection) {
            currentDirection.current = [...SNAKE_KEY_MOVES[evt.code]];
        }
    } */

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

    useEffect(() => {
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
            >
                <SnakeBlocks 
                    snakePosition={snakePosition} 
                    blockSize={blockSize}
                />
                <SnakeFood
                    snakePosition={snakePosition}
                    setCollisionState={setFoodCollision}
                    frameSize={frameSize}
                    blockSize={blockSize}
                />
            </ControlsFrame>
        </>
    );
}

export default Snake;