import '../assets/styles/InfoButton.css';

function InfoButton({ handleClick }) {
    return (
        <button 
            type="button" 
            className="info-button" 
            onClick={handleClick}
        >
            <div className="info-button__icon" />
        </button>
    );
}

export default InfoButton;