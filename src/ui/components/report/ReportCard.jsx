import { ChevronRightIcon } from "@radix-ui/react-icons";

import './reportcard.css';

const ReportCard = ({ title, description, icon: Icon, colorClass, onClick }) => {
  return (
    <div className={`report-card report-card-enable card-${colorClass}`} onClick={onClick}>
      <div className={`report-card-icon-box ${colorClass} report-card--enable`}>
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`report-card-footer ${colorClass} report-card--enable`} style={{ backgroundColor: 'transparent' }}>
        <div>
          Ver reporte <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
