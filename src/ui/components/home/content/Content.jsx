import { useState, useEffect } from 'react';
import { getCurrentImage } from '../../../constant/DBFunctions.jsx';
import { Page } from '../../../constant/Pages.jsx'; 
import Payments from '../../../pages/payments/Payments.jsx';
import Expenses from '../../../pages/expenses/Expenses.jsx';
import Students from '../../../pages/students/Students.jsx';
import Teachers from '../../../pages/teachers/Teachers.jsx';
import Pricing from  '../../../pages/pricing/Pricing.jsx';
import Export from   '../../../pages/export/Export.jsx';
import Report from '../../../pages/report/Report.jsx';
import Settings from '../../../pages/settings/Settings.jsx';

import sinem from "../../../assets/SINEM_home.png";

import './page.css';
const Content = ({ page }) => {
  const [logo, setLogo] = useState(sinem);

  useEffect(() => {
    const fetchLogo = async () => {
      const result = await getCurrentImage();
      if (result && result.image) {
        setLogo(result.image);
      } else {
        setLogo(sinem);
      }
    };
    fetchLogo();

    window.addEventListener("logo-updated", fetchLogo);

    return () => {
      window.removeEventListener("logo-updated", fetchLogo);
    };

  }, []);

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
    case Page.EXPENSES_REGISTRY:
        return (
          <div className="expense-page-container">
            <Expenses />
          </div>
        );
    case Page.TEACHERS_REGISTRY:
        return (
          <div className="teacher-page-container">
            <Teachers />
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
    case Page.SETTINGS_REGISTRY:
      return (
        <div className="settings-page-container">
          <Settings />
        </div>
      );
    default:
      title = "Página No Encontrada";
      description = "Error de navegación. Por favor, selecciona un enlace del menú lateral.";
  }

  return (
    <div className="content-area">
      <h1 className="main-header">{title}</h1>
      <img src={logo} width={500} height={500} alt='sinem-logo' className="img" id="" />
      <div className="info-card">
        <h2 className="card-title">Pagina Inicial</h2>
        <p className="card-text">{description}</p>
      </div>

    </div>
  );
};

export default Content;