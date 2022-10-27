import { useState, useEffect } from 'react';
import '../assets/styles/SnakeFood.css';
import { getRandomNumber } from '../utils/utils.js';

function SnakeFood({ snakePosition, setCollisionState, frameSize }) {
    const [foodPosition, setFoodPosition] = useState();

// handle random food position

    function getRandomPosition() {
        const x = getRandomNumber(0, (frameSize.x / 40)) * 40;
        const y = getRandomNumber(0, (frameSize.y / 40)) * 40;

        const collision = snakePosition.some(item => item.x === x && item.y === y);

        if(collision) {
            getRandomPosition();
        } else {
            setFoodPosition({
                top: y,
                left: x,
            })
        }
    }

    useState(() => {
        getRandomPosition();
    }, []);

// handle food collision

    function checkCollision() {
        const snakeHead = snakePosition[0];
        const collision = snakeHead.x === foodPosition.left && snakeHead.y === foodPosition.top;

        if(collision) {
            getRandomPosition();
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