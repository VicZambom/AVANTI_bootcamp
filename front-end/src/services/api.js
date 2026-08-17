const API_URL = "http://localhost:3000";

function pegarToken() {
  return localStorage.getItem("token");
}

async function requisicao(caminho, opcoes = {}) {
  const cabecalhos = { "Content-Type": "application/json", ...opcoes.headers };

  const token = pegarToken();
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers: cabecalhos });

  if (resposta.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Entre novamente.");
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.mensagem || "Algo deu errado. Tente de novo.");
  }

  return dados;
}

export async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível entrar.");
  return dados;
}

export const listarReservas = () => requisicao("/reservas?incluirCanceladas=true");
export const listarQuadras = () => requisicao("/quadras");
export const listarJogadores = () => requisicao("/jogadores");

export const criarReserva = (dados) =>
  requisicao("/reservas", { method: "POST", body: JSON.stringify(dados) });

export const atualizarReserva = (id, dados) =>
  requisicao(`/reservas/${id}`, { method: "PUT", body: JSON.stringify(dados) });

export const cancelarReserva = (id) =>
  requisicao(`/reservas/${id}`, { method: "DELETE" });