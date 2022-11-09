function useMousePosition() {
    function getPositionInCanvas(evt, canvas) {
        const canvasPosition = canvas.parentElement.getBoundingClientRect();

        const x = evt.pageX - canvasPosition.x;
        const y = evt.pageY - canvasPosition.y;

        return [x, y];
    }

    return getPositionInCanvas;
}

export default useMousePosition;