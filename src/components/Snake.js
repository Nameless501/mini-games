import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import '../assets/styles/Canvas.css';
import ControlsFrame from './ControlsFrame.js';
import { COLOR_DARK, COLOR_LIGHT, SNAKE_BLOCK_SIZES, SNAKE_POSSIBLE_DIRECTION, SNAKE_POSSIBLE_KEYS, SNAKE_KEY_MOVES, SNAKE_MOVE_TIME, SNAKE_DEFAULT_DIRECTION, FONT_SIZE } from '../utils/constants.js';
import { getFrameSize, getRandomNumber } from '../utils/utils.js';

function Snake() {
    const [inGame, setInGame] = useState(false);
    const canvasRef = useRef();
    const snakeRef = useRef();
    const tailRef = useRef();
    const foodRef = useRef();
    const direction = useRef();
    const canvasContext = useRef();
    const blockWidth = useRef();
    const scoreCounter = useRef(0);

// --------- draw handlers ---------

    function drawBrick(x, y, width) {
        canvasContext.current.fillStyle = COLOR_LIGHT;
        canvasContext.current.strokeStyle = COLOR_DARK;

        canvasContext.current.fillRect(x, y, width - 3, width - 3);
        canvasContext.current.strokeRect(x+1, y+1, 1.5, 1.5);
    }

    function drawSnake() {
        const width = blockWidth.current;

        snakeRef.current.forEach(elem => {
            drawBrick(elem.x, elem.y, width, width);
        })
    }

    function drawFood() {
        const width = blockWidth.current;
        const x = foodRef.current.x;
        const y = foodRef.current.y;

        drawBrick(x, y, width);
    }

    function drawScoreCounter() {
        canvasContext.current.font = `${FONT_SIZE}px Segoe UI`;
        canvasContext.current.fillStyle = COLOR_DARK;
        canvasContext.current.fillText(`Score: ${scoreCounter.current}`, 10, FONT_SIZE);
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function drawAll() {
        drawSnake();
        drawFood();
        drawScoreCounter();
    }

// --------- gameOver and reset all states ---------

    function handleGameOver() {
        setInGame(false);
    }

    function resetAllStates() {
        direction.current = SNAKE_DEFAULT_DIRECTION;
        scoreCounter.current = 0;

        getInitialSnake();
        getRandomFoodPosition();
    }

    function handleStartButton() {
        resetAllStates();
        setInGame(true);
    }

    function handlePause() {
        setInGame((current) => !current);
    }

// --------- collision handlers ---------

    function checkFoodCollision() {
        const snakeHead = snakeRef.current[0];
        const food = foodRef.current;
    
        const collision = snakeHead.x === food.x && snakeHead.y === food.y;
    
        if(collision) {
            scoreCounter.current += 1;
            getRandomFoodPosition();
            addSnakeBlock();
        }
    }

    function checkSelfCollision() {
        const snakeHead = snakeRef.current[0];
        const snakeBody = snakeRef.current.slice(1);

        const collision = snakeBody.some(elem => elem.x === snakeHead.x && elem.y === snakeHead.y);

        if(collision) {
            handleGameOver();
        }
    }

// --------- snake move handlers ---------

    function getInitialSnake() {
        const x = Math.floor((canvasRef.current.width / blockWidth.current) / 2) * blockWidth.current;
        const y = Math.floor((canvasRef.current.height / blockWidth.current) / 2) * blockWidth.current;

        const initialSnake = [
            {x, y},
            {x, y: y + blockWidth.current},
            {x, y: y + blockWidth.current * 2},
        ]

        snakeRef.current = initialSnake;
    }

    function setNewSnakePosition(newHead) {
        snakeRef.current = [
            newHead,
            ...snakeRef.current
        ]

        const tail = snakeRef.current.pop();
        tailRef.current = tail;
    }

    function getNewSnakePosition(axis, direction) {
        const newHead = { ...snakeRef.current[0] };
        newHead[axis] += blockWidth.current * direction;

        const overflowX = newHead.x < 0 || newHead.x >= canvasRef.current.width;
        const overflowY = newHead.y < 0 || newHead.y >= canvasRef.current.height;

        if(overflowX) {
            newHead.x = newHead.x < 0 ? (canvasRef.current.width - blockWidth.current) : 0;
        } else if(overflowY) {
            newHead.y = newHead.y < 0 ? (canvasRef.current.height - blockWidth.current) : 0;
        }
        
        setNewSnakePosition(newHead);
    }

    function makeSnakeMove() {
        const [axis, currentDirection] = direction.current;
        
        getNewSnakePosition(axis, currentDirection);

        checkFoodCollision();
        checkSelfCollision();

        clearAll();
        drawAll();
    }

    function addSnakeBlock() {
        snakeRef.current = [
            ...snakeRef.current,
            tailRef.current
        ]
    }

// --------- random food position ---------

    function getRandomFoodPosition() {
        const columns = Math.floor(canvasRef.current.width / blockWidth.current);
        const rows = Math.floor(canvasRef.current.height / blockWidth.current);

        const x = getRandomNumber(0, columns) * blockWidth.current;
        const y = getRandomNumber(0, rows) * blockWidth.current;

        const collision = snakeRef.current.some(item => item.x === x && item.y === y);

        if(collision) {
            getRandomFoodPosition();
        } else {
            foodRef.current = {x, y};
        }
    }

// --------- event handlers ---------

    function handleDirectionChange(keyCode) {
        const isPossibleDirection = SNAKE_POSSIBLE_DIRECTION[direction.current[2]].some(item => {
            return item === keyCode;
        });

        if(isPossibleDirection) {
            direction.current = [...SNAKE_KEY_MOVES[keyCode]];
        }
    }

    function handleKeydown(evt) {
        const isPossibleKey = SNAKE_POSSIBLE_KEYS.some(key => key === evt.code);

        if (isPossibleKey) {
            handleDirectionChange(evt.code);
        }
    }

// --------- useLayoutEffect ---------

useLayoutEffect(() => {
    const frame = getFrameSize();
    canvasRef.current.width = frame.x;
    canvasRef.current.height = frame.y;

    canvasContext.current = canvasRef.current.getContext('2d');
    blockWidth.current = SNAKE_BLOCK_SIZES[canvasRef.current.width];

    resetAllStates();

    clearAll();
    drawAll();

    window.addEventListener('keydown', handleKeydown);

    return (() => {
        window.removeEventListener('keydown', handleKeydown);
    })
}, []);

    useEffect(() => {
        const timeout = setInterval(() => {
            makeSnakeMove();
        }, SNAKE_MOVE_TIME);

        if(!inGame) {
            clearInterval(timeout);
        }
    
        return () => clearInterval(timeout);
    }, [inGame]);

// JSX

    return (
        <>
            <ControlsFrame 
                inGame={inGame}
                setStart={handleStartButton}
                score={scoreCounter.current}
                showButtons={true}
                buttonsList={['up', 'down', 'left', 'right']}
                handleClick={handleDirectionChange}
                handlePause={handlePause}
            >
                <canvas className='canvas' ref={canvasRef} />
            </ControlsFrame>
        </>
    );
}

export default Snake;