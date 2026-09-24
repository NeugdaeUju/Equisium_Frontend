import { useNavigate, NavLink} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import '../assets/styles/sidebar.css'

function Sidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    const navClass = ({isActive } : {isActive: boolean}) =>
        isActive ? 'navigation-block-link active' : 'navigation-block-link';

    const total = useAppSelector((state) => state.horses.total);

    return (
        <header>
            <div className='header-block'>
                <h1 className='header-title'>Ecurie</h1>
                <span className='header-subtitle'>EQUIDOEW MANAGER</span>
            </div>

            <nav>
                <div className='navigation-block'>
                    <h2 className='navigation-block-title'>Général</h2>
                    <ul>
                        <NavLink to='/dashboard' className={navClass}>Tableau de bord</NavLink>
                        <NavLink to='/horses' className={navClass}>
                            Mes chevaux
                            <span className='num'>{total}</span>
                        </NavLink>
                    </ul>
                </div>
                <div className='navigation-block'>
                    <h2 className='navigation-block-title'>Elevage</h2>
                    <ul>
                        <li className='navigation-block-link'>Reproduction</li>
                        <li className='navigation-block-link'>Concours</li>
                    </ul>
                </div>
                <div className='navigation-block'>
                    <h2 className='navigation-block-title'>Suivi</h2>
                    <ul>
                        <li className='navigation-block-link'>Progression BLUP</li>
                        <li className='navigation-block-link'>Planning</li>
                        <li className='navigation-block-link'>Paramètres</li>
                    </ul>
                </div>
            </nav>

            <div className='sidebar-footer'>
                <button type='button' className='logout-button' onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </header>
    )
}

export default Sidebar;