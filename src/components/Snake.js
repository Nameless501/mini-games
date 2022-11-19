import { useState, useRef, useEffect, useLayoutEffect, useContext } from 'react';
import '../assets/styles/Canvas.css';
import ColorContext from '../contexts/ColorContext.js';
import ControlsFrame from './ControlsFrame.js';
import { SNAKE_BLOCK_SIZES, SNAKE_POSSIBLE_DIRECTION, SNAKE_POSSIBLE_KEYS, SNAKE_KEY_MOVES, SNAKE_MOVE_TIME, SNAKE_DEFAULT_DIRECTION, FONT_SIZE } from '../utils/constants.js';
import { getFrameSize, getRandomNumber } from '../utils/utils.js';
import useFiguresRender from '../hooks/useFiguresRender.js';
import useCollisionCheck from '../hooks/useCollisionCheck.js';

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

// --------- color context ---------

    const colors = useContext(ColorContext);

// --------- custom hooks ---------

    const { renderRect, renderText, clearCanvas } = useFiguresRender(colors.light);
    const { rectWithFrameCollision, rectCollision } = useCollisionCheck();

// --------- initial states handlers ---------

function setCanvasSize() {
    const frame = getFrameSize();
    canvasRef.current.width = frame.x;
    canvasRef.current.height = frame.y;
}

function getInitialSnake() {
    const x = Math.floor((canvasRef.current.width / blockWidth.current) / 2) * blockWidth.current;
    const y = Math.floor((canvasRef.current.height / blockWidth.current) / 2) * blockWidth.current;
    const w = blockWidth.current;

    const initialSnake = [
        {x, y, w, h: w},
        {x, y: y + blockWidth.current, w, h: w},
        {x, y: y + blockWidth.current * 2, w, h: w},
    ]

    snakeRef.current = initialSnake;
}

// --------- draw handlers ---------

    function drawBrick(x, y, width) {
        renderRect(canvasContext.current, x + 1, y + 1, width - 2, width - 2);
    }

    function drawSnake() {
        snakeRef.current.forEach(elem => {
            drawBrick(elem.x, elem.y, elem.w);
        })
    }

    function drawFood() {
        const width = foodRef.current.w;
        const x = foodRef.current.x;
        const y = foodRef.current.y;
        drawBrick(x, y, width);
    }

    function drawScoreCounter() {
        renderText(canvasContext.current, `Score: ${scoreCounter.current}`, 10, FONT_SIZE);
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

// --------- collision handlers and frame overflow ---------

    function checkFoodCollision() {   
        const collision = rectCollision(snakeRef.current[0], foodRef.current);

        if(collision) {
            scoreCounter.current += 1;
            getRandomFoodPosition();
            addSnakeBlock();
        }
    }

    function checkSelfCollision() {
        const collision = snakeRef.current.slice(1).some(elem => {
            return rectCollision(snakeRef.current[0], elem);
        });

        if(collision) {
            handleGameOver();
        }
    }

    function checkFrameOverflow() {
        const head = snakeRef.current[0];
        const {
            overflowRight,
            overflowLeft,
            overflowTop,
            overflowBottom,
        } = rectWithFrameCollision(head, canvasRef.current.width, canvasRef.current.height);

        if(overflowRight) {
            head.x = 0;
        } else if(overflowLeft) {
            head.x = canvasRef.current.width - blockWidth.current;
        } else if(overflowTop) {
            head.y = canvasRef.current.height - blockWidth.current;
        } else if(overflowBottom) {
            head.y = 0;
        }
    }

// --------- snake move handlers ---------

    function getNewSnakePosition(axis, direction) {
        const newHead = { ...snakeRef.current[0] };
        newHead[axis] += blockWidth.current * direction;

        snakeRef.current = [
            newHead,
            ...snakeRef.current
        ]
        tailRef.current = snakeRef.current.pop();

        checkFrameOverflow();
    }

    function makeSnakeMove() {
        const [axis, currentDirection] = direction.current;
        getNewSnakePosition(axis, currentDirection);
        checkFoodCollision();
        checkSelfCollision();
        clearCanvas(canvasContext.current);
        drawAll();
    }

    function addSnakeBlock() {
        snakeRef.current = [
            ...snakeRef.current,
            tailRef.current
        ]
    }

// --------- get random food position ---------

    function getRandomFoodPosition() {
        const columns = Math.floor(canvasRef.current.width / blockWidth.current);
        const rows = Math.floor(canvasRef.current.height / blockWidth.current);

        const food = {
            x: getRandomNumber(0, columns) * blockWidth.current,
            y: getRandomNumber(0, rows) * blockWidth.current,
            w: blockWidth.current, 
            h: blockWidth.current,
        }
        const collision = snakeRef.current.some(elem => rectCollision(elem, food));

        if(collision) {
            getRandomFoodPosition();
        } else {
            foodRef.current = food;
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
    setCanvasSize();

    canvasContext.current = canvasRef.current.getContext('2d');
    blockWidth.current = SNAKE_BLOCK_SIZES[canvasRef.current.width];

    resetAllStates();
    clearCanvas(canvasContext.current);
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