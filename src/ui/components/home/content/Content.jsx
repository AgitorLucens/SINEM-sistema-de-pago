import { Page } from '../../../constant/Pages.jsx'; 
import Payments from '../../../pages/payments/Payments.jsx';
import Expenses from '../../../pages/expenses/Expenses.jsx';
import Students from '../../../pages/students/Students.jsx';
import Pricing from  '../../../pages/pricing/Pricing.jsx';
import Export from   '../../../pages/export/Export.jsx';
import Report from '../../../pages/report/Report.jsx';

import './page.css';
const Content = ({ page }) => {
  let title, description;

  switch (page) {
    case Page.DASHBOARD:
      title = "Panel Principal";
      description = "Bienvenido a la aplicación de gestion de pagos del SINEM";
      break;
    case Page.SETTINGS:
      title = "Configuración Local";
      description = "Ajustes de la aplicación, incluyendo preferencias de idioma, tema (si estuviera implementado) y configuración de la base de datos local.";
      break;
    case Page.PAYMENT_REGISTRY:
        return (
          <div className="payment-page-container">
            <Payments />
          </div>
        );
    case Page.EXPENSES_REGISTRY:
        return (
          <div className="expense-page-container">
            <Expenses />
          </div>
        );
    case Page.STUDENTS_REGISTRY:
        return (
          <div className="student-page-container">
            <Students />
          </div>
        );
    case Page.PRICING_REGISTRY:
        return (
          <div className="pricing-page-container">
            <Pricing />
          </div>
        );
    case Page.REPORT_REGISTRY:
        return (
          <div className="report-page-container">
            <Report/>
          </div>
        );
    case Page.EXPORT_REGISTRY:
        return (
          <div className="export-page-container">
            <Export />
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