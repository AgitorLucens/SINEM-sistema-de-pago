const IconBase = (props) => (
  <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
);

export const ColonIcon = (props) => (
  <svg
    {...props}
    // Usamos el viewBox del SVG original para mantener la forma
    // pero lo ajustamos ligeramente para que se centre en el área 24x24
    viewBox="19.79 19.962 278.029 428.302"
    fill="currentColor"
    width="24" // Aseguramos que el tamaño visible sea 24x24
    height="24"
  >
    {/* Este path es la forma compleja y detallada del Símbolo de Colones (₡) */}
    <path
      fillOpacity="1"
      stroke="none"
      d="m232.977 114.916-84.395 242.31q15.66 6.09 35.672 6.09 52.638 0 97.01-42.632l1.306-1.306 7.83 7.831q-3.48 6.525-18.27 19.576-41.33 35.672-99.622 35.672-16.53 0-31.757-3.045l-20.011 57.424h-15.661l21.316-60.904q-11.31-2.61-25.231-9.57l-24.797 70.474h-15.66l27.406-77.87q-60.904-40.023-60.904-126.593 0-74.39 52.203-117.022 40.458-33.062 95.706-33.062 6.09 0 9.136.435L202.09 31.39h15.661L199.48 84.029q10.44 1.305 26.536 6.09l20.447-58.728h15.66l-21.75 62.644q7.83 2.61 11.31 2.61 16.53 0 20.011-14.356h9.136l3.915 97.88H274.74q-10.44-43.5-41.762-65.253m-13.05-6.96q-12.617-5.656-26.103-7.396L112.04 334.604q10.005 10.006 23.057 16.966zm-41.762-8.265q-46.549.87-73.955 36.542-26.537 34.803-26.537 97.011 0 53.945 23.492 88.31l77.87-221.863z"
    />
  </svg>
);

export const ChevronUpDownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
);

export const FileExcel = () => (
    <svg width="32" 
         height="32" 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="currentColor" 
         strokeWidth="1.5" 
         strokeLinecap="round" 
         strokeLinejoin="round" 
         style={{ color: '#10b981' }}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M8 13h2"/>
      <path d="M8 17h2"/>
      <path d="M14 13h2"/>
      <path d="M14 17h2"/>
    </svg>
);

export const DataBaseUpload = () => (
    <svg
      width="52"
      height="52"
      viewBox="0 0 32 32"
      style={{ color: '#4f46e5' }}
    >
      <ellipse 
                cx="14" 
                cy="8" 
                rx="11" 
                ry="6" 
                fill="currentColor" 

                stroke="currentColor" 
                strokeWidth="1.5"
            ></ellipse>
            <path 
                d="M14 24c-4.8 0-8.8-1.4-11-3.6V24c0 3.4 4.8 6 11 6 .9 0 1.8-.1 2.7-.2-1.5-1.5-2.4-3.6-2.7-5.8M3 12.4V16c0 3.4 4.8 6 11 6h.1c.2-2.4 1.4-4.6 3-6.2-1 .1-2 .2-3.1.2-4.8 0-8.8-1.4-11-3.6M24 15c-4.4 0-8 3.6-8 8 0 4.1 3.1 7.4 7 7.9v-8.5l-1.3 1.3c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l3-3c.1-.1.2-.2.3-.2.2-.1.5-.1.8 0 .1.1.2.1.3.2l3 3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3s-.5-.1-.7-.3L25 22.4v8.5c3.9-.5 7-3.9 7-7.9 0-4.4-3.6-8-8-8" 
                fill="currentColor"
            ></path>
        </svg>
);

export const SearchIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const HomeIcon = (props) => (
  <IconBase {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </IconBase>
);

export const TrendingUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18">
    </polyline>
    <polyline points="17 6 23 6 23 12">
    </polyline>
  </svg>
);

export const TrendingDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6">
    </polyline>
    <polyline points="17 18 23 18 23 12">
    </polyline>
  </svg>
);

export const TeacherIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Marco de la pizarra */}
    <rect x="3" y="4" width="14" height="10" rx="2" />
    
    {/* Patas/Soporte de la pizarra */}
    <path d="M7 14v4" />
    <path d="M13 14v4" />
    <path d="M5 18h10" />
    
    {/* El Puntero o Vara de enseñanza */}
    <path d="M15 11l6 7" />
    
    {/* Líneas que sugieren contenido en la pizarra */}
    <path d="M7 8h6" />
    <path d="M7 11h3" />
  </svg>
);


export const Users = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2">
    </path>
    <circle cx="9" cy="7" r="4">
    </circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87">
    </path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75">
    </path>
  </svg>
);
export const FileText = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">
    </path>
    <polyline points="14 2 14 8 20 8">
    </polyline>
    <line x1="16" y1="13" x2="8" y2="13">
    </line>
    <line x1="16" y1="17" x2="8" y2="17">
    </line>
    <polyline points="10 9 9 9 8 9">
    </polyline>
</svg>
);

export const Download = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4">
    </path>
    <polyline points="7 10 12 15 17 10">
    </polyline>
    <line x1="12" y1="15" x2="12" y2="3">
    </line>
  </svg>
);

export const CreditCard = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V11.5C14 12.3284 13.3284 13 12.5 13H2.5C1.67157 13 1 12.3284 1 11.5V3.5ZM2.5 3C2.22386 3 2 3.22386 2 3.5V4H13V3.5C13 3.22386 12.7761 3 12.5 3H2.5ZM13 6H2V11.5C2 11.7761 2.22386 12 2.5 12H12.5C12.7761 12 13 11.7761 13 11.5V6ZM3.5 9H5.5V10H3.5V9Z" 
          fill="currentColor" />
  </svg>
)

export const CashIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Contorno del billete */}
    <rect x="2" y="6" width="20" height="12" rx="2" />
    {/* Círculo central (Moneda/Sello) */}
    <circle cx="12" cy="12" r="3" />
    {/* Detalles laterales del billete */}
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export const StudentIcon = (props) => (
  <IconBase {...props}>
    {/* Gorro de graduación (parte superior) */}
    <path d="M10.2 2.5a.5.5 0 0 1 .6 0l10.2 6.3a.5.5 0 0 1 .2.4v9.6a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5V9.2a.5.5 0 0 1 .2-.4z" fill="currentColor" stroke="none"/>
    {/* Cabeza (círculo) */}
    <circle cx="12" cy="14" r="4" stroke="white" fill="white" />
    {/* Cuerpo (base de persona) */}
    <path d="M18 21.5a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5z" stroke="currentColor" fill="currentColor"/>
    {/* Ajuste al path de la persona para que se vea como persona con birrete */}
    <path d="M12 17c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z" stroke="currentColor" fill="currentColor"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" fill="white" />
    <path d="M10 5l4 0" /> {/* Trazo de la borla del birrete */}
  </IconBase>
);

export const MatriculaIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 002-2v-5" />
  </svg>
);

export const MensualidadIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="16" r="2" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 14v4M10 16h4" />
  </svg>
);

export const OtrosIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21.17 3.06a2.1 2.1 0 0 1 0 2.97L11.08 16.12l-4.24 1.41 1.41-4.24L18.34 3.19a2.12 2.12 0 0 1 2.83-.13z" />
    <path d="M14 7l3 3" />
    <path d="M5 11l-2 2v7a1 1 0 0 0 1 1h7l2-2" />
  </svg>
);

export const IconArrowDownLeft = (props) => (
  <IconBase {...props}>
      <path d="M12 5v14"/>
      <path d="M19 12l-7 7-7-7"/>
  </IconBase>
);

export const HardDriveIcon = (props) => (
  <IconBase {...props}>
    <line x1="22" y1="12" x2="2" y2="12"></line>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
    <line x1="6" y1="16" x2="6.01" y2="16"></line>
    <line x1="10" y1="16" x2="10.01" y2="16"></line>
  </IconBase>
);

export const CPUIcon = (props) => (
  <IconBase {...props}>
    <rect x="5" y="5" width="14" height="14" rx="2"></rect>
    <path d="M9 9h6v6H9z"></path>
    <path d="M12 1v2"></path>
    <path d="M12 21v2"></path>
    <path d="M1 12h2"></path>
    <path d="M21 12h2"></path>
    <path d="M4.2 4.2l1.4 1.4"></path>
    <path d="M18.4 18.4l1.4 1.4"></path>
    <path d="M4.2 19.8l1.4-1.4"></path>
    <path d="M18.4 5.6l1.4-1.4"></path>
  </IconBase>
);

export const SettingsIcon = (props) => (
  <IconBase {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1 0 0 2 2 0 0 0-2 2v.44a2 2 0 0 1 0 0 2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2-2v-.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </IconBase>
);

export const PlusIcon = (props) => (
  <IconBase {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </IconBase>
);

export const TrashIcon = (props) => (
  <IconBase {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </IconBase>
);

export const PieDiagramIcon = () => (
  <svg 
      width="32"
      height="32"
      viewBox="0 0 24 24"
      stroke= "#a78bfa"
      strokeWidth= "1.5"
      fill= "none"
      strokeLinecap="round" 
      strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
)