import { useState } from 'react';
import StartPopup from './StartPopup.js';
import InfoPopup from './InfoPopup.js';
import LinkButton from './LinkButton.js';
import InfoButton from './InfoButton.js';
import '../assets/styles/ControlsFrame.css';

function ControlsFrame({ inGame, setStart, score, children }) {
    const [infoIsOpen, setInfoState] = useState(false);

    function handleInfoOpen() {
        if(infoIsOpen) {
            setInfoState(false);
        } else {
            setInfoState(true);
        }
    }

    return (
        <div className="controls-frame">
            <nav className="controls-frame__navigation">
                <ul className="controls-frame__navigation-list" >
                    <li>
                        <LinkButton />
                    </li>
                    <li>
                        <InfoButton 
                            handleClick={handleInfoOpen}
                        />
                    </li>
                </ul>
            </nav>
            <div className="controls-frame__frame" >
                {children}
                <StartPopup 
                    inGame={inGame}
                    setStart={setStart}
                    score={score}
                />
                <InfoPopup 
                    isOpen={infoIsOpen}
                />
            </div>
        </div>
    );
}

export default ControlsFrame;