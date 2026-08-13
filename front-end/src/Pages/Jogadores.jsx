import { useEffect, useState } from 'react';
import { Search, Pencil, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import './Jogadores.css';

const jogadoresMock = [
  { id: 1, nome: 'Maria Julia Correia', desde: 'jan 2026', email: 'Maria_Julia@gmail.com', telefone: '(21) 9 9197-2446', total: 15, concluidas: 10, ativas: 3, canceladas: 2, cor: '#a0522d' },
  { id: 2, nome: 'Carlos Lima', desde: 'jan 2026', email: 'Limaos@gmail.com', telefone: '(21) 9 9356-2233', total: 8, concluidas: 2, ativas: 0, canceladas: 6, cor: '#5b7fa6' },
  { id: 3, nome: 'Santana Gomes', desde: 'fev 2026', email: 'Gomes_Santa@gmail.com', telefone: '(21) 9 9832-2456', total: 26, concluidas: 20, ativas: 3, canceladas: 3, cor: '#9b6bb3' },
  { id: 4, nome: 'Diego Rocha', desde: 'jun 2026', email: 'DiegoRocha@gmail.com', telefone: '(21) 9 9197-2446', total: 10, concluidas: 9, ativas: 1, canceladas: 0, cor: '#c0645f' },
  { id: 5, nome: 'Roberto Carlos', desde: 'jun 2026', email: 'RobertoCarlos@gmail.com', telefone: '(21) 9 9194-5200', total: 17, concluidas: 17, ativas: 0, canceladas: 0, cor: '#4fa47f' },
  { id: 6, nome: 'Thaiane Gonçalvez', desde: 'jun 2026', email: 'Gonçalvez@gmail.com', telefone: '(21) 9 9881-5501', total: 24, concluidas: 19, ativas: 2, canceladas: 2, cor: '#4a7ba6' },
];

function getIniciais(nome) {
  const partes = nome.trim().split(' ');
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function Jogadores() {
  const [busca, setBusca] = useState('');

  useEffect(() => {
    document.title = 'Jogadores | Ruffo';
  }, []);

  const jogadoresFiltrados = jogadoresMock.filter((j) =>
    [j.nome, j.email, j.telefone].some((campo) =>
      campo.toLowerCase().includes(busca.toLowerCase())
    )
  );

  return (
    <>
      <Header />
      <div className="jogadores-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Jogadores</h1>
            <p className="page-subtitle">Visualize e gerencie os jogadores cadastrados</p>
          </div>
          <button className="btn-novo-jogador">+ Novo jogador</button>
        </div>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="jogadores-table">
          <thead>
            <tr>
              <th>Jogador</th>
              <th>Contato</th>
              <th>Total</th>
              <th>Concluídas</th>
              <th>Ativas</th>
              <th>Canceladas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {jogadoresFiltrados.map((j) => (
              <tr key={j.id}>
                <td>
                  <div className="jogador-cell">
                    <div className="avatar" style={{ backgroundColor: j.cor }}>
                      {getIniciais(j.nome)}
                    </div>
                    <div>
                      <div className="jogador-nome">{j.nome}</div>
                      <div className="jogador-desde">Desde {j.desde}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contato-email">{j.email}</div>
                  <div className="contato-telefone">{j.telefone}</div>
                </td>
                <td className="col-numero">
                  <div className="numero">{j.total}</div>
                  <div className="numero-label">reservas</div>
                </td>
                <td className="col-numero">
                  <div className="numero">{j.concluidas}</div>
                  <div className="numero-label">concluídas</div>
                </td>
                <td className="col-numero">
                  <div className={`numero ${j.ativas > 0 ? 'numero-ativa' : 'numero-zero'}`}>
                    {j.ativas}
                  </div>
                  <div className="numero-label">ativas</div>
                </td>
                <td className="col-numero">
                  <div className={`numero ${j.canceladas > 0 ? 'numero-cancelada' : 'numero-zero'}`}>
                    {j.canceladas}
                  </div>
                  <div className="numero-label">canceladas</div>
                </td>
                <td>
                  <div className="acoes">
                    <button className="btn-icon btn-editar" title="Editar">
                      <Pencil size={16} />
                    </button>
                    <button className="btn-icon btn-bloquear" title="Bloquear">
                      <Ban size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button className="page-btn"><ChevronLeft size={16} /></button>
          <span className="page-numbers">1, 2, 3, ...</span>
          <button className="page-btn"><ChevronRight size={16} /></button>
        </div>
      </div>
    </>
  );
}

export default Jogadores;