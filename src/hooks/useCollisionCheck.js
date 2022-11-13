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

    function checkSideCollision(targetData, blockData) {
        const collisionTop = Math.floor(blockData.top - targetData.bottom) <= 0 && Math.floor(blockData.top - targetData.bottom) > -4;
        const collisionRight = Math.round(blockData.left - targetData.right) <= 0 && Math.round(blockData.left - targetData.right) > -4;
        const collisionLeft = Math.round(targetData.left - blockData.right) <= 0 && Math.round(targetData.left - blockData.right) > -4;
        const collisionBottom = Math.round(targetData.top - blockData.bottom) <= 0 && Math.round(targetData.top - blockData.bottom) > -4;

        const collision = checkCollision(targetData, blockData);

        return [collision, collisionTop, collisionRight, collisionLeft, collisionBottom] 
    }

    return [checkFrameOverflow, checkCollision, checkSideCollision];
}

export default useCollisionCheck;