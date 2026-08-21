import { useEffect, useState } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import Header from "../../components/Header/Header";
import {
  listarJogadores,
  criarJogador,
  atualizarJogador,
  excluirJogador,
} from "../../services/api";
import './Jogadores.css';

const CORES = ['#a0522d', '#5b7fa6', '#9b6bb3', '#c0645f', '#4fa47f', '#4a7ba6'];

function getIniciais(nome) {
  const partes = nome.trim().split(' ').filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function corDoJogador(id) {
  return CORES[id % CORES.length];
}

function desdeQuando(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

/** Conta as reservas do jogador por situação. */
function contar(reservas = []) {
  const agora = new Date();
  let concluidas = 0, ativas = 0, canceladas = 0;

  for (const r of reservas) {
    if (r.status === 'CANCELADA') canceladas++;
    else if (new Date(r.fim) < agora) concluidas++;
    else ativas++;
  }

  return { total: reservas.length, concluidas, ativas, canceladas };
}

function Jogadores() {
  const [jogadores, setJogadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const dados = await listarJogadores();
      setJogadores(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    document.title = 'Jogadores | Ruffo';
    
    const inicializar = async () => {
      await carregar();
    };
    
    inicializar();
  }, []);

  async function remover(jogador) {
    const ok = window.confirm(`Excluir o jogador ${jogador.nome}?`);
    if (!ok) return;

    try {
      await excluirJogador(jogador.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  const termo = busca.trim().toLowerCase();
  const jogadoresFiltrados = jogadores.filter((j) =>
    !termo ||
    [j.nome, j.email, j.telefone].some((campo) =>
      campo?.toLowerCase().includes(termo)
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
          <button
            className="btn-novo-jogador"
            onClick={() => { setEditando(null); setModalAberto(true); }}
          >
            + Novo jogador
          </button>
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

        {erro && <p className="jog-erro" role="alert">{erro}</p>}

        {carregando ? (
          <p className="jog-aviso">Carregando jogadores…</p>
        ) : jogadoresFiltrados.length === 0 ? (
          <p className="jog-aviso">
            {termo
              ? 'Nenhum jogador encontrado com esse termo.'
              : 'Nenhum jogador cadastrado ainda.'}
          </p>
        ) : (
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
              {jogadoresFiltrados.map((j) => {
                const n = contar(j.reservas);
                return (
                  <tr key={j.id}>
                    <td>
                      <div className="jogador-cell">
                        <div className="avatar" style={{ backgroundColor: corDoJogador(j.id) }}>
                          {getIniciais(j.nome)}
                        </div>
                        <div>
                          <div className="jogador-nome">{j.nome}</div>
                          <div className="jogador-desde">Desde {desdeQuando(j.criadoEm)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contato-email">{j.email}</div>
                      <div className="contato-telefone">{j.telefone}</div>
                    </td>
                    <td className="col-numero">
                      <div className="numero">{n.total}</div>
                      <div className="numero-label">reservas</div>
                    </td>
                    <td className="col-numero">
                      <div className="numero">{n.concluidas}</div>
                      <div className="numero-label">concluídas</div>
                    </td>
                    <td className="col-numero">
                      <div className={`numero ${n.ativas > 0 ? 'numero-ativa' : 'numero-zero'}`}>
                        {n.ativas}
                      </div>
                      <div className="numero-label">ativas</div>
                    </td>
                    <td className="col-numero">
                      <div className={`numero ${n.canceladas > 0 ? 'numero-cancelada' : 'numero-zero'}`}>
                        {n.canceladas}
                      </div>
                      <div className="numero-label">canceladas</div>
                    </td>
                    <td>
                      <div className="acoes">
                        <button
                          className="btn-icon btn-editar"
                          title="Editar"
                          onClick={() => { setEditando(j); setModalAberto(true); }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn-icon btn-bloquear"
                          title="Excluir"
                          onClick={() => remover(j)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <ModalJogador
          jogador={editando}
          aoFechar={() => setModalAberto(false)}
          aoSalvar={async () => { setModalAberto(false); await carregar(); }}
        />
      )}
    </>
  );
}

function ModalJogador({ jogador, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState(jogador?.nome || '');
  const [email, setEmail] = useState(jogador?.email || '');
  const [telefone, setTelefone] = useState(jogador?.telefone || '');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    setErro('');

    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro('Preencha nome, e-mail e telefone.');
      return;
    }
    if (!email.includes('@')) {
      setErro('Informe um e-mail válido.');
      return;
    }

    setSalvando(true);
    try {
      const corpo = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
      };

      if (jogador) await atualizarJogador(jogador.id, corpo);
      else await criarJogador(corpo);

      await aoSalvar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="jog-modal" onClick={aoFechar}>
      <div className="jog-caixa" onClick={(e) => e.stopPropagation()}>
        <h2 className="jog-titulo">{jogador ? 'Editar jogador' : 'Novo jogador'}</h2>

        <div className="jog-corpo">
          <label className="jog-label" htmlFor="jog-nome">Nome completo</label>
          <input id="jog-nome" className="jog-campo" value={nome}
            onChange={(e) => setNome(e.target.value)} placeholder="Nome do jogador" />

          <label className="jog-label" htmlFor="jog-email">E-mail</label>
          <input id="jog-email" className="jog-campo" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="jogador@email.com" />

          <label className="jog-label" htmlFor="jog-tel">Telefone</label>
          <input id="jog-tel" className="jog-campo" value={telefone}
            onChange={(e) => setTelefone(e.target.value)} placeholder="(81) 90000-0000" />

          {erro && <p className="jog-erro" role="alert">{erro}</p>}
        </div>

        <div className="jog-acoes">
          <button className="jog-voltar" onClick={aoFechar}>Voltar</button>
          <button className="jog-salvar" onClick={salvar} disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Jogadores;