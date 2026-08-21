import { useState } from "react";
import { login as loginApi } from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha para continuar.");
      return;
    }

    setEnviando(true);

    try {
      const dados = await loginApi(email, senha);

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));

      navigate("/agenda");
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function aoTeclar(e) {
    if (e.key === "Enter") entrar();
  }

  return (
    <div className="login">
      <section className="login__palco" aria-hidden="true">
        <svg className="login__quadra" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="2">
            <rect x="40" y="40" width="320" height="480" />
            <line x1="40" y1="280" x2="360" y2="280" />
            <circle cx="200" cy="280" r="62" />
            <rect x="130" y="40" width="140" height="96" />
            <rect x="130" y="424" width="140" height="96" />
            <path d="M130 136 a70 70 0 0 0 140 0" />
            <path d="M130 424 a70 70 0 0 1 140 0" />
          </g>
        </svg>

        <div className="login__marca">
          <span className="login__logo">RUFFO</span>
          <p className="login__tagline">
            A agenda da quadra,<br />sem caderno e sem confusão.
          </p>
        </div>

        <p className="login__rodape">Agendamento de quadras esportivas</p>
      </section>

      <section className="login__painel">
        <div className="login__form">
          <span className="login__eyebrow">Área do gestor</span>
          <h1 className="login__titulo">Entrar</h1>
          <p className="login__sub">Acesse para gerenciar quadras, jogadores e reservas.</p>

          <label className="login__label" htmlFor="email">E-mail</label>
          <input
            id="email"
            className="login__input"
            type="email"
            autoComplete="username"
            placeholder="voce@quadra.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={aoTeclar}
          />

          <label className="login__label" htmlFor="senha">Senha</label>
          <div className="login__senha">
            <input
              id="senha"
              className="login__input"
              type={verSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={aoTeclar}
            />
            <button
              type="button"
              className="login__toggle"
              onClick={() => setVerSenha((v) => !v)}
            >
              {verSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {erro && <p className="login__erro" role="alert">{erro}</p>}

          <button
            type="button"
            className="login__botao"
            onClick={entrar}
            disabled={enviando}
          >
            {enviando ? "Entrando…" : "Entrar"}
          </button>

          <p className="login__ajuda">
            Esqueceu a senha? Fale com o administrador da quadra.
          </p>
        </div>
      </section>
    </div>
  );
}