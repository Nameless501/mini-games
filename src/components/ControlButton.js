import '../assets/styles/ControlButton.css';

function ControlButton({ direction, handleClick }) {
    function onClick() {
        handleClick(direction);
    }

    return (
        <button 
            type="button"
            className={`control-button control-button_${direction}`} 
            onClick={onClick}
        >
            <div className="control-button__line" />
            <div className="control-button__line" />
            <div className="control-button__line" />
        </button>
    );
}

export default ControlButton;