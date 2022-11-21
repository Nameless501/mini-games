import { createSlice } from '@reduxjs/toolkit';

export const snakeSlice = createSlice({
    name: 'snake',
    initialState: {
        value: {},
    },
    reducers: {
        moveForward: state => {
            const block = {...state.value.block};
            const canvas = {...state.value.canvas};
            const snake = [...state.value.position.map(item => ({...item}))];
            const newHead = {...snake[0]};
            const newTail = snake.pop();

            newHead.y = (newHead.y - block.h) < 0 ? (canvas.h - block.h) : (newHead.y - block.h);

            return {
                ...state,
                value: {
                    ...state.value,
                    position: [newHead, ...snake],
                    tail: newTail,
                }
            }
        },
        moveLeft: state => {
            const block = {...state.value.block};
            const canvas = {...state.value.canvas};
            const snake = [...state.value.position.map(item => ({...item}))];
            const newHead = {...snake[0]};
            const newTail = snake.pop();

            newHead.x = (newHead.x - block.w) < 0 ? (canvas.w - block.w) : (newHead.x - block.w);

            return {
                ...state,
                value: {
                    ...state.value,
                    position: [newHead, ...snake],
                    tail: newTail,
                }
            }
        },
        moveRight: state => {
            const block = {...state.value.block};
            const canvas = {...state.value.canvas};
            const snake = [...state.value.position.map(item => ({...item}))];
            const newHead = {...snake[0]};
            const newTail = snake.pop();

            newHead.x = (newHead.x + block.w) >= canvas.w ? 0 : (newHead.x + block.w);

            return {
                ...state,
                value: {
                    ...state.value,
                    position: [newHead, ...snake],
                    tail: newTail,
                }
            }
        },
        moveDown: state => {
            const block = {...state.value.block};
            const canvas = {...state.value.canvas};
            const snake = [...state.value.position.map(item => ({...item}))];
            const newHead = {...snake[0]};
            const newTail = snake.pop();

            newHead.y = (newHead.y + block.h) >= canvas.h ? 0 : (newHead.y + block.h);

            return {
                ...state,
                value: {
                    ...state.value,
                    position: [newHead, ...snake],
                    tail: newTail,
                }
            }
        },
        addBlock: state => {
            const newBlock = {...state.value.tail}

            return {
                ...state,
                value: {
                    ...state.value,
                    position: [...state.value.position, newBlock],
                }
            }
        },
        addFood: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    food: action.payload,
                }
            }
        },
        setInitial: (state, action) => {
            state.value = action.payload;
        },
    }
})

export const { moveForward, moveLeft, moveRight, moveDown, addBlock, addFood, setInitial } = snakeSlice.actions;

export default snakeSlice.reducer;