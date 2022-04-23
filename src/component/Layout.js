import { Outlet } from 'react-router-dom';
import Footerbar from './Footerbar';
import Header from './header';

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footerbar />
    </div>
  );
}

export default Layout;
