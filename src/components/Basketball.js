import { useState, useRef, useLayoutEffect } from 'react';
import '../assets/styles/Canvas.css';
import ControlsFrame from './ControlsFrame.js';
import { COLOR_LIGHT, COLOR_DARK, BALL_RADIUS } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';

function Basketball() {
    const inGame = useRef(false);
    const canvasRef = useRef();
    const canvasContext = useRef();
    const ballX = useRef();
    const ballY = useRef();
    const initialBallX = useRef();
    const initialBallY = useRef();
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

    function drawMaxRange() {
        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = COLOR_DARK;
        canvasContext.current.moveTo(
            initialBallX.current - 100 - BALL_RADIUS, 
            initialBallY.current - 50 - BALL_RADIUS
        );
        canvasContext.current.lineTo(
            initialBallX.current - 100 - BALL_RADIUS, 
            initialBallY.current + 80
        );
        canvasContext.current.quadraticCurveTo(
            initialBallX.current - 100 - BALL_RADIUS, 
            initialBallY.current + 100 + BALL_RADIUS,
            initialBallX.current - 80,
            initialBallY.current + 100 + BALL_RADIUS
        );
        canvasContext.current.lineTo(
            initialBallX.current,
            initialBallY.current + 100 + BALL_RADIUS
        );
        canvasContext.current.stroke();
        canvasContext.current.closePath();
    }

    function drawGuideLine() {
        const maxX = initialBallX.current + velocityX.current * 15;
        const maxY = initialBallY.current + velocityY.current * 15;
        const endX = maxX + 50;
        const endY = maxY + 10;


        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = COLOR_DARK;
        canvasContext.current.moveTo(ballX.current, ballY.current);
        canvasContext.current.quadraticCurveTo(maxX, maxY, endX, endY);
        canvasContext.current.stroke();
        canvasContext.current.closePath();
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function drawAll() {
        drawBall();
    }

    function drawAllWithGuide() {
        drawMaxRange();
        drawGuideLine();
        drawBall();
    }

// --------- event handlers ---------

    function getVelocity() {
        const multiplierX = (initialBallX.current - ballX.current) / 10;
        const multiplierY = (ballY.current - initialBallY.current) > 0 ?
            ((ballY.current - initialBallY.current)) / 10 : 0;

        velocityX.current = 0.75 * multiplierX;
        velocityY.current = -0.75 * multiplierY;
    }

    function handleMouseMove(evt) {
        const canvasPosition = canvasRef.current.parentElement.getBoundingClientRect();
        const x = evt.pageX - canvasPosition.x;
        const y = evt.pageY - canvasPosition.y;

        const leftBorder = initialBallX.current - 100;
        const topBorder = initialBallY.current - 50;
        const bottomBorder = initialBallY.current + 100;

        if(x > leftBorder && x < initialBallX.current) {
            ballX.current = x;
        }

        if(y > topBorder && y < bottomBorder) {
            ballY.current = y;
        }

        getVelocity();

        window.requestAnimationFrame(drawAllWithGuide);
        clearAll();
    }

    function checkClickOnBall(evt) {
        const canvasPosition = canvasRef.current.parentElement.getBoundingClientRect();

        const top = ballY.current - BALL_RADIUS;
        const bottom = ballY.current + BALL_RADIUS;
        const left = ballX.current - BALL_RADIUS;
        const right = ballX.current + BALL_RADIUS;

        const evtX = evt.pageX - canvasPosition.x;
        const evtY = evt.pageY - canvasPosition.y;

        const clickInside = evtX > left && evtX < right &&
            evtY > top && evtY < bottom

        return clickInside;
    }

    function handleMouseDown(evt) {
        const isClickedOnBall = checkClickOnBall(evt);

        if(isClickedOnBall) {
            canvasRef.current.addEventListener('mousemove', handleMouseMove);
            canvasRef.current.addEventListener('mouseup', handleMouseUp);
        }
    }

    function handleMouseUp() {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.addEventListener('mouseup', handleMouseUp);

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
        initialBallX.current = x;
        initialBallY.current = y;
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
            drawAll();

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
        drawAll();

        velocityX.current = 3;
        velocityY.current = -6;

        canvasRef.current.addEventListener('mousedown', handleMouseDown);

        return (() => {
            canvasRef.current.removeEventListener('mousedown', handleMouseDown);
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