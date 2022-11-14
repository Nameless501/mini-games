import { useState, useRef, useLayoutEffect, useEffect, useContext } from 'react';
import '../assets/styles/Canvas.css';
import ColorContext from '../contexts/ColorContext.js';
import ControlsFrame from './ControlsFrame.js';
import { BALL_RADIUS, FONT_SIZE } from '../utils/constants.js';
import { getFrameSize } from '../utils/utils.js';
import useFiguresRender from '../hooks/useFiguresRender.js';
import useCollisionCheck from '../hooks/useCollisionCheck.js';
import useMousePosition from '../hooks/useMousePosition.js';

function Basketball() {
    const inGame = useRef(false);
    const canvasRef = useRef();
    const canvasContext = useRef();
    const animationRef = useRef();
    const ballX = useRef();
    const ballY = useRef();
    const initialBallX = useRef();
    const initialBallY = useRef();
    const targetX = useRef();
    const targetY = useRef();
    const velocityX = useRef();
    const velocityY = useRef();
    const energy = useRef(10);
    const goal = useRef(false);
    const score = useRef(0);
    const collisionTimeout = useRef(0);
    const prevCollision = useRef();

// --------- color context ---------

    const colors = useContext(ColorContext);

// --------- custom hooks ---------

    const [renderCircle, renderRect, renderEllipse, renderText] = useFiguresRender(colors.light);
    const [checkFrameOverflow, checkCollision, circleWithRectCollision, circleWithFrameCollision] = useCollisionCheck();
    const getPositionInCanvas = useMousePosition();

// --------- initial states handlers ---------

    function setCanvasSize() {
        const frame = getFrameSize();
        canvasRef.current.width = frame.x;
        canvasRef.current.height = frame.y;
    }

    function getBallData() {
        return {
            x: ballX.current,
            y: ballY.current,
            r: BALL_RADIUS,
        };
    }

    function setInitialBallPosition() {
        let y = (canvasRef.current.height * 2) / 3 - BALL_RADIUS;
        let x = canvasRef.current.width / 4 - BALL_RADIUS;

        if(canvasRef.current.width < 351) {
            x = 51 + BALL_RADIUS;
        } else if(canvasRef.current.width < 551) {
            x = 71 + BALL_RADIUS;
        }

        ballX.current = x;
        ballY.current = y;
        initialBallX.current = x;
        initialBallY.current = y;
    }

    function setInitialTargetPosition() {
        let y, x;

        if(canvasRef.current.width < 351) {
            y = (canvasRef.current.height * 1) / 4;
            x = (canvasRef.current.width * 3) / 4 - BALL_RADIUS / 2;
        } else if(canvasRef.current.width < 551) {
            y = (canvasRef.current.height * 1) / 3 + BALL_RADIUS;
            x = (canvasRef.current.width * 5) / 6 - BALL_RADIUS;
        } else {
            y = (canvasRef.current.height * 2) / 4 - BALL_RADIUS;
            x = (canvasRef.current.width * 3) / 4 - BALL_RADIUS;
        }

        targetX.current = x;
        targetY.current = y;
    }

// --------- draw handlers ---------

    function drawCounter() {
        renderText(
            canvasContext.current,
            `Score: ${score.current}`,
            10,
            FONT_SIZE * 1.5
        )
    }

    function drawButton() {
        canvasContext.current.strokeStyle = colors.light;
        canvasContext.current.strokeRect(
            5, 
            canvasRef.current.height - FONT_SIZE * 2 - 2.5,
            90,
            FONT_SIZE + 10,
        );
        
        renderText(
            canvasContext.current,
            `Reset ball`,
            10,
            canvasRef.current.height - FONT_SIZE
        )
    }

    function drawBall() {
        renderCircle(canvasContext.current, ballX.current, ballY.current, BALL_RADIUS);
    }

    function drawMaxRange() {
        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = colors.light;

        canvasContext.current.moveTo(
            initialBallX.current, 
            initialBallY.current - 100 - BALL_RADIUS
        );
        canvasContext.current.lineTo(
            initialBallX.current - 80, 
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

        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = colors.light;
        canvasContext.current.moveTo(ballX.current, ballY.current);
        canvasContext.current.lineTo(endX, endY);
        canvasContext.current.stroke();
        canvasContext.current.closePath();
    }

    function drawTarget() {
        renderRect(canvasContext.current, targetX.current, targetY.current - 2, 5, 7);
        renderRect(canvasContext.current, targetX.current + 65, targetY.current - 2, 5, 7);
        renderRect(canvasContext.current, targetX.current + 5, targetY.current, 60, 5);
        
        renderRect(canvasContext.current, targetX.current + 80, targetY.current + 20, 10, -90);
        renderRect(canvasContext.current, targetX.current + 70, targetY.current + 2, 10, 1);

        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = colors.light;
        canvasContext.current.moveTo(targetX.current + 5, targetY.current);
        canvasContext.current.lineTo(targetX.current + 5, targetY.current + 70);
        canvasContext.current.lineTo(targetX.current + 65, targetY.current + 2);
        canvasContext.current.lineTo(targetX.current + 65, targetY.current + 70);
        canvasContext.current.lineTo(targetX.current + 5, targetY.current + 2);
        canvasContext.current.moveTo(targetX.current + 5, targetY.current + 32.5);
        canvasContext.current.lineTo(targetX.current + 35, targetY.current + 65);
        canvasContext.current.lineTo(targetX.current + 65, targetY.current + 32,5);
        canvasContext.current.lineTo(targetX.current + 35, targetY.current + 2);
        canvasContext.current.lineTo(targetX.current + 5, targetY.current + 32.5);
        canvasContext.current.moveTo(targetX.current + 5, targetY.current + 50);
        canvasContext.current.lineTo(targetX.current + 50, targetY.current + 2);
        canvasContext.current.moveTo(targetX.current + 65, targetY.current + 50);
        canvasContext.current.lineTo(targetX.current + 20, targetY.current + 2);
        canvasContext.current.stroke();
        canvasContext.current.closePath();
    }

    function clearAll() {
        canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function drawAll() {
        drawBall();
        drawTarget();
        drawCounter();
        if(inGame.current) {
            drawButton();
        }
    }

    function drawAllWithGuide() {
        drawMaxRange();
        drawGuideLine();
        drawAll();
    }

// --------- event handlers ---------

    function getVelocity() {
        const multiplierX = (initialBallX.current - ballX.current) / 10;
        const multiplierY = (ballY.current - initialBallY.current) / 10;
        velocityX.current = 0.8 * multiplierX;
        velocityY.current = -0.9 * multiplierY;
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

    // V for tests V

    /* function handleMouseMove(evt) {
        const [x, y] = getPositionInCanvas(evt, canvasRef.current);

        ballX.current = x;
        ballY.current = y;

        window.requestAnimationFrame(drawAllWithGuide);
        clearAll();
    } */

    function checkClickOnBall(evt) {
        const [x, y] = getPositionInCanvas(evt, canvasRef.current);
        const ball = getBallData();

        const clickInside = x > (ball.x - ball.r) && x < (ball.x + ball.r) &&
            y > (ball.y - ball.r) && y < (ball.y + ball.r);

        return clickInside;
    }

    function checkClickOnButton(evt) {
        const [x, y] = getPositionInCanvas(evt, canvasRef.current);

        const clickInside = x > 5 && x < 95 &&
            y > (canvasRef.current.height - FONT_SIZE * 2 - 2.5) && 
            y < (canvasRef.current.height - FONT_SIZE * 2 - 2.5) + (FONT_SIZE + 12.5)

        return clickInside;
    }

    function handleMouseDown(evt) {
        if(!inGame.current) {
            const isClickedOnBall = checkClickOnBall(evt);

            if(isClickedOnBall) {
                canvasRef.current.addEventListener('mousemove', handleMouseMove);
                canvasRef.current.addEventListener('mouseup', handleMouseUp);
            }
        } else if (inGame.current) {
            const isClickedOnButton = checkClickOnButton(evt);

            if(isClickedOnButton) {
                resetBall();
            }
        }
    }

    function handleMouseUp() {
        if(!inGame.current) {
            canvasRef.current.removeEventListener('mousemove', handleMouseMove);
            canvasRef.current.removeEventListener('mouseup', handleMouseUp);

            inGame.current = true;

            handleBallMove();
        }
    }

// --------- lose and reset handlers ---------

    function resetBall() {
        cancelAnimationFrame(animationRef.current);

        inGame.current = false;
        goal.current = false;

        velocityX.current = 0;
        velocityY.current = 0;
        energy.current = 10;

        setInitialBallPosition();
        clearAll();
        drawAll();
    }

    function resetAllStates() {
        resetBall();
        score.current = 0;
    }

// --------- ball direction handlers ---------

    function handleVerticalDirectionChange(energyReduce = false) {
        velocityY.current *= -1;
        handleVelocityReduce(energyReduce);
    }

    function handleHorizontalDirectionChange(energyReduce = false) {
        velocityX.current *= -1;
        handleVelocityReduce(energyReduce);
    }

    function handleBothDirectionsChange(energyReduce = false) {
        velocityY.current *= -1;
        velocityX.current *= -1;
        handleVelocityReduce(energyReduce);
    }

    function handleMultipleCollisions(currentCollision, callback) {
        if(prevCollision.current !== currentCollision) {
            prevCollision.current = currentCollision;
            collisionTimeout.current = 10;
            callback();
        } else if(prevCollision.current === currentCollision && collisionTimeout.current === 0) {
            collisionTimeout.current = 10;
            callback();
        }
    }

// --------- collision handlers ---------

    function checkFrameCollision() {
        const ball = getBallData();
        const [overflowRight, overflowLeft, overflowTop, overflowBottom] = circleWithFrameCollision(
            ball,
            canvasRef.current.width,
            canvasRef.current.height,
        );

        if((overflowRight || overflowLeft) && (overflowTop || overflowBottom)) {
            handleBothDirectionsChange(true);
        } else if (overflowRight || overflowLeft) {
            handleHorizontalDirectionChange(true);
        } else if (overflowTop || overflowBottom) {
            handleVerticalDirectionChange(true);
            if(overflowBottom) {
                checkScore();
            }
        }
    }

    function checkShieldCollision() {
        const ball = getBallData();
        const shield = {
            x: targetX.current + 85,
            y: targetY.current - 25,
            h: 90,
            w: 10,
        }
        const [sideCollision, verticalCollision, cornerCollision] = circleWithRectCollision(ball, shield);

        if(cornerCollision) {
            handleMultipleCollisions('shield', handleBothDirectionsChange);
        } else if(sideCollision) {
            handleMultipleCollisions('shield', handleHorizontalDirectionChange);
        } else if(verticalCollision) {
            handleMultipleCollisions('shield', handleVerticalDirectionChange);
        }
    }

    function checkBasketCollisionRight() {
        const ball = getBallData();
        const basketBorder = {
            x: targetX.current + 7.5 + 65,
            y: targetY.current + 1.5,
            h: 7,
            w: 15,
        }
        const [sideCollision, verticalCollision, cornerCollision] = circleWithRectCollision(ball, basketBorder);

        if(cornerCollision) {
            handleMultipleCollisions('borderRight', handleBothDirectionsChange);
        } else if(sideCollision) {
            handleMultipleCollisions('borderRight', handleHorizontalDirectionChange);
        } else if(verticalCollision) {
            handleMultipleCollisions('borderRight', handleVerticalDirectionChange);
        }
    }

    function checkBasketCollisionLeft() {
        const ball = getBallData();
        const basketBorder = {
            x: targetX.current + 2.5,
            y: targetY.current + 1.5,
            h: 7,
            w: 5,
        }
        const [sideCollision, verticalCollision, cornerCollision] = circleWithRectCollision(ball, basketBorder);

        if(cornerCollision) {
            handleMultipleCollisions('borderLeft', handleBothDirectionsChange);
        } else if(sideCollision) {
            handleMultipleCollisions('borderLeft', handleHorizontalDirectionChange);
        } else if(verticalCollision) {
            handleMultipleCollisions('borderLeft', handleVerticalDirectionChange);
        }
    }

    function checkNetCollision() {
        const ball = getBallData();
        const netLeft = {
            x: targetX.current + 5,
            y: targetY.current + 35,
            h: 70,
            w: 1,
        }
        const netRight = {
            x: targetX.current + 70,
            y: targetY.current + 35,
            h: 70,
            w: 1,
        }
        const [netLeftSideCollision, netLeftVerticalCollision, netLeftCornerCollision] = circleWithRectCollision(ball, netLeft);
        const [netRightSideCollision, netRightVerticalCollision, netRightCornerCollision] = circleWithRectCollision(ball, netRight);

        if(netLeftSideCollision) {
            handleMultipleCollisions('borderLeft', handleHorizontalDirectionChange);
        } else if (netRightSideCollision) {
            handleMultipleCollisions('borderRight', handleHorizontalDirectionChange);
        }
    }

    function checkBasketCollision() {
        checkShieldCollision();
        checkBasketCollisionRight();
        checkBasketCollisionLeft();
        checkNetCollision();
    }

    function checkGoal() {
        const ball = getBallData();
        const basket = {
            x: targetX.current + 35,
            y: targetY.current + 55,
            h: 10,
            w: 60,
        }
        const [sideCollision, verticalCollision, cornerCollision] = circleWithRectCollision(ball, basket);
        
        if(verticalCollision) {
            goal.current = true;
        }
    }

    function checkScore() {
        if(goal.current) {
            score.current += 1;
            goal.current = false;
        }
    }

// --------- ball move handlers ---------

    function handleGravity() {
        if (velocityY.current < 1) {
            velocityY.current += 0.1
        } else {
            velocityY.current += 0.1
        }
    }

    function handleVelocityReduce(energyReduce) {
        energy.current = energyReduce ? energy.current - 1 : energy.current;

        setTimeout(() => {
            velocityX.current = velocityX.current * 0.8;
            velocityY.current = velocityY.current * 0.8;
        }, 0)
    }

    function makeBallMove() {
        ballX.current += velocityX.current;
        ballY.current += velocityY.current;
    }

    function handleBallMove() {
        if (energy.current > 0) {
            animationRef.current = window.requestAnimationFrame(handleBallMove);

            checkFrameCollision();
            checkBasketCollision();
            checkGoal();

            handleGravity();
            
            makeBallMove();
            clearAll();
            drawAll();

            collisionTimeout.current = collisionTimeout.current > 0 ? collisionTimeout.current - 1 : 0;
        } else if(energy.current === 0) {
            setTimeout(() => {
                resetBall();
            }, 100);
        }
    }

// --------- useLayoutEffect ---------

    useLayoutEffect(() => {
        setCanvasSize();
        canvasContext.current = canvasRef.current.getContext('2d');

        resetAllStates();
        setInitialTargetPosition();
        drawAll();

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