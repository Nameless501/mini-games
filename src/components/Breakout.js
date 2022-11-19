import { useState, useRef, useLayoutEffect, useContext } from 'react';
import '../assets/styles/Canvas.css'
import ColorContext from '../contexts/ColorContext.js';
import ControlsFrame from './ControlsFrame.js';
import { PADDLE_WIDTH, PADDLE_HEIGHT, BALL_RADIUS, BRICK_PADDING, BRICK_HEIGHT, COLUMNS, ROWS, FONT_SIZE, BALL_VELOCITY } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';
import useFiguresRender from '../hooks/useFiguresRender.js';
import useCollisionCheck from '../hooks/useCollisionCheck.js';
import useMousePosition from '../hooks/useMousePosition.js';
import useAnimation from '../hooks/useAnimation';

function Breakout() {
    const [startGame, setStartGame] = useState(false);
    const inGame = useRef(false);
    const pause = useRef(false);
    const canvasRef = useRef();
    const canvasContext = useRef();
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

    const { renderCircle, renderRect, renderText, clearCanvas }  = useFiguresRender(colors.light);
    const { circleWithRectCollision, circleWithFrameCollision }  = useCollisionCheck();
    const getPositionInCanvas = useMousePosition();
    const { setAnimationStart, setAnimationEnd, setAnimationPause } = useAnimation();

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
                    x: currentX + brickWidth.current / 2, 
                    y: currentY + BRICK_HEIGHT / 2,
                    w: brickWidth.current,
                    h: BRICK_HEIGHT,
                    on: true
                });
            }
        }
        return bricks;
    }

    function getBallData() {
        return {
            x: ballX.current,
            y: ballY.current,
            r: BALL_RADIUS,
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
                    item.x - item.w / 2, 
                    item.y - item.h / 2, 
                    brickWidth.current - BRICK_PADDING, 
                    BRICK_HEIGHT
                );
            }
        })
    }

    function drawBall() {
        renderCircle(canvasContext.current, ballX.current,  ballY.current,  BALL_RADIUS);
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

        clearCanvas(canvasContext.current);
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

        clearCanvas(canvasContext.current);
        drawAll();
    }

// --------- lose, reset and pause handlers ---------

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
        setAnimationEnd();
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
            clearCanvas(canvasContext.current);
            drawAll();
        }, 0);
    }

    function handlePause() {
        if(inGame.current) {
            if(!pause.current) {
                setAnimationPause(true);
            } else {
                setAnimationPause(false, handleBallMove);
            }
            pause.current = !pause.current;
        }
    }

// --------- ball move handlers ---------

    function handleDirectionChange(direction) {
        if(direction.x) {
            directionX.current *= -1;
        }
        if(direction.y) {
            directionY.current *= -1;
        }
    }

    function checkBrickCollision() {
        let changeDirection = false;
        const ball = getBallData();

        for(let i = 0; i < bricks.current.length; i++) {
            const brick = bricks.current[i]

            if(brick.on === true) {
                const { sideCollision } = circleWithRectCollision(ball, brick);

                if(sideCollision.top || sideCollision.bottom) {
                    brick.on = false;
                    scoreCount.current++;
                    changeDirection = true;
                }
            }
        }

        if(changeDirection) {
            handleDirectionChange({ y: true });
        }

        if(scoreCount.current === bricks.current.length) {
            handleGameOver();
        }
    }

    function handleBottomOverflow() {
        setAnimationEnd();

        resetAllStates();

        setTimeout(() => {
            resetBall();
            clearCanvas(canvasContext.current);
            drawAll();
        }, 0);

        if(--livesCount.current < 1) {
            handleGameOver();
        }
    }

    function checkFrameCollision() {
        const ball = getBallData()
        const [overflowRight, overflowLeft, overflowTop, overflowBottom] = circleWithFrameCollision(
            ball,
            canvasRef.current.width,
            canvasRef.current.height,
        );

        if(overflowRight || overflowLeft) {
            handleDirectionChange({ x: true });
        }
        if(overflowTop) {
            handleDirectionChange({ y: true });
        }
        if(overflowBottom) {
            handleBottomOverflow();
        }
    }

    function checkPaddleCollision() {
        if(inGame.current) {
            const paddle = {
                y: paddleY.current + PADDLE_HEIGHT / 2, 
                x: paddleX.current + PADDLE_WIDTH / 2,
                w: PADDLE_WIDTH,
                h: PADDLE_HEIGHT,
            }
            const ball = getBallData();
            const { sideCollision } = circleWithRectCollision(ball, paddle);

            if(sideCollision.top) {
                handleDirectionChange({ y: true });
            }
        }
    }

    function makeBallMove() {
        ballX.current += directionX.current;
        ballY.current += directionY.current;
    }

    function handleBallMove() {
        setAnimationStart(handleBallMove);

        checkFrameCollision();
        checkPaddleCollision();
        checkBrickCollision();

        makeBallMove();
        clearCanvas(canvasContext.current);
        drawAll();
    }

// --------- useLayoutEffect ---------

    useLayoutEffect(() => {
        setCanvasSize();
        const canvas = canvasRef.current;

        canvasContext.current = canvas.getContext('2d');
        brickWidth.current = (canvas.width - BRICK_PADDING) / COLUMNS;

        bricks.current = createBricks();

        resetAllStates();
        resetBall();

        drawAll();

        if(canvasRef.current.width > 600) {
            window.addEventListener('mousemove', handleMousemove);
        }
        
        canvas.addEventListener('click', handleClick);

        return (() => {
            window.removeEventListener('mousemove', handleMousemove);
            canvas.removeEventListener('click', handleClick);
            setAnimationEnd();
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
                handlePause={handlePause}
            >
                <canvas className='canvas' ref={canvasRef} />
            </ControlsFrame>
        </>
    );
}

export default Breakout;