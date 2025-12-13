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