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

    function getTriangleHeight(ball, x1, y1, x2, y2, side) {
        const xTop = Math.abs(ball.x - x1);
        const yTop = Math.abs(ball.y - y1);

        const xBot = Math.abs(ball.x - x2);
        const yBot = Math.abs(ball.y - y2);

        const topDist = Math.sqrt(xTop * xTop + yTop * yTop);
        const botDist = Math.sqrt(xBot * xBot + yBot * yBot);

        const p = (topDist + botDist + side) / 2;

        const triangleS = Math.sqrt(p * (p - topDist)*(p - botDist)*(p - side));
        const triangleHeight = (triangleS * 2) / side;

        return triangleHeight;
    }

    function getDistance(ball, x, y) {
        const distX = Math.abs(ball.x - x);
        const distY = Math.abs(ball.y - y);
        const distance = Math.sqrt(distX * distX + distY * distY);
        return (distance - ball.r);
    }

    function circleWithRectCollision(targetData, blockData) {
        const blockTop = blockData.y - (blockData.h / 2);
        const blockBottom = blockData.y + (blockData.h / 2);
        const blockLeft = blockData.x - (blockData.w / 2);
        const blockRight = blockData.x + (blockData.w / 2);

        const leftTopCorner = getDistance(targetData, blockLeft, blockTop);
        const rightTopCorner = getDistance(targetData, blockRight, blockTop);
        const leftBottomCorner = getDistance(targetData, blockLeft, blockBottom);
        const rightBottomCorner = getDistance(targetData, blockRight, blockBottom);

        const insideY = (targetData.y + targetData.r) >= blockTop && 
        (targetData.y - targetData.r) <= blockBottom;

        const insideX = (targetData.x + targetData.r) >= blockLeft && 
        (targetData.x - targetData.r) <= blockRight;

        let sideCollision = false;
        let verticalCollision = false;

        if(insideY) {
            const distance = getTriangleHeight(targetData, blockData.x, blockTop, blockData.x, blockBottom, blockData.h);

            sideCollision = ((distance - (blockData.w / 2) - targetData.r)) < 1 ? true : false;
        } 
        
        if (insideX) {
            const distance = getTriangleHeight(targetData, blockLeft, blockData.y, blockRight, blockData.y, blockData.w);

            verticalCollision = ((distance - (blockData.h / 2) - targetData.r)) < 1 ? true : false;
        }

        const cornerCollision = leftTopCorner < 1 || rightTopCorner < 1 || leftBottomCorner < 1 || rightBottomCorner < 1;

        return [sideCollision, verticalCollision, cornerCollision];
    }

    function circleWithFrameCollision(ball, frameWidth, frameHeight) {
        const overflowRight = (getTriangleHeight(ball, 0, 0, 0, frameHeight, frameHeight) - ball.r) < 1;
        const overflowLeft = (getTriangleHeight(ball, frameWidth, 0, frameWidth, frameHeight, frameHeight) - ball.r) < 1;
        const overflowTop = (getTriangleHeight(ball, 0, 0, frameWidth, 0, frameWidth) - ball.r) < 1;
        const overflowBottom = (getTriangleHeight(ball, 0, frameHeight, frameWidth, frameHeight, frameWidth) - ball.r) < 1;

        return [overflowRight, overflowLeft, overflowTop, overflowBottom];
    }

    return [checkFrameOverflow, checkCollision, circleWithRectCollision, circleWithFrameCollision];
}

export default useCollisionCheck;