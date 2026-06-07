import './chip.css';

const Chip = ({ selected, onClick, children, activeClass = 'chip-active' }) => {
    return (
        <button
            type="button"
            className={`chip${selected ? ` ${activeClass}` : ''}`}
            aria-pressed={selected}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Chip;
