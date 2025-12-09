const NavLink = ({ icon: Icon, title, page, currentPage, onClick }) => {
  const isActive = currentPage === page;
  // Usamos nombres de clase definidos en index.css
  const className = isActive ? 'nav-link nav-link-active' : 'nav-link';

  return (
    <div className={className} onClick={() => onClick(page)}>
      <Icon className="nav-icon" />
      <span>{title}</span>
    </div>
  );
};
export default NavLink;