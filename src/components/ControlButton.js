import '../assets/styles/ControlButton.css';

function ControlButton({ keyCode, handleClick }) {
    function onClick() {
        handleClick(keyCode);
    }

    return (
        <button 
            type="button"
            className={`control-button control-button_${keyCode}`} 
            onClick={onClick}
        >
            <div className="control-button__line" />
            <div className="control-button__line" />
            <div className="control-button__line" />
        </button>
    );
}

export default ControlButton;