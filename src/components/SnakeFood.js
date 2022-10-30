import { useState, useEffect } from 'react';
import '../assets/styles/SnakeFood.css';
import { getRandomNumber, getBlockSize, getFrameSize } from '../utils/utils.js';

function SnakeFood({ snakePosition, setCollisionState }) {
    const [foodPosition, setFoodPosition] = useState(() => getRandomPosition());

// handle random food position

    function getRandomPosition() {
        const foodSize = getBlockSize();
        const frameSize = getFrameSize();

        const x = getRandomNumber(0, (frameSize.x / foodSize)) * foodSize;
        const y = getRandomNumber(0, (frameSize.y / foodSize)) * foodSize;

        const collision = snakePosition.some(item => item.x === x && item.y === y);

        if(collision) {
            getRandomPosition();
        } else {
            return ({
                top: y,
                left: x,
            })
        }
    }

// handle food collision

    function checkCollision() {
        const snakeHead = snakePosition[0];
        const collision = snakeHead.x === foodPosition.left && snakeHead.y === foodPosition.top;

        if(collision) {
            setFoodPosition(() => getRandomPosition());
            setCollisionState(true);
        }
    }

    useEffect(() => {
        checkCollision();
    }, [snakePosition]);

    return (
        <div 
            className="snake-food" 
            style={foodPosition}
        />
    );
}

export default SnakeFood;