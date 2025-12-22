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