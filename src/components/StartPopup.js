import '../assets/styles/StartPopup.css';

function StartPopup({ inGame, setStart, score }) {
    function handleClick() {
        setStart();
    }

    return (
        <div className={`start-popup ${!inGame && 'start-popup_active'}`}>
            {score > 0 && 
                <div className="start-popup__score" >
                    Your score: 
                    <span className="start-popup__score-counter">
                        {score}
                    </span>
                </div>
            }
            <button 
                type="button" 
                className="start-popup__button" 
                onClick={handleClick}
            >
                Start
            </button>
        </div>
    );
}

export default StartPopup;