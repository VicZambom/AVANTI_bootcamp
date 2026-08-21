import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "../../components/Header/Header";
import ModalReserva from "../../components/ModalReserva/ModalReserva";
import {
  listarReservas,
  listarQuadras,
  listarJogadores,
  cancelarReserva,
} from "../../services/api";
import "./Agenda.css";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function chaveDia(data) {
  return new Date(data).toLocaleDateString("sv-SE");
}

function horaCurta(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Agenda() {
  const [reservas, setReservas] = useState([]);
  const [quadras, setQuadras] = useState([]);
  const [jogadores, setJogadores] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [mes, setMes] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [diaSelecionado, setDiaSelecionado] = useState(() =>
    new Date().toLocaleDateString("sv-SE")
  );

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [r, q, j] = await Promise.all([
        listarReservas(),
        listarQuadras(),
        listarJogadores(),
      ]);
      setReservas(r);
      setQuadras(q);
      setJogadores(j);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    document.title = "Agenda | Ruffo";
    (async () => {
      await carregar();
    })();
  }, []);

  const porDia = useMemo(() => {
    const mapa = {};
    for (const r of reservas) {
      const chave = chaveDia(r.inicio);
      if (!mapa[chave]) mapa[chave] = [];
      mapa[chave].push(r);
    }
    for (const chave of Object.keys(mapa)) {
      mapa[chave].sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
    }
    return mapa;
  }, [reservas]);

  const celulas = useMemo(() => {
    const ano = mes.getFullYear();
    const m = mes.getMonth();
    const primeiroDiaSemana = new Date(ano, m, 1).getDay();
    const totalDias = new Date(ano, m + 1, 0).getDate();

    const lista = Array(primeiroDiaSemana).fill(null);
    for (let d = 1; d <= totalDias; d++) {
      const data = new Date(ano, m, d);
      lista.push({ numero: d, chave: data.toLocaleDateString("sv-SE") });
    }
    return lista;
  }, [mes]);

  function mudarMes(passo) {
    setMes((m) => new Date(m.getFullYear(), m.getMonth() + passo, 1));
  }

  function mudarDia(passo) {
    const d = new Date(`${diaSelecionado}T12:00`);
    d.setDate(d.getDate() + passo);
    const nova = d.toLocaleDateString("sv-SE");
    setDiaSelecionado(nova);

    const [ano, m] = nova.split("-").map(Number);
    if (m - 1 !== mes.getMonth() || ano !== mes.getFullYear()) {
      setMes(new Date(ano, m - 1, 1));
    }
  }

  function abrirNova() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(reserva) {
    setEditando(reserva);
    setModalAberto(true);
  }

  async function cancelar(reserva) {
    const ok = window.confirm(
      `Cancelar a reserva de ${reserva.jogador?.nome} em ${reserva.quadra?.nome}?`
    );
    if (!ok) return;

    try {
      await cancelarReserva(reserva.id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  const termo = busca.trim().toLowerCase();
  const doDia = (porDia[diaSelecionado] || []).filter(
    (r) =>
      !termo ||
      [r.jogador?.nome, r.jogador?.email, r.jogador?.telefone, r.quadra?.nome].some(
        (campo) => campo?.toLowerCase().includes(termo)
      )
  );

  const [ano, m, d] = diaSelecionado.split("-");

  return (
    <>
      <Header />

      <div className="agenda">
        <div className="agenda__topo">
          <div>
            <h1 className="agenda__titulo">Agenda</h1>
            <p className="agenda__sub">Consulte e gerencie as reservas das quadras</p>
          </div>
          <button className="agenda__novo" onClick={abrirNova}>
            + Nova reserva
          </button>
        </div>

        <div className="agenda__busca">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, telefone ou quadra…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {erro && <p className="agenda__erro" role="alert">{erro}</p>}

        {carregando ? (
          <p className="agenda__vazio">Carregando reservas…</p>
        ) : (
          <div className="agenda__grade">
            <section className="calendario">
              <div className="calendario__topo">
                <h2 className="calendario__mes">
                  {MESES[mes.getMonth()]} {mes.getFullYear()}
                </h2>
                <div className="calendario__nav">
                  <button onClick={() => mudarMes(-1)} aria-label="Mês anterior">‹</button>
                  <button onClick={() => mudarMes(1)} aria-label="Próximo mês">›</button>
                </div>
              </div>

              <div className="calendario__semana">
                {DIAS.map((dia) => (
                  <span key={dia}>{dia}</span>
                ))}
              </div>

              <div className="calendario__dias">
                {celulas.map((celula, i) =>
                  celula === null ? (
                    <div key={`vazio-${i}`} className="dia dia--fora" />
                  ) : (
                    <button
                      key={celula.chave}
                      className={`dia ${celula.chave === diaSelecionado ? "dia--ativo" : ""}`}
                      onClick={() => setDiaSelecionado(celula.chave)}
                    >
                      <span className="dia__numero">{celula.numero}</span>
                      <span className="dia__barras">
                        {(porDia[celula.chave] || []).slice(0, 3).map((r) => (
                          <span
                            key={r.id}
                            className={`dia__barra ${
                              r.status === "CANCELADA" ? "dia__barra--cancelada" : ""
                            }`}
                          />
                        ))}
                      </span>
                    </button>
                  )
                )}
              </div>
            </section>

            <aside className="painel">
              <div className="painel__topo">
                <button onClick={() => mudarDia(-1)} aria-label="Dia anterior">‹</button>
                <strong>{d}/{m}/{ano}</strong>
                <button onClick={() => mudarDia(1)} aria-label="Próximo dia">›</button>
              </div>

              <div className="painel__corpo">
                {doDia.length === 0 ? (
                  <p className="painel__vazio">
                    {termo
                      ? "Nenhuma reserva encontrada com esse termo."
                      : "Nenhuma reserva neste dia."}
                  </p>
                ) : (
                  <ul className="painel__lista">
                    {doDia.map((r) => {
                      const cancelada = r.status === "CANCELADA";
                      return (
                        <li
                          key={r.id}
                          className={`reserva ${cancelada ? "reserva--cancelada" : ""}`}
                        >
                          <div className="reserva__linha">
                            <span className="reserva__jogador">{r.jogador?.nome}</span>
                            <span className="reserva__hora">
                              {horaCurta(r.inicio)}
                            </span>
                          </div>

                          <div className="reserva__linha">
                            <span className="reserva__contato">{r.jogador?.email}</span>
                            <span className="reserva__quadra">{r.quadra?.nome}</span>
                          </div>

                          <div className="reserva__linha">
                            <span className="reserva__contato">{r.jogador?.telefone}</span>
                            <span className="reserva__quadra">{r.quadra?.modalidade}</span>
                          </div>

                          {r.observacao && <p className="reserva__obs">{r.observacao}</p>}

                          {cancelada ? (
                            <span className="reserva__selo">Cancelada</span>
                          ) : (
                            <div className="reserva__acoes">
                              <button onClick={() => abrirEdicao(r)}>Editar</button>
                              <button
                                className="reserva__cancelar"
                                onClick={() => cancelar(r)}
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

      {modalAberto && (
        <ModalReserva
          reserva={editando}
          quadras={quadras}
          jogadores={jogadores}
          reservas={reservas}
          diaSugerido={diaSelecionado}
          aoFechar={() => setModalAberto(false)}
          aoSalvar={async () => {
            setModalAberto(false);
            await carregar();
          }}
        />
      )}
    </>
  );
}