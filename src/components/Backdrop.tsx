export default function Backdrop() {
  return (
    <div className="backdrop-root" aria-hidden="true">
      <div className="backdrop-canvas">
        <div className="backdrop-paint backdrop-paint-day" />
        <div className="backdrop-paint backdrop-paint-dusk" />
      </div>
      <div className="backdrop-wash" />
      <div className="backdrop-grain" />
      <div className="backdrop-vignette" />
      <svg className="backdrop-ribbons" viewBox="0 0 1440 900" preserveAspectRatio="none">
        {/* Two hand-painted ribbons like old map routes */}
        <path d="M-80 620 C240 480 380 760 720 600 S1160 420 1520 560" />
        <path d="M1040 -60 C920 200 1180 280 1060 520 S930 780 1180 960" />
      </svg>
    </div>
  );
}
