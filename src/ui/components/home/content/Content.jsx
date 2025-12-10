import { Page } from '../../../constant/Pages.jsx'; 
import Payments from '../../../pages/payments/Payments.jsx';

const Content = ({ page }) => {
  let title, description;

  switch (page) {
    case Page.DASHBOARD:
      title = "Panel Principal";
      description = "Bienvenido a la aplicación de gestion de pagos del SINEM";
      break;
    case Page.SYSTEM:
      title = "Estado del Sistema";
      description = "Monitoreo de los recursos de la máquina local. Todos los datos mostrados provienen de la API de Electron y son accesibles sin conexión a Internet.";
      break;
    case Page.STORAGE:
      title = "Archivos y Almacenamiento";
      description = "Gestión segura de archivos locales de la institución. Las operaciones de lectura y escritura se realizan directamente en el disco duro.";
      break;
    case Page.SETTINGS:
      title = "Configuración Local";
      description = "Ajustes de la aplicación, incluyendo preferencias de idioma, tema (si estuviera implementado) y configuración de la base de datos local.";
      break;
    case Page.PAYMENT_REGISTRY:
        // Renderiza el componente completo de gestión de pagos
        return (
          <div className="p-8 w-full max-w-7xl mx-auto">
            <Payments />
          </div>
        );
    default:
      title = "Página No Encontrada";
      description = "Error de navegación. Por favor, selecciona un enlace del menú lateral.";
  }

  return (
    <div className="content-area">
      <h1 className="main-header">{title}</h1>
      <div className="info-card">
        <h2 className="card-title">Información del Módulo</h2>
        <p className="card-text">{description}</p>
      </div>
      
      <p className="card-text" style={{ marginTop: '2rem' }}>
        Pagina Inicial
      </p>
    </div>
  );
};

export default Content;