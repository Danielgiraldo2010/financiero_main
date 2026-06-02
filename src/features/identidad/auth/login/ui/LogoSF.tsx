export function LogoSF() {
  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      {/* Icono institucional */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      {/* Nombre */}
      <div className="text-center">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "#f0f7ff" }}
        >
          Sistema Financiero
        </h1>
        <p
          className="mt-0.5 text-sm"
          style={{ color: "rgba(214,232,247,0.7)" }}
        >
          Universidad de Caldas
        </p>
      </div>
    </div>
  )
}
