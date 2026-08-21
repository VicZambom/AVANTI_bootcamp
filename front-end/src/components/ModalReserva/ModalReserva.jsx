import { useEffect, useMemo, useRef, useState } from "react";
import { criarReserva, atualizarReserva } from "../../services/api";
import "./ModalReserva.css";

const ABERTURA = 6;
const FECHAMENTO = 23;
const HORAS = Array.from({ length: FECHAMENTO - ABERTURA }, (_, i) => ABERTURA + i);
const DIAS_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function rotuloData(chave) {
  const d = new Date(`${chave}T12:00`);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return { dia: `${dia}/${mes}`, semana: DIAS_SEMANA[d.getDay()] };
}

export default function ModalReserva({
  reserva,
  quadras,
  jogadores,
  reservas = [],
  diaSugerido,
  aoFechar,
  aoSalvar,
}) {
  const inicial = reserva ? new Date(reserva.inicio) : null;

  const [data, setData] = useState(
    inicial ? inicial.toLocaleDateString("sv-SE") : diaSugerido
  );
  const [quadraId, setQuadraId] = useState(reserva?.quadraId || "");
  const [hora, setHora] = useState(inicial ? inicial.getHours() : null);
  const [duracao, setDuracao] = useState(() => {
    if (!reserva) return 1;
    const h = (new Date(reserva.fim) - new Date(reserva.inicio)) / 3600000;
    return Math.min(3, Math.max(1, Math.round(h)));
  });
  const [jogadorId, setJogadorId] = useState(reserva?.jogadorId || "");
  const [observacao, setObservacao] = useState(reserva?.observacao || "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") aoFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  const quadraAtual = quadras.find((q) => q.id === Number(quadraId));

  /** Horas ocupadas na quadra escolhida, neste dia. */
  const ocupadas = useMemo(() => {
    const set = new Set();
    if (!quadraId) return set;

    for (const r of reservas) {
      if (r.status === "CANCELADA") continue;
      if (r.quadraId !== Number(quadraId)) continue;

      const ini = new Date(r.inicio);
      if (ini.toLocaleDateString("sv-SE") !== data) continue;

      const fim = new Date(r.fim);
      const ultima = fim.getMinutes() > 0 ? fim.getHours() : fim.getHours() - 1;
      for (let h = ini.getHours(); h <= ultima; h++) set.add(h);
    }
    return set;
  }, [reservas, quadraId, data]);

  function blocoLivre(h) {
    if (h + duracao > FECHAMENTO) return false;
    for (let i = 0; i < duracao; i++) if (ocupadas.has(h + i)) return false;
    return true;
  }

  const selecionadas = useMemo(() => {
    if (hora === null) return new Set();
    return new Set(Array.from({ length: duracao }, (_, i) => hora + i));
  }, [hora, duracao]);

  function mudarDia(passo) {
    const d = new Date(`${data}T12:00`);
    d.setDate(d.getDate() + passo);
    setData(d.toLocaleDateString("sv-SE"));
    setHora(null);
  }

  function escolherDuracao(d) {
    setDuracao(d);
    if (hora !== null) {
      for (let i = 0; i < d; i++) {
        if (ocupadas.has(hora + i) || hora + d > FECHAMENTO) {
          setHora(null);
          break;
        }
      }
    }
  }

  async function salvar() {
    setErro("");

    if (!quadraId) return setErro("Escolha a quadra.");
    if (hora === null) return setErro("Escolha o horário.");
    if (!jogadorId) return setErro("Escolha o jogador responsável.");

    setSalvando(true);
    try {
      const inicio = new Date(`${data}T${String(hora).padStart(2, "0")}:00`);
      const fim = new Date(inicio);
      fim.setHours(fim.getHours() + duracao);

      const corpo = {
        jogadorId: Number(jogadorId),
        quadraId: Number(quadraId),
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        observacao: observacao.trim() || null,
      };

      if (reserva) await atualizarReserva(reserva.id, corpo);
      else await criarReserva(corpo);

      await aoSalvar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  const { dia, semana } = rotuloData(data);
  const fimPrevisto = hora !== null ? hora + duracao : null;

  return (
    <div className="mr" onClick={aoFechar} role="dialog" aria-modal="true">
      <div className="mr__painel" onClick={(e) => e.stopPropagation()}>

        <header className="mr__cabecalho">
          <div>
            <span className="mr__etiqueta">
              {reserva ? "Editando" : "Novo agendamento"}
            </span>
            <h2 className="mr__titulo">Reserva</h2>
          </div>
          <button className="mr__fechar" onClick={aoFechar} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="mr__conteudo">

          <div className="mr__dia">
            <button onClick={() => mudarDia(-1)} aria-label="Dia anterior">‹</button>
            <div className="mr__dia-texto">
              <strong>{dia}</strong>
              <span>{semana}</span>
            </div>
            <button onClick={() => mudarDia(1)} aria-label="Próximo dia">›</button>
          </div>

          <section className="mr__campo">
            <span className="mr__rotulo">Quadra</span>
            <div className="mr__quadras">
              {quadras.map((q) => (
                <button
                  key={q.id}
                  className={`mr__quadra ${Number(quadraId) === q.id ? "mr__quadra--ativa" : ""}`}
                  onClick={() => { setQuadraId(q.id); setHora(null); }}
                >
                  <span className="mr__quadra-nome">{q.nome}</span>
                  <span className="mr__quadra-mod">{q.modalidade}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mr__campo">
            <span className="mr__rotulo">Duração</span>
            <div className="mr__duracao">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  className={`mr__pilula ${duracao === d ? "mr__pilula--ativa" : ""}`}
                  onClick={() => escolherDuracao(d)}
                >
                  {d}h
                </button>
              ))}
            </div>
          </section>

          <section className="mr__campo">
            <div className="mr__rotulo-linha">
              <span className="mr__rotulo">Horário</span>
              {fimPrevisto !== null && (
                <span className="mr__resumo">
                  {String(hora).padStart(2, "0")}:00 — {String(fimPrevisto).padStart(2, "0")}:00
                </span>
              )}
            </div>

            {!quadraId ? (
              <p className="mr__aviso">Escolha uma quadra para ver os horários.</p>
            ) : (
              <div className="mr__horarios">
                {HORAS.map((h) => {
                  const ocupada = ocupadas.has(h);
                  const ativa = selecionadas.has(h);
                  const livre = blocoLivre(h);
                  return (
                    <button
                      key={h}
                      className={
                        "mr__hora" +
                        (ocupada ? " mr__hora--ocupada" : "") +
                        (ativa ? " mr__hora--ativa" : "")
                      }
                      disabled={ocupada || !livre}
                      title={ocupada ? "Horário ocupado" : ""}
                      onClick={() => setHora(h)}
                    >
                      {String(h).padStart(2, "0")}:00
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mr__campo">
            <span className="mr__rotulo">Jogador responsável</span>
            <SeletorJogador
              jogadores={jogadores}
              valor={jogadorId}
              aoEscolher={setJogadorId}
            />
          </section>

          <section className="mr__campo">
            <span className="mr__rotulo">Observação</span>
            <input
              className="mr__texto"
              type="text"
              placeholder="Aniversário, treino, campeonato…"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </section>

          {erro && <p className="mr__erro" role="alert">{erro}</p>}
        </div>

        <footer className="mr__rodape">
          <p className="mr__recibo">
            {quadraAtual ? quadraAtual.nome : "Nenhuma quadra"}
            {fimPrevisto !== null && ` · ${dia} · ${String(hora).padStart(2, "0")}h`}
          </p>
          <button className="mr__confirmar" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando…" : reserva ? "Salvar alterações" : "Confirmar reserva"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function SeletorJogador({ jogadores, valor, aoEscolher }) {
  const escolhido = jogadores.find((j) => j.id === Number(valor));
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const caixa = useRef(null);

  useEffect(() => {
    function aoClicarFora(e) {
      if (caixa.current && !caixa.current.contains(e.target)) setAberto(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  const filtrados = jogadores.filter((j) =>
    j.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="mr__seletor" ref={caixa}>
      <input
        className="mr__texto"
        type="text"
        placeholder={escolhido ? escolhido.nome : "Buscar jogador…"}
        value={aberto ? busca : escolhido?.nome || ""}
        onFocus={() => { setAberto(true); setBusca(""); }}
        onChange={(e) => setBusca(e.target.value)}
      />

      {aberto && (
        <ul className="mr__lista">
          {filtrados.length === 0 ? (
            <li className="mr__vazio">Nenhum jogador com esse nome.</li>
          ) : (
            filtrados.map((j) => (
              <li key={j.id}>
                <button
                  className={`mr__item ${Number(valor) === j.id ? "mr__item--ativo" : ""}`}
                  onClick={() => { aoEscolher(j.id); setAberto(false); }}
                >
                  <strong>{j.nome}</strong>
                  <small>{j.telefone}</small>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}