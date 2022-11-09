import { COLOR_LIGHT, FONT_SIZE } from '../utils/constants.js'

function useFiguresRender() {
    function renderCircle(canvas, x, y, radius, color=COLOR_LIGHT) {
        canvas.beginPath();
        canvas.fillStyle = color;
        canvas.arc(x, y, radius, 0, Math.PI * 2, false);
        canvas.fill();
        canvas.closePath();
    }

    function renderRect(canvas, x, y, width, height, color=COLOR_LIGHT) {
        canvas.fillStyle = color;
        canvas.fillRect(x, y, width, height);
    }

    function renderEllipse(canvas, x, y, width, height, color=COLOR_LIGHT) {
        canvas.beginPath();
        canvas.ellipse(x, y, width, height, 0, 0, Math.PI * 2, true);
        canvas.strokeStyle = color;
        canvas.stroke();
        canvas.closePath();
    }

    function renderText(canvas, text, x, y, fontSize=FONT_SIZE, color=COLOR_LIGHT) {
        canvas.font = `${fontSize}px Segoe UI`;
        canvas.fillStyle = color;
        canvas.fillText(text, x, y);
    }

    return [renderCircle, renderRect, renderEllipse, renderText];
}

export default useFiguresRender;