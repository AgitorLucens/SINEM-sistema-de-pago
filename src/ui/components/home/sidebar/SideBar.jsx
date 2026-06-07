import NavLink from "../navlink/NavLink.jsx";
import { Page } from '../../../constant/Pages.jsx';
import { HomeIcon, IconArrowDownLeft, TeacherIcon, TrendingUp} from "../../icons/Icons.jsx";
import { ClipboardIcon, PersonIcon, ExitIcon, FileTextIcon, ArrowBottomLeftIcon,
         ChevronLeftIcon, ChevronRightIcon, Pencil2Icon,
         ReaderIcon, GearIcon  } from "@radix-ui/react-icons";

import {useState, useCallback, useMemo, useEffect} from "react";
import './sidebar.css';
const Sidebar = ({ currentPage, setCurrentPage, isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
    const [localIsOpen, setLocalIsOpen] = useState(true);
    
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
    const setIsOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setLocalIsOpen;

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');
        const handler = (e) => {
            if (typeof externalSetIsOpen !== 'function') {
                setLocalIsOpen(!e.matches);
            }
        };
        handler(mq);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [externalSetIsOpen]);

    const handleToggle = useCallback(() => {
        if (typeof setIsOpen === 'function') {
            setIsOpen(!isOpen);
        }
    }, [isOpen, setIsOpen]);

    const navItems = useMemo(() => [
        { icon: HomeIcon, title: "Panel Principal", page: Page.DASHBOARD },
        { icon: ClipboardIcon, title: "Ingresos", page: Page.PAYMENT_REGISTRY },
        { icon: ArrowBottomLeftIcon, title: "Egresos", page: Page.EXPENSES_REGISTRY },
        { icon: PersonIcon, title: "Estudiantes", page: Page.STUDENTS_REGISTRY },
        { icon: TeacherIcon, title: "Profesores", page: Page.TEACHERS_REGISTRY },
        { icon: Pencil2Icon, title: "Cursos", page: Page.PRICING_REGISTRY },
        { icon: ReaderIcon, title: "Reporte", page: Page.REPORT_REGISTRY },
        { icon: FileTextIcon, title: "Exportar", page: Page.EXPORT_REGISTRY },
    ], []);

    const footerItems = useMemo(() => [
        { icon: GearIcon, title: "Configuración", page: Page.SETTINGS_REGISTRY, onClick: setCurrentPage },
        { icon: ExitIcon, title: "Salir", page: Page.SETTINGS, onClick: () => { window.api.quitApp(); } },
    ], [setCurrentPage]);

    return (
        <nav className="sidebar" style={{ width: isOpen ? '16rem' : '5rem' }} aria-label="Navegación principal">
            <button className="toggle-btn" onClick={handleToggle} aria-label={isOpen ? "Colapsar menú" : "Expandir menú"}>
                {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>

            <div className={`flex items-center mb-6 ${isOpen ? 'px-2' : 'justify-center'}`}>
                {isOpen && (
                    <span className="ml-3 font-bold text-indigo-600 text-lg">SINEM</span>
                )}
            </div>

            <ul className="nav-list" aria-label="Secciones">
                {navItems.map(({ icon, title, page }) => (
                    <li key={page}>
                        <NavLink
                            icon={icon}
                            title={title}
                            page={page}
                            currentPage={currentPage}
                            onClick={setCurrentPage}
                            isOpen={isOpen}
                        />
                    </li>
                ))}
            </ul>

            <div className="mt-auto border-t pt-4">
                {footerItems.map(({ icon, title, page, onClick }) => (
                    <NavLink
                        key={page}
                        icon={icon}
                        title={title}
                        page={page}
                        currentPage={currentPage}
                        onClick={onClick}
                        isOpen={isOpen}
                    />
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;