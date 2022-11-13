import { useState, useRef, useLayoutEffect, useContext } from 'react';
import '../assets/styles/Canvas.css'
import ColorContext from '../contexts/ColorContext.js';
import ControlsFrame from './ControlsFrame.js';
import { PADDLE_WIDTH, PADDLE_HEIGHT, BALL_RADIUS, BRICK_PADDING, BRICK_HEIGHT, COLUMNS, ROWS, FONT_SIZE, BALL_VELOCITY } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';
import useFiguresRender from '../hooks/useFiguresRender.js';
import useCollisionCheck from '../hooks/useCollisionCheck.js';
import useMousePosition from '../hooks/useMousePosition.js';

function Breakout() {
    const [startGame, setStartGame] = useState(false);
    const inGame = useRef(false);
    const canvasRef = useRef();
    const canvasContext = useRef();
    const animation = useRef();
    const brickWidth = useRef();
    const bricks = useRef();
    const paddleX = useRef();
    const paddleY = useRef();
    const ballX = useRef();
    const ballY = useRef();
    const directionX = useRef(BALL_VELOCITY);
    const directionY = useRef(BALL_VELOCITY);
    const scoreCount = useRef(0);
    const livesCount = useRef(3);

// --------- color context ---------

    const colors = useContext(ColorContext);

// --------- custom hooks ---------

    const [renderCircle, renderRect, renderEllipse, renderText] = useFiguresRender(colors.light);
    const [checkFrameOverflow, checkCollision] = useCollisionCheck();
    const getPositionInCanvas = useMousePosition();

// --------- initial states handlers ---------

    function setCanvasSize() {
        const frame = getFrameSize();
        canvasRef.current.width = frame.x;
        canvasRef.current.height = frame.y;
    }

    function createBricks() {
        const bricks = [];
        for(let i = 0; i < ROWS; i++) {
            for(let j = 0; j < COLUMNS; j++) {
                const currentX = BRICK_PADDING + j * brickWidth.current;
                const currentY  = (BRICK_PADDING * 2) + (i * (BRICK_HEIGHT + BRICK_PADDING));
                bricks.push({
                    left: currentX, 
                    top: currentY,
                    right: currentX + brickWidth.current,
                    bottom: currentY + BRICK_HEIGHT,
                    on: true
                });
            }
        }
        return bricks;
    }

    function getBallData() {
        return {
            top: ballY.current - BALL_RADIUS, 
            bottom: ballY.current + BALL_RADIUS,
            left: ballX.current - BALL_RADIUS,
            right: ballX.current + BALL_RADIUS,
        }
    }

// --------- draw handlers ---------

    function drawCounters() {
        renderText(
            canvasContext.current,
            `Score: ${scoreCount.current}`,
            10,
            FONT_SIZE
        )

        renderText(
            canvasContext.current,
            `Lives: ${livesCount.current}`,
            canvasRef.current.width - 75,
            FONT_SIZE
        )
    }

    function drawPaddle() {
        renderRect(
            canvasContext.current,
            paddleX.current, 
            paddleY.current, 
            PADDLE_WIDTH, 
            PADDLE_HEIGHT
        );
    }

    function drawBricks() {
        bricks.current.forEach(item => {
            if(item.on === true) {
                renderRect(
                    canvasContext.current,
                    item.left, 
                    item.top, 
                    brickWidth.current - BRICK_PADDING, 
                    BRICK_HEIGHT
                );
            }
        })
    }

    function drawBall() {
        renderCircle(canvasContext.current, ballX.current,  ballY.current,  BALL_RADIUS);
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function drawAll() {
        drawPaddle();
        drawBall();
        drawBricks();
        drawCounters();
    }

// --------- event handlers ---------

    function handleMousemove(evt) {
        const [x, y] = getPositionInCanvas(evt, canvasRef.current);
        const rightBorder = canvasRef.current.width - PADDLE_WIDTH;

        if(x > 0 && x < rightBorder) {
            paddleX.current = x;
        } else if (x < 0) {
            paddleX.current = 0;
        } else if (x > rightBorder) {
            paddleX.current = rightBorder;
        }

        if(!inGame.current) {
            ballX.current = paddleX.current + PADDLE_WIDTH / 2;
        }

        clearAll();
        drawAll();
    }

    function handleClick() {
        if(!inGame.current) {
            handleBallMove();

            inGame.current = true;
        }
    }

    function handleControlButton(direction) {
        if(direction === "left") {
            paddleX.current = paddleX.current > 0 ? (paddleX.current - 60) : 0;
        } else if(direction === "right") {
            paddleX.current = paddleX.current < 250 ? (paddleX.current + 60) : 0;
        }

        if(!inGame.current) {
            ballX.current = paddleX.current + PADDLE_WIDTH / 2;
        }

        clearAll();
        drawAll();
    }

// --------- lose and reset handlers ---------

    function resetAllStates() {
        inGame.current = false;

        directionX.current = BALL_VELOCITY;
        directionY.current = BALL_VELOCITY * -1;

        paddleX.current = (canvasRef.current.width / 2) - (PADDLE_WIDTH / 2);
        paddleY.current = canvasRef.current.height - PADDLE_HEIGHT;
    }

    function resetBall() {
        ballX.current = paddleX.current + PADDLE_WIDTH / 2;
        ballY.current = paddleY.current - BALL_RADIUS;
    }

    function handleGameOver() {
        cancelAnimationFrame(animation.current);

        setStartGame(false);

        resetAllStates();
        resetBall();

        bricks.current = createBricks();
        scoreCount.current = 0;
        livesCount.current = 3;
    }

    function handleGameOn() {
        setStartGame(true);

        setTimeout(() => {
            resetBall()
            clearAll();
            drawAll();
        }, 0);
    }

// --------- ball move handlers ---------

    function checkBrickCollision() {
        let changeDirection = false;

        for(let i = 0; i < bricks.current.length; i++) {
            const brick = bricks.current[i];

            if(brick.on === true) {
                const ball = getBallData();
                const collision = checkCollision(ball, brick);

                if(collision) {
                    brick.on = false;
                    scoreCount.current++;
                    changeDirection = true;
                }
            }
        }

        if(changeDirection) {
            directionY.current *= -1;
        }

        if(scoreCount.current === bricks.current.length) {
            handleGameOver();
        }
    }

    function handleBottomOverflow() {
        cancelAnimationFrame(animation.current);

        resetAllStates();

        setTimeout(() => {
            resetBall();
            clearAll();
            drawAll();
        }, 0);

        if(--livesCount.current < 1) {
            handleGameOver();
        }
    }

    function checkFrameCollision() {
        const ball = getBallData()

        const [overflowRight, overflowLeft, overflowTop, overflowBottom] = checkFrameOverflow(
            ball,
            canvasRef.current.width,
            canvasRef.current.height,
        )

        directionX.current = overflowRight || overflowLeft ? (directionX.current * -1) : directionX.current;
        directionY.current = overflowTop ? (directionY.current * -1) : directionY.current;

        if(overflowBottom) {
            handleBottomOverflow();
        }
    }

    function checkPaddleCollision() {
        if(inGame.current) {
            const paddle = {
                top: paddleY.current, 
                bottom: paddleY.current + PADDLE_HEIGHT,
                left: paddleX.current,
                right: paddleX.current + PADDLE_WIDTH,
            }
            const ball = getBallData();

            const collision = checkCollision(ball, paddle);

            directionY.current = collision ? (directionY.current * -1) : directionY.current;
        }
    }

    function checkBallDirection() {
        checkFrameCollision();

        checkPaddleCollision();

        checkBrickCollision();
    }

    function makeBallMove() {
        ballX.current += directionX.current;
        ballY.current += directionY.current;
    }

    function handleBallMove() {
        animation.current = requestAnimationFrame(handleBallMove);

        checkBallDirection();
        makeBallMove();
        clearAll();
        drawAll();
    }

// --------- useLayoutEffect ---------

    useLayoutEffect(() => {
        setCanvasSize();

        canvasContext.current = canvasRef.current.getContext('2d');
        brickWidth.current = (canvasRef.current.width - BRICK_PADDING) / COLUMNS;

        bricks.current = createBricks();

        resetAllStates();
        resetBall();

        drawAll();

        if(canvasRef.current.width > 600) {
            window.addEventListener('mousemove', handleMousemove);
        }
        
        canvasRef.current.addEventListener('click', handleClick);

        return (() => {
            window.removeEventListener('mousemove', handleMousemove);
            canvasRef.current.removeEventListener('click', handleClick);
        })
    }, []);

// JSX

    return (
        <>
            <ControlsFrame 
                inGame={startGame}
                setStart={handleGameOn}
                showButtons={true}
                buttonsList={['left', 'right']}
                handleClick={handleControlButton}
            >
                <canvas className='canvas' ref={canvasRef} />
            </ControlsFrame>
        </>
    );
}

export default Breakout;