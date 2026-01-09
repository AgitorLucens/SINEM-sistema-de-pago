import { ChevronRightIcon } from "@radix-ui/react-icons";

import './exportcard.css';
const ExportCard = ({ title, description, icon: Icon, colorClass, onClick, disabled=false, disabledMessage}) => {
  return (
    <div className={`export-card${disabled ? " export-card-disabled" : " export-card-enable"} card-${disabled ? "" : colorClass}`} onClick={!disabled ? onClick : undefined}>
      <div className={`export-card-icon-box ${colorClass}${disabled ? " export-card--disabled" : " export-card--enable"}`}>
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`export-card-footer ${colorClass}${disabled ? " export-card--disabled" : " export-card--enable"}`} style={{ backgroundColor: 'transparent' }}>
        {disabled && (
        <span className="export-card-tooltip">
          {disabledMessage}
        </span>
        )}
        {!disabled && (
          <div>
            Configurar excel <ChevronRightIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportCard;