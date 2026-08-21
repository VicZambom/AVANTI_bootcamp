import { useEffect, useMemo, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import Header from "../../components/Header/Header";
import {
  listarQuadras,
  listarReservas,
  criarQuadra,
  atualizarQuadra,
  excluirQuadra,
} from "../../services/api";
import "./Quadras.css";

const MODALIDADES = ["FUTEBOL", "FUTSAL", "VOLEI", "BASQUETE", "TENIS", "HANDEBOL", "OUTRO"];

function hoje() {
  return new Date().toLocaleDateString("sv-SE");
}

function horaCurta(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function Quadras() {
  const [quadras, setQuadras] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [q, r] = await Promise.all([listarQuadras(), listarReservas()]);
      setQuadras(q);
      setReservas(r.filter((x) => x.status !== "CANCELADA"));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    document.title = "Quadras | Ruffo";
    const inicializar = async () => {
      await carregar();
    };
    inicializar();
  }, []);

  const reservasHoje = useMemo(() => {
    const mapa = {};
    const dia = hoje();

    for (const r of reservas) {
      if (new Date(r.inicio).toLocaleDateString("sv-SE") !== dia) continue;
      if (!mapa[r.quadraId]) mapa[r.quadraId] = [];
      mapa[r.quadraId].push(r);
    }

    for (const id of Object.keys(mapa)) {
      mapa[id].sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
    }
    return mapa;
  }, [reservas]);

  function emUso(quadraId) {
    const agora = new Date();
    return (reservasHoje[quadraId] || []).some(
      (r) => new Date(r.inicio) <= agora && new Date(r.fim) > agora
    );
  }

  async function remover(quadra) {
    const ok = window.confirm(`Excluir a quadra ${quadra.nome}?`);
    if (!ok) return;

    try {
      await excluirQuadra(quadra.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  const termo = busca.trim().toLowerCase();
  const filtradas = quadras.filter(
    (q) =>
      !termo ||
      [q.nome, q.modalidade, q.localizacao].some((c) =>
        c?.toLowerCase().includes(termo)
      )
  );

  return (
    <>
      <Header />

      <div className="qd">
        <div className="qd__topo">
          <div>
            <h1 className="qd__titulo">Quadras</h1>
            <p className="qd__sub">Visualize e gerencie as quadras cadastradas</p>
          </div>
          <button
            className="qd__novo"
            onClick={() => { setEditando(null); setModalAberto(true); }}
          >
            + Nova quadra
          </button>
        </div>

        <div className="qd__busca">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, modalidade ou localização…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {erro && <p className="qd__erro" role="alert">{erro}</p>}

        {carregando ? (
          <p className="qd__aviso">Carregando quadras…</p>
        ) : filtradas.length === 0 ? (
          <p className="qd__aviso">
            {termo
              ? "Nenhuma quadra encontrada com esse termo."
              : "Nenhuma quadra cadastrada ainda."}
          </p>
        ) : (
          <div className="qd__grade">
            {filtradas.map((q) => {
              const doDia = reservasHoje[q.id] || [];
              const ocupada = emUso(q.id);

              return (
                <article key={q.id} className="qd__card">
                  <header className="qd__card-topo">
                    <div>
                      <h2>{q.nome}</h2>
                      <span className="qd__local">
                        {q.modalidade} · {q.localizacao}
                      </span>
                    </div>
                    <span className={`qd__selo ${ocupada ? "qd__selo--uso" : "qd__selo--livre"}`}>
                      {ocupada ? "Em uso" : "Livre agora"}
                    </span>
                  </header>

                  <div className="qd__card-corpo">
                    <span className="qd__rotulo">Reservas de hoje</span>

                    {doDia.length === 0 ? (
                      <p className="qd__vazio">Não há reservas para esta quadra hoje.</p>
                    ) : (
                      <ul className="qd__reservas">
                        {doDia.map((r) => (
                          <li key={r.id}>
                            <strong>{horaCurta(r.inicio)}</strong>
                            <span>{r.jogador?.nome}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <footer className="qd__card-pe">
                    <button onClick={() => { setEditando(q); setModalAberto(true); }}>
                      <Pencil size={15} /> Editar
                    </button>
                    <button className="qd__excluir" onClick={() => remover(q)}>
                      <Trash2 size={15} /> Excluir
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {modalAberto && (
        <ModalQuadra
          quadra={editando}
          aoFechar={() => setModalAberto(false)}
          aoSalvar={async () => { setModalAberto(false); await carregar(); }}
        />
      )}
    </>
  );
}

function ModalQuadra({ quadra, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState(quadra?.nome || "");
  const [modalidade, setModalidade] = useState(quadra?.modalidade || "");
  const [localizacao, setLocalizacao] = useState(quadra?.localizacao || "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") aoFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  async function salvar() {
    setErro("");

    if (!nome.trim() || !modalidade || !localizacao.trim()) {
      setErro("Preencha nome, modalidade e localização.");
      return;
    }

    setSalvando(true);
    try {
      const corpo = {
        nome: nome.trim(),
        modalidade,
        localizacao: localizacao.trim(),
      };

      if (quadra) await atualizarQuadra(quadra.id, corpo);
      else await criarQuadra(corpo);

      await aoSalvar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="qd__modal" onClick={aoFechar}>
      <div className="qd__caixa" onClick={(e) => e.stopPropagation()}>
        <h2 className="qd__modal-titulo">
          {quadra ? "Editar quadra" : "Nova quadra"}
        </h2>

        <div className="qd__corpo-modal">
          <label className="qd__label" htmlFor="qd-nome">Nome da quadra</label>
          <input id="qd-nome" className="qd__campo" value={nome}
            onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Quadra Society" />

          <label className="qd__label">Modalidade</label>
          <div className="qd__chips">
            {MODALIDADES.map((m) => (
              <button
                key={m}
                className={`qd__chip ${modalidade === m ? "qd__chip--ativo" : ""}`}
                onClick={() => setModalidade(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <label className="qd__label" htmlFor="qd-local">Localização</label>
          <input id="qd-local" className="qd__campo" value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)} placeholder="Ex.: Bloco A, Centro" />

          {erro && <p className="qd__erro" role="alert">{erro}</p>}
        </div>

        <div className="qd__acoes">
          <button className="qd__voltar" onClick={aoFechar}>Voltar</button>
          <button className="qd__salvar" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}