import { useState } from 'react';
import Sidebar from '../../components/home/sidebar/SideBar.jsx'; 
import Content from '../../components/home/content/Content.jsx';
import { Page } from '../../constant/Pages.jsx'; 

const Home = () => {
  
  const [currentPage, setCurrentPage] = useState(Page.DASHBOARD);

  return (
    // La clase .app-container se define en index.css y maneja el layout Flexbox (pantalla completa).
    <div className="app-container"> 
      {/* Barra lateral de navegación. 
        Recibe el estado actual y la función para cambiarlo. 
      */}
      <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
      />
      
      {/* Área de contenido principal. 
        Recibe el estado actual para renderizar el contenido correspondiente.
      */}
      <Content page={currentPage} />
    </div>
  );
};

export default Home;