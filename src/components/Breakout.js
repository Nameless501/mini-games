import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import '../assets/styles/Breakout.css';
import ControlsFrame from './ControlsFrame.js';
import { COLOR_CRIMSON, COLOR_PURPLE, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_RADIUS, BRICK_PADDING, BRICK_HEIGHT, COLUMNS, ROWS, FONT_SIZE, BALL_VELOCITY } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';

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

// --------- draw handlers ---------

    function drawScoreCounter() {
        canvasContext.current.font = `${FONT_SIZE}px Segoe UI`;
        canvasContext.current.fillStyle = COLOR_CRIMSON;
        canvasContext.current.fillText(`Score: ${scoreCount.current}`, 10, FONT_SIZE);
    }

    function drawLivesCounter() {
        const right = canvasRef.current.width - 75;

        canvasContext.current.font = `${FONT_SIZE}px Segoe UI`;
        canvasContext.current.fillStyle = COLOR_CRIMSON;
        canvasContext.current.fillText(`Lives: ${livesCount.current}`, right, FONT_SIZE);
    }

    function drawPaddle() {
        canvasContext.current.fillStyle = COLOR_PURPLE;
        canvasContext.current.fillRect(paddleX.current, paddleY.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    }

    function createBricks() {
        const bricks = [];

        for(let i = 0; i < ROWS; i++) {
            for(let j = 0; j < COLUMNS; j++) {
                const currentX = BRICK_PADDING + j * brickWidth.current;
                const currentY  = (BRICK_PADDING * 2) + (i * (BRICK_HEIGHT + BRICK_PADDING));

                bricks.push({x: currentX, y: currentY, on: true});
            }
        }

        return bricks;
    }

    function drawBricks() {
        bricks.current.forEach(item => {
            if(item.on === true) {
                canvasContext.current.fillStyle = COLOR_PURPLE;
                canvasContext.current.fillRect(item.x, item.y, brickWidth.current - BRICK_PADDING, BRICK_HEIGHT);
            }
        })
    }

    function drawBall() {
        canvasContext.current.beginPath();
        canvasContext.current.fillStyle = COLOR_CRIMSON;
        canvasContext.current.arc(ballX.current, ballY.current, BALL_RADIUS, 0, Math.PI * 2, false);
        canvasContext.current.fill();
        canvasContext.current.closePath();
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function drawAll() {
        drawPaddle();
        drawBall();
        drawBricks();
        drawScoreCounter();
        drawLivesCounter();
    }

// --------- event handlers ---------

    function handleMousemove(evt) {
        const x = evt.clientX - canvasRef.current.parentElement.offsetLeft;
        const rightBorder = canvasRef.current.width - PADDLE_WIDTH;

        if(x > 0 && x < rightBorder) {
            paddleX.current = x;
        } else if (x < 0) {
            paddleX.current = 0;
        } else if (x > rightBorder) {
            paddleX.current = rightBorder;
        }

        window.requestAnimationFrame(drawPaddle);
        canvasContext.current.clearRect(
            0, 
            canvasRef.current.height - PADDLE_HEIGHT, 
            canvasRef.current.width, 
            PADDLE_HEIGHT
        );

        if(!inGame.current) {
            ballX.current = paddleX.current + PADDLE_WIDTH / 2;
            window.requestAnimationFrame(drawBall);
            canvasContext.current.clearRect(
                0, 
                canvasRef.current.height - (PADDLE_HEIGHT + BALL_RADIUS * 2), 
                canvasRef.current.width, 
                BALL_RADIUS * 2
            );
        }
    }

    function handleClick() {
        inGame.current = true;
    }

// --------- lose and reset handlers ---------

    function resetAll() {
        inGame.current = false;

        directionX.current = BALL_VELOCITY;
        directionY.current = BALL_VELOCITY;
        bricks.current = createBricks();

        paddleX.current = (canvasRef.current.width / 2) - (PADDLE_WIDTH / 2);
        paddleY.current = canvasRef.current.height - PADDLE_HEIGHT;

        ballX.current = paddleX.current + PADDLE_WIDTH / 2;
        ballY.current = paddleY.current - BALL_RADIUS;
    }

    function handleGameOver() {
        setStartGame(false);

        resetAll();

        scoreCount.current = 0;
        livesCount.current = 3;
    }

    function handleGameOn() {
        setStartGame(true);
    }

// --------- ball move handlers ---------

    function checkBrickCollision() {
        let changeDirection = false;

        for(let i = 0; i < bricks.current.length; i++) {
            const brick = bricks.current[i];

            if(brick.on === true) {
                const collision = ballX.current > (brick.x - BALL_RADIUS) && 
                ballX.current < (brick.x + brickWidth.current + BALL_RADIUS) &&
                ballY.current > (brick.y - BALL_RADIUS) && 
                ballY.current < (brick.y + BRICK_HEIGHT + BALL_RADIUS);

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

        resetAll();
        clearAll();
        drawAll();

        if((livesCount.current - 1) > 0) {
            livesCount.current--;
        } else {
            handleGameOver();
        }
    }

    function checkBallDirection() {
        const bottom = canvasRef.current.height;
        const right = canvasRef.current.width - BALL_RADIUS;
        const top = BALL_RADIUS;
        const left = BALL_RADIUS;
        const paddleLeft = paddleX.current - BALL_RADIUS;
        const paddleRight = paddleX.current + PADDLE_WIDTH + BALL_RADIUS;

        const overflowX = (ballX.current + directionX.current) > right || (ballX.current + directionX.current) < left;
        const overflowY = (ballY.current + directionY.current) < top;
        const paddleCollision = ballX.current <= paddleRight && 
            ballX.current >= paddleLeft && 
            ballY.current === (paddleY.current - BALL_RADIUS);

        const bottomOverflow = ballY.current > bottom;

        directionX.current = overflowX ? (directionX.current * -1) : directionX.current;
        directionY.current = overflowY || paddleCollision ? (directionY.current * -1) : directionY.current;

        if(bottomOverflow) {
            handleBottomOverflow();
        }

        checkBrickCollision();
    }

    function makeBallMove() {
        ballX.current += directionX.current;
        ballY.current += directionY.current;
    }

    function handleBallMove() {
        checkBallDirection();
        makeBallMove();

        clearAll();
        drawAll();

        if(inGame.current === true) {
            animation.current = requestAnimationFrame(handleBallMove);
        } else {
            requestAnimationFrame(resetAll);
        }
    }

// --------- useLayoutEffect ---------

    useLayoutEffect(() => {
        const frame = getFrameSize();

        canvasRef.current.width = frame.x;
        canvasRef.current.height = frame.y;

        canvasContext.current = canvasRef.current.getContext('2d');
        brickWidth.current = (canvasRef.current.width - BRICK_PADDING) / COLUMNS;

        resetAll();
        drawAll();

        window.addEventListener('mousemove', handleMousemove);
        canvasRef.current.addEventListener('click', handleClick);
        canvasRef.current.addEventListener('click', handleBallMove);

        return (() => {
            window.removeEventListener('mousemove', handleMousemove);
            canvasRef.current.removeEventListener('click', handleClick);
            canvasRef.current.removeEventListener('click', handleBallMove);
        })
    }, []);

// JSX

    return (
        <>
            <ControlsFrame 
                inGame={startGame}
                setStart={handleGameOn}
            >
                <canvas className='breakout__canvas' ref={canvasRef} >
                </canvas>
            </ControlsFrame>
        </>
    );
}

export default Breakout;