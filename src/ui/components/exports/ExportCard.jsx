import { ChevronRightIcon } from "@radix-ui/react-icons";

import './exportcard.css';
const ExportCard = ({ title, description, icon: Icon, colorClass, onClick }) => {
  return (
    <div className="export-card" onClick={onClick}>
      <div className={`export-card-icon-box ${colorClass}`}>
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`export-card-footer ${colorClass}`} style={{ backgroundColor: 'transparent' }}>
        Configurar excel <ChevronRightIcon />
      </div>
    </div>
  );
};

export default ExportCard;