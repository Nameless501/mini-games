import rock from '../assets/images/rock-white.svg';
import paper from '../assets/images/paper-white.svg';
import scissors from '../assets/images/scissors-white.svg';

// --------- general ---------

export const FRAME_SIZES = {
    1280: {x: 800, y: 600},
    1023: {x: 690, y: 480},
    767: {x: 500, y: 350},
    550: {x: 320, y: 380},
}

// --------- Snake game ---------

export const SNAKE_POSSIBLE_DIRECTION = {
    up: ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'left', 'right'],
    right: ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown', 'up', 'down'],
    down: ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'left', 'right'],
    left: ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown', 'up', 'down'],
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
    up: ['y', -1, 'up'],
    down: ['y', 1, 'down'],
    left: ['x', -1,  'left'],
    right: ['x', 1, 'right'],
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