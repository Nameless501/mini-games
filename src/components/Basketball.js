import { useState, useRef, useLayoutEffect } from 'react';
import '../assets/styles/Canvas.css';
import ControlsFrame from './ControlsFrame.js';
import { COLOR_LIGHT, COLOR_DARK, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_RADIUS, BRICK_PADDING, BRICK_HEIGHT, COLUMNS, ROWS, FONT_SIZE, BALL_VELOCITY } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';

function Basketball() {
    const inGame = useRef(false);
    const canvasRef = useRef();
    const canvasContext = useRef();
    const ballX = useRef();
    const ballY = useRef();
    const velocityX = useRef();
    const velocityY = useRef();
    const energy = useRef(20);

// --------- draw handlers ---------
    /* function drawPaddle() {
        canvasContext.current.fillStyle = COLOR_LIGHT;
        canvasContext.current.fillRect(paddleX.current, paddleY.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    } */

    function drawBall() {
        canvasContext.current.beginPath();
        canvasContext.current.fillStyle = COLOR_DARK;
        canvasContext.current.arc(ballX.current, ballY.current, BALL_RADIUS, 0, Math.PI * 2, false);
        canvasContext.current.fill();
        canvasContext.current.closePath();
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    /* function drawAll() {
        
    } */

// --------- event handlers ---------

    function handleMousemove(evt) {
        const x = evt.clientX - canvasRef.current.parentElement.offsetLeft;
        const y = evt.clientY - canvasRef.current.parentElement.offsetTop;
        const rightBorder = canvasRef.current.width;
        const bottom = canvasRef.current.height;

        if(inGame.current === false) {
            if(x > 0 && x < rightBorder) {
                ballX.current = x;
            }
    
            if(y > 0 && y < bottom) {
                ballY.current = y;
            }
    
            window.requestAnimationFrame(drawBall);
            clearAll();
        }
    }

    function handleClick() {
        inGame.current = true;

        handleBallMove();
    }

// --------- lose and reset handlers ---------

    function resetAllStates() {
        
    }

    function resetBall() {
        
    }

// --------- ball move handlers ---------

    function setInitialBallPosition() {
        const y = (canvasRef.current.height * 2) / 3 - BALL_RADIUS;
        const x = canvasRef.current.width / 3 - BALL_RADIUS;

        ballX.current = x;
        ballY.current = y;
    }

    function checkBallDirection() {
        const bottom = canvasRef.current.height - BALL_RADIUS;
        const right = canvasRef.current.width - BALL_RADIUS;
        const top = BALL_RADIUS;
        const left = BALL_RADIUS;

        const overflowX = (ballX.current + velocityX.current) > right || 
            (ballX.current + velocityX.current) < left;
        const overflowY = (ballY.current + velocityY.current) < top || 
            (ballY.current + velocityY.current) > bottom;

        velocityX.current = overflowX ? (velocityX.current * -1) : velocityX.current;
        velocityY.current = overflowY ? (velocityY.current * -0.5) : velocityY.current;

        if(overflowY && energy.current > 0) {
            energy.current -= 1;
            velocityX.current = velocityX.current < 0 ? velocityX.current + 0.1 : velocityX.current - 0.1;
        }
        if(overflowX && energy.current > 0) {
            velocityX.current *= 0.7;
        }
    }

    function makeBallMove() {
        ballX.current += velocityX.current;
        ballY.current += velocityY.current;
    }

    function handleBallMove() {
        if (energy.current > 0) {
            window.requestAnimationFrame(handleBallMove);

            checkBallDirection();
            makeBallMove();
            clearAll();
            drawBall();

            velocityY.current = velocityY.current < 0 ? velocityY.current + 0.075 : velocityY.current + 0.15;
        }
    }

// --------- useLayoutEffect ---------

    useLayoutEffect(() => {
        const frame = getFrameSize();
        canvasRef.current.width = frame.x;
        canvasRef.current.height = frame.y;
        canvasContext.current = canvasRef.current.getContext('2d');

        setInitialBallPosition();
        drawBall();

        velocityX.current = 3;
        velocityY.current = -6;

        window.addEventListener('mousedown', handleMousemove);
        //canvasRef.current.addEventListener('click', handleClick);

        return (() => {
            window.removeEventListener('mousemove', handleMousemove);
            canvasRef.current.removeEventListener('click', handleClick);
        })
    }, []);

// JSX

    return (
        <>
            <ControlsFrame 
                inGame={true}
            >
                <canvas className='canvas' ref={canvasRef} />
            </ControlsFrame>
        </>
    );
}

export default Basketball;