import { NavLink, useNavigate } from "react-router-dom";
import { Calendar, PersonStanding, Globe, LogOut } from "lucide-react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <header className="app-header">
      <div className="logo-container">
        <span className="logo-text">RUFFO</span>
      </div>

      <nav className="main-nav">
        <NavLink to="/agenda" className="nav-item">
          <Calendar size={18} />
          <span>Agenda</span>
        </NavLink>
        <NavLink to="/jogadores" className="nav-item">
          <PersonStanding size={18} />
          <span>Jogadores</span>
        </NavLink>
        <NavLink to="/quadras" className="nav-item">
          <Globe size={18} />
          <span>Quadras</span>
        </NavLink>
      </nav>

      <div className="user-container">
        <div className="user-info">
          <span className="user-name">{usuario.nome || "Gestor"}</span>
          <span className="user-role">GERENTE</span>
        </div>
        <button className="user-sair" onClick={sair} title="Sair">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;