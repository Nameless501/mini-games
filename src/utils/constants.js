// --------- general ---------

export const COLORS = [
    {
        dark: '#145f48',
        light: '#e89db4',
    },
    {
        dark: '#ab0916',
        light: '#4ff3e6',
    },
    {
        dark: '#20324e',
        light: '#dccaae',
    },
    {
        dark: '#94afdc',
        light: '#6e5326',
    },
    {
        dark: '#570511',
        light: '#a5f7eb',
    },
    {
        dark: '#c8faa4',
        light: '#3a085e',
    },
    {
        dark: '#6f0da5',
        light: '#8cef57',
    },
    {
        dark: '#6f0da5',
        light: '#8cef57',
    },
    {
        dark: '#bb2562',
        light: '#40d59a',
    },
    {
        dark: '#25bbbf',
        light: '#af1622',
    }
]

export const FRAME_SIZES = {
    1280: {x: 800, y: 600},
    1023: {x: 690, y: 480},
    767: {x: 500, y: 350},
    550: {x: 350, y: 450},
}

// --------- Snake game ---------

export const SNAKE_BLOCK_SIZES = {
    800: 40,
    690: 30,
    500: 25,
    350: 25,
}

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
        beat: 'scissors',
    },
    {
        name: 'paper',
        beat: 'rock',
    },
    {
        name: 'scissors',
        beat: 'paper',
    }
];

// --------- Breakout ---------

export const PADDLE_WIDTH = 100;

export const PADDLE_HEIGHT = 15;

export const BALL_RADIUS = 15;

export const BRICK_PADDING = 15;

export const BRICK_HEIGHT = 30;

export const COLUMNS = 6;

export const ROWS = 4;

export const FONT_SIZE = 20;

export const BALL_VELOCITY = 4;