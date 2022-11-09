import { useState, useRef, useLayoutEffect } from 'react';
import '../assets/styles/Canvas.css';
import ControlsFrame from './ControlsFrame.js';
import { COLOR_LIGHT, COLOR_DARK, BALL_RADIUS } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';
import useFiguresRender from '../hooks/useFiguresRender.js';
import useCollisionCheck from '../hooks/useCollisionCheck.js';
import useMousePosition from '../hooks/useMousePosition.js';

function Basketball() {
    const inGame = useRef(false);
    const canvasRef = useRef();
    const canvasContext = useRef();
    const ballX = useRef();
    const ballY = useRef();
    const initialBallX = useRef();
    const initialBallY = useRef();
    const targetX = useRef();
    const targetY = useRef();
    const velocityX = useRef();
    const velocityY = useRef();
    const energy = useRef(20);

// --------- custom hooks ---------

    const [renderCircle, renderRect, renderEllipse, renderText] = useFiguresRender();
    const [checkFrameOverflow, checkCollision] = useCollisionCheck();
    const getPositionInCanvas = useMousePosition();

// --------- initial states handlers ---------

    function setCanvasSize() {
        const frame = getFrameSize();
        canvasRef.current.width = frame.x;
        canvasRef.current.height = frame.y;
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

    function drawBall() {
        renderCircle(canvasContext.current, ballX.current, ballY.current, BALL_RADIUS);
    }

    function drawMaxRange() {
        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = COLOR_DARK;
        canvasContext.current.moveTo(
            initialBallX.current, 
            initialBallY.current - 100 - BALL_RADIUS
        );
        canvasContext.current.lineTo(
            initialBallX.current - 80 - BALL_RADIUS, 
            initialBallY.current - 100 - BALL_RADIUS
        );
        canvasContext.current.quadraticCurveTo(
            initialBallX.current - 100 - BALL_RADIUS, 
            initialBallY.current - 100 - BALL_RADIUS,
            initialBallX.current - 100 - BALL_RADIUS,
            initialBallY.current - 80
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
        const endX = initialBallX.current + velocityX.current * 10;
        const endY = initialBallY.current + velocityY.current * 10;
        const arrowY = initialBallY.current + velocityY.current * 8;
        const arrowX = initialBallX.current + velocityX.current * 8;


        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = COLOR_DARK;
        canvasContext.current.moveTo(ballX.current, ballY.current);
        canvasContext.current.lineTo(endX, endY);

        // стрелку бы переделать

        canvasContext.current.moveTo(arrowX, arrowY - 5);
        canvasContext.current.lineTo(endX, endY);
        canvasContext.current.moveTo(arrowX, arrowY + 5);
        canvasContext.current.lineTo(endX, endY);

        // -----------------------

        canvasContext.current.stroke();
        canvasContext.current.closePath();
    }

    function drawTarget() {
        renderEllipse(canvasContext.current, targetX.current, targetY.current, BALL_RADIUS * 2, BALL_RADIUS);
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function drawAll() {
        drawTarget();
        drawBall();
    }

    function drawAllWithGuide() {
        drawMaxRange();
        drawGuideLine();
        drawAll();
    }

// --------- event handlers ---------

    function getVelocity() {
        const multiplierX = (initialBallX.current - ballX.current) / 10;
        /* const multiplierY = (ballY.current - initialBallY.current) > 0 ?
            ((ballY.current - initialBallY.current)) / 10 : 0; */
        const multiplierY = (ballY.current - initialBallY.current) / 10;

        velocityX.current = 0.75 * multiplierX;
        velocityY.current = -0.75 * multiplierY;
    }

    function handleMouseMove(evt) {
        const [x, y] = getPositionInCanvas(evt, canvasRef.current);

        const leftBorder = initialBallX.current - 100;
        const topBorder = initialBallY.current - 100;
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
        const [x, y] = getPositionInCanvas(evt, canvasRef.current);
        const ball = getBallData();

        const clickInside = x > ball.left && x < ball.right &&
            y > ball.top && y < ball.bottom

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
        setInitialBallPosition();
        clearAll();
        drawAll();
    }

// --------- target handlers ---------

    function setInitialTargetPosition() {
        const y = (canvasRef.current.height * 2) / 3 - BALL_RADIUS;
        const x = (canvasRef.current.width * 3) / 4 - BALL_RADIUS;
    
        targetX.current = x;
        targetY.current = y;
    }

// --------- collision handlers ---------

    function checkFrameCollision() {
        const ball = getBallData()
        const [overflowRight, overflowLeft, overflowTop, overflowBottom] = checkFrameOverflow(
            ball,
            canvasRef.current.width,
            canvasRef.current.height,
        )
        const overflowX = overflowLeft || overflowRight;
        const overflowY = overflowTop || overflowBottom;

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

// --------- ball move handlers ---------

    function setInitialBallPosition() {
        const y = (canvasRef.current.height * 2) / 3 - BALL_RADIUS;
        const x = canvasRef.current.width / 4 - BALL_RADIUS;

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
        setCanvasSize();
        canvasContext.current = canvasRef.current.getContext('2d');

        setInitialBallPosition();
        setInitialTargetPosition();
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