import './pricingcard.css';
import { BellIcon,Pencil1Icon } from '@radix-ui/react-icons';

const PricingCard = ({ price, onClick}) => {
  return (
    <div
      onClick={onClick}
      className="card"
      onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563eb'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className={`card-icon card-icon-${price.name}`}><BellIcon size={20} /></div>
        <div>
          <h4 className='card-title'>{price.name}</h4>
          <span className='card-category'>{price.name}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div className='amount'>{new Intl.NumberFormat("es-CR", {
                                                                    style: "currency",
                                                                    currency: "CRC",
                                                                    minimumFractionDigits: 2,
                                                                  }).format(price.amount)}
            </div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>MONTO ACTUAL</div>
        </div>
        <div style={{ color: '#d1d5db' }}><Pencil1Icon size={16} /></div>
      </div>
    </div>
  );
};

export default PricingCard;