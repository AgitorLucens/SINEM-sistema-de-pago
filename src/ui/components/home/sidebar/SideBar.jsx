import NavLink from "../navlink/NavLink.jsx";
import { Page } from '../../../constant/Pages.jsx';
import { HomeIcon, IconArrowDownLeft, ColonIcon} from "../../icons/Icons.jsx";
import { ClipboardIcon, PersonIcon, ExitIcon, FileTextIcon } from "@radix-ui/react-icons";

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
                icon={ClipboardIcon} 
                title="Ingresos" 
                page={Page.PAYMENT_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <NavLink 
                icon={IconArrowDownLeft} 
                title="Egresos" 
                page={Page.EXPENSES_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />
            <NavLink 
                icon={PersonIcon} 
                title="Estudiantes" 
                page={Page.STUDENTS_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <NavLink 
                icon={PersonIcon} 
                title="Precios" 
                page={Page.PRICING_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <NavLink 
                icon={FileTextIcon} 
                title="Exportar" 
                page={Page.EXPORT_REGISTRY} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
            />

            <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }}></div>

            <NavLink 
                icon={ExitIcon} 
                title="Salir" 
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