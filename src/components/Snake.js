import { useState, useRef, useEffect, useLayoutEffect, useContext } from 'react';
import { useDispatch } from 'react-redux'
import '../assets/styles/Canvas.css';
import ColorContext from '../contexts/ColorContext.js';
import ControlsFrame from './ControlsFrame.js';
import { SNAKE_BLOCK_SIZES, SNAKE_POSSIBLE_DIRECTION, SNAKE_POSSIBLE_KEYS, SNAKE_MOVE_TIME, FONT_SIZE } from '../utils/constants.js';
import { getFrameSize, getRandomNumber } from '../utils/utils.js';
import useFiguresRender from '../hooks/useFiguresRender.js';
import useCollisionCheck from '../hooks/useCollisionCheck.js';
import { moveForward, moveLeft, moveRight, moveDown, addBlock, addFood, setInitial } from '../redux/snakeSlice.js';
import store from '../redux/store.js';

function Snake() {
    const [inGame, setInGame] = useState(false);
    const action = useRef(moveForward());
    const canvasRef = useRef();
    const canvasContext = useRef();
    const scoreCounter = useRef(0);

// --------- redux ---------

    const dispatch = useDispatch();

// --------- color context ---------

    const colors = useContext(ColorContext);

// --------- custom hooks ---------

    const { renderRect, renderText, clearCanvas } = useFiguresRender(colors.light);
    const { rectCollision } = useCollisionCheck();

// --------- initial states handlers ---------

    function setCanvasSize() {
        const frame = getFrameSize();
        canvasRef.current.width = frame.x;
        canvasRef.current.height = frame.y;
    }

    function getInitialSnake() {
        const blockWidth = SNAKE_BLOCK_SIZES[canvasRef.current.width];
        const x = Math.floor((canvasRef.current.width / blockWidth) / 2) * blockWidth;
        const y = Math.floor((canvasRef.current.height / blockWidth) / 2) * blockWidth;

        const initialSnake = {
            position: [
                {x, y},
                {x, y: y + blockWidth},
                {x, y: y + blockWidth * 2},
            ],
            block: {
                w: blockWidth,
                h: blockWidth,
            },
            canvas: {
                w: canvasRef.current.width,
                h: canvasRef.current.height,
            },
            food: {},
        }

        dispatch(setInitial(initialSnake));

        getRandomFoodPosition(initialSnake);
    }

// --------- draw handlers ---------

    function drawBrick(x, y, width) {
        renderRect(canvasContext.current, x + 1, y + 1, width - 2, width - 2);
    }

    function drawSnake(snake) {
        snake.position.forEach(elem => {
            drawBrick(elem.x, elem.y, snake.block.w);
        })
    }

    function drawFood(snake) {
        drawBrick(snake.food.x, snake.food.y, snake.block.w);
    }

    function drawScoreCounter() {
        renderText(canvasContext.current, `Score: ${scoreCounter.current}`, 10, FONT_SIZE);
    }

    function drawAll(snake) {
        clearCanvas(canvasContext.current);
        drawSnake(snake);
        drawFood(snake);
        drawScoreCounter();
    }

// --------- gameOver and reset all states ---------

    function handleGameOver() {
        setInGame(false);
    }

    function resetAllStates() {
        action.current = moveForward();
        scoreCounter.current = 0;
        getInitialSnake();
    }

    function handleStartButton() {
        resetAllStates();
        setInGame(true);
    }

    function handlePause() {
        setInGame((current) => !current);
    }

// --------- collision handlers and frame overflow ---------

    function checkFoodCollision(snake) {
        const collision = rectCollision({...snake.position[0], ...snake.block}, {...snake.food, ...snake.block});
        if(collision) {
            scoreCounter.current += 1;
            getRandomFoodPosition(snake);
            dispatch(addBlock());
        }
    }

    function checkSelfCollision(snake) {
        const collision = snake.position.slice(1).some(elem => {
            return rectCollision({...snake.position[0], ...snake.block}, {...elem, ...snake.block});
        });

        if(collision) {
            handleGameOver();
        }
    }

// --------- get random food position ---------

    function getRandomFoodPosition(snake) {
        const columns = Math.floor(canvasRef.current.width / snake.block.w);
        const rows = Math.floor(canvasRef.current.height / snake.block.w);
        const food = {
            x: getRandomNumber(0, columns) * snake.block.w,
            y: getRandomNumber(0, rows) * snake.block.w,
        }
        const collision = snake.position.some(elem => rectCollision(elem, food));

        if(collision) {
            getRandomFoodPosition();
        } else {
            dispatch(addFood(food));
        }
    }

// --------- event handlers ---------

    function handleDirectionChange(keyCode) {
        const current = action.current.type.split('/')[1];
        const isPossibleDirection = SNAKE_POSSIBLE_DIRECTION[current].some(item => {
            return item === keyCode;
        });

        if(isPossibleDirection) {
            if(keyCode === 'KeyW' || keyCode === 'ArrowUp') {
                action.current = moveForward();
            } else if(keyCode === 'KeyA' || keyCode === 'ArrowLeft') {
                action.current = moveLeft();
            } else if(keyCode === 'KeyD' || keyCode === 'ArrowRight') {
                action.current = moveRight();
            } else if(keyCode === 'KeyS' || keyCode === 'ArrowDown') {
                action.current = moveDown();
            }
        }
    }

    function handleKeydown(evt) {
        const isPossibleKey = SNAKE_POSSIBLE_KEYS.some(key => key === evt.code);

        if (isPossibleKey) {
            handleDirectionChange(evt.code);
        }
    }

// --------- useEffect ---------

useLayoutEffect(() => {
    setCanvasSize();
    getInitialSnake();
    canvasContext.current = canvasRef.current.getContext('2d');

    resetAllStates();

    store.subscribe(() => {
        const snake = store.getState().snake.value;
        checkFoodCollision(snake);
        checkSelfCollision(snake);
        drawAll(snake);
    })

    window.addEventListener('keydown', handleKeydown);

    return (() => {
        window.removeEventListener('keydown', handleKeydown);
    })
}, []);

    useEffect(() => {
        const timeout = setInterval(() => {
            dispatch(action.current);
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
                buttonsList={['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']}
                handleClick={handleDirectionChange}
                handlePause={handlePause}
            >
                <canvas className='canvas' ref={canvasRef} />
            </ControlsFrame>
        </>
    );
}

export default Snake;