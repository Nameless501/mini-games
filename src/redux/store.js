import { configureStore } from '@reduxjs/toolkit';
import snakeReducer from './snakeSlice.js';

export default configureStore({
    reducer: {
        snake: snakeReducer
    },
})