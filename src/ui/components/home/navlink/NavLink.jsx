const NavLink = ({ icon: Icon, title, page, currentPage, onClick, isOpen }) => {
  const isActive = currentPage === page;
    
    return (
        <button
            onClick={() => onClick(page)}
            className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
            title={!isOpen ? title : ""}
        >
            <div className="nav-icon">
                <Icon width={20} height={20} />
            </div>
            {isOpen && <span className="nav-text">{title}</span>}
        </button>
    );
};
export default NavLink;