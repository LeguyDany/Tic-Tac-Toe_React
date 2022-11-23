// ====================================================== Notice ======================================================
// Very short file which contains component of the header.

// ====================================================== Imports ======================================================
import './index.css';

// ====================================================== Component ======================================================
export function Header () {
    return(
        <header>
            <a className="black0" href="/">
                <div>Play locally</div>
            </a>
            <a className="black1" href="Multi">
                <div>Play online</div>
            </a>
        </header>
    )
}