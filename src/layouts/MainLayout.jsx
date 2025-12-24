import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
