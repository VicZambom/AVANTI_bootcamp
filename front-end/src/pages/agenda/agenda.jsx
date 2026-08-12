export default function Agenda() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Agenda</h1>
      <p>Logada como {usuario.nome}</p>
      <button onClick={sair}>Sair</button>
    </div>
  );
}