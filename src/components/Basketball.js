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
    const [checkFrameOverflow, checkCollision, checkSideCollision] = useCollisionCheck();
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

    function setInitialBallPosition() {
        const y = (canvasRef.current.height * 2) / 3 - BALL_RADIUS;
        const x = canvasRef.current.width / 4 - BALL_RADIUS;

        ballX.current = x;
        ballY.current = y;
        initialBallX.current = x;
        initialBallY.current = y;
    }

    function setInitialTargetPosition() {
        const y = (canvasRef.current.height * 2) / 4 - BALL_RADIUS;
        const x = (canvasRef.current.width * 3) / 4 - BALL_RADIUS;

        targetX.current = x;
        targetY.current = y;
    }

// --------- draw handlers ---------

    function drawCounter() {
        renderText(
            canvasContext.current,
            `Score: ${score.current}`,
            10,
            FONT_SIZE
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
        //const arrowY = initialBallY.current + velocityY.current * 8;
        //const arrowX = initialBallX.current + velocityX.current * 8;

        canvasContext.current.beginPath();
        canvasContext.current.strokeStyle = colors.light;
        canvasContext.current.moveTo(ballX.current, ballY.current);
        canvasContext.current.lineTo(endX, endY);

        // стрелку бы переделать

        /* canvasContext.current.moveTo(arrowX, arrowY - 5);
        canvasContext.current.lineTo(endX, endY);
        canvasContext.current.moveTo(arrowX, arrowY + 5);
        canvasContext.current.lineTo(endX, endY); */

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
        canvasContext.current.moveTo(targetX.current + 5, targetY.current + 30);
        canvasContext.current.lineTo(targetX.current + 35, targetY.current + 65);
        canvasContext.current.lineTo(targetX.current + 65, targetY.current + 30);
        canvasContext.current.lineTo(targetX.current + 35, targetY.current + 2);
        canvasContext.current.lineTo(targetX.current + 5, targetY.current + 30);
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

        const clickInside = x > ball.left && x < ball.right &&
            y > ball.top && y < ball.bottom

        return clickInside;
    }

    function handleMouseDown(evt) {
        if(!inGame.current) {
            const isClickedOnBall = checkClickOnBall(evt);

            if(isClickedOnBall) {
                canvasRef.current.addEventListener('mousemove', handleMouseMove);
                canvasRef.current.addEventListener('mouseup', handleMouseUp);
            }
        }
    }

    function handleMouseUp() {
        if(!inGame.current) {
            canvasRef.current.removeEventListener('mousemove', handleMouseMove);
            canvasRef.current.addEventListener('mouseup', handleMouseUp);

            inGame.current = true;

            handleBallMove();
        }
    }

// --------- lose and reset handlers ---------

    function resetBall() {
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

    function handleVerticalDirectionChange() {
        velocityY.current *= -1;
        handleVelocityReduce();
    }

    function handleHorizontalDirectionChange() {
        velocityX.current *= -1;
        handleVelocityReduce();
    }

    function handleBothDirectionsChange() {
        velocityY.current *= -1;
        velocityX.current *= -1;
        handleVelocityReduce();
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
        const [overflowRight, overflowLeft, overflowTop, overflowBottom] = checkFrameOverflow(
            ball,
            canvasRef.current.width,
            canvasRef.current.height,
        );
        const frameCollision = overflowRight || overflowLeft || overflowBottom || overflowTop;

        if(frameCollision) {
            velocityX.current = overflowRight || overflowLeft ? (velocityX.current * -1) : velocityX.current;
            velocityY.current = overflowBottom || overflowTop ? (velocityY.current * -1) : velocityY.current;

            handleVelocityReduce();
        }

        if(overflowBottom) {
            checkScore();
        }
    }

    function checkShieldCollision() {
        const ball = getBallData();
        const shield = {
            top: targetY.current - 70,
            left: targetX.current + 80,
            right: targetX.current + 90,
            bottom: targetY.current - 20,
        }

        const [collision, collisionTop, collisionRight, collisionLeft, collisionBottom] = checkSideCollision(ball, shield);

        console.log(Math.floor(velocityY.current));

        if(collision) {

            console.log(collisionTop, collisionBottom);
            
            if(collisionTop || collisionBottom) {
                console.log(ball, shield)
                handleMultipleCollisions('shield', handleVerticalDirectionChange);
            } 
            
            if(collisionRight || collisionLeft) {
                //console.log('side')
                handleMultipleCollisions('shield', handleHorizontalDirectionChange);
            }
        }
    }

    function checkBasketCollision() {
        const ball = getBallData();
        const basketBorderRight = {
            top: targetY.current - 2,
            left: targetX.current + 65,
            right: targetX.current + 70,
            bottom: targetY.current + 5,
        }
        const basketBorderLeft = {
            top: targetY.current - 2,
            left: targetX.current,
            right: targetX.current + 5,
            bottom: targetY.current + 5,
        }

        const [RBcollision, RBcollisionTop, RBcollisionRight, RBcollisionLeft, RBcollisionBottom] = checkSideCollision(ball, basketBorderRight);
        const [LBcollision, LBcollisionTop, LBcollisionRight, LBcollisionLeft, LBcollisionBottom] = checkSideCollision(ball, basketBorderLeft);

        if(RBcollision) {
            const name = 'borderRight';
            if(RBcollisionTop || RBcollisionBottom) {
                handleMultipleCollisions(name, handleBothDirectionsChange);
            } else if(RBcollisionRight || RBcollisionLeft) {
                handleMultipleCollisions(name, handleHorizontalDirectionChange);
            }
        }

        if(LBcollision) {
            const name = 'borderLeft';
            if(LBcollisionTop || LBcollisionBottom) {
                handleMultipleCollisions(name, handleBothDirectionsChange);
            } else if(LBcollisionRight || LBcollisionLeft) {
                handleMultipleCollisions(name, handleHorizontalDirectionChange);
            }
        }

        /* const borderRightCollision = checkCollision(ball, basketBorderRight);
        const borderLeftCollision = checkCollision(ball, basketBorderLeft);
        const rightBorderVerticalCollision = checkCollision(ball, basketBorderTopRight);
        const leftBorderVerticalCollision = checkCollision(ball, basketBorderTopLeft);

        const verticalCollision = rightBorderVerticalCollision || leftBorderVerticalCollision;
        const sideCollision = borderRightCollision || borderLeftCollision;

        if(verticalCollision) {
            const name = rightBorderVerticalCollision ? 'borderRight' : 'borderLeft';
            handleMultipleCollisions(name, handleBothDirectionsChange);
        } else if (sideCollision) {
            const name = borderRightCollision ? 'borderRight' : 'borderLeft';
            handleMultipleCollisions(name, handleHorizontalDirectionChange);
        } */
    } 

    function checkNetCollision() {
        /* const ball = getBallData();
        const netLeft = {
            top: targetY.current + 2,
            left: targetX.current + 5,
            right: targetX.current + 6,
            bottom: targetY.current + 70,
        }
        const netRight = {
            top: targetY.current + 2,
            left: targetX.current + 64,
            right: targetX.current + 65,
            bottom: targetY.current + 70,
        }

        const netLeftCollision = checkCollision(ball, netLeft);
        const netRightCollision = checkCollision(ball, netRight);

        if(netLeftCollision) {
            handleMultipleCollisions('borderLeft', handleHorizontalDirectionChange);
        } else if (netRightCollision) {
            handleMultipleCollisions('borderRight', handleHorizontalDirectionChange);
        } */
    }

    function checkGoal() {
        const ball = getBallData();
        const basket = {
            top: targetY.current + 50,
            left: targetX.current + 5,
            right: targetX.current + 65,
            bottom: targetY.current + 60,
        }
        const inBasket = checkCollision(ball, basket);
        
        if(inBasket) {
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

    function handleVelocityReduce() {
        energy.current -= 1;

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
            var animation = window.requestAnimationFrame(handleBallMove);

            checkFrameCollision();
            checkShieldCollision();
            checkBasketCollision();
            checkNetCollision();
            checkGoal();

            handleGravity();
            
            makeBallMove();
            clearAll();
            drawAll();

            collisionTimeout.current = collisionTimeout.current > 0 ? collisionTimeout.current - 1 : 0;
        } else if(energy.current === 0) {
            cancelAnimationFrame(animation);

            setTimeout(() => {
                resetBall();
            }, 100)
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