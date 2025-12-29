import Link from "next/link";

export default function Home() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 text-center" style={{ width: "380px" }}>
        <h2 className="mb-3">Smart Issue Board</h2>
        <p className="text-muted">
          Simple issue tracking system
        </p>

        <Link href="/login" className="btn btn-primary w-100 mb-2">
          Login
        </Link>

        <Link href="/signup" className="btn btn-outline-primary w-100">
          Signup
        </Link>
      </div>
    </div>
  );
}
