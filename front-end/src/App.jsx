import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";
import Agenda from "./pages/agenda/Agenda";
import Jogadores from "./pages/jogadores/Jogadores";
import RotaPrivada from "./components/RotaPrivada";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/agenda"
          element={
            <RotaPrivada>
              <Agenda />
            </RotaPrivada>
          }
        />
        <Route
          path="/jogadores"
          element={
            <RotaPrivada>
              <Jogadores />
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/agenda" replace />} />
      </Routes>
    </BrowserRouter>
  );
}