export default function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      <div className="nebula-layer absolute -inset-[10%]" />
      <div className="star-layer absolute inset-0" />
      <div
        className="star-layer absolute inset-0"
        style={{ backgroundSize: "410px 410px", opacity: 0.35 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(3,4,10,0.85) 100%)",
        }}
      />
    </div>
  );
}
