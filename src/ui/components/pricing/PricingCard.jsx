import { BellIcon,Pencil1Icon } from '@radix-ui/react-icons';

import './pricingcard.css';
const PricingCard = ({ price, onClick, id}) => {
  return (
    <div
      onClick={onClick}
      className={`card card-${id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className={`card-icon card-icon-${id}`}><BellIcon size={20} /></div>
        <div>
          <h4 className='card-title-price'>{price.name}</h4>
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