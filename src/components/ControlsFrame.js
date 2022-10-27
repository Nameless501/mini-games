import { useEffect, useRef } from 'react';
import StartPopup from './StartPopup';
import LinkButton from './LinkButton.js';
import InfoButton from './InfoButton.js';
import '../assets/styles/ControlsFrame.css';

function ControlsFrame({ inGame, setStart, score, setFrameSize, children }) {
    const frame = useRef();

    useEffect(() => {
        const frameHeight = frame.current.clientHeight;
        const frameWidth = frame.current.clientWidth;

        setFrameSize({
            x: frameWidth,
            y: frameHeight,
        })
    }, []);

    return (
        <div className="controls-frame">
            <nav className="controls-frame__navigation">
                <ul className="controls-frame__navigation-list" >
                    <li>
                        <LinkButton />
                    </li>
                    <li>
                        <InfoButton />
                    </li>
                </ul>
            </nav>
            <div className="controls-frame__frame" ref={frame} >
                {children}
                <StartPopup 
                    inGame={inGame}
                    setStart={setStart}
                    score={score}
                />
            </div>
        </div>
    );
}

export default ControlsFrame;