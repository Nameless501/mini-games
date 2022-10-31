import { Link } from 'react-router-dom';
import '../assets/styles/Main.css';


function Main() {
    return (
        <div className="main">
            <h1 className="main__title">
                Choose game
            </h1>
            <ul className="main__links-list">
                <li className="main__links-list-item">
                    <Link to="/breakout" className="main__link">
                        <button className="main__link-button">
                            <p className="main__link-title">
                            Breakout
                            </p>
                        </button>
                    </Link>
                </li>
                <li className="main__links-list-item">
                    <Link to="/snake" className="main__link">
                        <button className="main__link-button">
                            <p className="main__link-title">
                                Snake
                            </p>
                        </button>
                    </Link>
                </li>
                <li className="main__links-list-item">
                    <Link to="/rock-paper-scissors" className="main__link">
                        <button className="main__link-button">
                            <p className="main__link-title">
                                Rock, paper, scissors
                            </p>
                        </button>
                    </Link>
                </li>
                <li className="main__links-list-item">
                    <Link to="/" className="main__link">
                        <button className="main__link-button">
                            <p className="main__link-title">
                                Placeholder
                            </p>
                        </button>
                    </Link>
                </li>
                <li className="main__links-list-item">
                    <Link to="/" className="main__link">
                        <button className="main__link-button">
                            <p className="main__link-title">
                                Placeholder
                            </p>
                        </button>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Main;