import { LayoutGrid, Calendar, PersonStanding, Globe } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <span className="logo-text">RUFFO</span>
      </div>

      <nav className="main-nav">
        <a href="#" className="nav-item">
          <LayoutGrid size={18} />
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item">
          <Calendar size={18} />
          <span>Agenda</span>
        </a>
        <a href="#" className="nav-item active">
          <PersonStanding size={18} />
          <span>Jogadores</span>
        </a>
        <a href="#" className="nav-item">
          <Globe size={18} />
          <span>Quadras</span>
        </a>
      </nav>

      <div className="user-container">
        <div className="user-info">
          <span className="user-name">Admin</span>
          <span className="user-role">GERENTE</span>
        </div>
        <div className="user-avatar" />
      </div>
    </header>
  );
}

export default Header;