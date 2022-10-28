import { FRAME_SIZES } from './constants.js'

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function getBlockSize() {
    const windowWidth = window.innerWidth;
    const blockSize = windowWidth > 1023 ? 40 : 
        windowWidth > 767 ? 30 : windowWidth > 550 ? 25 : 20;
    return blockSize
}

export function getFrameSize() {
    const windowWidth = window.innerWidth;
    const frameSize = windowWidth > 1023 ? FRAME_SIZES['1280'] : windowWidth > 767 ? FRAME_SIZES['1023'] :
        windowWidth > 550 ? FRAME_SIZES['767'] : FRAME_SIZES['550'];
    return frameSize;
}