import '../assets/styles/InfoButton.css';

function InfoButton({ handleClick, isActive }) {
    return (
        <button 
            type="button" 
            className="info-button" 
            onClick={handleClick}
        >
            <div className={`info-button__icon ${isActive && 'info-button__icon_active'}`} />
        </button>
    );
}

export default InfoButton;