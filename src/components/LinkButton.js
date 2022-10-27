import { Link } from 'react-router-dom';
import '../assets/styles/LinkButton.css';

function LinkButton() {
    return (
        <Link to='/' >
            <button type="button" className="link-button">
                <div className="link-button__line"></div>
                <div className="link-button__line"></div>
                <div className="link-button__line"></div>
            </button>
        </Link>
    );
}

export default LinkButton;