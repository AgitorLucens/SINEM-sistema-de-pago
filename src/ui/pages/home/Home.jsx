import { useState } from 'react';
import Sidebar from '../../components/home/sidebar/SideBar.jsx'; 
import Content from '../../components/home/content/Content.jsx';
import { Page } from '../../constant/Pages.jsx'; 

const Home = () => {
  
  const [currentPage, setCurrentPage] = useState(Page.DASHBOARD);

  return (
    <div className="app-container"> 
      <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
      />
      <Content page={currentPage} />
    </div>
  );
};

export default Home;