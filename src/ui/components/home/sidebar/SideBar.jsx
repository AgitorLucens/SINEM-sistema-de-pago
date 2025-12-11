import NavLink from "../navlink/NavLink.jsx";
import { Page } from '../../../constant/Pages.jsx';
import { HomeIcon, CPUIcon, HardDriveIcon, SettingsIcon } from "../../icons/Icons.jsx";

const Sidebar = ({ currentPage, setCurrentPage }) => {

    return (
        <nav className="sidebar">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4f46e5', marginBottom: '1rem' }}>
                App SINEM
            </h1>

            <NavLink 
                icon={HomeIcon} 
                title="Panel Principal" 
                page={Page.DASHBOARD} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <NavLink 
                icon={HardDriveIcon} 
                title="Ingresos" 
                page={Page.PAYMENT_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <NavLink 
                icon={CPUIcon} 
                title="Egresos" 
                page={Page.EXPENSES_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />
            <NavLink 
                icon={HardDriveIcon} 
                title="Almacenamiento" 
                page={Page.STORAGE} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />
    
            <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }}></div>

            <NavLink 
                icon={SettingsIcon} 
                title="Configuración" 
                page={Page.SETTINGS} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <footer className="footer-text">
                Versión 1.0 (Offline)
            </footer>
        </nav>
    );
};

export default Sidebar;