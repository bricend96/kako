// Logo kako : un anneau surmontant un sourire (trait blanc, façon "lentille souriante").
// Utilise currentColor → hérite de la couleur du texte parent.
export function KakoLogo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={5.2}
      strokeLinecap="round"
      className={className}
      role="img"
      aria-label="kako"
    >
      <circle cx="24" cy="19" r="11" />
      <path d="M10 33.5c3.6 4.2 8.4 6.5 14 6.5s10.4-2.3 14-6.5" />
    </svg>
  );
}

// Logo kako "badge" : le trait blanc sur un carré arrondi violet (comme l'icône d'app).
export function KakoBadge({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-[22%] text-white ${className ?? ""}`}
      style={{ width: size, height: size, background: "#7c5cff" }}
    >
      <KakoLogo size={size * 0.62} />
    </span>
  );
}
