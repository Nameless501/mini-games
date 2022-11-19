function useCollisionCheck() {
    function rectWithFrameCollision(targetData, frameWidth, frameHeight) {
        const left = targetData.x;
        const right = targetData.x + targetData.w;
        const top = targetData.y;
        const bottom = targetData.y + targetData.h;

        return {
            overflowRight: right > frameWidth,
            overflowLeft: left < 0,
            overflowTop: top < 0,
            overflowBottom: bottom > frameHeight,
        }
    }

    function rectCollision(targetData, blockData) {
        const targetLeft = targetData.x;
        const targetRight = targetData.x + targetData.w;
        const targetTop = targetData.y;
        const targetBottom = targetData.y + targetData.h;

        const blockLeft = blockData.x;
        const blockRight = blockData.x + blockData.w;
        const blockTop = blockData.y;
        const blockBottom = blockData.y + blockData.h;

        const collision = targetRight > blockLeft && targetLeft < blockRight &&
            targetBottom > blockTop && targetTop < blockBottom;

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

        if(insideY) {
            const leftDistance = getTriangleHeight(targetData, blockLeft, blockTop, blockLeft, blockBottom, blockData.h);
            const rightDistance = getTriangleHeight(targetData, blockRight, blockTop, blockRight, blockBottom, blockData.h);

            var collisionLeft = (leftDistance - targetData.r) < 1;
            var collisionRight = (rightDistance - targetData.r) < 1;
        } 
        
        if (insideX) {
            const topDistance = getTriangleHeight(targetData, blockRight, blockTop, blockLeft, blockTop, blockData.w);
            const bottomDistance = getTriangleHeight(targetData, blockRight, blockBottom, blockLeft, blockBottom, blockData.w);

            var collisionTop = (topDistance - targetData.r) < 1;
            var collisionBottom = (bottomDistance - targetData.r) < 1;
        }

        const sideCollision = {
            top: collisionTop,
            bottom: collisionBottom,
            left: collisionLeft,
            right: collisionRight,
        }

        const cornerCollision = {
            leftTopCorner: leftTopCorner < 1, 
            rightTopCorner: rightTopCorner < 1,
            leftBottomCorner: leftBottomCorner < 1,
            rightBottomCorner: rightBottomCorner < 1,
        }

        return { sideCollision, cornerCollision };
    }

    function circleWithFrameCollision(ball, frameWidth, frameHeight) {
        const overflowRight = (getTriangleHeight(ball, 0, 0, 0, frameHeight, frameHeight) - ball.r) < 1;
        const overflowLeft = (getTriangleHeight(ball, frameWidth, 0, frameWidth, frameHeight, frameHeight) - ball.r) < 1;
        const overflowTop = (getTriangleHeight(ball, 0, 0, frameWidth, 0, frameWidth) - ball.r) < 1;
        const overflowBottom = (getTriangleHeight(ball, 0, frameHeight, frameWidth, frameHeight, frameWidth) - ball.r) < 1;

        return [overflowRight, overflowLeft, overflowTop, overflowBottom];
    }

    return { rectWithFrameCollision, rectCollision, circleWithRectCollision, circleWithFrameCollision };
}

export default useCollisionCheck;