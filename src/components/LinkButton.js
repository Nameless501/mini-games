import { Link } from 'react-router-dom';
import '../assets/styles/LinkButton.css';

function LinkButton() {
    return (
        <Link to='/' >
            <button type="button" className="link-button">
                <div className="link-button__line" />
                <div className="link-button__line" />
                <div className="link-button__line" />
            </button>
        </Link>
    );
}

export default LinkButton;