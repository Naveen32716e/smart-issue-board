import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #fff1eb 0%, #ffe4d1 40%, #ffd3a5 70%, #ffffff 100%)",
      }}
    >
      <div
        className="card border-0 rounded-4 p-5 text-center"
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h2 className="fw-bold mb-2">Smart Issue Board</h2>
        <p className="text-muted mb-4">
          Simple issue tracking system
        </p>

        <Link href="/login">
          <button
            className="btn w-100 text-white fw-semibold mb-3"
            style={{
              background: "linear-gradient(90deg, #ff8a00, #ffb347)",
              border: "none",
            }}
          >
            Login
          </button>
        </Link>

        <Link href="/signup">
          <button
            className="btn w-100 fw-semibold"
            style={{
              border: "2px solid #ff8a00",
              color: "#ff8a00",
              background: "transparent",
            }}
          >
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}
