import { useState } from 'react';
import StartPopup from './StartPopup.js';
import InfoPopup from './InfoPopup.js';
import LinkButton from './LinkButton.js';
import InfoButton from './InfoButton.js';
import ControlButton from './ControlButton.js';
import '../assets/styles/ControlsFrame.css';

function ControlsFrame({ inGame, setStart, score, showButtons=false, buttonsList=null, handleClick, handlePause=null, children }) {
    const [infoIsOpen, setInfoState] = useState(false);

    function handleInfoOpen() {
        if(infoIsOpen) {
            setInfoState(false);
        } else {
            setInfoState(true);
        }

        if(handlePause) {
            handlePause();
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
                            isActive={infoIsOpen}
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
            {showButtons && <>
                <div className="control-buttons" >
                    <nav className="controls-buttons__navigation">
                        <ul className="controls-buttons__navigation-list" >
                            {buttonsList.map((item, ind) => {
                                return (
                                    <li key={ind} >
                                        <ControlButton 
                                            direction={item} 
                                            handleClick={handleClick}
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>
            </>}
        </div>
    );
}

export default ControlsFrame;