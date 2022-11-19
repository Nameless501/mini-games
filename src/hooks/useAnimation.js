import { useRef } from "react";

function useAnimation() {
    const animationRef = useRef();
    let currentAnimation;

    function setAnimationStart(animation) {
        animationRef.current = window.requestAnimationFrame(animation);

        currentAnimation = animation;
    }

    function setAnimationEnd() {
        cancelAnimationFrame(animationRef.current);
    }

    function setAnimationPause(prop, animation = null) {
        if(prop) {
            setAnimationEnd();
        } else if(currentAnimation) {
            setAnimationStart(currentAnimation);
        } else if(animation) {
            setAnimationStart(animation);
        }
    }

    return { setAnimationStart, setAnimationEnd, setAnimationPause };
}

export default useAnimation;