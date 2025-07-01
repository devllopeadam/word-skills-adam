import { useNavigate } from "react-router-dom";
import wowLogo from "../assets/wow-logo.svg";

export default function Bienvenue() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <div
        style={{
          background: "#6C3BFF",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <img
          src={wowLogo}
          alt="WOW Logo"
          style={{ width: 200, marginBottom: 40 }}
        />
        <h2
          style={{
            color: "black",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 20,
          }}>
          A VOUS DE RACONTER LE
        </h2>
        <h1
          style={{
            color: "#FFF700",
            fontWeight: 900,
            textShadow: "2px 2px 0 #000",
            fontSize: 48,
            marginBottom: 0,
          }}>
          “ WOW ” !!
        </h1>
      </div>
      <div
        style={{
          background: "#333",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div style={{ display: "flex", gap: 24 }}>
          <button
            style={{
              background: "#6C4BFF",
              border: "none",
              borderRadius: 24,
              padding: "15px 35px",
              fontSize: 18,
            }}
            onClick={() => navigate("/login")}>
            Se connecter
          </button>
          <button
            style={{
              background: "#6C4BFF",
              border: "none",
              borderRadius: 24,
              padding: "15px 35px",
              fontSize: 18,
            }}
            onClick={() => navigate("/register")}>
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}
