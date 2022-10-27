import rock from '../assets/images/rock-white.svg';
import paper from '../assets/images/paper-white.svg';
import scissors from '../assets/images/scissors-white.svg';

// --------- Snake game ---------

export const DEFAULT_SNAKE = [
    {x: 360, y: 280},
    {x: 360, y: 320},
    {x: 360, y: 360},
]

export const SNAKE_POSSIBLE_DIRECTION = {
    up: ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight'],
    right: ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'],
    down: ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight'],
    left: ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'],
}

export const SNAKE_KEY_MOVES = {
    KeyW: ['y', -1, 'up'],
    ArrowUp: ['y', -1, 'up'],
    KeyS: ['y', 1, 'down'],
    ArrowDown: ['y', 1, 'down'],
    KeyA: ['x', -1,  'left'],
    ArrowLeft: ['x', -1,  'left'],
    KeyD: ['x', 1, 'right'],
    ArrowRight: ['x', 1, 'right'],
}

export const SNAKE_DEFAULT_DIRECTION = ['y', -1, 'up'];

export const SNAKE_POSSIBLE_KEYS = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const SNAKE_MOVE_TIME = 500;

export const SNAKE_MOVE_DISTANCE = 10;

// --------- Rock paper scissors ---------

export const RPS_CONFIG = [
    {
        name: 'rock',
        img: `${rock}`,
        beat: 'scissors',
    },
    {
        name: 'paper',
        img: `${paper}`,
        beat: 'rock',
    },
    {
        name: 'scissors',
        img: `${scissors}`,
        beat: 'paper',
    }
];