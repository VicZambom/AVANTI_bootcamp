import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarQuadras, listarReservas, solicitarReserva } from "../../services/api";
import "./Landing.css";

const ABERTURA = 6;
const FECHAMENTO = 23;
const HORAS = Array.from({ length: FECHAMENTO - ABERTURA }, (_, i) => ABERTURA + i);
const SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function hoje() {
  return new Date().toLocaleDateString("sv-SE");
}

function rotulo(chave) {
  const d = new Date(`${chave}T12:00`);
  return {
    numero: String(d.getDate()).padStart(2, "0"),
    mes: String(d.getMonth() + 1).padStart(2, "0"),
    semana: SEMANA[d.getDay()],
  };
}

export default function Landing() {
  const [quadras, setQuadras] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [data, setData] = useState(hoje());
  const [duracao, setDuracao] = useState(1);
  const [escolha, setEscolha] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacao, setObservacao] = useState("");

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [confirmada, setConfirmada] = useState(null);

  async function carregar() {
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
    document.title = "Ruffo | Reserve sua quadra";

    let ativo = true;
    const carregarInicial = async () => {
      try {
        await carregar();
      } catch (e) {
        if (ativo) setErro(e.message);
      }
    };

    void carregarInicial();

    return () => {
      ativo = false;
    };
  }, []);

  const ocupacao = useMemo(() => {
    const mapa = {};
    for (const r of reservas) {
      const ini = new Date(r.inicio);
      if (ini.toLocaleDateString("sv-SE") !== data) continue;

      if (!mapa[r.quadraId]) mapa[r.quadraId] = new Set();

      const fim = new Date(r.fim);
      const ultima = fim.getMinutes() > 0 ? fim.getHours() : fim.getHours() - 1;
      for (let h = ini.getHours(); h <= ultima; h++) mapa[r.quadraId].add(h);
    }
    return mapa;
  }, [reservas, data]);

  function disponivel(quadraId, h) {
    if (h + duracao > FECHAMENTO) return false;

    const inicio = new Date(`${data}T${String(h).padStart(2, "0")}:00`);
    if (inicio < new Date()) return false;

    const ocupadas = ocupacao[quadraId];
    if (!ocupadas) return true;

    for (let i = 0; i < duracao; i++) if (ocupadas.has(h + i)) return false;
    return true;
  }

  function mudarDia(passo) {
    const d = new Date(`${data}T12:00`);
    d.setDate(d.getDate() + passo);
    const nova = d.toLocaleDateString("sv-SE");
    if (nova < hoje()) return;
    setData(nova);
    setEscolha(null);
  }

  async function enviar() {
    setErro("");

    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro("Preencha nome, e-mail e telefone.");
      return;
    }
    if (!email.includes("@")) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setEnviando(true);
    try {
      const inicio = new Date(`${data}T${String(escolha.hora).padStart(2, "0")}:00`);
      const fim = new Date(inicio);
      fim.setHours(fim.getHours() + duracao);

      const reserva = await solicitarReserva({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        quadraId: escolha.quadraId,
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        observacao: observacao.trim() || null,
      });

      setConfirmada(reserva);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function recomecar() {
    setConfirmada(null);
    setEscolha(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setObservacao("");
  }

  const { numero, mes, semana } = rotulo(data);
  const quadraEscolhida = quadras.find((q) => q.id === escolha?.quadraId);

  return (
    <div className="lp">

      <header className="lp__hero">
        <svg className="lp__linhas" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2">
            <rect x="40" y="40" width="720" height="420" />
            <line x1="400" y1="40" x2="400" y2="460" />
            <circle cx="400" cy="250" r="80" />
            <rect x="40" y="150" width="110" height="200" />
            <rect x="650" y="150" width="110" height="200" />
          </g>
        </svg>

        <nav className="lp__nav">
          <span className="lp__logo">RUFFO</span>
          <Link to="/login" className="lp__acesso">Área do gestor</Link>
        </nav>

        <div className="lp__hero-texto">
          <h1>
            A quadra do bairro,<br />com agenda de clube.
          </h1>
          <p>
            Escolha o horário, reserve em um minuto e receba a confirmação.
            Sem caderno, sem grupo de mensagem, sem fila.
          </p>
          <a href="#reservar" className="lp__cta">Ver horários livres</a>
        </div>
      </header>

      <section className="lp__motivo">
        <div className="lp__motivo-texto">
          <span className="lp__eyebrow">Por que jogar</span>
          <h2>A quadra vazia é a maior perda do bairro.</h2>
          <p>
            Uma partida por semana já muda a rotina de quem joga, e a de quem assiste.
            A quadra é onde vizinho vira time, onde criança aprende a perder e a insistir,
            onde adulto encontra motivo pra sair de casa depois do trabalho.
          </p>
          <p>
            O RUFFO existe pra tirar o único obstáculo que ainda sobra: descobrir
            se tem horário livre.
          </p>
        </div>

        <ul className="lp__beneficios">
          <li>
            <strong>30 min</strong>
            <span>de atividade por dia já reduzem risco cardiovascular</span>
          </li>
          <li>
            <strong>Time</strong>
            <span>esporte coletivo cria vínculo que academia sozinha não cria</span>
          </li>
          <li>
            <strong>Rotina</strong>
            <span>horário marcado é o que transforma vontade em hábito</span>
          </li>
        </ul>
      </section>

      <section className="lp__passos-secao">
        <h2 className="lp__passos-titulo">Reservar leva um minuto</h2>
        <div className="lp__passos">
          <article>
            <span className="lp__passo-num">1</span>
            <h3>Escolha o dia</h3>
            <p>Veja de uma vez o que está livre em todas as quadras.</p>
          </article>
          <article>
            <span className="lp__passo-num">2</span>
            <h3>Toque no horário</h3>
            <p>Os horários ocupados aparecem bloqueados — sem risco de conflito.</p>
          </article>
          <article>
            <span className="lp__passo-num">3</span>
            <h3>Confirme</h3>
            <p>Deixe seu contato e pronto: a quadra é sua naquele horário.</p>
          </article>
        </div>
      </section>

      <section className="lp__reservar" id="reservar">
        <div className="lp__secao-topo">
          <h2>Horários disponíveis</h2>
          <p>Selecione a duração e toque em um horário livre.</p>
        </div>

        <div className="lp__controles">
          <div className="lp__dia">
            <button onClick={() => mudarDia(-1)} aria-label="Dia anterior">‹</button>
            <div>
              <strong>{numero}/{mes}</strong>
              <span>{semana}</span>
            </div>
            <button onClick={() => mudarDia(1)} aria-label="Próximo dia">›</button>
          </div>

          <div className="lp__duracao">
            {[1, 2].map((d) => (
              <button
                key={d}
                className={duracao === d ? "lp__dur lp__dur--ativa" : "lp__dur"}
                onClick={() => { setDuracao(d); setEscolha(null); }}
              >
                {d}h
              </button>
            ))}
          </div>
        </div>

        {carregando ? (
          <p className="lp__aviso">Carregando horários…</p>
        ) : quadras.length === 0 ? (
          <p className="lp__aviso">Nenhuma quadra cadastrada ainda.</p>
        ) : (
          <div className="lp__quadras">
            {quadras.map((q) => (
              <article key={q.id} className="lp__quadra">
                <header className="lp__quadra-topo">
                  <h3>{q.nome}</h3>
                  <span>{q.modalidade} · {q.localizacao}</span>
                </header>

                <div className="lp__horas">
                  {HORAS.map((h) => {
                    const livre = disponivel(q.id, h);
                    const ativa = escolha?.quadraId === q.id && escolha?.hora === h;
                    return (
                      <button
                        key={h}
                        className={
                          "lp__hora" +
                          (livre ? "" : " lp__hora--ocupada") +
                          (ativa ? " lp__hora--ativa" : "")
                        }
                        disabled={!livre}
                        onClick={() => setEscolha({ quadraId: q.id, hora: h })}
                      >
                        {String(h).padStart(2, "0")}:00
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="lp__chamada">
        <h2>Chama a galera. A quadra tá esperando.</h2>
        <p>
          Não precisa de time montado nem de equipamento caro.
          Precisa de gente disposta e de uma hora marcada.
        </p>
        <a href="#reservar" className="lp__cta">Reservar meu horário</a>
      </section>

      <footer className="lp__rodape">
        <span className="lp__logo lp__logo--pe">RUFFO</span>
        <p>Agendamento de quadras esportivas · Projeto DFS-2026.2</p>
      </footer>

      {escolha && !confirmada && (
        <div className="lp__folha" onClick={() => setEscolha(null)}>
          <div className="lp__caixa" onClick={(e) => e.stopPropagation()}>
            <button className="lp__fechar" onClick={() => setEscolha(null)} aria-label="Fechar">×</button>

            <span className="lp__etiqueta">Você está reservando</span>
            <h2 className="lp__resumo">
              {quadraEscolhida?.nome}<br />
              {numero}/{mes} · {String(escolha.hora).padStart(2, "0")}h às{" "}
              {String(escolha.hora + duracao).padStart(2, "0")}h
            </h2>

            <label className="lp__label" htmlFor="lp-nome">Seu nome</label>
            <input id="lp-nome" className="lp__campo" value={nome}
              onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />

            <label className="lp__label" htmlFor="lp-email">E-mail</label>
            <input id="lp-email" className="lp__campo" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />

            <label className="lp__label" htmlFor="lp-tel">Telefone</label>
            <input id="lp-tel" className="lp__campo" value={telefone}
              onChange={(e) => setTelefone(e.target.value)} placeholder="(81) 90000-0000" />

            <label className="lp__label" htmlFor="lp-obs">Observação</label>
            <input id="lp-obs" className="lp__campo" value={observacao}
              onChange={(e) => setObservacao(e.target.value)} placeholder="Opcional" />

            {erro && <p className="lp__erro" role="alert">{erro}</p>}

            <button className="lp__confirmar" onClick={enviar} disabled={enviando}>
              {enviando ? "Reservando…" : "Confirmar reserva"}
            </button>
          </div>
        </div>
      )}

      {confirmada && (
        <div className="lp__folha">
          <div className="lp__caixa lp__caixa--ok">
            <div className="lp__selo">✓</div>
            <h2 className="lp__ok-titulo">Reserva confirmada!</h2>
            <p className="lp__ok-texto">
              Enviamos os detalhes para <strong>{confirmada.jogador?.email}</strong>.
            </p>

            <dl className="lp__recibo">
              <div><dt>Quadra</dt><dd>{confirmada.quadra?.nome}</dd></div>
              <div><dt>Data</dt><dd>{new Date(confirmada.inicio).toLocaleDateString("pt-BR")}</dd></div>
              <div><dt>Horário</dt><dd>
                {new Date(confirmada.inicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                {" às "}
                {new Date(confirmada.fim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </dd></div>
              <div><dt>Responsável</dt><dd>{confirmada.jogador?.nome}</dd></div>
            </dl>

            <button className="lp__confirmar" onClick={recomecar}>
              Fazer outra reserva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}