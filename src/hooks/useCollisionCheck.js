function useCollisionCheck() {
    function checkFrameOverflow(targetData, frameWidth, frameHeight) {
        const overflowRight = targetData.right >= frameWidth;
        const overflowLeft = targetData.left <= 0;
        const overflowTop = targetData.top <= 0 
        const overflowBottom = targetData.bottom >= frameHeight;

        return [overflowRight, overflowLeft, overflowTop, overflowBottom];
    }

    function checkCollision(targetData, blockData) {
        const collision = targetData.right >= blockData.left && 
            targetData.left <= blockData.right &&
            targetData.bottom >= blockData.top && 
            targetData.top <= blockData.bottom; 

        return collision;
    }

    return [checkFrameOverflow, checkCollision];
}

export default useCollisionCheck;