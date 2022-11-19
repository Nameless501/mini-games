import { FONT_SIZE } from '../utils/constants.js'

function useFiguresRender(currentColor) {
    function renderCircle(canvas, x, y, radius, color=currentColor) {
        canvas.beginPath();
        canvas.fillStyle = color;
        canvas.arc(x, y, radius, 0, Math.PI * 2, false);
        canvas.fill();
        canvas.closePath();
    }

    function renderRect(canvas, x, y, width, height, color=currentColor) {
        canvas.fillStyle = color;
        canvas.fillRect(x, y, width, height);
    }

    function renderEllipse(canvas, x, y, width, height, color=currentColor) {
        canvas.beginPath();
        canvas.ellipse(x, y, width, height, 0, 0, Math.PI * 2, true);
        canvas.strokeStyle = color;
        canvas.stroke();
        canvas.closePath();
    }

    function renderText(canvas, text, x, y, fontSize=FONT_SIZE, color=currentColor) {
        canvas.font = `${fontSize}px Segoe UI`;
        canvas.fillStyle = color;
        canvas.fillText(text, x, y);
    }

    function clearCanvas(canvasContext) {
        const width = canvasContext.canvas.offsetWidth;
        const height = canvasContext.canvas.offsetHeight;

        canvasContext.clearRect(0, 0, width, height);
    }

    return { renderCircle, renderRect, renderEllipse, renderText, clearCanvas };
}

export default useFiguresRender;