import NavLink from "../navlink/NavLink.jsx";
import { Page } from '../../../constant/Pages.jsx';
import { HomeIcon, IconArrowDownLeft, ColonIcon, TrendingUp} from "../../icons/Icons.jsx";
import { ClipboardIcon, PersonIcon, ExitIcon, FileTextIcon, ArrowBottomLeftIcon,
         ChevronLeftIcon, ChevronRightIcon, Pencil2Icon  } from "@radix-ui/react-icons";

import {useState} from "react";
import './sidebar.css';
const Sidebar = ({ currentPage, setCurrentPage, isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
    const [localIsOpen, setLocalIsOpen] = useState(true);
    
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
    const setIsOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setLocalIsOpen;

    const handleToggle = () => {
        if (typeof setIsOpen === 'function') {
            setIsOpen(!isOpen);
        }
    };

    return (
        <>
            <nav className="sidebar" style={{ width: isOpen ? '16rem' : '5rem' }}>
                {/* Botón de Colapso */}
                <button className="toggle-btn" onClick={handleToggle}>
                    {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </button>

                {/* Header Logo */}
                <div className={`flex items-center mb-6 ${isOpen ? 'px-2' : 'justify-center'}`}>
                    {isOpen && (
                        <span className="ml-3 font-bold text-indigo-600 text-lg">SINEM</span>
                    )}
                </div>

                {/* Menú de Navegación */}
                <div className="">
                    <NavLink 
                        icon={HomeIcon} 
                        title="Panel Principal" 
                        page={Page.DASHBOARD} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                    <NavLink 
                        icon={ClipboardIcon} 
                        title="Ingresos" 
                        page={Page.PAYMENT_REGISTRY} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                    <NavLink 
                        icon={ArrowBottomLeftIcon} 
                        title="Egresos" 
                        page={Page.EXPENSES_REGISTRY} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                    <NavLink 
                        icon={PersonIcon} 
                        title="Estudiantes" 
                        page={Page.STUDENTS_REGISTRY} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                    <NavLink 
                        icon={Pencil2Icon} 
                        title="Precios" 
                        page={Page.PRICING_REGISTRY} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                    <NavLink 
                        icon={FileTextIcon} 
                        title="Exportar" 
                        page={Page.EXPORT_REGISTRY} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                </div>

                {/* Footer */}
                <div className="mt-auto border-t pt-4">
                    <NavLink 
                        icon={ExitIcon} 
                        title="Salir" 
                        page={Page.SETTINGS} 
                        currentPage={currentPage} 
                        onClick={setCurrentPage}
                        isOpen={isOpen}
                    />
                </div>
            </nav>
        </>
    );
};

export default Sidebar;